import React from "react";
import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "../components/ui/button"; // Assuming path is correct
import { Input } from "../components/ui/input";   // Assuming path is correct
import { Avatar } from "../components/ui/avatar"; // Assuming path is correct
import { Send, Mic, User, Lock } from "lucide-react";

// --- Import the Correct Google GenAI library ---
import { GoogleGenAI, HarmCategory, HarmBlockThreshold, Content } from '@google/genai';

type Message = {
  id: number;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
};

interface AIAssistantProps {
  initialPrompt?: string | null;
  onPromptConsumed?: () => void; // Callback function
}

const SYSTEM_INSTRUCTION = `You are SecWay, a friendly and helpful AI assistant focused on web privacy and security within a browser extension. Your goal is to help non-technical users understand potential risks like excessive permissions, suspicious website behavior, and data collection. Explain concepts clearly and simply using straightforward language. Provide actionable recommendations for securing settings. Keep your tone encouraging, helpful, and educational. Do not mention that you are an AI model.`;


// --- Environment Variable for API Key (Local Dev ONLY) ---
// 🚨🚨🚨 WARNING: This key is still bundled with your client-side code! 🚨🚨🚨
// It's exposed if deployed. ONLY use this for local development.
// Ensure you have a .env file in your project root with:
// VITE_GEMINI_API_KEY=YOUR_ACTUAL_KEY_HERE
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Using Vite's env variable convention

// Use the specific preview model ID requested
const MODEL_ID = "gemini-2.5-pro-preview-03-25"; // Make sure you have access!

