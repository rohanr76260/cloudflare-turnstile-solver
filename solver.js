// CloudFlare Turnstile Auto Solver
(function() {
  'use strict';

  function solveTurnstile() {
    // Find iframe
    const iframe = document.querySelector('iframe[src*="challenges.cloudflare.com"]');
    if (!iframe) {
      console.log('No iframe found');
      return;
    }

    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      if (!iframeDoc) {
        console.log('Cannot access iframe');
        return;
      }

      // Find checkbox
      const checkbox = iframeDoc.querySelector('input[type="checkbox"]');
      if (checkbox) {
        checkbox.click();
        console.log('Checkbox clicked');
      }
    } catch (e) {
      console.log('Error:', e);
    }
  }

  // Start solving
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', solveTurnstile);
  } else {
    solveTurnstile();
  }

  // Retry after delay
  setTimeout(solveTurnstile, 2000);
  setTimeout(solveTurnstile, 5000);
})();
