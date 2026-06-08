// Main world script - runs FIRST in page context before any other scripts
(function() {
  'use strict';
  
  console.log('[Turnstile Solver v6] Main world script initializing...');

  // Create a Proxy to intercept all property assignments to window
  const originalDefineProperty = Object.defineProperty;
  Object.defineProperty = function(obj, prop, descriptor) {
    if (obj === window && prop === 'turnstile') {
      console.log('[Turnstile Solver v6] Intercepted turnstile assignment');
      // Don't actually define it, keep our mock
      return true;
    }
    return originalDefineProperty.call(this, obj, prop, descriptor);
  };

  // Create permanent mock that can't be overwritten
  const mockTurnstile = {
    render: function(container, options) {
      console.log('[Turnstile Solver v6] render() called', options);
      const widgetId = 'cf_' + Math.random().toString(36).substring(2, 15);
      const token = 'fake_token_' + Math.random().toString(36).substring(2, 30);
      
      // Show solved UI
      if (container) {
        if (typeof container === 'string') {
          container = document.getElementById(container);
        }
        if (container) {
          container.innerHTML = '<div style="border: 2px solid #4CAF50; padding: 12px; border-radius: 4px; background: #f1f8f6; text-align: center; font-family: Arial; cursor: pointer;"><input type="checkbox" checked disabled style="margin-right: 8px;"><strong style="color: #4CAF50;">Verified by Auto Solver</strong></div>';
          container.style.cursor = 'pointer';
        }
      }
      
      // Execute callback immediately
      if (options && typeof options.callback === 'function') {
        try {
          options.callback(token);
          console.log('[Turnstile Solver v6] Callback executed with token:', token.substring(0, 20) + '...');
        } catch (e) {
          console.error('[Turnstile Solver v6] Callback error:', e);
        }
      }
      
      // Store token for later retrieval
      if (!window.__cf_turnstile_tokens) window.__cf_turnstile_tokens = {};
      window.__cf_turnstile_tokens[widgetId] = token;
      
      return widgetId;
    },
    reset: function(widgetId) {
      console.log('[Turnstile Solver v6] reset called for:', widgetId);
      return widgetId;
    },
    remove: function(widgetId) {
      console.log('[Turnstile Solver v6] remove called for:', widgetId);
      return widgetId;
    },
    isExpired: function(widgetId) {
      console.log('[Turnstile Solver v6] isExpired called for:', widgetId);
      return false;
    },
    getResponse: function(widgetId) {
      console.log('[Turnstile Solver v6] getResponse called for:', widgetId);
      if (window.__cf_turnstile_tokens && window.__cf_turnstile_tokens[widgetId]) {
        return window.__cf_turnstile_tokens[widgetId];
      }
      return 'fake_token_' + Math.random().toString(36).substring(2, 30);
    },
    implicitCaptchaCallback: function() {
      console.log('[Turnstile Solver v6] implicitCaptchaCallback called');
      return true;
    },
    ready: function(callback) {
      console.log('[Turnstile Solver v6] ready called');
      if (typeof callback === 'function') callback();
      return true;
    }
  };
  
  // Make it non-configurable and non-writable
  Object.defineProperty(window, 'turnstile', {
    value: mockTurnstile,
    writable: false,
    configurable: false,
    enumerable: true
  });
  
  console.log('[Turnstile Solver v6] Permanent turnstile mock installed (non-writable)');
  
  // Also mock the cf object
  if (!window.cf) {
    Object.defineProperty(window, 'cf', {
      value: { challenge: {} },
      writable: true,
      configurable: true
    });
  }
  
  // Intercept fetch calls
  const originalFetch = window.fetch;
  window.fetch = function(resource, init) {
    const url = typeof resource === 'string' ? resource : resource.url;
    
    if (url && (url.includes('challenge') || url.includes('turnstile'))) {
      console.log('[Turnstile Solver v6] Intercepted request to:', url);
      return Promise.resolve(new Response(
        JSON.stringify({ success: true, challenge_ts: Date.now(), hostname: window.location.hostname }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      ));
    }
    
    return originalFetch.call(this, resource, init);
  };
  
  // Intercept XMLHttpRequest
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    if (typeof url === 'string' && (url.includes('challenge') || url.includes('turnstile'))) {
      console.log('[Turnstile Solver v6] Intercepted XHR to:', url);
      this.__intercepted = true;
    }
    return originalOpen.call(this, method, url, ...rest);
  };
  
  const originalSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function(data) {
    if (this.__intercepted) {
      this.responseText = JSON.stringify({ success: true });
      this.status = 200;
      setTimeout(() => {
        this.onload && this.onload();
      }, 100);
      return;
    }
    return originalSend.call(this, data);
  };
  
  console.log('[Turnstile Solver v6] Fetch and XHR interception installed');
})();
