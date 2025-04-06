import { defineManifest } from "@crxjs/vite-plugin"

export default defineManifest({
  manifest_version: 3,
  name: "ClearLock",
  version: "1.0.0",
  description: "Your AI Ally for Privacy You Understand",
  action: {
    default_popup: "src/scripts/popup/popup.html",
    default_icon: {
      "16": "src/assets/icon16.png",
      "48": "src/assets/icon48.png",
      "128": "src/assets/icon128.png",
    },
  },
  options_page: "src/scripts/options/options.html",
  background: {
    service_worker: "src/scripts/service-worker/index.ts",
    type: "module",
  },
  permissions: ["activeTab", "storage", "scripting"],
  host_permissions: ["<all_urls>"],
  content_scripts: [
    {
      matches: ["<all_urls>"],
      js: ["src/scripts/content/index.tsx"],
    },
  ],
  icons: {
    "16": "src/assets/icon16.png",
    "48": "src/assets/icon48.png",
    "128": "src/assets/icon128.png",
  },
})
