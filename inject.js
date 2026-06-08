(function() {
  'use strict';

  // Inject script into page context
  const script = document.createElement('script');
  script.textContent = `
    (function() {
      // Mock Turnstile API
      window.turnstile = window.turnstile || {};
      
      // Override render function
      const originalRender = window.turnstile.render;
      window.turnstile.render = function(element, options) {
        console.log('[Solver] Turnstile render called', options);
        
        // Create mock token
        const mockToken = 'auto_solved_token_' + Math.random().toString(36).substr(2, 9);
        
        // Call the callback immediately with mock token
        if (options && options.callback) {
          setTimeout(() => {
            options.callback(mockToken);
            console.log('[Solver] Token generated:', mockToken);
          }, 500);
        }
        
        // Create a visible checkbox to satisfy the page
        if (element) {
          element.innerHTML = '<div style="padding:10px; background:#f0f0f0; border-radius:5px; text-align:center; cursor:pointer;">✓ Solved</div>';
          element.style.cursor = 'pointer';
        }
        
        return mockToken;
      };
      
      // Override reset function
      window.turnstile.reset = function(widgetId) {
        console.log('[Solver] Reset called for widget:', widgetId);
      };
      
      // Override remove function
      window.turnstile.remove = function(widgetId) {
        console.log('[Solver] Remove called for widget:', widgetId);
      };
      
      // Override isExpired function
      window.turnstile.isExpired = function(widgetId) {
        console.log('[Solver] isExpired called for widget:', widgetId);
        return false;
      };
      
      // Override getResponse function
      window.turnstile.getResponse = function(widgetId) {
        console.log('[Solver] getResponse called for widget:', widgetId);
        return 'auto_solved_token_' + Math.random().toString(36).substr(2, 9);
      };
      
      console.log('[Solver] Turnstile API mocked successfully');
    })();
  `;
  
  if (document.documentElement) {
    document.documentElement.appendChild(script);
    script.remove();
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      document.documentElement.appendChild(script);
      script.remove();
    });
  }
})();
