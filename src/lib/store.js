import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const memoriesFile = path.join(dataDir, 'memories.json');
const timelineFile = path.join(dataDir, 'timeline.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Ensure memories file exists
if (!fs.existsSync(memoriesFile)) {
  fs.writeFileSync(memoriesFile, '[]', 'utf8');
}

// Ensure timeline file exists
if (!fs.existsSync(timelineFile)) {
  // Seed with initial data if empty
  const initialTimeline = [
     { id: '1', year: '2023', title: 'First Steps', desc: 'Wobbling across the living room!', icon: 'Flag' },
     { id: '2', year: '2022', title: 'First Word', desc: '"Dada" was the magic word.', icon: 'Calendar' },
     { id: '3', year: '2021', title: 'Hello World', desc: 'Welcome to the family, sweet Aniya.', icon: 'Calendar' },
  ];
  fs.writeFileSync(timelineFile, JSON.stringify(initialTimeline, null, 2), 'utf8');
}

// --- Memories ---

export function getMemories() {
  try {
    const fileContent = fs.readFileSync(memoriesFile, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading memories:', error);
    return [];
  }
}

export function saveMemory(memory) {
  try {
    const memories = getMemories();
    const newMemory = { ...memory, id: Date.now().toString(), date: memory.date || new Date().toISOString() };
    memories.unshift(newMemory);
    fs.writeFileSync(memoriesFile, JSON.stringify(memories, null, 2), 'utf8');
    return newMemory;
  } catch (error) {
    console.error('Error saving memory:', error);
    throw error;
  }
}

export function deleteMemory(id) {
  try {
    const memories = getMemories();
    const newMemories = memories.filter(m => m.id !== id);
    fs.writeFileSync(memoriesFile, JSON.stringify(newMemories, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error deleting memory:', error);
    throw error;
  }
}

// --- Timeline ---

export function getTimeline() {
  try {
    const fileContent = fs.readFileSync(timelineFile, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading timeline:', error);
    return [];
  }
}

export function saveTimelineEvent(event) {
  try {
    const timeline = getTimeline();
    const newEvent = { ...event, id: Date.now().toString() };
    // Sort by year descending (simple logic for now)
    timeline.push(newEvent);
    timeline.sort((a, b) => b.year - a.year); 
    fs.writeFileSync(timelineFile, JSON.stringify(timeline, null, 2), 'utf8');
    return newEvent;
  } catch (error) {
    console.error('Error saving timeline event:', error);
    throw error;
  }
}

export function deleteTimelineEvent(id) {
   try {
    const timeline = getTimeline();
    const newTimeline = timeline.filter(t => t.id !== id);
    fs.writeFileSync(timelineFile, JSON.stringify(newTimeline, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error deleting timeline event:', error);
    throw error;
  } 
}
