"use client"

import React, { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Switch } from "../../components/ui/switch"
import { Button } from "../../components/ui/button"
import { Slider } from "../../components/ui/slider"
import { AIAssistant } from "../../components/ai-assistant"
import { SiteInfo } from "../../components/site-info"
import { PermissionsList } from "../../components/permissions-list"
import { Lock, Bell, Settings, Save } from "lucide-react"

// Declare chrome variable for environments where it might not be defined (e.g., testing)
declare const chrome: any

export function Options() {
  const [settings, setSettings] = useState({
    notifications: true,
    autoScan: true,
    aiSuggestions: true,
    privacyLevel: 80,
    scanInterval: 'always',
  });

  const [currentTab, setCurrentTab] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          setCurrentTab(tabs[0].url || null);
        }
      });
    }
  }, []);

  const handleSave = () => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ settings }, () => {
        alert('Settings saved!');
      });
    } else {
      alert('Settings saved!');
    }
    setShowSettings(false);
  };

  const permissionStatuses = [
    {
      title: "Camera",
      desc: "Access to your camera",
      status: "granted", // change as needed
    },
    {
      title: "Location",
      desc: "Access to your location",
      status: "warning", // or "denied"
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

  const getColorClass = (status: string) => {
    switch (status) {
      case "granted":
        return "bg-green-100 text-green-600 border-green-400";
      case "warning":
        return "bg-yellow-100 text-yellow-600 border-yellow-400";
      case "denied":
        return "bg-red-100 text-red-600 border-red-400";
      default:
        return "bg-gray-100 text-gray-500 border-gray-300";
    }
  };

  return (
    <div className="w-[400px] h-[800px] bg-white shadow-lg flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="h-6 w-6" />
          <h1 className="text-xl font-bold">SecWay</h1>
        </div>
        <button onClick={() => setShowSettings(true)} className="hover:opacity-80">
          <Settings className="h-6 w-6" />
        </button>
      </div>

      <SiteInfo />

      {/* Main Content Tabs */}
      <Tabs defaultValue="permissions" className="mt-6 p-4 flex-1">
        <TabsList className="grid w-full grid-cols-2 mb-8">
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
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Website Permission Status</h2>
            <Card>
              <CardContent className="pt-6 space-y-4">
                {permissionStatuses.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>AI Privacy Assistant</CardTitle>
                <CardDescription>
                  Ask questions about privacy and security or get help with the current website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AIAssistant />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md p-6 rounded-lg overflow-y-auto max-h-[90%]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Settings</h2>
              <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-gray-700">&times;</button>
            </div>

            {/* All cards as before... (keep your settings cards here) */}

            <div className="mt-8 flex justify-end">
              <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-gray-50 p-3 border-t border-gray-200 text-center text-xs text-gray-500">
        SecWay • Protecting your privacy, one permission at a time
      </div>
    </div>
  );
}
