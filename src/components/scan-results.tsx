import React from "react"
import { AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Progress } from "../components/ui/progress"

interface ScanResultsProps {
  riskLevel: "low" | "medium" | "high"
}

export const ScanResults = ({ riskLevel }: ScanResultsProps) => {
  const getRiskData = () => {
    switch (riskLevel) {
      case "low":
        return {
          icon: <ShieldCheck className="h-8 w-8 text-green-500" />,
          title: "Low Risk",
          description: "This website appears to be safe",
          color: "bg-green-500",
          percentage: 15,
          issues: [{ name: "Cookies", status: "Acceptable", severity: "low" }],
        }
      case "medium":
        return {
          icon: <AlertTriangle className="h-8 w-8 text-amber-500" />,
          title: "Medium Risk",
          description: "Some privacy concerns detected",
          color: "bg-amber-500",
          percentage: 55,
          issues: [
            { name: "Location Access", status: "Requested", severity: "medium" },
            { name: "Excessive Trackers", status: "Detected", severity: "medium" },
            { name: "Cookies", status: "Excessive", severity: "low" },
          ],
        }
      case "high":
        return {
          icon: <ShieldAlert className="h-8 w-8 text-red-500" />,
          title: "High Risk",
          description: "Potential scam or privacy threat",
          color: "bg-red-500",
          percentage: 85,
          issues: [
            { name: "Phishing Indicators", status: "Detected", severity: "high" },
            { name: "Suspicious Domain", status: "Detected", severity: "high" },
            { name: "Excessive Permissions", status: "Requested", severity: "medium" },
            { name: "Data Collection", status: "Excessive", severity: "medium" },
          ],
        }
    }
  }

  const data = getRiskData()

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {data.icon}
              <div>
                <CardTitle>{data.title}</CardTitle>
                <CardDescription>{data.description}</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span>Risk Level</span>
              <span>{data.percentage}%</span>
            </div>
            <Progress value={data.percentage} className={`h-2 ${data.color}`} />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Detected Issues</h3>
        {data.issues.map((issue, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
            <div className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  issue.severity === "high"
                    ? "bg-red-500"
                    : issue.severity === "medium"
                      ? "bg-amber-500"
                      : "bg-green-500"
                }`}
              ></div>
              <span className="text-sm">{issue.name}</span>
            </div>
            <Badge severity={issue.severity}>{issue.status}</Badge>
          </div>
        ))}
      </div>
    </div>
  )
}

const Badge = ({ children, severity }: { children: React.ReactNode; severity: string }) => {
  const bgColor =
    severity === "high"
      ? "bg-red-100 text-red-800"
      : severity === "medium"
        ? "bg-amber-100 text-amber-800"
        : "bg-green-100 text-green-800"

  return <span className={`text-xs px-2 py-1 rounded-full ${bgColor}`}>{children}</span>
}

