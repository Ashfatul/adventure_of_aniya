import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';

const pump = promisify(pipeline);

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files received." }, { status: 400 });
    }

    const savedFiles = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename =  Date.now() + "_" + file.name.replaceAll(" ", "_");
      const filePath = path.join(process.cwd(), 'public/uploads', filename);
      
      await fs.promises.writeFile(filePath, buffer);
      
      // Return the URL relative to public
      savedFiles.push(`/uploads/${filename}`);
    }

    return NextResponse.json({ urls: savedFiles, message: "Success" });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Failed to upload files." }, { status: 500 });
  }
}