export const AIAssistant: React.FC<AIAssistantProps> = ({
  initialPrompt,
  onPromptConsumed
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      // --- Updated Initial Prompt ---
      content: `Hi! I'm SecWay, your AI privacy assistant. How can I help you browse more safely today?`,
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentStreamedMessageId, setCurrentStreamedMessageId] = useState<number | null>(null);

  // --- Initialize Gemini Client using @google/genai ---
  const genAI = useMemo(() => {
    if (!GEMINI_API_KEY) { // Check if the key was loaded from .env
      console.error("Gemini API Key not found. Make sure VITE_GEMINI_API_KEY is set in your .env file and you've restarted the dev server.");
      setError("API Key configuration error. Check .env file and console."); // Update error message
      return null;
    }
    try {
      return new GoogleGenAI({ apiKey: GEMINI_API_KEY, vertexai: false });
    } catch (initError) {
      console.error("Failed to initialize GoogleGenAI:", initError);
      setError("Failed to initialize AI Client. Check console for details.");
      return null;
    }
  }, []); // Re-run if API key changes (though it shouldn't in this setup)


  const safetySettings = [/* ... same settings ... */];
  const generationConfig = { /* ... same settings ... */ };

  const scrollToBottom = () => {
    // ... (Scrolling logic remains the same) ...
    if (!isTyping) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      const container = messagesEndRef.current?.parentElement?.parentElement;
      if (container && container.scrollHeight - container.scrollTop <= container.clientHeight + 100) {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = useCallback(async (promptToSend?: string) => {
    const contentToSend = promptToSend ?? input.trim(); // Use passed prompt or current input

    if (contentToSend === "" || !genAI || isTyping) {
      if (!genAI) setError("AI Client not initialized. Check API Key/console.");
      return;
    }

    // Clear input field only if the prompt didn't come from the prop
    if (!promptToSend) {
      setInput("");
    }
    setError(null);

    const userMessage: Message = {
      id: Date.now(),
      content: contentToSend,
      sender: "user",
      timestamp: new Date(),
    };

    // History preparation (remains the same)
    const conversationHistory: Content[] = messages
      .filter((msg, index) => index !== 0) // Exclude initial greeting
      .map(msg => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      }));

    // API Contents Preparation including System Prompt
    const apiContents: Content[] = [
      { role: "user", parts: [{ text: SYSTEM_INSTRUCTION }] },
      { role: "model", parts: [{ text: "Okay, I understand my role as SecWay. I'm ready to help with web privacy and security." }] }, // AI acknowledges
      ...conversationHistory,
      { role: "user", parts: [{ text: contentToSend }] } // The actual user prompt
    ];

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
      console.log(`Starting stream from ${MODEL_ID}:`, contentToSend);

      const streamResult = await genAI.models.generateContentStream({
        model: MODEL_ID, // Pass model ID here
        contents: apiContents,
      });

      let accumulatedText = '';
      // Process stream
      for await (const chunk of streamResult.stream) { // Access stream property
        const chunkText = chunk.text(); // Call text() method
        if (chunkText) {
          accumulatedText += chunkText;
          setMessages(prevMessages =>
            prevMessages.map(msg =>
              msg.id === assistantMessageId ? { ...msg, content: accumulatedText } : msg
            )
          );
        }
      }
      console.log("Stream finished.");

    } catch (err) {
      console.error(`Error during stream from ${MODEL_ID}:`, err);
      // --- Error Handling (keep your robust error handling) ---
      let displayError = `Sorry, error communicating with ${MODEL_ID}.`;
      if (err instanceof Error) {
        const errorDetails = (err as any)?.response?.data?.error?.message || (err as any)?.message || String(err);
        displayError = `Stream Error: ${errorDetails}`;
        if (String(err).includes('400')) {
          displayError += " (Bad Request - check model access, request format, history structure, or safety filters)";
        } else if (String(err).includes('API key not valid') || String(err).includes('PERMISSION_DENIED')) {
          displayError += " (Check your API Key in .env or API permissions)";
        } else if (String(errorDetails).includes('SAFETY') || (err as any)?.response?.promptFeedback?.blockReason) {
          displayError = `Stream stopped due to safety settings. Reason: ${(err as any)?.response?.promptFeedback?.blockReason || 'Safety Filter'}`;
        }
        console.error("Full Error Object:", err);
      } else {
        displayError = `Stream Error: ${String(err)}`;
      }
      setError(displayError);
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === assistantMessageId ? { ...msg, content: `Error: ${displayError}` } : msg
        )
      );

    } finally {
      setIsTyping(false);
      setCurrentStreamedMessageId(null);
      // If the send was triggered by a prop, clear the input field *after* sending
      if (promptToSend) {
        setInput("");
      }
    }
  }, [genAI, input, isTyping, messages, onPromptConsumed, safetySettings, generationConfig]); // Add dependencies


  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  useEffect(() => {
    if (initialPrompt && !isTyping && genAI) { // Check if prompt exists, not currently typing, and AI is ready
      console.log("Received initial prompt:", initialPrompt);
      // We call handleSend directly, passing the prompt
      handleSend(initialPrompt);
      // Call the callback to reset the prompt state in the parent component
      onPromptConsumed?.();
    }
    // Intentionally excluding handleSend from dependencies here to avoid loops if it changes unnecessarily often.
    // We rely on useCallback for handleSend stability.
    // We *do* need initialPrompt, isTyping, genAI, and onPromptConsumed as dependencies.
  }, [initialPrompt, isTyping, genAI, onPromptConsumed, handleSend]);

  // Render warning if API key is missing
  if (!genAI) { // Check if genAI client initialized successfully
    return (
      <div className="flex flex-col h-[350px] items-center justify-center bg-red-100 p-4 rounded-lg shadow-md border border-red-300 text-red-800">
        <h3 className="font-bold text-lg mb-2">Configuration Error</h3>
        <p className="text-center">{error || "Gemini API Key missing or invalid. Check .env (VITE_GEMINI_API_KEY) and restart dev server."}</p>
        <p className="text-center text-xs mt-4 font-bold">Remember: NEVER deploy this frontend code with a bundled API key!</p>
      </div>
    );
  }

  // --- Original JSX Structure ---
  return (
    <div className="flex flex-col h-[350px] bg-white p-4 rounded-lg shadow-md border border-gray-200">
      {/* Message display area */}
      <div className="flex-1 overflow-y-auto pr-2 mb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 shadow-sm ${message.sender === "user"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-800"
                  } ${message.id === currentStreamedMessageId ? 'opacity-80' : ''}`} // Simple opacity change for streaming message
              >
                {/* Sender info */}
                <div className="flex items-center space-x-2 mb-1">
                  {message.sender === "assistant" ? (<Avatar className="h-6 w-6 bg-emerald-100"><div className="flex h-full items-center justify-center"><Lock className="h-3 w-3 text-emerald-600" /></div></Avatar>) : (<Avatar className="h-6 w-6 bg-white border border-gray-200"><div className="flex h-full items-center justify-center"><User className="h-3 w-3 text-emerald-600" /></div></Avatar>)}
                  <span className="text-xs font-medium">{message.sender === "user" ? "You" : "SecWay AI"}</span>
                </div>
                {/* Message content */}
                <p className="text-sm whitespace-pre-wrap">{message.content || ' '}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="mt-auto flex items-center space-x-2 pt-2 border-t border-gray-200">
        <Input
          placeholder={`Ask SecWay AI (${MODEL_ID.split('-')[1]})...`} // Updated placeholder
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded-full px-4 py-2 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
          disabled={isTyping || !genAI}
          onKeyDown={handleKeyPress}
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={input.trim() === "" || isTyping || !genAI}
          className="rounded-full flex-shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-gray-400"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};