"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    keyword: "",
    email: "",
  })

  const [errors, setErrors] = useState({
    keyword: "",
    email: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors = {
      keyword: "",
      email: "",
    }

    let isValid = true

    if (!formData.keyword.trim()) {
      newErrors.keyword = "Keyword is required"
      isValid = false
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulate form submission
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Form submitted successfully!",
        description: "We'll get back to you soon.",
      })

      // Reset form
      setFormData({
        keyword: "",
        email: "",
      })
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
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

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex items-center justify-center mb-6">
          <Sparkles className="h-8 w-8 text-indigo-400 mr-2 animate-pulse" />
          <span className="text-indigo-300 font-medium tracking-wider">pulseAI</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-200 to-pink-300 mb-4">
          Contact Us
        </h1>

        <p className="text-center text-indigo-200/80 text-lg mb-8 max-w-md mx-auto">
          Fill out the form below and we'll get back to you as soon as possible.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 mb-8">
        <div className="bg-white/10 backdrop-blur-xl py-8 px-6 shadow-[0_0_50px_rgba(124,58,237,0.15)] sm:rounded-2xl sm:px-10 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="keyword" className="block text-sm font-medium text-indigo-200 mb-1">
                Keyword
              </Label>
              <Input
                id="keyword"
                name="keyword"
                type="text"
                value={formData.keyword}
                onChange={handleChange}
                className={`bg-white/5 border ${errors.keyword ? "border-red-500" : "border-white/10"} text-white placeholder-indigo-300/50 focus:border-indigo-400 focus:ring-indigo-400`}
                placeholder="Enter your keyword"
              />
              {errors.keyword && <p className="mt-1 text-sm text-red-400">{errors.keyword}</p>}
            </div>

            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-indigo-200 mb-1">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`bg-white/5 border ${errors.email ? "border-red-500" : "border-white/10"} text-white placeholder-indigo-300/50 focus:border-indigo-400 focus:ring-indigo-400`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
            </div>

            <div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full relative group overflow-hidden rounded-xl py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-500 transition-all duration-300"
              >
                <span className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-indigo-300 to-transparent opacity-30 group-hover:animate-shimmer"></span>
                <span className="flex items-center justify-center">
                  {isSubmitting ? "Submitting..." : "Submit"}
                  <Send className="ml-2 h-4 w-4" />
                </span>
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link
          href="/"
          className="flex items-center justify-center text-indigo-300 hover:text-indigo-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-10 left-10 w-20 h-20 border border-indigo-500/20 rounded-full"></div>
      <div className="absolute top-20 right-10 w-32 h-32 border border-purple-500/20 rounded-full"></div>
    </div>
  )
}
