// Function to check permissions
async function checkPermissions() {
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
        console.log("All permissions results:", results);
        // Send the results back to the extension
        chrome.runtime.sendMessage({
            type: "PERMISSIONS_RESULT",
            permissions: results,
        });
    }
}

// Execute the permission check
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", checkPermissions);
} else {
    checkPermissions();
}
