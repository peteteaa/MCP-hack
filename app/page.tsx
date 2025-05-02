"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Sparkles, Search } from "lucide-react"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {mounted &&
          Array.from({ length: 20 }).map((_, i) => (
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

      {/* Main content */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex items-center justify-center mb-6">
          <Sparkles className="h-8 w-8 text-indigo-400 mr-2 animate-pulse" />
          <span className="text-indigo-300 font-medium tracking-wider">pulseAI</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-200 to-pink-300 mb-4 animate-fade-in">
          Welcome to pulseAI
        </h1>

        <p className="text-center text-indigo-200/80 text-lg mb-12 max-w-md mx-auto">
          Discover AI-powered events and connect with the future of technology
        </p>

        <div className="bg-white/10 backdrop-blur-xl py-10 px-6 shadow-[0_0_50px_rgba(124,58,237,0.15)] sm:rounded-2xl sm:px-10 border border-white/20 transform transition-all duration-500 hover:shadow-[0_0_80px_rgba(124,58,237,0.25)]">
          <div className="space-y-8">
            <p className="text-center text-gray-200 text-lg leading-relaxed">
              Ready to explore AI events tailored to your interests? Search by keyword or city to find the perfect
              event.
            </p>

            <div className="text-center">
              <Link
                href="/events"
                className="group relative w-full inline-flex justify-center items-center py-4 px-6 border-0 rounded-xl text-lg font-semibold text-white overflow-hidden transition-all duration-300"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 opacity-100"></span>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-size-200 animate-gradient-x"></span>
                <span className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-indigo-300 to-transparent opacity-30 group-hover:animate-shimmer"></span>
                <span className="relative z-10 flex items-center">
                  <Search className="mr-2 h-5 w-5" />
                  Find AI Events
                  <svg
                    className="ml-2 h-5 w-5 transform transition-transform duration-300 ease-in-out group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-10 left-10 w-20 h-20 border border-indigo-500/20 rounded-full"></div>
      <div className="absolute top-20 right-10 w-32 h-32 border border-purple-500/20 rounded-full"></div>
    </div>
  )
}
