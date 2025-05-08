"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Send, Sparkles, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { useSearchParams } from "next/navigation"

export default function SubscribePage() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    
    // Fetch the selected event from our context API
    const fetchContext = async () => {
      try {
        const response = await fetch('/api/context')
        if (response.ok) {
          const data = await response.json()
          if (data.data && data.data.selectedEvent) {
            setSelectedEvent(data.data.selectedEvent)
          }
        }
      } catch (error) {
        console.error('Error fetching context:', error)
      }
    }
    
    fetchContext()
  }, [])

  const validateForm = () => {
    if (!email.trim()) {
      setError("Email is required")
      return false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address")
      return false
    }

    setError("")
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Create API endpoint to save subscription
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          event: selectedEvent || null,
          interests: selectedEvent ? selectedEvent.keywords : []
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }

      // Mark user as subscribed in localStorage
      localStorage.setItem('hasSubscribed', 'true');
      
      // Clear the selected event from context API
      await fetch('/api/context', {
        method: 'DELETE',
      });

      toast({
        title: "Subscription successful!",
        description: selectedEvent 
          ? `You'll receive updates about "${selectedEvent.title}" and similar AI events.`
          : "You'll receive updates about upcoming AI events.",
      })

      // Reset form
      setEmail("")
    } catch (error) {
      console.error("Error subscribing:", error)
      toast({
        title: "Subscription failed",
        description: "There was an error processing your subscription. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
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

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex items-center justify-center mb-6">
          <Sparkles className="h-8 w-8 text-indigo-400 mr-2 animate-pulse" />
          <span className="text-indigo-300 font-medium tracking-wider">pulseAI</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-200 to-pink-300 mb-4">
          Subscribe to Updates
        </h1>

        <p className="text-center text-indigo-200/80 text-lg mb-8 max-w-md mx-auto">
          Get notified about upcoming AI events and opportunities
        </p>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Subscribe to AI Event Updates</h2>
          <p className="text-indigo-200/80 mt-2">
            {selectedEvent 
              ? `Get notified about "${selectedEvent.title}" and similar AI events`
              : "Stay updated on the latest AI conferences, workshops, and meetups"}
          </p>
        </div>

        {selectedEvent && (
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
            <h3 className="font-semibold text-white mb-2">Selected Event:</h3>
            <p className="text-indigo-200 font-medium">{selectedEvent.title}</p>
            <p className="text-indigo-200/80 text-sm mt-1">{selectedEvent.description}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {selectedEvent.keywords?.map((keyword: string) => (
                <span 
                  key={keyword}
                  className="px-2 py-0.5 bg-white/5 text-indigo-200 text-xs rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 mb-8">
        <div className="bg-white/10 backdrop-blur-xl py-8 px-6 shadow-[0_0_50px_rgba(124,58,237,0.15)] sm:rounded-2xl sm:px-10 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-indigo-200 mb-1">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`bg-white/5 border ${error ? "border-red-500" : "border-white/10"} text-white placeholder-indigo-300/50 focus:border-indigo-400 focus:ring-indigo-400`}
                placeholder="you@example.com"
              />
              {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
            </div>

            <div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full relative group overflow-hidden rounded-xl py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 transition-all duration-300"
              >
                <span className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-purple-300 to-transparent opacity-30 group-hover:animate-shimmer"></span>
                <span className="flex items-center justify-center">
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                  <Send className="ml-2 h-4 w-4" />
                </span>
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center space-x-4">
          <Link
            href="/"
            className="flex items-center justify-center text-indigo-300 hover:text-indigo-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <Link
            href="/events"
            className="flex items-center justify-center text-indigo-300 hover:text-indigo-200 transition-colors"
          >
            <Search className="h-4 w-4 mr-2" />
            Find Events
          </Link>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-10 left-10 w-20 h-20 border border-indigo-500/20 rounded-full"></div>
      <div className="absolute top-20 right-10 w-32 h-32 border border-purple-500/20 rounded-full"></div>
    </div>
  )
}
