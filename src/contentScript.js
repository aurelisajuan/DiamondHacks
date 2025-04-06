// Function to check permissions
async function checkPermissions() {
    console.log("Content script: Starting permission check");
    const permissionsToCheck = [
        "camera",
        "microphone",
        "geolocation",
        "notifications",
    ];
    const results = {};
    let completedChecks = 0;

    for (const permissionName of permissionsToCheck) {
        try {
            const permissionStatus = await navigator.permissions.query({
                name: permissionName,
            });
            results[permissionName] = permissionStatus.state;
            console.log(
                `${permissionName} permission status:`,
                permissionStatus.state
            );
        } catch (error) {
            results[permissionName] = "unsupported";
            console.log(`${permissionName} permission status: unsupported`);
        }
        completedChecks++;
    }

    if (completedChecks === permissionsToCheck.length) {
        console.log("Content script: All permissions results:", results);
        // Store the results in chrome.storage
        chrome.storage.local.set({ secway_permissions: results }, () => {
            console.log("Content script: Permissions stored in chrome.storage");
        });
    }
}

console.log("Content script: Script loaded");
// Execute the permission check
if (document.readyState === "loading") {
    console.log("Content script: Waiting for DOMContentLoaded");
    document.addEventListener("DOMContentLoaded", checkPermissions);
} else {
    console.log("Content script: DOM already loaded, checking permissions");
    checkPermissions();
}
