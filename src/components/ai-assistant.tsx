import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar } from "../components/ui/avatar";
import { Send, Mic, User, Lock } from "lucide-react";
import { GoogleGenAI, HarmCategory, HarmBlockThreshold, Content } from '@google/genai';
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message";

type MessageType = {
  id: number;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
};

// New component to render markdown-enabled messages for the assistant
export function MessageWithMarkdown({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <Message>
        <MessageAvatar src="https://github.com/ibelick.png" alt="SecWay AI" />
        <MessageContent markdown className="prose-h2:!mt-0 prose-h2:!scroll-m-0">
          {children as string}
        </MessageContent>
      </Message>
    </div>
  );
}

const SYSTEM_INSTRUCTION = `You are SecWay, a friendly and helpful AI assistant focused on web privacy and security within a browser extension. Your goal is to help non-technical users understand potential risks like excessive permissions, suspicious website behavior, and data collection. Explain concepts clearly and simply using straightforward language. Provide actionable recommendations for securing settings. Keep your tone encouraging, helpful, and educational. Do not mention that you are an AI model. When asked specifically about why a permission is important or risky (like camera, location, microphone, notifications), explain the potential privacy implications of granting it unnecessarily and why users should be cautious.`;

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL_ID = "gemini-2.5-pro-preview-03-25"; // Ensure this model ID is correct and accessible

