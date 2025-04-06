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

export default function Options() {
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

  return (
    <div className="w-[400px] h-[600px] bg-white shadow-lg flex flex-col">
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

      {/* Tabs */}
      <Tabs defaultValue="permissions" className="mt-6 p-4 flex-1 overflow-y-auto">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Current Website Permissions</h2>
              <PermissionsList />
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Global Permission Rules</h2>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  {[
                    { title: "Block all location requests", desc: "Prevent websites from accessing your location" },
                    { title: "Block camera access", desc: "Prevent websites from accessing your camera" },
                    { title: "Block microphone access", desc: "Prevent websites from accessing your microphone" },
                    { title: "Limit cookie storage", desc: "Restrict cookies to session only" },
                    { title: "Block notification requests", desc: "Prevent websites from sending notifications" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                      <span className="text-sm font-medium text-red-500">Not granted</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Permission Exceptions</h2>
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    {[
                      { site: "maps.google.com", note: "Location access allowed" },
                      { site: "meet.google.com", note: "Camera and microphone allowed" },
                      { site: "github.com", note: "Notifications allowed" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{item.site}</h3>
                          <p className="text-sm text-gray-500">{item.note}</p>
                        </div>
                        <Button variant="outline" size="sm">Remove</Button>
                      </div>
                    ))}

                    <div className="pt-2">
                      <Button variant="outline" className="w-full">Add Exception</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
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
            <div className="space-y-6">
              {/* General Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Configure how ClearLock operates in your browser</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Auto-scan websites</h3>
                      <p className="text-sm text-gray-500">Automatically scan websites when you visit them</p>
                    </div>
                    <Switch 
                      checked={settings.autoScan} 
                      onCheckedChange={(checked) => setSettings({ ...settings, autoScan: checked })}
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Scan interval</h3>
                    <p className="text-sm text-gray-500">How often should ClearLock scan websites you've already visited?</p>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={settings.scanInterval}
                      onChange={(e) => setSettings({ ...settings, scanInterval: e.target.value })}
                    >
                      <option value="always">Every visit</option>
                      <option value="daily">Once a day</option>
                      <option value="weekly">Once a week</option>
                      <option value="never">Never rescan</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Control how ClearLock protects your privacy</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">AI-powered suggestions</h3>
                      <p className="text-sm text-gray-500">Allow ClearLock to suggest privacy improvements</p>
                    </div>
                    <Switch 
                      checked={settings.aiSuggestions} 
                      onCheckedChange={(checked) => setSettings({ ...settings, aiSuggestions: checked })}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <h3 className="font-medium">Privacy protection level</h3>
                      <span className="text-sm font-medium">{settings.privacyLevel}%</span>
                    </div>
                    <Slider 
                      value={[settings.privacyLevel]} 
                      min={0} 
                      max={100} 
                      step={10}
                      onValueChange={(value) => setSettings({ ...settings, privacyLevel: value[0] })}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Basic</span>
                      <span>Balanced</span>
                      <span>Strict</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Control how and when ClearLock notifies you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Enable notifications</h3>
                      <p className="text-sm text-gray-500">Receive alerts about privacy concerns</p>
                    </div>
                    <Switch 
                      checked={settings.notifications} 
                      onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Notification types</h3>
                    <div className="space-y-2">
                      {[
                        { id: "high-risk", label: "High-risk alerts" },
                        { id: "medium-risk", label: "Medium-risk warnings" },
                        { id: "tips", label: "Educational tips" }
                      ].map(({ id, label }) => (
                        <div key={id} className="flex items-center space-x-2">
                          <input type="checkbox" id={id} defaultChecked />
                          <label htmlFor={id} className="text-sm">{label}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About */}
              <Card>
                <CardHeader>
                  <CardTitle>About ClearLock</CardTitle>
                  <CardDescription>Information about your privacy assistant</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium">Version</h3>
                    <p className="text-sm text-gray-500">1.0.0</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Created by</h3>
                    <p className="text-sm text-gray-500">DiamondHacks Team</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Privacy Policy</h3>
                    <a href="#" className="text-sm text-emerald-600 hover:underline">View Privacy Policy</a>
                  </div>
                  <div>
                    <h3 className="font-medium">Feedback</h3>
                    <a href="#" className="text-sm text-emerald-600 hover:underline">Send Feedback</a>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 flex justify-end">
              <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
