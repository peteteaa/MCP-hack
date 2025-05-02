"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowLeft, Search, Calendar, MapPin, Users, Sparkles, Mail, ExternalLink, ChevronDown } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { GoogleGenerativeAI } from "@google/generative-ai"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

// Type definition for events
interface Event {
  id: number
  title: string
  description: string
  date: string
  location: string
  url: string
  keywords: string[]
}

// Available cities for dropdown
const CITIES = [
  { value: "all", label: "All Cities" },
  { value: "austin", label: "Austin" },
  { value: "barcelona", label: "Barcelona" },
  { value: "boston", label: "Boston" },
  { value: "chicago", label: "Chicago" },
  { value: "london", label: "London" },
  { value: "new-york", label: "New York" },
  { value: "online", label: "Online" },
  { value: "san-francisco", label: "San Francisco" },
  { value: "seattle", label: "Seattle" },
  { value: "toronto", label: "Toronto" },
];

// Function to search for events using Google Programmable Search and enhance with Gemini
async function searchEvents(keyword: string, city: string): Promise<{ events: Event[], explanation: string }> {
  try {
    // Construct query with city if selected
    const query = city && city !== "all" 
      ? `${keyword} ${city.replace('-', ' ')}`
      : keyword;
    
    // Step 1: Call Google Programmable Search API via our backend
    const searchResponse = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
    if (!searchResponse.ok) {
      throw new Error('Failed to fetch search results');
    }
    
    const searchData = await searchResponse.json();
    
    if (!searchData.items || searchData.items.length === 0) {
      return { events: [], explanation: "No events found matching your search criteria." };
    }
    
    // Step 2: Use Gemini to process and enhance the search results
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    
    const prompt = `
      You are an AI assistant helping to extract and enhance information about AI events from search results.
      
      Here are search results for AI events matching the query: "${query}"
      
      ${JSON.stringify(searchData.items, null, 2)}
      
      Please analyze these search results and extract information about AI events.
      For each event, provide the following information in a structured format:
      
      Return your response in this exact JSON format:
      {
        "events": [
          {
            "id": number (starting from 1),
            "title": "event title",
            "description": "brief description",
            "date": "date of the event (if found, otherwise 'Date not specified')",
            "location": "location of the event (if found, otherwise 'Location not specified')",
            "url": "URL to the event page",
            "keywords": ["keyword1", "keyword2", ...] (extract 3-5 relevant keywords)
          }
        ],
        "explanation": "A brief explanation of the search results and what kinds of events were found"
      }
      
      Rules:
      1. Only include items that are clearly AI-related events
      2. Extract as much information as possible from the search snippets
      3. Make sure all JSON fields are present
      4. Make sure your response is valid JSON and nothing else
      5. Limit to at most 5 events
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      
      const jsonText = jsonMatch[0];
      const parsedResponse = JSON.parse(jsonText);
      
      if (!parsedResponse.events || !Array.isArray(parsedResponse.events)) {
        throw new Error("Response missing events array");
      }
      
      return {
        events: parsedResponse.events,
        explanation: parsedResponse.explanation || "AI events matching your search criteria"
      };
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError, "Response was:", text);
      
      // Fallback: Create events directly from search results
      const events = searchData.items.slice(0, 5).map((item: any, index: number) => ({
        id: index + 1,
        title: item.title,
        description: item.snippet || "No description available",
        date: "Date not specified",
        location: "Location not specified",
        url: item.link,
        keywords: ["ai", "event"]
      }));
      
      return {
        events,
        explanation: "AI events matching your search criteria (processed from search results)"
      };
    }
  } catch (error) {
    console.error("Error searching events:", error);
    throw error;
  }
}

export default function EventsPage() {
  const [keyword, setKeyword] = useState("")
  const [city, setCity] = useState("all")
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [explanation, setExplanation] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    
    setLoading(true);
    setError(null);
    setExplanation(null);
    setHasSearched(true);
    
    try {
      const results = await searchEvents(keyword, city);
      setEvents(results.events);
      setExplanation(results.explanation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error searching events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex flex-col py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/5 backdrop-blur-3xl"
            style={{
              width: `${Math.random() * 300 + 50}px`,
              height: `${Math.random() * 300 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 15}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.4,
            }}
          />
        ))}
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-4xl relative z-10">
        <div className="flex items-center justify-center mb-6">
          <Sparkles className="h-8 w-8 text-indigo-400 mr-2 animate-pulse" />
          <span className="text-indigo-300 font-medium tracking-wider">pulseAI</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-200 to-pink-300 mb-4">
          Discover AI Events
        </h1>

        <p className="text-center text-indigo-200/80 text-lg mb-8 max-w-md mx-auto">
          Search for real AI events using Google Programmable Search
        </p>

        <div className="bg-white/10 backdrop-blur-xl py-8 px-6 shadow-[0_0_50px_rgba(124,58,237,0.15)] sm:rounded-2xl sm:px-10 border border-white/20 mb-8">
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">Search for AI Events</h2>
              <p className="text-indigo-200/80">Find the latest AI conferences, workshops, and meetups</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="keyword" className="block text-sm font-medium text-indigo-200 mb-1">
                  Keyword
                </Label>
                <Input
                  id="keyword"
                  name="keyword"
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="bg-white/5 border border-white/10 text-white placeholder-indigo-300/50 focus:border-indigo-400 focus:ring-indigo-400"
                  placeholder="e.g., 'AI conferences' or 'Machine learning workshops'"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              
              <div>
                <Label htmlFor="city" className="block text-sm font-medium text-indigo-200 mb-1">
                  City
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-between bg-white/5 border border-white/10 text-white hover:bg-white/10"
                    >
                      {CITIES.find(c => c.value === city)?.label || "All Cities"}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full max-h-[300px] overflow-y-auto">
                    <DropdownMenuRadioGroup value={city} onValueChange={setCity}>
                      {CITIES.map((city) => (
                        <DropdownMenuRadioItem 
                          key={city.value} 
                          value={city.value}
                          className="cursor-pointer"
                        >
                          {city.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div className="flex justify-center pt-2">
              <Button
                onClick={handleSearch}
                disabled={loading}
                className="relative group overflow-hidden rounded-xl px-8 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-500 transition-all duration-300"
              >
                <span className="flex items-center">
                  {loading ? "Searching..." : "Search Events"}
                  <Search className="ml-2 h-4 w-4" />
                </span>
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/20 backdrop-blur-xl py-6 px-6 shadow-[0_0_30px_rgba(220,38,38,0.15)] sm:rounded-2xl sm:px-8 border border-red-500/20 mb-8 text-center">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {hasSearched && explanation && (
          <div className="bg-white/10 backdrop-blur-xl py-6 px-6 shadow-[0_0_30px_rgba(124,58,237,0.15)] sm:rounded-2xl sm:px-8 border border-white/20 mb-8 text-center">
            <h2 className="text-xl font-semibold text-white mb-3">Search Results</h2>
            <p className="text-indigo-200/80 mb-4">{explanation}</p>
          </div>
        )}

        {hasSearched && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {events.length > 0 ? (
              events.map((event) => (
                <Card
                  key={event.id}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 text-white overflow-hidden hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                    <p className="text-indigo-200/80 mb-4">{event.description}</p>
                    <div className="text-sm text-indigo-200/80">
                      {event.date !== "Date not specified" && (
                        <p className="mb-1">📅 {event.date}</p>
                      )}
                      {event.location !== "Location not specified" && (
                        <p className="mb-1">📍 {event.location}</p>
                      )}
                      <p className="mt-2">
                        <a 
                          href={event.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-indigo-400 hover:text-indigo-300"
                        >
                          Visit Event Page <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {event.keywords.map((keyword) => (
                        <Badge
                          key={keyword}
                          variant="outline"
                          className="bg-white/5 text-indigo-200 border-indigo-400/30"
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-indigo-200/80 text-lg">
                  No events found matching your search. Try a different query.
                </p>
              </div>
            )}
          </div>
        )}

        {events.length > 0 && (
          <div className="bg-white/10 backdrop-blur-xl py-6 px-6 shadow-[0_0_30px_rgba(124,58,237,0.15)] sm:rounded-2xl sm:px-8 border border-white/20 mb-8 text-center">
            <h2 className="text-xl font-semibold text-white mb-3">Stay Updated on AI Events</h2>
            <p className="text-indigo-200/80 mb-4">
              Subscribe to receive notifications about upcoming events matching your interests.
            </p>
            <Link href="/subscribe">
              <Button className="relative group overflow-hidden rounded-xl px-8 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 transition-all duration-300">
                <span className="flex items-center">
                  Subscribe to Updates
                  <Mail className="ml-2 h-4 w-4" />
                </span>
              </Button>
            </Link>
          </div>
        )}

        <div className="flex justify-center">
          <Link
            href="/"
            className="flex items-center justify-center text-indigo-300 hover:text-indigo-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-10 left-10 w-20 h-20 border border-indigo-500/20 rounded-full"></div>
      <div className="absolute top-20 right-10 w-32 h-32 border border-purple-500/20 rounded-full"></div>
    </div>
  )
}
