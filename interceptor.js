// Content script to intercept Turnstile script loading
(function() {
  'use strict';
  console.log('[Turnstile Solver v7] Interceptor running...');
  
  // Intercept script tags
  const originalAppendChild = Element.prototype.appendChild;
  Element.prototype.appendChild = function(child) {
    if (child.tagName === 'SCRIPT') {
      const src = child.src || '';
      if (src.includes('challenges.cloudflare.com') || src.includes('turnstile') || src.includes('/cdn/')) {
        console.log('[TSolver] Blocked Turnstile script:', src);
        // Don't append the real script, create a dummy one instead
        const dummyScript = document.createElement('script');
        dummyScript.type = 'text/javascript';
        return this.appendChild(dummyScript);
      }
    }
    return originalAppendChild.call(this, child);
  };
  
  const originalInsertBefore = Element.prototype.insertBefore;
  Element.prototype.insertBefore = function(newNode, referenceNode) {
    if (newNode.tagName === 'SCRIPT') {
      const src = newNode.src || '';
      if (src.includes('challenges.cloudflare.com') || src.includes('turnstile') || src.includes('/cdn/')) {
        console.log('[TSolver] Blocked Turnstile script (insertBefore):', src);
        const dummyScript = document.createElement('script');
        dummyScript.type = 'text/javascript';
        return originalInsertBefore.call(this, dummyScript, referenceNode);
      }
    }
    return originalInsertBefore.call(this, newNode, referenceNode);
  };
  
  // Also intercept fetch/XHR for Turnstile API
  const originalFetch = window.fetch;
  if (originalFetch) {
    window.fetch = function(resource, init) {
      const url = typeof resource === 'string' ? resource : resource?.url || '';
      if (url.includes('challenge') || url.includes('turnstile')) {
        console.log('[TSolver] Blocked fetch to:', url);
        return Promise.resolve(new Response(
          JSON.stringify({ success: true, error_codes: [] }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        ));
      }
      return originalFetch.call(this, resource, init);
    };
  }
  
  // Intercept XMLHttpRequest
  const originalXhrOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    if (typeof url === 'string' && (url.includes('challenge') || url.includes('turnstile'))) {
      console.log('[TSolver] Blocked XHR to:', url);
      this.__tsolver_blocked = true;
    }
    return originalXhrOpen.call(this, method, url, ...rest);
  };
  
  const originalXhrSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function(data) {
    if (this.__tsolver_blocked) {
      this.status = 200;
      this.responseText = JSON.stringify({ success: true, error_codes: [] });
      setTimeout(() => {
        const evt = new Event('load');
        this.dispatchEvent(evt);
        if (this.onload) this.onload(evt);
      }, 50);
      return;
    }
    return originalXhrSend.call(this, data);
  };
  
  console.log('[TSolver] All interceptions installed');
})();
