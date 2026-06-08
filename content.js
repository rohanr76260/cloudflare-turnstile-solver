(function() {
  'use strict';
  console.log('[TSolver v10] Content script loaded');
  
  // Monitor for Turnstile widgets
  const monitorTurnstile = setInterval(() => {
    const widgets = document.querySelectorAll('[data-sitekey]');
    
    widgets.forEach(widget => {
      if (!widget.__turnstile_solver_processed) {
        widget.__turnstile_solver_processed = true;
        
        const sitekey = widget.getAttribute('data-sitekey');
        console.log('[TSolver] Found Turnstile widget with sitekey:', sitekey);
        
        // Request solving from background
        chrome.runtime.sendMessage(
          {
            type: 'SOLVE_TURNSTILE',
            sitekey: sitekey,
            pageUrl: window.location.href,
            tabId: chrome.runtime.id
          },
          (response) => {
            if (response.success) {
              console.log('[TSolver] Received token from Anti-Captcha');
              
              // Execute the callback with the token
              if (window.turnstile && typeof window.turnstile.callback === 'function') {
                window.turnstile.callback(response.token);
              }
              
              // Also try to find and execute any registered callbacks
              if (window.__turnstile_callbacks) {
                window.__turnstile_callbacks.forEach(cb => {
                  try {
                    cb(response.token);
                  } catch (e) {
                    console.error('[TSolver] Callback error:', e);
                  }
                });
              }
              
              // Fill hidden inputs
              document.querySelectorAll('input[type="hidden"]').forEach(input => {
                if (input.name && (input.name.includes('cf') || input.name.includes('turnstile'))) {
                  input.value = response.token;
                  console.log('[TSolver] Filled hidden input:', input.name);
                }
              });
            } else {
              console.error('[TSolver] Failed to solve:', response.error);
            }
          }
        );
      }
    });
  }, 1000);
  
  // Stop monitoring after 5 minutes
  setTimeout(() => {
    clearInterval(monitorTurnstile);
    console.log('[TSolver] Monitoring stopped');
  }, 300000);
})();
