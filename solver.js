// Cloudflare Turnstile Solver
(function() {
  function solveTurnstile() {
    try {
      // Find the Turnstile iframe
      const frames = document.querySelectorAll('iframe');
      
      for (let frame of frames) {
        try {
          // Try to access iframe content
          const doc = frame.contentDocument || frame.contentWindow?.document;
          if (!doc) continue;
          
          // Find checkbox input
          const checkbox = doc.querySelector('input[type="checkbox"]');
          if (checkbox) {
            checkbox.checked = true;
            checkbox.click();
            
            // Trigger change event
            const event = new Event('change', { bubbles: true });
            checkbox.dispatchEvent(event);
            
            console.log('[Turnstile Solver] Checkbox solved');
            return true;
          }
        } catch (e) {
          // Cross-origin frames - continue
          continue;
        }
      }
      
      // Fallback: Try to find and click any Turnstile elements
      const turnstileWidget = document.querySelector('.cf-turnstile');
      if (turnstileWidget) {
        const button = turnstileWidget.querySelector('button') || 
                       turnstileWidget.querySelector('[role="button"]');
        if (button) {
          button.click();
          console.log('[Turnstile Solver] Button clicked');
          return true;
        }
      }
    } catch (error) {
      console.log('[Turnstile Solver] Error:', error.message);
    }
    return false;
  }
  
  // Solve on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', solveTurnstile);
  } else {
    solveTurnstile();
  }
  
  // Try again after delays
  setTimeout(solveTurnstile, 1000);
  setTimeout(solveTurnstile, 2000);
  setTimeout(solveTurnstile, 3000);
  
  // Monitor for new elements
  const observer = new MutationObserver(() => {
    solveTurnstile();
  });
  
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
