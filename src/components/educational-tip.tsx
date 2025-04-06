"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "../components/ui/card"
import { Lightbulb, X } from "lucide-react"
import React from "react"

export const EducationalTip = () => {
  const [tip, setTip] = useState("")
  const [visible, setVisible] = useState(true)

  const tips = [
    "Always check website permissions before sharing sensitive information.",
    "A legitimate website rarely needs access to your camera or microphone unless it offers video/audio features.",
    "Be cautious of websites that request your location without a clear reason.",
    "Excessive tracking cookies can follow your browsing habits across different websites.",
    "Look for 'https://' in the URL - the 's' means the connection is secure.",
    "Phishing sites often have URLs that look similar to legitimate sites but with slight misspellings.",
    "Be wary of websites that create a false sense of urgency or offer deals that seem too good to be true.",
  ]

  useEffect(() => {
    setTip(tips[Math.floor(Math.random() * tips.length)])
  }, [])

  if (!visible) return null

  return (
    <Card className="mt-4 bg-blue-50 border-blue-200">
      <CardContent className="p-3">
        <div className="flex">
          <div className="mr-3 mt-1">
            <Lightbulb className="h-5 w-5 text-blue-500" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-blue-700 mb-1">Did you know?</div>
            <p className="text-xs text-blue-600">{tip}</p>
          </div>
          <button onClick={() => setVisible(false)} className="text-blue-400 hover:text-blue-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

