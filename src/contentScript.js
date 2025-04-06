// Create a script element
const injectedScript = document.createElement('script');
injectedScript.textContent = '(' + function() {
  const permissionsToCheck = ['camera', 'microphone', 'location', 'notifications', 'sound', 'pop-ups and redirects'];
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

// Inject the script into the page
(document.head || document.documentElement).appendChild(injectedScript);
injectedScript.remove();

// Listen for the results in your content script
window.addEventListener('message', event => {
    // Check that the message is from the same window
    if (event.source !== window) return;
  
    const message = event.data;
    if (message && message.type === 'PERMISSIONS_RESULT') {
      console.log('Permissions result:', message.permissions);
      // Optionally send this data to your background script or process it further
      chrome.runtime.sendMessage({ permissions: message.permissions });
    }
  });