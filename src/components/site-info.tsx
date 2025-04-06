import { useState, useEffect } from "react"
import { Badge } from "../components/ui/badge"
import { Lock } from "lucide-react"
import React from "react"

export const SiteInfo = () => {
  const [currentSite, setCurrentSite] = useState({
    url: "example.com",
    title: "Example Website",
    isSecure: true,
  })

  // In a real extension, you would get this from chrome.tabs API
  useEffect(() => {
    // Check if chrome is defined (running in a browser extension context)
    if (typeof chrome !== "undefined" && chrome.tabs) {
      // Get the current tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.url) {
          const url = new URL(tabs[0].url)
          setCurrentSite({
            url: url.hostname,
            title: tabs[0].title || "Unknown Website",
            isSecure: url.protocol === "https:",
          })
        }
      })
    } else {
      // Handle the case where chrome is not defined (e.g., running in a regular browser environment)
      console.warn("Chrome API not available. Running in a non-extension environment.")
    }
  }, [])

  return (
    <div className="bg-gray-50 p-3 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center mr-2">
            {currentSite.url.charAt(0).toUpperCase()}
          </div>
          <div className="truncate">
            <div className="font-medium text-sm truncate">{currentSite.title}</div>
            <div className="text-xs text-gray-500 flex items-center">
              {currentSite.isSecure ? <Lock className="h-3 w-3 text-green-600 mr-1" /> : null}
              {currentSite.url}
            </div>
          </div>
        </div>
        <Badge variant={currentSite.isSecure ? "outline" : "destructive"} className="ml-2">
          {currentSite.isSecure ? "Secure" : "Not Secure"}
        </Badge>
      </div>
    </div>
  )
}

