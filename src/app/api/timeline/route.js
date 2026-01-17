import { getTimeline, saveTimelineEvent } from '@/lib/store';
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
