(function() {
  'use strict';
  console.log('[TSolver v10] Main world injector');
  
  // Track render calls
  const renderCallbacks = [];
  
  window.turnstile = {
    render: function(container, options) {
      console.log('[TSolver] render() called');
      
      const widgetId = 'cf_' + Math.random().toString(36).substr(2, 10);
      
      // Store callback for later use
      if (options && typeof options.callback === 'function') {
        renderCallbacks.push(options.callback);
        window.__turnstile_callbacks = renderCallbacks;
      }
      
      // Show loading state
      if (container) {
        if (typeof container === 'string') {
          container = document.getElementById(container);
        }
        if (container) {
          container.innerHTML = '<div style="padding:10px;background:#2196F3;color:white;border-radius:4px;text-align:center;">Solving with Anti-Captcha...</div>';
        }
      }
      
      return widgetId;
    },
    
    reset: function(id) {
      console.log('[TSolver] reset():', id);
      return id;
    },
    
    remove: function(id) {
      console.log('[TSolver] remove():', id);
      return id;
    },
    
    isExpired: function(id) {
      return false;
    },
    
    getResponse: function(id) {
      return 'auto-solved-token';
    },
    
    ready: function(callback) {
      if (typeof callback === 'function') {
        callback();
      }
      return true;
    }
  };
  
  console.log('[TSolver v10] Turnstile API ready');
})();
