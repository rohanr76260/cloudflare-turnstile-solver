// Content script - intercepts DOM manipulation
(function() {
  'use strict';
  console.log('[TSolver v8] Content script loaded');
  
  // Intercept script loading
  const origAppendChild = Element.prototype.appendChild;
  Element.prototype.appendChild = function(el) {
    if (el.tagName === 'SCRIPT' && (el.src.includes('challenges.cloudflare.com') || el.src.includes('turnstile'))) {
      console.log('[TSolver] Blocked script:', el.src);
      return el;
    }
    return origAppendChild.call(this, el);
  };
  
  // Intercept fetch
  const origFetch = window.fetch;
  window.fetch = function(url, init) {
    if (typeof url === 'string' && (url.includes('challenges') || url.includes('turnstile'))) {
      console.log('[TSolver] Blocked fetch:', url);
      return Promise.resolve(new Response(
        JSON.stringify({ success: true, error_codes: [] }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      ));
    }
    return origFetch.call(this, url, init);
  };
})();
