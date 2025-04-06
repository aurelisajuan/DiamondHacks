function injectScript() {
    console.log("Injecting script to check permissions...");
    const injectedScript = document.createElement('script');
    injectedScript.textContent = '(' + function() {
      const permissionsToCheck = ['camera', 'microphone', 'geolocation', 'notifications'];
      const results = {};
      let completedChecks = 0;
  
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
            if (completedChecks === permissionsToCheck.length) {
              window.postMessage({
                type: 'PERMISSIONS_RESULT',
                permissions: results
              }, '*');
            }
          });
      });
    } + ')();';
  
    // Ensure that we have a valid target element
    const target = document.head || document.documentElement;
    console.log("Injecting script into target:", target);
    if (target) {
      target.appendChild(injectedScript);
      injectedScript.remove();
    } else {
      console.error("No valid target for script injection.");
    }
  }

  console.log("Content script loaded. Checking document ready state...");
  
  // Check if the document is still loading
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectScript);
  } else {
    injectScript();
  }
  
  // Listen for the permissions result in your content script
  window.addEventListener('message', event => {
    if (event.source !== window) return;
    const message = event.data;
    if (message && message.type === 'PERMISSIONS_RESULT') {
      console.log('Permissions result:', message.permissions);
    }
  });
  