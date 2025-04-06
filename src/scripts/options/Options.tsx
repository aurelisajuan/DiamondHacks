import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Switch } from "../../components/ui/switch"
import { Button } from "../../components/ui/button"
import { Slider } from "../../components/ui/slider"
import { Lock, Shield, Bell, Settings, Save } from "lucide-react"
import React from "react"

const Options = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    autoScan: true,
    aiSuggestions: true,
    privacyLevel: 80,
    scanInterval: "always",
  })

  const handleSave = () => {
    // In a real extension, save to chrome.storage
    alert("Settings saved!")
  }

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-emerald-600 p-3 rounded-full">
          <Lock className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">SecWay Settings</h1>
          <p className="text-gray-500">Configure your privacy protection preferences</p>
        </div>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="general">
            <Settings className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Shield className="mr-2 h-4 w-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure how SecWay operates in your browser</CardDescription>
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
                <p className="text-sm text-gray-500">
                  How often should SecWay scan websites you've already visited?
                </p>
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
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control how SecWay protects your privacy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">AI-powered suggestions</h3>
                  <p className="text-sm text-gray-500">Allow SecWay to suggest privacy improvements</p>
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
                  onValueChange={(value: any[]) => setSettings({ ...settings, privacyLevel: value[0] })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Basic</span>
                  <span>Balanced</span>
                  <span>Strict</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Control how and when SecWay notifies you</CardDescription>
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
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="high-risk" defaultChecked />
                    <label htmlFor="high-risk" className="text-sm">
                      High-risk alerts
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="medium-risk" defaultChecked />
                    <label htmlFor="medium-risk" className="text-sm">
                      Medium-risk warnings
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="tips" defaultChecked />
                    <label htmlFor="tips" className="text-sm">
                      Educational tips
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex justify-end">
        <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}

export default Options

