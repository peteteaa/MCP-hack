"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Sparkles, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

interface Event {
  id: number
  title: string
  description: string
  date: string
  location: string
  url: string
  keywords: string[]
}

export default function ContextDemoPage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [generatingRecommendations, setGeneratingRecommendations] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scrapeResults, setScrapeResults] = useState<string | null>(null)
  const [scrapeContext, setScrapeContext] = useState<any | null>(null)
  const [scrapeLoading, setScrapeLoading] = useState(false)

  // Fetch the current context when the page loads
  useEffect(() => {
    async function fetchContext() {
      try {
        setLoading(true)
        const response = await fetch('/api/context')
        
        if (!response.ok) {
          throw new Error('Failed to fetch context')
        }
        
        const data = await response.json()
        
        if (data.data && data.data.selectedEvent) {
          setSelectedEvent(data.data.selectedEvent)
          // Generate recommendations automatically if an event is selected
          generateRecommendations(data.data.selectedEvent)
          // Fetch scrape results
          fetchScrapeResults()
        }
      } catch (error) {
        console.error('Error fetching context:', error)
        setError('Failed to fetch context. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchContext()
  }, [])
  
  // Function to fetch scrape results
  const fetchScrapeResults = async () => {
    try {
      setScrapeLoading(true)
      const response = await fetch('/api/scrape')
      
      if (!response.ok) {
        throw new Error('Failed to fetch scrape results')
      }
      
      const data = await response.json()
      console.log('Scrape API response:', data)
      
      if (data.result) {
        setScrapeResults(data.result)
      }
      
      if (data.debug && data.debug.context) {
        setScrapeContext(data.debug.context)
      }
    } catch (error) {
      console.error('Error fetching scrape results:', error)
    } finally {
      setScrapeLoading(false)
    }
  }

  // Function to generate recommendations based on the selected event
  const generateRecommendations = async (event: Event) => {
    if (!event) return
    
    setGeneratingRecommendations(true)
    setError(null)
    
    try {
      // Use Gemini to generate recommendations based on the selected event
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" })
      
      const prompt = `
        You are an AI assistant helping to provide recommendations based on a user's interest in an AI event.
        
        The user has expressed interest in the following AI event:
        
        Title: ${event.title}
        Description: ${event.description}
        Date: ${event.date}
        Location: ${event.location}
        Keywords: ${event.keywords.join(', ')}
        
        Based on this event, please provide 5 specific recommendations for:
        1. Related AI topics the user might want to learn about
        2. Skills they should develop to make the most of this event
        3. Other similar events they might be interested in
        4. Resources (books, courses, websites) related to the event's focus
        5. Networking opportunities or communities related to this event's topic
        
        Format each recommendation as a concise, actionable bullet point.
      `
      
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      // Extract bullet points from the response
      const bulletPoints = text
        .split('\n')
        .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
        .map(line => line.trim().replace(/^[-•]\s+/, ''))
        .filter(line => line.length > 0)
      
      setRecommendations(bulletPoints.length > 0 ? bulletPoints : [
        "Explore machine learning fundamentals to better understand AI applications",
        "Practice with Python and TensorFlow before attending the event",
        "Consider attending the upcoming AI Summit in San Francisco",
        "Read 'AI Superpowers' by Kai-Fu Lee for industry context",
        "Join the AI Practitioners community on Discord for networking"
      ])
    } catch (error) {
      console.error('Error generating recommendations:', error)
      setError('Failed to generate recommendations. Please try again.')
      
      // Fallback recommendations
      setRecommendations([
        "Explore machine learning fundamentals to better understand AI applications",
        "Practice with Python and TensorFlow before attending the event",
        "Consider attending the upcoming AI Summit in San Francisco",
        "Read 'AI Superpowers' by Kai-Fu Lee for industry context",
        "Join the AI Practitioners community on Discord for networking"
      ])
    } finally {
      setGeneratingRecommendations(false)
    }
  }

  // Function to refresh recommendations
  const handleRefreshRecommendations = () => {
    if (selectedEvent) {
      generateRecommendations(selectedEvent)
    }
  }

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

        <div className="flex items-center justify-between mb-8">
          <Link href="/events" className="flex items-center text-indigo-300 hover:text-indigo-200 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Events
          </Link>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-200 to-pink-300 mb-4">
          Context-Aware Recommendations
        </h1>

        <p className="text-center text-indigo-200/80 text-lg mb-8 max-w-md mx-auto">
          Personalized recommendations based on your selected event
        </p>

        {loading ? (
          <div className="bg-white/10 backdrop-blur-xl py-8 px-6 shadow-[0_0_50px_rgba(124,58,237,0.15)] sm:rounded-2xl sm:px-10 border border-white/20 mb-8 text-center">
            <p className="text-indigo-200/80">Loading your context...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 backdrop-blur-xl py-6 px-6 shadow-[0_0_30px_rgba(220,38,38,0.15)] sm:rounded-2xl sm:px-8 border border-red-500/20 mb-8 text-center">
            <p className="text-red-300">{error}</p>
          </div>
        ) : !selectedEvent ? (
          <div className="bg-white/10 backdrop-blur-xl py-8 px-6 shadow-[0_0_50px_rgba(124,58,237,0.15)] sm:rounded-2xl sm:px-10 border border-white/20 mb-8 text-center">
            <p className="text-indigo-200/80 mb-4">No event selected. Please go to the Events page and select an event you're interested in.</p>
            <Link href="/events">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Browse Events
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-white/10 backdrop-blur-xl py-8 px-6 shadow-[0_0_50px_rgba(124,58,237,0.15)] sm:rounded-2xl sm:px-10 border border-white/20 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Your Selected Event</h2>
              
              <Card className="bg-white/10 backdrop-blur-xl border border-white/20 text-white overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{selectedEvent.title}</h3>
                  <p className="text-indigo-200/80 mb-4">{selectedEvent.description}</p>
                  <div className="text-sm text-indigo-200/80">
                    {selectedEvent.date !== "Date not specified" && (
                      <p className="mb-1">📅 {selectedEvent.date}</p>
                    )}
                    {selectedEvent.location !== "Location not specified" && (
                      <p className="mb-1">📍 {selectedEvent.location}</p>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedEvent.keywords.map((keyword) => (
                        <Badge
                          key={keyword}
                          variant="outline"
                          className="bg-white/5 text-indigo-200 border-indigo-400/30"
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-white/10 backdrop-blur-xl py-8 px-6 shadow-[0_0_50px_rgba(124,58,237,0.15)] sm:rounded-2xl sm:px-10 border border-white/20 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Personalized Recommendations</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRefreshRecommendations}
                  disabled={generatingRecommendations}
                  className="bg-white/5 border border-indigo-400/30 text-indigo-200 hover:bg-white/10"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
              </div>
              
              {generatingRecommendations ? (
                <p className="text-indigo-200/80 text-center py-4">Generating recommendations...</p>
              ) : (
                <ul className="space-y-3">
                  {recommendations.map((recommendation, index) => (
                    <li key={index} className="bg-white/5 p-3 rounded-lg border border-white/10">
                      <p className="text-indigo-100">{recommendation}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {/* Debug section for scrape context */}
            <div className="bg-white/10 backdrop-blur-xl py-8 px-6 shadow-[0_0_50px_rgba(124,58,237,0.15)] sm:rounded-2xl sm:px-10 border border-white/20 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Debug: Scrape Context</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={fetchScrapeResults}
                  disabled={scrapeLoading}
                  className="bg-white/5 border border-indigo-400/30 text-indigo-200 hover:bg-white/10"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
              </div>
              
              {scrapeLoading ? (
                <p className="text-indigo-200/80 text-center py-4">Loading scrape data...</p>
              ) : (
                <div className="space-y-4">
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <h3 className="text-lg font-medium text-indigo-100 mb-2">Context Used for Scraping</h3>
                    <pre className="text-indigo-200/80 text-sm overflow-auto p-2 bg-black/20 rounded">
                      {scrapeContext ? JSON.stringify(scrapeContext, null, 2) : 'No context data available'}
                    </pre>
                  </div>
                  
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <h3 className="text-lg font-medium text-indigo-100 mb-2">Scrape Results</h3>
                    <pre className="text-indigo-200/80 text-sm overflow-auto p-2 bg-black/20 rounded max-h-60">
                      {scrapeResults || 'No scrape results available'}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
