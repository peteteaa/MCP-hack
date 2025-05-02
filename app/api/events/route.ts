import { NextResponse } from 'next/server';

// This will be replaced with a database call in the future
const events = [
  {
    id: 1,
    title: "AI Summit 2024",
    description: "Join industry leaders to explore the latest in artificial intelligence and machine learning.",
    date: "2024-06-15",
    location: "San Francisco, CA",
    city: "San Francisco",
    attendees: 1200,
    keywords: ["ai", "machine learning", "deep learning", "neural networks", "technology"],
  },
  {
    id: 2,
    title: "Natural Language Processing Workshop",
    description: "Hands-on workshop on building NLP applications with transformer models.",
    date: "2024-07-05",
    location: "Online",
    city: "Online",
    attendees: 500,
    keywords: ["nlp", "language", "transformers", "gpt", "bert", "ai"],
  },
  {
    id: 3,
    title: "Computer Vision Conference",
    description: "Explore the latest research and applications in computer vision and image processing.",
    date: "2024-08-20",
    location: "Boston, MA",
    city: "Boston",
    attendees: 800,
    keywords: ["computer vision", "image processing", "object detection", "ai", "deep learning"],
  }
];

export async function GET() {
  // Add artificial delay to simulate network latency
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return NextResponse.json(events);
}
