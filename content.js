(function() {
  'use strict';

  // Intercept fetch to auto-solve
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    // Log all fetch requests
    console.log('Fetch:', args[0]);
    return originalFetch.apply(this, args).then(response => {
      return response.clone().json().then(data => {
        // Auto-complete verification
        if (data.challenge_ts || data.hostname) {
          console.log('Turnstile solved!');
        }
        return Response.json(data);
      }).catch(() => response);
    });
  };

  // Find and click checkbox
  function autoSolve() {
    // Method 1: Direct click
    const checkbox = document.querySelector('input[type="checkbox"]');
    if (checkbox && !checkbox.checked) {
      checkbox.click();
      console.log('Checkbox clicked');
      return;
    }

    // Method 2: Find label and click
    const label = document.querySelector('label');
    if (label) {
      label.click();
      console.log('Label clicked');
      return;
    }

    // Method 3: Find any clickable element with Turnstile
    const turnstile = document.querySelector('[data-sitekey]');
    if (turnstile) {
      turnstile.click();
      console.log('Turnstile clicked');
    }
  }

  // Try multiple times
  autoSolve();
  setTimeout(autoSolve, 500);
  setTimeout(autoSolve, 1000);
  setTimeout(autoSolve, 2000);
  setTimeout(autoSolve, 3000);

  // Watch for DOM changes
  const observer = new MutationObserver(() => {
    autoSolve();
  });

  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true
  });
})();
