"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Search, Calendar, MapPin, Users, Sparkles, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock event data with city information
const allEvents = [
  {
    id: 1,
    title: "AI Summit 2023",
    description: "Join industry leaders to explore the latest in artificial intelligence and machine learning.",
    date: "2023-11-15",
    location: "San Francisco, CA",
    city: "San Francisco",
    attendees: 1200,
    keywords: ["ai", "machine learning", "deep learning", "neural networks", "technology"],
  },
  {
    id: 2,
    title: "Natural Language Processing Workshop",
    description: "Hands-on workshop on building NLP applications with transformer models.",
    date: "2023-12-05",
    location: "Online",
    city: "Online",
    attendees: 500,
    keywords: ["nlp", "language", "transformers", "gpt", "bert", "ai"],
  },
  {
    id: 3,
    title: "Computer Vision Conference",
    description: "Explore the latest research and applications in computer vision and image processing.",
    date: "2024-01-20",
    location: "Boston, MA",
    city: "Boston",
    attendees: 800,
    keywords: ["computer vision", "image processing", "object detection", "ai", "deep learning"],
  },
  {
    id: 4,
    title: "Reinforcement Learning Symposium",
    description: "Deep dive into reinforcement learning algorithms and their applications.",
    date: "2024-02-10",
    location: "Seattle, WA",
    city: "Seattle",
    attendees: 400,
    keywords: ["reinforcement learning", "rl", "ai", "machine learning", "algorithms"],
  },
  {
    id: 5,
    title: "AI Ethics Forum",
    description: "Discussing ethical considerations in AI development and deployment.",
    date: "2024-03-15",
    location: "New York, NY",
    city: "New York",
    attendees: 600,
    keywords: ["ethics", "ai ethics", "responsible ai", "fairness", "ai"],
  },
  {
    id: 6,
    title: "Healthcare AI Summit",
    description: "Exploring AI applications in healthcare and medical research.",
    date: "2024-04-05",
    location: "Chicago, IL",
    city: "Chicago",
    attendees: 700,
    keywords: ["healthcare", "medical", "ai", "machine learning", "diagnosis"],
  },
  {
    id: 7,
    title: "Robotics Innovation Expo",
    description: "Showcasing the latest advancements in robotics and autonomous systems.",
    date: "2024-05-20",
    location: "Austin, TX",
    city: "Austin",
    attendees: 900,
    keywords: ["robotics", "autonomous", "ai", "automation", "robots"],
  },
  {
    id: 8,
    title: "Financial AI Conference",
    description: "AI applications in finance, trading, and risk management.",
    date: "2024-06-10",
    location: "London, UK",
    city: "London",
    attendees: 550,
    keywords: ["finance", "fintech", "trading", "ai", "machine learning"],
  },
  {
    id: 9,
    title: "AI in Education Summit",
    description: "Exploring how AI is transforming education and learning experiences.",
    date: "2024-07-15",
    location: "Toronto, Canada",
    city: "Toronto",
    attendees: 450,
    keywords: ["education", "edtech", "ai", "learning", "personalization"],
  },
  {
    id: 10,
    title: "Smart Cities AI Conference",
    description: "How artificial intelligence is building the cities of tomorrow.",
    date: "2024-08-22",
    location: "Barcelona, Spain",
    city: "Barcelona",
    attendees: 800,
    keywords: ["smart cities", "urban planning", "ai", "iot", "sustainability"],
  },
  {
    id: 11,
    title: "AI Research Symposium",
    description: "Academic conference showcasing cutting-edge AI research.",
    date: "2024-09-10",
    location: "Boston, MA",
    city: "Boston",
    attendees: 600,
    keywords: ["research", "academic", "ai", "machine learning", "papers"],
  },
  {
    id: 12,
    title: "AI for Climate Action",
    description: "Using AI to address climate change and environmental challenges.",
    date: "2024-10-05",
    location: "Seattle, WA",
    city: "Seattle",
    attendees: 500,
    keywords: ["climate", "environment", "ai", "sustainability", "green tech"],
  },
]

export default function EventsPage() {
  const [keyword, setKeyword] = useState("")
  const [city, setCity] = useState("")
  const [filteredEvents, setFilteredEvents] = useState<typeof allEvents>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Get unique cities for dropdown
  const uniqueCities = Array.from(new Set(allEvents.map((event) => event.city))).sort()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    setHasSearched(true)

    setTimeout(() => {
      let results = [...allEvents]

      // Filter by keyword if provided
      if (keyword.trim() !== "") {
        const searchTerm = keyword.toLowerCase()
        results = results.filter(
          (event) =>
            event.keywords.some((k) => k.toLowerCase().includes(searchTerm)) ||
            event.title.toLowerCase().includes(searchTerm) ||
            event.description.toLowerCase().includes(searchTerm),
        )
      }

      // Filter by city if provided
      if (city && city !== "all") {
        results = results.filter((event) => event.city === city)
      }

      setFilteredEvents(results)
      setIsSearching(false)
    }, 500) // Simulate search delay
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex flex-col py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {mounted &&
          Array.from({ length: 15 }).map((_, i) => (
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
          Search for AI events by keyword and city
        </p>

        <div className="bg-white/10 backdrop-blur-xl py-8 px-6 shadow-[0_0_50px_rgba(124,58,237,0.15)] sm:rounded-2xl sm:px-10 border border-white/20 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="AI, machine learning, robotics, etc."
                />
              </div>
              <div>
                <Label htmlFor="city" className="block text-sm font-medium text-indigo-200 mb-1">
                  City
                </Label>
                <div className="relative">
                  <select
                    id="city"
                    name="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full appearance-none bg-white/5 border border-white/10 text-white rounded-md px-3 py-2 focus:border-indigo-400 focus:ring-indigo-400 focus:outline-none"
                  >
                    <option value="">All Cities</option>
                    {uniqueCities.map((city) => (
                      <option key={city} value={city} className="bg-slate-800 text-white">
                        {city}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-indigo-300">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={isSearching}
                className="relative group overflow-hidden rounded-xl px-8 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-500 transition-all duration-300"
              >
                <span className="flex items-center">
                  {isSearching ? "Searching..." : "Search Events"}
                  <Search className="ml-2 h-4 w-4" />
                </span>
              </Button>
            </div>
          </form>
        </div>

        {hasSearched && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 text-white overflow-hidden hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] transition-all duration-300"
                  >
                    <CardHeader>
                      <CardTitle className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
                        {event.title}
                      </CardTitle>
                      <CardDescription className="text-indigo-200/80">{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center text-sm text-indigo-200/80">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center text-sm text-indigo-200/80">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.location}
                      </div>
                      <div className="flex items-center text-sm text-indigo-200/80">
                        <Users className="h-4 w-4 mr-2" />
                        {event.attendees.toLocaleString()} attendees
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex flex-wrap gap-2">
                        {event.keywords.slice(0, 3).map((keyword, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="bg-white/5 text-indigo-200 border-indigo-400/30"
                          >
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-indigo-200/80 text-lg">
                    No events found matching your search. Try different keywords or cities.
                  </p>
                </div>
              )}
            </div>

            {filteredEvents.length > 0 && (
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
          </>
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
