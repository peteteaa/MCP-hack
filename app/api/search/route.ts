import { NextResponse } from 'next/server';

// Google Programmable Search Engine configuration
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  
  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  if (!GOOGLE_API_KEY || !GOOGLE_SEARCH_ENGINE_ID) {
    return NextResponse.json(
      { error: 'Google API key or Search Engine ID not configured' }, 
      { status: 500 }
    );
  }

  try {
    // Add "AI events" to the query to focus on AI-related events
    const enhancedQuery = `AI events ${query}`;
    
    // Call Google Programmable Search API
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(enhancedQuery)}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google Search API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to fetch search results' }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error searching events:', error);
    return NextResponse.json(
      { error: 'An error occurred while searching for events' }, 
      { status: 500 }
    );
  }
}
