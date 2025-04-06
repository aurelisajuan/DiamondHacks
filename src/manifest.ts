import type { ManifestV3Export } from "@crxjs/vite-plugin"

// Define the manifest object
const manifest: ManifestV3Export = {
  manifest_version: 3,
  name: "SecWay",
  version: "1.0.0",
  description: "Your AI Ally for Privacy You Understand",
  action: {
    // Instead of opening a popup, we'll open the options page
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
}

// Export the writeManifest function that the build system is looking for
export function writeManifest() {
  return manifest
}

// Also export the manifest as default for compatibility
export default manifest

