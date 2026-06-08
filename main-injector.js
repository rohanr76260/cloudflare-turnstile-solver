// Main world injector - runs before page scripts
(function() {
  'use strict';
  console.log('[TSolver v9] Main injector starting...');
  
  // Pre-define turnstile with auto-solving capability
  window.turnstile = {
    render: function(container, options) {
      console.log('[TSolver] render() called with:', options);
      
      const widgetId = 'widget_' + Math.random().toString(36).substr(2, 10);
      const fakeToken = 'cf_clearance_' + Math.random().toString(36).substr(2, 50);
      
      // Find and update container
      let elem = container;
      if (typeof container === 'string') {
        elem = document.getElementById(container);
      }
      
      if (elem) {
        // Show verified state
        elem.innerHTML = '<div style="padding:10px;background:#4CAF50;color:white;border-radius:4px;text-align:center;font-weight:bold;">✓ Verified</div>';
        elem.setAttribute('data-sitekey', '');
      }
      
      // Execute callback with token
      if (options && typeof options.callback === 'function') {
        setTimeout(() => {
          console.log('[TSolver] Executing callback');
          options.callback(fakeToken);
        }, 100);
      }
      
      // Also try to submit any forms that might be waiting
      setTimeout(() => {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
          const hiddenInputs = form.querySelectorAll('input[type="hidden"][name*="cf"], input[type="hidden"][name*="turnstile"]');
          hiddenInputs.forEach(input => {
            if (!input.value) {
              input.value = fakeToken;
              console.log('[TSolver] Set hidden field:', input.name);
            }
          });
        });
        
        // Try to submit form if there's a submit button
        const submitBtn = document.querySelector('button[type="submit"], input[type="submit"]');
        if (submitBtn) {
          console.log('[TSolver] Found submit button, clicking...');
          // Don't auto-click, just prepare
        }
      }, 200);
      
      return widgetId;
    },
    
    reset: function(widgetId) {
      console.log('[TSolver] reset():', widgetId);
      return widgetId;
    },
    
    remove: function(widgetId) {
      console.log('[TSolver] remove():', widgetId);
      return widgetId;
    },
    
    isExpired: function(widgetId) {
      console.log('[TSolver] isExpired():', widgetId);
      return false;
    },
    
    getResponse: function(widgetId) {
      console.log('[TSolver] getResponse():', widgetId);
      return 'cf_clearance_' + Math.random().toString(36).substr(2, 50);
    },
    
    ready: function(callback) {
      console.log('[TSolver] ready() called');
      if (typeof callback === 'function') {
        callback();
      }
      return true;
    },
    
    implicitCaptchaCallback: function() {
      console.log('[TSolver] implicitCaptchaCallback()');
      return true;
    }
  };
  
  console.log('[TSolver v9] Turnstile API injected');
  
  // Also set cf_challenge if needed
  if (!window.cf) window.cf = {};
  if (!window.cf.challenge) window.cf.challenge = { render: window.turnstile.render };
})();
