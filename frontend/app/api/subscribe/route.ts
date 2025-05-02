import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Subscription {
  email: string;
  createdAt: string;
  updatedAt: string;
  interests: string[];
  selectedEvents: any[];
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    // Create a directory to store subscriptions if it doesn't exist
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }
    
    // Store subscription data
    const subscriptionsFile = path.join(dataDir, "subscriptions.json");
    let subscriptions: Subscription[] = [];
    
    if (fs.existsSync(subscriptionsFile)) {
      const fileData = fs.readFileSync(subscriptionsFile, 'utf8');
      subscriptions = JSON.parse(fileData);
    }
    
    // Check if this email is already subscribed
    const existingIndex = subscriptions.findIndex((sub: Subscription) => sub.email === data.email);
    
    const timestamp = new Date().toISOString();
    
    if (existingIndex >= 0) {
      // Update existing subscription
      subscriptions[existingIndex] = {
        ...subscriptions[existingIndex],
        updatedAt: timestamp,
        // Add new interests if they don't already exist
        interests: [...new Set([
          ...subscriptions[existingIndex].interests,
          ...(data.interests || [])
        ])],
        // Add the selected event if provided
        selectedEvents: data.event 
          ? [...(subscriptions[existingIndex].selectedEvents || []), data.event]
          : (subscriptions[existingIndex].selectedEvents || [])
      };
    } else {
      // Add new subscription
      subscriptions.push({
        email: data.email,
        createdAt: timestamp,
        updatedAt: timestamp,
        interests: data.interests || [],
        selectedEvents: data.event ? [data.event] : []
      });
    }
    
    // Save updated subscriptions
    fs.writeFileSync(subscriptionsFile, JSON.stringify(subscriptions, null, 2));
    
    // If an event was selected, track interest in it using our API
    if (data.event) {
      try {
        // Call our event-tracking API
        const baseUrl = typeof window === 'undefined' 
          ? 'http://localhost:3000' // Server-side
          : window.location.origin; // Client-side
          
        await fetch(`${baseUrl}/api/event-tracking`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ event: data.event }),
        });
      } catch (error) {
        console.error('Error tracking event interest:', error);
        // Continue with subscription even if tracking fails
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Subscription for ${data.email} has been saved successfully`
    });
  } catch (error) {
    console.error('Error saving subscription:', error);
    return NextResponse.json(
      { error: 'An error occurred while saving your subscription' }, 
      { status: 500 }
    );
  }
}
