"use client"

import { useState } from "react"
import { Switch } from "../components/ui/switch"
import { Mic, Camera, MapPin, Bell, Database, Eye } from "lucide-react"
import React from "react"

export const PermissionsList = () => {
  const [permissions, setPermissions] = useState([
    { id: 1, name: "Microphone", icon: Mic, enabled: false, risk: "medium" },
    { id: 2, name: "Camera", icon: Camera, enabled: false, risk: "medium" },
    { id: 3, name: "Location", icon: MapPin, enabled: true, risk: "high" },
    { id: 4, name: "Notifications", icon: Bell, enabled: true, risk: "low" },

  ])

  const togglePermission = (id: number) => {
    setPermissions(
      permissions.map((permission) =>
        permission.id === id ? { ...permission, enabled: !permission.enabled } : permission,
      ),
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-500 mb-2">
        Manage what this website can access. Toggle off permissions you don't need.
      </div>

      <div className="space-y-3">
        {permissions.map((permission) => (
          <div key={permission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div
                className={`p-2 rounded-full mr-3 ${
                  permission.risk === "high"
                    ? "bg-red-100"
                    : permission.risk === "medium"
                      ? "bg-amber-100"
                      : "bg-green-100"
                }`}
              >
                <permission.icon
                  className={`h-4 w-4 ${
                    permission.risk === "high"
                      ? "text-red-600"
                      : permission.risk === "medium"
                        ? "text-amber-600"
                        : "text-green-600"
                  }`}
                />
              </div>
              <div>
                <div className="font-medium text-sm">{permission.name}</div>
                <div className="text-xs text-gray-500">
                  {permission.risk === "high" ? "High risk" : permission.risk === "medium" ? "Medium risk" : "Low risk"}
                </div>
              </div>
            </div>
            <Switch checked={permission.enabled} onCheckedChange={() => togglePermission(permission.id)} />
          </div>
        ))}
      </div>
    </div>
  )
}

