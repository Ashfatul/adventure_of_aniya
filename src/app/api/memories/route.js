import { deleteMemory, getMemories, saveMemory, updateMemory } from '@/lib/store';
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

export async function PUT(request) {
  try {
    const { id, ...data } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    const updated = updateMemory(id, data);
    if (!updated) return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update memory' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    const deleted = deleteMemory(id);
    if (!deleted) return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    return NextResponse.json({ message: 'Deleted successfully', item: deleted });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete memory' }, { status: 500 });
  }
}
