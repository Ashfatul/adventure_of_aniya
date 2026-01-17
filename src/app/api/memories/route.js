import { getMemories, saveMemory } from '@/lib/store';
import { NextResponse } from 'next/server';

export async function GET() {
  const memories = getMemories();
  return NextResponse.json(memories);
}

export async function POST(request) {
  try {
    const json = await request.json();
    const memory = saveMemory(json);
    return NextResponse.json(memory);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save memory' }, { status: 500 });
  }
}
