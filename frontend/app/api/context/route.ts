import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the structure for our context data
interface ContextData {
  selectedEvent: any;
  lastUpdated: string;
}

// Global context storage path
const CONTEXT_FILE_PATH = path.join(process.cwd(), "data", "user_context.json");

// Ensure the data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }
};

// Get the current context
const getContext = (): ContextData => {
  ensureDataDir();
  
  if (fs.existsSync(CONTEXT_FILE_PATH)) {
    try {
      const fileData = fs.readFileSync(CONTEXT_FILE_PATH, 'utf8');
      return JSON.parse(fileData);
    } catch (error) {
      console.error('Error reading context file:', error);
    }
  }
  
  // Return default context if file doesn't exist or can't be read
  return {
    selectedEvent: null,
    lastUpdated: new Date().toISOString()
  };
};

// Save the context
const saveContext = (contextData: ContextData): void => {
  ensureDataDir();
  fs.writeFileSync(CONTEXT_FILE_PATH, JSON.stringify(contextData, null, 2));
};

// GET handler to retrieve the current context
export async function GET() {
  try {
    const context = getContext();
    
    return NextResponse.json({
      success: true,
      data: context
    });
  } catch (error) {
    console.error('Error getting context:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve context' },
      { status: 500 }
    );
  }
}

// POST handler to update the context
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Get current context
    const currentContext = getContext();
    
    // Update with new data
    const updatedContext: ContextData = {
      selectedEvent: data.selectedEvent || currentContext.selectedEvent,
      lastUpdated: new Date().toISOString()
    };
    
    // Save updated context
    saveContext(updatedContext);
    
    return NextResponse.json({
      success: true,
      message: 'Context updated successfully',
      data: updatedContext
    });
  } catch (error) {
    console.error('Error updating context:', error);
    return NextResponse.json(
      { error: 'Failed to update context' },
      { status: 500 }
    );
  }
}

// DELETE handler to clear the context
export async function DELETE() {
  try {
    // Clear the context by setting event to null
    saveContext({
      selectedEvent: null,
      lastUpdated: new Date().toISOString()
    });
    
    return NextResponse.json({
      success: true,
      message: 'Context cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing context:', error);
    return NextResponse.json(
      { error: 'Failed to clear context' },
      { status: 500 }
    );
  }
}
