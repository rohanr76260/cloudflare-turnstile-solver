// Content script for additional monitoring
(function() {
  'use strict';
  console.log('[Turnstile Solver v6] Content script loaded');
  
  // Monitor for form submissions and auto-fill any hidden Turnstile tokens
  document.addEventListener('submit', function(e) {
    console.log('[Turnstile Solver v6] Form submitted, checking for Turnstile fields...');
    
    const form = e.target;
    const hiddenInputs = form.querySelectorAll('input[type="hidden"]');
    
    hiddenInputs.forEach(input => {
      if (input.name && (input.name.includes('turnstile') || input.name.includes('cf_clearance'))) {
        if (!input.value) {
          input.value = 'fake_token_' + Math.random().toString(36).substring(2, 30);
          console.log('[Turnstile Solver v6] Auto-filled hidden field:', input.name);
        }
      }
    });
  }, true);
  
  // Also watch for dynamically added Turnstile containers
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) { // Element node
            if (node.getAttribute && (node.getAttribute('data-sitekey') || node.classList.contains('cf-turnstile'))) {
              console.log('[Turnstile Solver v6] Detected new Turnstile widget');
              
              // Try to trigger render if turnstile is available
              if (window.turnstile && typeof window.turnstile.render === 'function') {
                setTimeout(() => {
                  window.turnstile.render(node, {
                    callback: function(token) {
                      console.log('[Turnstile Solver v6] Dynamic widget solved');
                    }
                  });
                }, 100);
              }
            }
          }
        });
      }
    });
  });
  
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
  
  console.log('[Turnstile Solver v6] Mutation observer started');
})();
