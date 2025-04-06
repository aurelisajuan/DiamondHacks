import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "../../styles/globals.css"

// Create a container for our React app
const container = document.createElement("div")
container.id = "SecWay-container"
document.body.appendChild(container)

// Render the React app
ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Analyze the current page
function analyzePage() {
  // In a real extension, you would analyze the DOM, scripts, etc.
  const permissionsRequested = []

  // Check for permission requests in the page
  if (document.querySelector('script[src*="maps"]')) {
    permissionsRequested.push("location")
  }

  if (document.querySelector("video") || document.querySelector("audio")) {
    permissionsRequested.push("media")
  }

  // Send the results back to the extension
  if (typeof chrome !== "undefined" && chrome.runtime) {
    chrome.runtime.sendMessage({
      action: "pageAnalysisComplete",
      url: window.location.href,
      title: document.title,
      permissions: permissionsRequested,
    })
  } else {
    console.warn("Chrome runtime is not available. This is expected outside of a Chrome extension environment.")
  }
}

// Run the analysis when the page is fully loaded
window.addEventListener("load", analyzePage)

