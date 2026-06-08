(function() {
  'use strict';

  console.log('[Turnstile Solver] Initializing...');

  // Mock Turnstile API in the main world
  window.turnstile = {
    render: function(element, options) {
      console.log('[Turnstile Solver] render() called with options:', options);
      
      const widgetId = 'widget-' + Math.random().toString(36).substr(2, 9);
      const mockToken = 'mock_token_' + Math.random().toString(36).substr(2, 20);
      
      // Call callback immediately with mock token
      if (options && typeof options.callback === 'function') {
        setTimeout(() => {
          console.log('[Turnstile Solver] Executing callback with token:', mockToken);
          options.callback(mockToken);
        }, 100);
      }
      
      // Update element with solved status
      if (element) {
        element.innerHTML = '<div style="padding: 10px; background: #4CAF50; color: white; border-radius: 4px; text-align: center; font-weight: bold;">✓ Verified</div>';
        element.setAttribute('data-solved', 'true');
      }
      
      return widgetId;
    },

    reset: function(widgetId) {
      console.log('[Turnstile Solver] reset() called for widget:', widgetId);
    },

    remove: function(widgetId) {
      console.log('[Turnstile Solver] remove() called for widget:', widgetId);
    },

    isExpired: function(widgetId) {
      console.log('[Turnstile Solver] isExpired() called for widget:', widgetId);
      return false;
    },

    getResponse: function(widgetId) {
      console.log('[Turnstile Solver] getResponse() called for widget:', widgetId);
      return 'mock_token_' + Math.random().toString(36).substr(2, 20);
    }
  };

  console.log('[Turnstile Solver] API mocked successfully');

  // Also mock the cf_challenge if it exists
  if (window.cf_challenge) {
    console.log('[Turnstile Solver] cf_challenge already exists');
  }

  // Watch for dynamically added iframes or challenge elements
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) { // Element node
            // Check if it's a Turnstile iframe or container
            if (node.classList && node.classList.contains('cf-turnstile')) {
              console.log('[Turnstile Solver] Turnstile container found');
              // Trigger immediate solution
              if (window.turnstile && window.turnstile.render) {
                window.turnstile.render(node, { callback: function(token) {
                  console.log('[Turnstile Solver] Auto-solved new Turnstile widget');
                }});
              }
            }
          }
        });
      }
    });
  });

  // Start observing
  observer.observe(document.documentElement || document.body, {
    childList: true,
    subtree: true
  });

  console.log('[Turnstile Solver] Mutation observer started');
})();
