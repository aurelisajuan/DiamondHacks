console.log("ClearLock content script loaded")

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
  chrome.runtime.sendMessage({
    action: "pageAnalysisComplete",
    url: window.location.href,
    title: document.title,
    permissions: permissionsRequested,
  })
}

// Run the analysis when the page is fully loaded
window.addEventListener("load", analyzePage)

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getPageInfo") {
    sendResponse({
      url: window.location.href,
      title: document.title,
    })
  }
  return true
})

