document.getElementById('reviewPermissionsBtn').addEventListener('click', () => {
    // Trigger the scan process
    scanCurrentWebsitePermissions();
  });

  function getCurrentSite() {
    return window.location.hostname;
  }
  
  function getLastUsed(site) {
    return localStorage.getItem(`lastUsed_${site}`);
  }
  
  function updateLastUsed(site) {
    localStorage.setItem(`lastUsed_${site}`, Date.now());
  }

  function checkPermissions() {
    const permissionsToCheck = ['camera', 'microphone', 'geolocation', 'notifications'];
    const results = {};
    let completedChecks = 0;

    return new Promise((resolve) => {
        permissionsToCheck.forEach(permissionName => {
            navigator.permissions.query({ name: permissionName })
            .then(permissionStatus => {
                results[permissionName] = permissionStatus.state;
            })
            .catch(() => {
                results[permissionName] = 'unsupported';
            })
            .finally(() => {
                completedChecks++;
                if (completedChecks === permissionsToCheck.length){
                    resolve(results);
                }
            });
        });
    });
  }

  async function scanCurrentWebsitePermissions() {
    const site = getCurrentSite();
    const lastUsed = getLastUsed(site);
    const now = Date.now();
    // Define "a while" as, e.g., 30 days (in milliseconds)
    const threshold = 30 * 24 * 60 * 60 * 1000;
  
    const permissions = await checkPermissions();
  
    // Update the last-used timestamp regardless (or only if the user takes action)
    updateLastUsed(site);
  
    // Build a message based on permissions that are on
    let educationalMessage = '';
    for (const [permission, state] of Object.entries(permissions)) {
      if (state === 'granted') {
        // Only remind if it has been a while since the site was used
        if (!lastUsed || (now - lastUsed > threshold)) {
          educationalMessage += `<p>Your <strong>${permission}</strong> permission is enabled on ${site}. For your privacy and security, we recommend reviewing permissions for sites you haven't visited in a while. This permission allows the site to access your ${permission} when needed. Consider disabling it if you no longer use this site regularly.</p>`;
        }
      }
    }
  
    if (!educationalMessage) {
      educationalMessage = `<p>No reminders needed. All permissions are either disabled or the site has been used recently.</p>`;
    }
  
    // Display the message in the UI
    document.getElementById('message').innerHTML = educationalMessage;
  }
  