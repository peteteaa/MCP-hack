import { NextResponse } from 'next/server';

// Google Programmable Search Engine configuration
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID;

// Mock data for when Google API is not available
const mockSearchResults = {
  "items": [
    {
      "title": "AI Conference 2025 - San Francisco",
      "link": "https://example.com/ai-conference-2025",
      "snippet": "Join us for the biggest AI conference in San Francisco. Learn about the latest developments in artificial intelligence, machine learning, and more.",
      "formattedUrl": "https://example.com/ai-conference-2025"
    },
    {
      "title": "Machine Learning Workshop - Online",
      "link": "https://example.com/ml-workshop",
      "snippet": "Virtual workshop on machine learning fundamentals. Perfect for beginners and intermediate practitioners looking to enhance their skills.",
      "formattedUrl": "https://example.com/ml-workshop"
    },
    {
      "title": "AI Ethics Symposium - New York",
      "link": "https://example.com/ai-ethics",
      "snippet": "A symposium dedicated to discussing ethical considerations in AI development and deployment. Featuring speakers from academia and industry.",
      "formattedUrl": "https://example.com/ai-ethics"
    },
    {
      "title": "Deep Learning Summit - London",
      "link": "https://example.com/deep-learning-summit",
      "snippet": "Annual summit focusing on deep learning innovations. Network with experts and discover cutting-edge research in neural networks.",
      "formattedUrl": "https://example.com/deep-learning-summit"
    },
    {
      "title": "AI in Healthcare Conference - Boston",
      "link": "https://example.com/ai-healthcare",
      "snippet": "Explore the intersection of AI and healthcare. Learn how artificial intelligence is transforming patient care, diagnosis, and treatment.",
      "formattedUrl": "https://example.com/ai-healthcare"
    }
  ]
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  
  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  // If Google API key is not available, return mock data
  if (!GOOGLE_API_KEY || !GOOGLE_SEARCH_ENGINE_ID) {
    console.log('Using mock data for search results');
    return NextResponse.json(mockSearchResults);
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
