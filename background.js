// Background service worker - handles network interception
console.log('[TSolver v8] Background service worker loaded');

// Listen for web requests
chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    const url = details.url;
    
    if (url.includes('challenges.cloudflare.com') || url.includes('/cf_challenge') || url.includes('turnstile')) {
      console.log('[TSolver] Request intercepted:', url);
      
      // Block Turnstile script requests
      if (url.endsWith('.js')) {
        console.log('[TSolver] Blocking Turnstile JS script');
        return { cancel: true };
      }
    }
    
    return { requestHeaders: details.requestHeaders };
  },
  { urls: ["*://*/*"] },
  ["blocking", "requestHeaders"]
);

// Intercept responses
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    const url = details.url;
    
    if ((url.includes('challenges.cloudflare.com') || url.includes('turnstile')) && !url.endsWith('.js')) {
      console.log('[TSolver] Blocking Turnstile API request:', url);
      return { 
        redirectUrl: 'data:application/json,{"success":true,"challenge_ts":' + Date.now() + ',"hostname":"' + new URL(url).hostname + '"}'
      };
    }
    
    return {};
  },
  { urls: ["*://*/*"] },
  ["blocking"]
);

console.log('[TSolver v8] Network interception active');
