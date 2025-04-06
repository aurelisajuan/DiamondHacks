import React, { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar } from "../components/ui/avatar";
import { Send, User, Lock } from "lucide-react";
import { GoogleGenAI } from "@google/genai";

type Message = {
  id: number;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
};

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL_ID = "gemini-2.5-pro-preview-03-25";

export const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: `Hi! I'm SecWay, your AI privacy assistant. I can scan sites for risky permissions, explain potential threats, and help secure your settings. How can I help you browse more safely today? (Model: ${MODEL_ID} - Local POC)`,
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentStreamedMessageId, setCurrentStreamedMessageId] = useState<number | null>(null);

  // Initialize Gemini Client
  const genAI = useMemo(() => {
    if (!GEMINI_API_KEY) {
      console.error("Gemini API Key not found. Please check your .env file.");
      setError("API Key configuration error. Check your .env file and console.");
      return null;
    }
    try {
      return new GoogleGenAI({ apiKey: GEMINI_API_KEY, vertexai: false });
    } catch (initError) {
      console.error("Failed to initialize GoogleGenAI:", initError);
      setError("Failed to initialize AI Client. Check console for details.");
      return null;
    }
  }, []);

  // Autoscroll to the bottom on message update.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === "" || !genAI || isTyping) {
      if (!genAI) setError("AI Client not initialized. Check your API Key/console.");
      return;
    }

    const userMessageContent = input;
    setInput("");
    setError(null);

    const userMessage: Message = {
      id: Date.now(),
      content: userMessageContent,
      sender: "user",
      timestamp: new Date(),
    };

    const assistantMessageId = Date.now() + 1;
    const placeholderAiMessage: Message = {
      id: assistantMessageId,
      content: "...",
      sender: "assistant",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage, placeholderAiMessage]);
    setCurrentStreamedMessageId(assistantMessageId);
    setIsTyping(true);

    try {
      const streamResponse = await genAI.models.generateContentStream({
        model: MODEL_ID,
        contents: [{ role: "user", parts: [{ text: userMessageContent }] }],
      });

      let accumulatedText = "";
      for await (const chunk of streamResponse) {
        if (chunk.text) {
          accumulatedText += chunk.text;
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === assistantMessageId ? { ...msg, content: accumulatedText } : msg
            )
          );
        }
      }
    } catch (err) {
      console.error(`Error during stream from ${MODEL_ID}:`, err);
      let displayError = `Error communicating with ${MODEL_ID}.`;
      if (err instanceof Error) {
        const errorDetails =
          (err as any)?.response?.data?.error || err.message || String(err);
        displayError = `Stream Error: ${errorDetails}`;
        if (String(err).includes("400")) {
          displayError += " (Bad Request - check model access or request format)";
        } else if (String(err).includes("API key not valid")) {
          displayError += " (Check your API Key in .env)";
        } else if (String(errorDetails).includes("SAFETY")) {
          displayError = "Stream stopped due to safety settings.";
        }
      } else {
        displayError = `Stream Error: ${String(err)}`;
      }
      setError(displayError);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === assistantMessageId ? { ...msg, content: `Error: ${displayError}` } : msg
        )
      );
    } finally {
      setIsTyping(false);
      setCurrentStreamedMessageId(null);
    }
  };

  if (!genAI) {
    return (
      <div className="flex flex-col items-center justify-center h-48 max-w-md mx-auto bg-red-100 p-4 rounded-lg border border-red-300 text-red-800">
        <h3 className="font-bold text-lg mb-2">Configuration Error</h3>
        <p className="text-center">
          {error || "Gemini API Key missing or invalid. Check your .env file."}
        </p>
        <p className="text-center text-xs mt-4 font-bold">
          Remember: NEVER deploy this frontend code with a bundled API key!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-md mx-auto bg-white border border-gray-200 rounded-lg shadow-lg h-[500px]">
      {/* Header */}
      <header className="bg-orange-600 text-white p-2 rounded-t-lg text-center">
        <h2 className="text-xl font-bold">SecWay Chatbot</h2>
      </header>

      {/* Message Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex items-start space-x-2 max-w-[80%] ${
                message.sender === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <Avatar className="h-8 w-8">
                <div className="flex items-center justify-center h-full">
                  {message.sender === "assistant" ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>
              </Avatar>
              <div
                className={`rounded-lg p-3 shadow ${
                  message.sender === "user"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Ask SecWay AI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded-full px-4 py-2 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
            disabled={isTyping || !genAI}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={input.trim() === "" || isTyping || !genAI}
            className="rounded-full flex-shrink-0 bg-orange-600 hover:bg-orange-700 text-white disabled:bg-gray-400"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {error && <div className="mt-2 text-red-600 text-sm">{error}</div>}
      </footer>
    </div>
  );
};
