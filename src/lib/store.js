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

export function updateMemory(id, data) {
  try {
    const memories = getMemories();
    const index = memories.findIndex(m => m.id === id);
    if (index === -1) return null;
    
    memories[index] = { ...memories[index], ...data, id }; // Ensure ID doesn't change
    fs.writeFileSync(memoriesFile, JSON.stringify(memories, null, 2), 'utf8');
    return memories[index];
  } catch (error) {
    console.error('Error updating memory:', error);
    throw error;
  }
}

export function deleteMemory(id) {
  try {
    const memories = getMemories();
    const memoryToDelete = memories.find(m => m.id === id);
    if (!memoryToDelete) return null;
    
    const newMemories = memories.filter(m => m.id !== id);
    fs.writeFileSync(memoriesFile, JSON.stringify(newMemories, null, 2), 'utf8');
    return memoryToDelete;
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

export function updateTimelineEvent(id, data) {
  try {
    const timeline = getTimeline();
    const index = timeline.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    timeline[index] = { ...timeline[index], ...data, id };
    timeline.sort((a, b) => b.year - a.year);
    fs.writeFileSync(timelineFile, JSON.stringify(timeline, null, 2), 'utf8');
    return timeline[index];
  } catch (error) {
    console.error('Error updating timeline event:', error);
    throw error;
  }
}

export function deleteTimelineEvent(id) {
   try {
    const timeline = getTimeline();
    const eventToDelete = timeline.find(t => t.id === id);
    if (!eventToDelete) return null;
    
    const newTimeline = timeline.filter(t => t.id !== id);
    fs.writeFileSync(timelineFile, JSON.stringify(newTimeline, null, 2), 'utf8');
    return eventToDelete;
  } catch (error) {
    console.error('Error deleting timeline event:', error);
    throw error;
  } 
}
