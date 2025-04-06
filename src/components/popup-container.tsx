import { useState } from "react"
import { ScanResults } from "./scan-results"
import { AIAssistant } from "./ai-assistant"
import { SiteInfo } from "./site-info"
import { Button } from "@/components/ui/button"
import { Shield, ShieldCheck, Lock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PermissionsList } from "./permissions-list"
import { EducationalTip } from "./educational-tip"
import React from "react"

export const PopupContainer = () => {
  const [isScanning, setIsScanning] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)
  const [riskLevel, setRiskLevel] = useState<"low" | "medium" | "high">("medium")

  const handleScan = () => {
    setIsScanning(true)
    // Simulate scan process
    setTimeout(() => {
      setIsScanning(false)
      setScanComplete(true)
      // Random risk level for demo purposes
      setRiskLevel(["low", "medium", "high"][Math.floor(Math.random() * 3)] as "low" | "medium" | "high")
    }, 2000)
  }

  const handleSecureMe = () => {
    // Simulate securing process
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      setRiskLevel("low")
    }, 1500)
  }

  return (
    <div className="w-[400px] h-[600px] bg-white rounded-lg shadow-lg flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="h-6 w-6" />
            <h1 className="text-xl font-bold">ClearLock</h1>
          </div>
          <span className="text-xs opacity-80">Your AI Ally for Privacy</span>
        </div>
      </div>

      {/* Current Site Info */}
      <SiteInfo />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {!scanComplete ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-gray-800">Welcome to ClearLock</h2>
              <p className="text-gray-600 text-sm">
                Scan this website to check for privacy concerns and potential scams
              </p>
            </div>
            <Button
              size="lg"
              onClick={handleScan}
              disabled={isScanning}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isScanning ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Scanning...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Scan This Website
                </>
              )}
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="results">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
            </TabsList>

            <TabsContent value="results" className="pt-4">
              <ScanResults riskLevel={riskLevel} />
              <div className="mt-4">
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  onClick={handleSecureMe}
                  disabled={isScanning || riskLevel === "low"}
                >
                  {isScanning ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Securing...
                    </>
                  ) : riskLevel === "low" ? (
                    <>
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Already Secured
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Secure Me
                    </>
                  )}
                </Button>
              </div>
              <EducationalTip />
            </TabsContent>

            <TabsContent value="permissions" className="pt-4">
              <PermissionsList />
            </TabsContent>

            <TabsContent value="assistant" className="pt-4">
              <AIAssistant />
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 p-3 border-t border-gray-200 text-center text-xs text-gray-500">
        ClearLock • Protecting your privacy, one permission at a time
      </div>
    </div>
  )
}

