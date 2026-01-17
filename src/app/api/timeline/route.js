import { deleteTimelineEvent, getTimeline, saveTimelineEvent, updateTimelineEvent } from '@/lib/store';
import { NextResponse } from 'next/server';

export async function GET() {
  const timeline = getTimeline();
  return NextResponse.json(timeline);
}

export async function POST(request) {
  try {
    const json = await request.json();
    const event = saveTimelineEvent(json);
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save event' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, ...data } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    const updated = updateTimelineEvent(id, data);
    if (!updated) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    const deleted = deleteTimelineEvent(id);
    if (!deleted) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    return NextResponse.json({ message: 'Deleted successfully', item: deleted });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
