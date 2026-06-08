// Main world script - runs in page's JavaScript context
(function() {
  'use strict';
  
  console.log('[Turnstile Solver] Main world script initialized');

  // Pre-define turnstile object before Cloudflare script loads
  const mockTurnstile = {
    render: function(container, options) {
      console.log('[Turnstile Solver] render() called', options);
      const widgetId = 'mock-widget-' + Date.now();
      const token = 'mock_token_' + Math.random().toString(36).substring(2, 15);
      
      // Show solved UI
      if (container) {
        if (typeof container === 'string') {
          container = document.getElementById(container);
        }
        if (container) {
          container.innerHTML = '<div style="border: 2px solid #4CAF50; padding: 10px; border-radius: 4px; background: #f1f8f6; text-align: center;"><strong style="color: #4CAF50;">✓ Verified</strong></div>';
        }
      }
      
      // Execute callback
      if (options && typeof options.callback === 'function') {
        setTimeout(() => {
          console.log('[Turnstile Solver] Executing callback with token:', token);
          options.callback(token);
        }, 100);
      }
      
      // Store widget ID
      if (!window._turnstileWidgets) window._turnstileWidgets = {};
      window._turnstileWidgets[widgetId] = token;
      
      return widgetId;
    },
    reset: function(widgetId) {
      console.log('[Turnstile Solver] reset called:', widgetId);
    },
    remove: function(widgetId) {
      console.log('[Turnstile Solver] remove called:', widgetId);
    },
    isExpired: function(widgetId) {
      console.log('[Turnstile Solver] isExpired called:', widgetId);
      return false;
    },
    getResponse: function(widgetId) {
      console.log('[Turnstile Solver] getResponse called:', widgetId);
      if (window._turnstileWidgets && window._turnstileWidgets[widgetId]) {
        return window._turnstileWidgets[widgetId];
      }
      return 'mock_token_' + Math.random().toString(36).substring(2, 15);
    },
    implicitCaptchaCallback: function() {
      console.log('[Turnstile Solver] implicitCaptchaCallback called');
    }
  };
  
  // Assign to window
  window.turnstile = mockTurnstile;
  console.log('[Turnstile Solver] Turnstile API injected successfully');

  // Also try to capture any CF object
  window.cf = window.cf || {};
  
  // Intercept any fetch to Turnstile API
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const url = args[0];
    if (typeof url === 'string' && url.includes('challenges')) {
      console.log('[Turnstile Solver] Intercepted fetch to:', url);
      return Promise.resolve(new Response(JSON.stringify({success: true}), {status: 200}));
    }
    return originalFetch.apply(this, args);
  };
  
  console.log('[Turnstile Solver] Fetch interceptor installed');
})();
