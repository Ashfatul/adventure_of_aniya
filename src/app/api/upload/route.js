import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files received." }, { status: 400 });
    }

    const savedFiles = [];

    for (const file of files) {
      // Upload to Vercel Blob
      try {
        const blob = await put(file.name, file, {
          access: 'public',
        });
        savedFiles.push(blob.url);
      } catch (uploadError) {
        console.error("Blob Upload Error for file:", file.name, uploadError);
        // Continue with other files if one fails, or handle as needed
      }
    }

    if (savedFiles.length === 0) {
       return NextResponse.json({ error: "All uploads failed." }, { status: 500 });
    }

    return NextResponse.json({ urls: savedFiles, message: "Success" });
  } catch (error) {
    console.error("General Upload Error:", error);
    return NextResponse.json({ error: "Failed to process uploads." }, { status: 500 });
  }
}
