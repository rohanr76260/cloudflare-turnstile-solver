// Auto-solve Turnstile
setTimeout(() => {
  const btn = document.querySelector('[data-sitekey]');
  if (btn) {
    btn.click();
    console.log('Clicked!');
  }
}, 1000);
