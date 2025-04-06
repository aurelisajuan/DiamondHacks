// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
    console.log("ClearLock extension installed")

    // Set default settings
    chrome.storage.local.set({
        settings: {
            notifications: true,
            autoScan: true,
            aiSuggestions: true,
            privacyLevel: 80,
            scanInterval: "always",
        },
        })
    })

    // Open options page when extension icon is clicked
    chrome.action.onClicked.addListener(() => {
        chrome.runtime.openOptionsPage()
    })
    
    // Listen for tab updates to analyze new websites
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (changeInfo.status === "complete" && tab.url) {
        // Check if we should auto-scan
        chrome.storage.local.get(["settings"], (result) => {
            const settings = result.settings || {}
    
            if (settings.autoScan) {
            console.log(`Analyzing website: ${tab.url}`)
    
            // In a real extension, you would perform analysis here
            // For demo, we'll simulate a random risk level
            const riskLevels = ["low", "medium", "high"]
            const randomRisk = riskLevels[Math.floor(Math.random() * riskLevels.length)]
    
            // Only show notifications for medium and high risks
            if (randomRisk !== "low" && settings.notifications) {
                // Send a notification to the content script
                chrome.tabs.sendMessage(tabId, {
                action: "showNotification",
                riskLevel: randomRisk,
                title: randomRisk === "high" ? "High Risk Detected!" : "Privacy Warning",
                message:
                    randomRisk === "high"
                    ? "This website shows signs of a potential scam. Be careful with your personal information."
                    : "This website is requesting unnecessary permissions. Click to review.",
                })
            }
            }
        })
        }
    })
    
    // Listen for messages from the content scripts
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "scanWebsite") {
        // In a real extension, you would perform the scan here
        console.log("Scanning website for privacy concerns")
    
        // Simulate a scan result
        setTimeout(() => {
            sendResponse({
            success: true,
            riskLevel: Math.random() > 0.5 ? "high" : "medium",
            issues: ["Excessive permissions", "Tracking cookies"],
            })
        }, 1000)
    
        // Return true to indicate that the response will be sent asynchronously
        return true
        }
    
        if (message.action === "openOptions") {
        chrome.runtime.openOptionsPage()
        }
    
        if (message.action === "pageAnalysisComplete") {
        console.log("Page analysis complete:", message)
        // Store the analysis results
        chrome.storage.local.set({
            [`site_${message.url}`]: {
            title: message.title,
            permissions: message.permissions,
            lastScanned: new Date().toISOString(),
            },
        })
        }
    })