import React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Avatar } from "../components/ui/avatar"
import { Send, Mic, User, Lock } from "lucide-react"

type Message = {
  id: number
  content: string
  sender: "user" | "assistant"
  timestamp: Date
}

export const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hi there! I'm your SecWay AI assistant. How can I help you with your privacy and security today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (input.trim() === "") return

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I've analyzed this website and found several privacy concerns. It's requesting location access which isn't necessary for its functionality.",
        "This site uses excessive tracking cookies. I recommend disabling them in the Permissions tab.",
        "Based on my analysis, this website shows several indicators of a potential scam. I'd recommend caution before sharing any personal information.",
        "Good question! When a website asks for camera access, you should only grant it if you're actively using video features like video calls.",
        "I've secured your privacy settings for this site. All unnecessary permissions have been disabled.",
      ]

      const aiMessage: Message = {
        id: messages.length + 2,
        content: responses[Math.floor(Math.random() * responses.length)],
        sender: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-[350px]">
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "user" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-800"
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  {message.sender === "assistant" ? (
                    <Avatar className="h-6 w-6 bg-emerald-100">
                      <div className="flex h-full items-center justify-center">
                        <Lock className="h-3 w-3 text-emerald-600" />
                      </div>
                    </Avatar>
                  ) : (
                    <Avatar className="h-6 w-6 bg-white">
                      <div className="flex h-full items-center justify-center">
                        <User className="h-3 w-3 text-emerald-600" />
                      </div>
                    </Avatar>
                  )}
                  <span className="text-xs font-medium">{message.sender === "user" ? "You" : "SecWay AI"}</span>
                </div>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="mt-4 flex items-center space-x-2">
        <Button size="icon" variant="outline" className="rounded-full flex-shrink-0">
          <Mic className="h-4 w-4" />
        </Button>
        <Input
          placeholder="Ask about privacy or security..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={input.trim() === ""}
          className="rounded-full flex-shrink-0 bg-emerald-600 hover:bg-emerald-700"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

