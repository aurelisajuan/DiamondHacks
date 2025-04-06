"use client"

import React, { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { AIAssistant } from "../../components/ai-assistant"
import { SiteInfo } from "../../components/site-info"
import { Lock, Bell, Settings } from "lucide-react"

// Declare chrome variable for environments where it might not be defined
declare const chrome: any

export function Options() {
  const [currentTab, setCurrentTab] = useState<string | null>(null);

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          setCurrentTab(tabs[0].url || null);
        }
      });
    }
  }, []);

  const permissionStatuses = [
    {
      title: "Camera",
      desc: "Access to your camera",
      status: "granted",
    },
    {
      title: "Location",
      desc: "Access to your location",
      status: "warning",
    },
    {
      title: "Notifications",
      desc: "Permission to send alerts",
      status: "denied",
    },
    {
      title: "Microphone",
      desc: "Access to your microphone",
      status: "granted",
    },
  ];

  return (
    <div className="w-[400px] h-[600px] bg-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="h-6 w-6" />
          <h1 className="text-xl font-bold">SecWay</h1>
        </div>
        {/* Settings icon as a placeholder */}
        <button className="hover:opacity-80">
          <Settings className="h-6 w-6" />
        </button>
      </div>

      {/* Site Information */}
      <SiteInfo />

      {/* Main Content Area */}
      <div className="flex-1 p-4">
        <Tabs defaultValue="permissions">
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
              <h2 className="text-xl font-semibold">Website Permission Status</h2>
              <Card>
                <CardContent className="pt-4 space-y-3">
                  {permissionStatuses.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg border border-gray-200 bg-gray-50"
                    >
                      <div>
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full border ${
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
                <AIAssistant />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 p-3 border-t border-gray-200 text-center text-xs text-gray-500">
        SecWay • Protecting your privacy, one permission at a time
      </div>
    </div>
  );
}
