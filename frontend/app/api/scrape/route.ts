import { NextResponse } from 'next/server';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

const execPromise = promisify(exec);

// Function to get context from the local file
function getContextFromFile() {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const contextFilePath = path.join(dataDir, 'user_context.json');
    
    if (fs.existsSync(contextFilePath)) {
      const fileData = fs.readFileSync(contextFilePath, 'utf8');
      return JSON.parse(fileData);
    }
  } catch (error) {
    console.error('Error reading context file:', error);
  }
  return null;
}

export async function GET() {
  try {
    console.log('=== SCRAPE API CALLED ===');
    
    // Get the current context for debugging
    const context = getContextFromFile();
    console.log('Context from file in API route:', context ? 'Found' : 'Not found');
    
    if (context && context.selectedEvent) {
      console.log('Selected event:', context.selectedEvent.title);
      console.log('Keywords:', context.selectedEvent.keywords);
    }
    
    // Path to the backend directory
    const backendDir = path.join(process.cwd(), '..', 'backend');
    console.log('Backend directory:', backendDir);
    
    // Execute a script that runs the scrape function
    console.log('Executing scrape function...');
    const { stdout, stderr } = await execPromise('node -e "import(\'./apify.js\').then(module => module.scrape().then(result => console.log(JSON.stringify({result}))))"', {
      cwd: backendDir
    });
    
    if (stderr) {
      console.error('Error executing scrape function:', stderr);
      return NextResponse.json({ 
        error: 'Failed to scrape data',
        stderr,
        context: context || 'No context found'
      }, { status: 500 });
    }
    
    console.log('Scrape function executed successfully');
    console.log('Stdout length:', stdout.length);
    
    try {
      // Parse the result from stdout
      const parsedResult = JSON.parse(stdout);
      
      // Return both the scrape result and the context used
      return NextResponse.json({
        ...parsedResult,
        debug: {
          context: context,
          timestamp: new Date().toISOString()
        }
      });
    } catch (parseError) {
      console.error('Error parsing scrape result:', parseError);
      return NextResponse.json({ 
        result: stdout,
        error: 'Could not parse as JSON, returning raw output',
        debug: {
          context: context,
          timestamp: new Date().toISOString()
        }
      });
    }
  } catch (error) {
    console.error('Error calling scrape function:', error);
    return NextResponse.json(
      { 
        error: 'An error occurred while scraping data',
        errorMessage: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      }, 
      { status: 500 }
    );
  }
}