interface AIAssistantProps {
  initialPrompt?: string | null;
  onPromptConsumed?: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  initialPrompt,
  onPromptConsumed,
}) => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: 1,
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

  const genAI = useMemo(() => {
    if (!GEMINI_API_KEY) {
      console.error("Gemini API Key not found. Make sure VITE_GEMINI_API_KEY is set in your .env file and you've restarted the dev server.");
      setError("API Key configuration error. Check .env file and console.");
      return null;
    }
    try {
      return new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    } catch (initError) {
      console.error("Failed to initialize GoogleGenAI:", initError);
      setError("Failed to initialize AI Client. Check console for details.");
      return null;
    }
  }, []);

  const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  ];

  const generationConfig = {
    temperature: 0.7,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const scrollToBottom = () => {
    if (!isTyping) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      const container = messagesEndRef.current?.parentElement?.parentElement;
      if (container && container.scrollHeight - container.scrollTop <= container.clientHeight + 150) {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = useCallback(async (promptToSend?: string) => {
    const contentToSend = promptToSend ?? input.trim();

    if (contentToSend === "" || !genAI || isTyping) {
      if (!genAI) setError("AI Client not initialized. Check API Key/console.");
      return;
    }

    if (!promptToSend) {
      setInput("");
    }
    setError(null);

    const userMessage: MessageType = {
      id: Date.now(),
      content: contentToSend,
      sender: "user",
      timestamp: new Date(),
    };

    const conversationHistory: Content[] = messages
      .filter((msg, index) => index !== 0)
      .map(msg => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      }));

    const apiContents: Content[] = [
      { role: "user", parts: [{ text: SYSTEM_INSTRUCTION }] },
      { role: "model", parts: [{ text: "Okay, I understand my role as SecWay. I'm ready to help with web privacy and security." }] },
      ...conversationHistory,
      { role: "user", parts: [{ text: contentToSend }] }
    ];

    const assistantMessageId = Date.now() + 1;
    const placeholderAiMessage: MessageType = {
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
        contents: apiContents,
      });

      let accumulatedText = '';
      let processedChunk = false; // Flag to see if any text processing path worked

      for await (const chunk of streamResponse) { // Attempting direct iteration
        processedChunk = false; // Reset for each chunk
        let chunkText = null;

        chunkText = chunk.text;
        processedChunk = true;

        if (chunkText) {
          accumulatedText += chunkText;
          setMessages(prevMessages =>
            prevMessages.map(msg =>
              msg.id === assistantMessageId ? { ...msg, content: accumulatedText } : msg
            )
          );
        } else if (!processedChunk) {
          // If no known structure matched, log for debugging
          // console.log("Unrecognized chunk structure:", JSON.stringify(chunk, null, 2));
        }
      }

      // If direct iteration on streamResponse yielded nothing, try streamResponse.stream
      if (accumulatedText === '' && streamResponse && typeof (streamResponse as any).stream === 'object') {
        console.warn("Direct iteration yielded no text, trying .stream property");
        for await (const chunk of (streamResponse as any).stream) {
          processedChunk = false; // Reset for each chunk
          let chunkText = null;

          // Reuse the same processing logic as above for chunks from .stream
          if (chunk && typeof chunk.text !== 'function' && typeof chunk.text !== 'undefined') {
            chunkText = chunk.text;
            processedChunk = true;
          } else if (chunk && typeof chunk.text === 'function') {
            chunkText = chunk.text();
            processedChunk = true;
          } else if (chunk && chunk.candidates && chunk.candidates[0]?.content?.parts?.[0]?.text) {
            chunkText = chunk.candidates[0].content.parts[0].text;
            processedChunk = true;
          }

          if (chunkText) {
            accumulatedText += chunkText;
            setMessages(prevMessages =>
              prevMessages.map(msg =>
                msg.id === assistantMessageId ? { ...msg, content: accumulatedText } : msg
              )
            );
          } else if (!processedChunk) {
            // console.log("Unrecognized chunk structure (from .stream):", JSON.stringify(chunk, null, 2));
          }
        }
      }


      if (accumulatedText === '') {
        console.warn("Stream finished but no text was accumulated.");
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === assistantMessageId && msg.content === "..." ? { ...msg, content: "[No response content]" } : msg
          )
        );
      }

    } catch (err) {
      console.error(`Error during stream from ${MODEL_ID}:`, err);
      let displayError = `Sorry, error communicating with ${MODEL_ID}.`;
      if (err instanceof Error) {
        const errorDetails = (err as any)?.response?.data?.error?.message || (err as any)?.message || String(err);
        const googleApiError = (err as any).cause;

        displayError = `Stream Error: ${errorDetails}`;
        if (googleApiError && googleApiError.message) {
          displayError += ` (Detail: ${googleApiError.message})`;
        }

        if (String(err).includes('400')) {
          displayError += " (Bad Request - check model access, request format/history structure, or safety filters)";
        } else if (String(err).includes('API key not valid') || String(err).includes('PERMISSION_DENIED')) {
          displayError += " (Check your API Key in .env or API permissions)";
        } else if (String(errorDetails).includes('SAFETY') || (err as any)?.response?.promptFeedback?.blockReason) {
          displayError = `Stream stopped due to safety settings. Reason: ${(err as any)?.response?.promptFeedback?.blockReason || 'Safety Filter'}`;
        }
        console.error("Full Error Object:", err);
        if (googleApiError) console.error("Google API Error Cause:", googleApiError);
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
      if (promptToSend) {
        setInput("");
      }
    }
  }, [genAI, input, isTyping, messages, safetySettings, generationConfig, onPromptConsumed]);


  useEffect(() => {
    if (initialPrompt && !isTyping && genAI) {
      handleSend(initialPrompt);
      onPromptConsumed?.();
    }
  }, [initialPrompt, isTyping, genAI, onPromptConsumed, handleSend]);


  if (!genAI && !GEMINI_API_KEY) {
    return (
      <div className="flex flex-col h-[350px] items-center justify-center bg-red-100 p-4 rounded-lg shadow-md border border-red-300 text-red-800">
        <h3 className="font-bold text-lg mb-2">Configuration Error</h3>
        <p className="text-center">{error || "Gemini API Key missing. Set VITE_GEMINI_API_KEY in your .env file and restart the dev server."}</p>
        <p className="text-center text-xs mt-4 font-bold">Remember: NEVER deploy this frontend code with a bundled API key!</p>
      </div>
    );
  }
  if (!genAI && error) {
    return (
      <div className="flex flex-col h-[350px] items-center justify-center bg-red-100 p-4 rounded-lg shadow-md border border-red-300 text-red-800">
        <h3 className="font-bold text-lg mb-2">Initialization Error</h3>
        <p className="text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[350px] bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <div className="flex-1 overflow-y-auto pr-2 mb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.sender === "assistant" ? (
                // Use the markdown-enabled component for assistant messages
                <MessageWithMarkdown>{message.content || " "}</MessageWithMarkdown>
              ) : (
                <div
                  className={`max-w-[85%] rounded-lg p-3 shadow-sm bg-orange-600 text-white ${message.id === currentStreamedMessageId && message.content === "..." ? 'animate-pulse' : ''}`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <Avatar className="h-6 w-6 bg-white border border-gray-300 flex items-center justify-center">
                      <User className="h-3 w-3 text-orange-600" />
                    </Avatar>
                    <span className="text-xs font-medium">You</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap break-words">{message.content || ' '}</p>
                </div>
              )}
            </div>
          ))}
          {error && (
            <div className="flex justify-center">
              <div className="max-w-[85%] rounded-lg p-3 bg-red-100 text-red-700 text-sm border border-red-200 shadow-sm">
                <strong>Error:</strong> {error}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="mt-auto flex items-center space-x-2 pt-2 border-t border-gray-200">
        <Input
          placeholder="Ask SecWay AI..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          className="flex-1 rounded-full px-4 py-2 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
          disabled={isTyping || !genAI}
        />
        <Button
          size="icon"
          onClick={() => handleSend()}
          disabled={input.trim() === "" || isTyping || !genAI}
          className="rounded-full flex-shrink-0 bg-orange-600 hover:bg-orange-700 text-white disabled:bg-gray-400"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
