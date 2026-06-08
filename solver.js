(function() {
  'use strict';
  console.log('[TSolver v9] Solver content script loaded');
  
  // Monitor for Cloudflare challenge frames
  const monitorChallenge = setInterval(() => {
    // Check for challenge containers
    const challengeFrame = document.querySelector('iframe[src*="challenges"]');
    const turnstileWidget = document.querySelector('[data-sitekey]');
    const challengeDiv = document.querySelector('div#challenge-form, div.challenge-container');
    
    if (challengeFrame) {
      console.log('[TSolver] Found challenge iframe');
    }
    
    if (turnstileWidget) {
      console.log('[TSolver] Found Turnstile widget');
      
      // Try to call render on it
      if (window.turnstile && typeof window.turnstile.render === 'function') {
        try {
          window.turnstile.render(turnstileWidget, {
            callback: function(token) {
              console.log('[TSolver] Widget rendered and solved');
              
              // Find and fill hidden inputs
              document.querySelectorAll('input[type="hidden"]').forEach(input => {
                if (input.name && (input.name.includes('cf') || input.name.includes('turnstile'))) {
                  input.value = token;
                  console.log('[TSolver] Filled input:', input.name);
                }
              });
            }
          });
        } catch (e) {
          console.error('[TSolver] Error rendering:', e);
        }
      }
    }
    
    if (challengeDiv) {
      console.log('[TSolver] Found challenge div');
    }
  }, 1000);
  
  // Stop monitoring after 10 seconds
  setTimeout(() => {
    clearInterval(monitorChallenge);
    console.log('[TSolver] Monitoring stopped');
  }, 10000);
  
  // Intercept fetch calls
  const originalFetch = window.fetch;
  window.fetch = function(resource, init) {
    const url = typeof resource === 'string' ? resource : resource?.url || '';
    
    if (url.includes('challenge') || url.includes('turnstile')) {
      console.log('[TSolver] Fetch intercepted:', url);
      
      // Return fake success response
      return Promise.resolve(new Response(
        JSON.stringify({ success: true, error_codes: [] }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      ));
    }
    
    return originalFetch.call(this, resource, init);
  };
  
  // Intercept XMLHttpRequest
  const originalXHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...args) {
    if (typeof url === 'string' && (url.includes('challenge') || url.includes('turnstile'))) {
      console.log('[TSolver] XHR intercepted:', url);
      this.__isChallengeRequest = true;
    }
    return originalXHROpen.call(this, method, url, ...args);
  };
  
  const originalXHRSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function(body) {
    if (this.__isChallengeRequest) {
      this.status = 200;
      this.responseText = JSON.stringify({ success: true, error_codes: [] });
      
      setTimeout(() => {
        this.dispatchEvent(new Event('load'));
        if (this.onload) this.onload();
      }, 100);
      
      return;
    }
    
    return originalXHRSend.call(this, body);
  };
  
  console.log('[TSolver v9] All interceptions active');
  
  // Log page status
  console.log('[TSolver] Page URL:', window.location.href);
  console.log('[TSolver] Page title:', document.title);
  console.log('[TSolver] Turnstile available:', !!window.turnstile);
})();
