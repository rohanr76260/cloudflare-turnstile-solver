// Inject mock Turnstile API
(function() {
  'use strict';
  console.log('[TSolver v8] Injector running');
  
  const mockScript = `
    (function() {
      window.turnstile = {
        render: function(e, o) {
          console.log('[TSolver] render');
          const id = 'cf_' + Date.now();
          const token = 'mock_' + Math.random().toString(36).substr(2, 50);
          
          if (e) {
            if (typeof e === 'string') e = document.getElementById(e);
            if (e) e.innerHTML = '<div style="border:2px solid #4CAF50;padding:10px;border-radius:4px;background:#e8f5e9;text-align:center;cursor:pointer;"><input type=checkbox checked disabled style="margin-right:8px;"><strong style="color:#4CAF50;font-weight:bold;">Solved</strong></div>';
          }
          
          if (o && typeof o.callback === 'function') {
            setTimeout(() => o.callback(token), 100);
          }
          
          window.__cf_tokens = window.__cf_tokens || {};
          window.__cf_tokens[id] = token;
          return id;
        },
        reset: (id) => id,
        remove: (id) => id,
        isExpired: () => false,
        getResponse: function(id) {
          if (window.__cf_tokens && window.__cf_tokens[id]) return window.__cf_tokens[id];
          return 'mock_' + Math.random().toString(36).substr(2, 50);
        },
        ready: (cb) => typeof cb === 'function' && cb(),
        implicitCaptchaCallback: () => true
      };
      console.log('[TSolver] API ready');
    })();
  `;
  
  const script = document.createElement('script');
  script.textContent = mockScript;
  if (document.documentElement) {
    document.documentElement.insertBefore(script, document.documentElement.firstChild);
  }
})();
