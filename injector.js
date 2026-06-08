// Inject mock Turnstile script into the page BEFORE anything else loads
(function() {
  'use strict';
  console.log('[Turnstile Solver v7] Injector running...');
  
  // Create inline mock script that runs immediately
  const mockScript = `
    window.turnstile = {
      render: function(container, options) {
        console.log('[TSolver] render() called');
        const widgetId = 'cf_' + Date.now();
        const token = 'mock_' + Math.random().toString(36).substr(2, 50);
        
        if (container) {
          if (typeof container === 'string') container = document.getElementById(container);
          if (container) {
            container.innerHTML = '<div style="border:2px solid #4CAF50;padding:10px;border-radius:4px;background:#f1f8f6;text-align:center;"><input type=checkbox checked disabled style="margin-right:8px;"><strong style="color:#4CAF50;">Verified</strong></div>';
          }
        }
        
        if (options && typeof options.callback === 'function') {
          setTimeout(() => options.callback(token), 50);
        }
        
        window.__tsolver_tokens = window.__tsolver_tokens || {};
        window.__tsolver_tokens[widgetId] = token;
        return widgetId;
      },
      reset: function(id) { console.log('[TSolver] reset'); return id; },
      remove: function(id) { console.log('[TSolver] remove'); return id; },
      isExpired: function(id) { console.log('[TSolver] isExpired'); return false; },
      getResponse: function(id) { 
        console.log('[TSolver] getResponse');
        if (window.__tsolver_tokens && window.__tsolver_tokens[id]) return window.__tsolver_tokens[id];
        return 'mock_' + Math.random().toString(36).substr(2, 50);
      },
      ready: function(cb) { typeof cb === 'function' && cb(); return true; },
      implicitCaptchaCallback: function() { return true; }
    };
    console.log('[TSolver] Mock installed');
  `;
  
  // Create and inject script
  const script = document.createElement('script');
  script.textContent = mockScript;
  script.type = 'text/javascript';
  
  if (document.documentElement) {
    document.documentElement.insertBefore(script, document.documentElement.firstChild);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      document.documentElement.insertBefore(script, document.documentElement.firstChild);
    });
  }
  
  // Also set it on window immediately if possible
  try {
    eval(mockScript);
  } catch (e) {
    console.log('[TSolver] Eval error (expected):', e.message);
  }
})();
