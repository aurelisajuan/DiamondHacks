import React, { useState, useEffect } from "react"
import { Shield, X, AlertTriangle } from "lucide-react"

declare const chrome: any

const App = () => {
  const [visible, setVisible] = useState(false)
  const [riskLevel, setRiskLevel] = useState<"low" | "medium" | "high">("low")
  const [notification, setNotification] = useState({
    title: "",
    message: "",
  })

  useEffect(() => {
    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener((message) => {
      if (message.action === "showNotification") {
        setRiskLevel(message.riskLevel)
        setNotification({
          title: message.title,
          message: message.message,
        })
        setVisible(true)

        // Auto-hide after 5 seconds
        setTimeout(() => {
          setVisible(false)
        }, 5000)
      }
    })

    // Simulate a notification for demo purposes
    setTimeout(() => {
      const risks = ["low", "medium", "high"]
      const randomRisk = risks[Math.floor(Math.random() * risks.length)] as "low" | "medium" | "high"

      setRiskLevel(randomRisk)
      setNotification({
        title:
          randomRisk === "high"
            ? "High Risk Detected!"
            : randomRisk === "medium"
              ? "Privacy Warning"
              : "Privacy Scan Complete",
        message:
          randomRisk === "high"
            ? "This website shows signs of a potential scam. Be careful with your personal information."
            : randomRisk === "medium"
              ? "This website is requesting unnecessary permissions. Click to review."
              : "This website appears to be safe. No major privacy concerns detected.",
      })
      setVisible(true)
    }, 2000)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div
        className={`rounded-lg shadow-lg overflow-hidden ${
          riskLevel === "high"
            ? "bg-red-50 border border-red-200"
            : riskLevel === "medium"
              ? "bg-amber-50 border border-amber-200"
              : "bg-green-50 border border-green-200"
        }`}
      >
        <div
          className={`px-4 py-3 flex items-center justify-between ${
            riskLevel === "high" ? "bg-red-500" : riskLevel === "medium" ? "bg-amber-500" : "bg-emerald-500"
          } text-white`}
        >
          <div className="flex items-center gap-2">
            {riskLevel === "high" ? <AlertTriangle className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
            <span className="font-medium">{notification.title}</span>
          </div>
          <button onClick={() => setVisible(false)} className="text-white hover:text-gray-100">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-4">
          <p
            className={`text-sm ${
              riskLevel === "high" ? "text-red-700" : riskLevel === "medium" ? "text-amber-700" : "text-green-700"
            }`}
          >
            {notification.message}
          </p>
          <div className="mt-3 flex justify-end">
            <button
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                riskLevel === "high"
                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                  : riskLevel === "medium"
                    ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                    : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              }`}
              onClick={() => {
                // Open the extension popup
                chrome.runtime.sendMessage({ action: "openPopup" })
                setVisible(false)
              }}
            >
              {riskLevel === "high" ? "Review Now" : "Details"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

