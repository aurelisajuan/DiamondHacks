import { useState, useEffect } from "react";
import { Badge } from "../components/ui/badge";
import { Lock } from "lucide-react";
import React from "react";

export const SiteInfo = () => {
  const [currentSite, setCurrentSite] = useState({
    url: "Loading...",
    title: "Loading Tab Info",
    isSecure: false,
  });

  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.tabs?.query) {
      (async () => {
        try {
          const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
          if (tabs[0]?.url) {
            const url = new URL(tabs[0].url);
            setCurrentSite({
              url: url.hostname,
              title: tabs[0].title || "Untitled Tab",
              isSecure: url.protocol === "https:",
            });
          }
        } catch (error) {
          console.error("Failed to query tabs:", error);
        }
      })();
    } else {
      console.warn("Chrome API not available. Running in a non-extension environment.");
    }
  }, []);

  return (
    <div className="bg-gray-50 p-3 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center mr-2">
            {currentSite.url.charAt(0).toUpperCase()}
          </div>
          <div className="truncate">
            <div className="font-medium text-sm truncate">{currentSite.title}</div>
            <div className="text-xs text-gray-500 flex items-center">
              {currentSite.isSecure ? <Lock className="h-3 w-3 text-orange-600 mr-1" /> : null}
              {currentSite.url}
            </div>
          </div>
        </div>
        <Badge variant={currentSite.isSecure ? "outline" : "destructive"} className="ml-2">
          {currentSite.isSecure ? "Secure" : "Not Secure"}
        </Badge>
      </div>
    </div>
  );
};
