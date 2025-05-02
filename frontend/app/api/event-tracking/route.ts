import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface EventInterest {
  id: number;
  title: string;
  keywords: string[];
  count: number;
  searchTerms: string[];
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.event) {
      return NextResponse.json({ error: 'Event data is required' }, { status: 400 });
    }
    
    // Create a directory to store event interests if it doesn't exist
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }
    
    // Store event interest data
    const interestsFile = path.join(dataDir, "event_interests.json");
    let interests: EventInterest[] = [];
    
    if (fs.existsSync(interestsFile)) {
      const fileData = fs.readFileSync(interestsFile, 'utf8');
      interests = JSON.parse(fileData);
    }
    
    // Check if this event is already being tracked
    const existingIndex = interests.findIndex(item => item.id === data.event.id);
    
    if (existingIndex >= 0) {
      // Update existing event interest count
      interests[existingIndex].count += 1;
    } else {
      // Add new event interest
      interests.push({
        id: data.event.id,
        title: data.event.title,
        keywords: data.event.keywords || [],
        count: 1,
        searchTerms: [
          data.event.title,
          ...(data.event.keywords || [])
        ]
      });
    }
    
    // Save updated interests
    fs.writeFileSync(interestsFile, JSON.stringify(interests, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      message: `Interest in "${data.event.title}" has been tracked successfully`,
      data: interests
    });
  } catch (error) {
    console.error('Error tracking event interest:', error);
    return NextResponse.json(
      { error: 'An error occurred while tracking event interest' }, 
      { status: 500 }
    );
  }
}
