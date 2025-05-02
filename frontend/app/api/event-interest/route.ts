import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Import the backend functions (adjust the path as needed)
import { trackEventInterest } from '../../../../backend/arcade.js';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.event) {
      return NextResponse.json({ error: 'Event data is required' }, { status: 400 });
    }
    
    // Track the event interest using the backend function
    const result = await trackEventInterest(data.event);
    
    return NextResponse.json({ 
      success: true, 
      message: `Interest in "${data.event.title}" has been tracked successfully`,
      data: result
    });
  } catch (error) {
    console.error('Error tracking event interest:', error);
    return NextResponse.json(
      { error: 'An error occurred while tracking event interest' }, 
      { status: 500 }
    );
  }
}
