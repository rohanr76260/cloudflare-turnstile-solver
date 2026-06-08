// Content script - runs in isolated world
(function() {
  'use strict';
  console.log('[Turnstile Solver] Content script loaded');

  // Listen for messages and auto-solve
  window.addEventListener('message', function(event) {
    if (event.source !== window) return;
    if (event.data && event.data.type === 'TURNSTILE_CHECK') {
      console.log('[Turnstile Solver] Turnstile challenge detected');
    }
  });

  // Periodically check for Turnstile challenges
  const checkInterval = setInterval(function() {
    const turnstileContainer = document.querySelector('[data-sitekey]');
    if (turnstileContainer) {
      console.log('[Turnstile Solver] Found Turnstile container');
      clearInterval(checkInterval);
    }
  }, 500);

  // Clean up after 30 seconds
  setTimeout(() => clearInterval(checkInterval), 30000);
})();
