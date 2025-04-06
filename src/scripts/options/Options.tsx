// src/app/options/Options.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { AIAssistant } from "../../components/ai-assistant"; // Adjust path if needed
import { SiteInfo } from "../../components/site-info";       // Adjust path if needed
import { Lock, Bell, Settings } from "lucide-react";

// Declare chrome variable
declare const chrome: any;

export function Options() {
  const [currentTabUrl, setCurrentTabUrl] = useState<string | null>(null); // Renamed for clarity
  const [activeTab, setActiveTab] = useState<string>("permissions"); // State to control Tabs value
  const [initialAiPrompt, setInitialAiPrompt] = useState<string | null>(null); // State for the pre-filled AI prompt

  useEffect(() => {
    // Fetch current tab URL (remains the same)
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          setCurrentTabUrl(tabs[0].url || null);
        }
      });
    }
  }, []);

  // Hardcoded permissions (remains the same)
  const permissionStatuses = [
    { title: "Camera", desc: "Access to your camera", status: "granted" },
    { title: "Location", desc: "Access to your location", status: "warning" },
    { title: "Notifications", desc: "Permission to send alerts", status: "denied" },
    { title: "Microphone", desc: "Access to your microphone", status: "granted" },
  ];

  // --- New Handler ---
  const handlePermissionQuery = (permissionTitle: string) => {
    // Set the prompt for the AI Assistant
    setInitialAiPrompt(
      `Why is granting the "${permissionTitle}" permission to websites potentially risky or important to manage? Explain in simple terms.`
    );
    // Switch to the AI Assistant tab
    setActiveTab("assistant");
  };

  // --- Function to clear the prompt after the AI uses it ---
  const consumeInitialPrompt = () => {
    setInitialAiPrompt(null);
  };

  return (
    <div className="w-[400px] h-[600px] bg-white flex flex-col">
      {/* Header (remains the same) */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white flex items-center justify-between">
        {/* ... header content ... */}
        <div className="flex items-center gap-2">
          <Lock className="h-6 w-6" />
          <h1 className="text-xl font-bold">SecWay</h1>
        </div>
        <button className="hover:opacity-80">
          <Settings className="h-6 w-6" />
        </button>
      </div>

      {/* Site Information (remains the same) */}
      {/* Pass currentTabUrl if SiteInfo needs it */}
      <SiteInfo />

      {/* Main Content Area */}
      <div className="flex-1 p-4 overflow-y-auto"> {/* Added overflow-y-auto */}
        {/* --- Control Tabs component with state --- */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="permissions">
              <Lock className="mr-2 h-4 w-4" />
              Permissions
            </TabsTrigger>
            <TabsTrigger value="assistant">
              <Bell className="mr-2 h-4 w-4" />
              AI Assistant
            </TabsTrigger>
          </TabsList>

          <TabsContent value="permissions">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Website Permissions</h2> {/* Adjusted size */}
              <Card>
                <CardContent className="pt-4 space-y-3">
                  {permissionStatuses.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between p-3 rounded-lg border border-gray-200 bg-gray-50" // Adjusted padding/items-start
                    >
                      <div className="flex-1 pr-2"> {/* Added flex-1 and padding */}
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                        {/* --- New Link --- */}
                        <button
                          onClick={() => handlePermissionQuery(item.title)}
                          className="text-xs text-blue-600 hover:underline mt-1 focus:outline-none"
                        >
                          Why is this important?
                        </button>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full border self-center ${ // Use self-center
                          item.status === "granted"
                            ? "bg-green-100 text-green-600 border-green-400"
                            : item.status === "warning"
                              ? "bg-yellow-100 text-yellow-600 border-yellow-400"
                              : "bg-red-100 text-red-600 border-red-400"
                          }`}
                      >
                        {item.status === "granted"
                          ? "Granted"
                          : item.status === "warning"
                            ? "Limited"
                            : "Not granted"}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="assistant">
            <Card>
              <CardHeader>
                <CardTitle>AI Privacy Assistant</CardTitle>
                <CardDescription>
                  Ask questions about privacy and security or get help with the current website.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* --- Pass props to AIAssistant --- */}
                <AIAssistant
                  initialPrompt={initialAiPrompt}
                  onPromptConsumed={consumeInitialPrompt} // Pass the clearing function
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer (remains the same) */}
      <div className="bg-gray-50 p-3 border-t border-gray-200 text-center text-xs text-gray-500">
        SecWay • Protecting your privacy, one permission at a time
      </div>
    </div>
  );
}