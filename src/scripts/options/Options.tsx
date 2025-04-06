"use client";

import React, { useState, useEffect } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../../components/ui/tabs";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "../../components/ui/card";
import { AIAssistant } from "../../components/ai-assistant";
import { SiteInfo } from "../../components/site-info";
import { Lock, Bell, Settings } from "lucide-react";

// Declare chrome variable for environments where it might not be defined
declare const chrome: any;

export function Options() {
    const [permissions, setPermissions] = useState<Record<string, string>>({});

    console.log(permissions);

    useEffect(() => {
        console.log("Options: Checking chrome.storage for permissions");

        // Get permissions from chrome.storage
        chrome.storage.local.get(["secway_permissions"], (result) => {
            console.log(
                "Options: Retrieved from chrome.storage:",
                result.secway_permissions
            );

            if (result.secway_permissions) {
                console.log(
                    "Options: Parsed permissions:",
                    result.secway_permissions
                );
                setPermissions(result.secway_permissions);
            } else {
                console.log("Options: No permissions found in chrome.storage");
            }
        });

        // Set up an interval to check for permission updates
        const interval = setInterval(() => {
            chrome.storage.local.get(["secway_permissions"], (result) => {
                if (result.secway_permissions) {
                    console.log(
                        "Options: Updated permissions found:",
                        result.secway_permissions
                    );
                    setPermissions(result.secway_permissions);
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const permissionStatuses = [
        {
            title: "Camera",
            desc: "Access to your camera",
            status: permissions["camera"] || "unknown",
        },
        {
            title: "Geolocation",
            desc: "Access to your location",
            status: permissions["geolocation"] || "unknown",
        },
        {
            title: "Notifications",
            desc: "Permission to send alerts",
            status: permissions["notifications"] || "unknown",
        },
        {
            title: "Microphone",
            desc: "Access to your microphone",
            status: permissions["microphone"] || "unknown",
        },
    ];

    return (
        <div className="w-[400px] h-[600px] bg-white flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 text-white bg-gradient-to-r from-orange-500 to-orange-600">
                <div className="flex items-center gap-2">
                    <Lock className="w-6 h-6" />
                    <h1 className="text-xl font-bold">SecWay</h1>
                </div>
                {/* Settings icon as a placeholder */}
                <button className="hover:opacity-80">
                    <Settings className="w-6 h-6" />
                </button>
            </div>

            {/* Site Information */}
            <SiteInfo />

            {/* Main Content Area */}
            <div className="flex-1 p-4">
                <Tabs defaultValue="permissions">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="permissions">
                            <Lock className="w-4 h-4 mr-2" />
                            Permissions
                        </TabsTrigger>
                        <TabsTrigger value="assistant">
                            <Bell className="w-4 h-4 mr-2" />
                            AI Assistant
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="permissions">
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">
                                Website Permission Status
                            </h2>
                            <Card>
                                <CardContent className="pt-4 space-y-3">
                                    {permissionStatuses.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between p-2 border border-gray-200 rounded-lg bg-gray-50"
                                        >
                                            <div>
                                                <h3 className="font-medium">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {item.desc}
                                                </p>
                                            </div>
                                            <span
                                                className={`text-xs font-semibold px-2 py-1 rounded-full border ${
                                                    item.status === "granted"
                                                        ? "bg-green-100 text-green-600 border-green-400"
                                                        : item.status ===
                                                                "warning" ||
                                                            item.status ===
                                                                "prompt"
                                                          ? "bg-yellow-100 text-yellow-600 border-yellow-400"
                                                          : "bg-red-100 text-red-600 border-red-400"
                                                }`}
                                            >
                                                {item.status === "granted"
                                                    ? "Granted"
                                                    : item.status === "warning"
                                                      ? "Limited"
                                                      : item.status === "prompt"
                                                        ? "Prompt"
                                                        : item.status}
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
                                    Ask questions about privacy and security or
                                    get help with the current website.
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
            <div className="p-3 text-xs text-center text-gray-500 border-t border-gray-200 bg-gray-50">
                SecWay • Protecting your privacy, one permission at a time
            </div>
        </div>
    );
}
