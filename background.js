// Background service worker for Anti-Captcha API calls
const ANTI_CAPTCHA_API = 'https://api.anti-captcha.com/createTask';

// You need to set your API key here or in extension options
let API_KEY = localStorage.getItem('anticaptcha_api_key') || '';

console.log('[TSolver v10] Background service worker loaded');

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'SOLVE_TURNSTILE') {
    console.log('[TSolver] Received solve request:', request);
    
    solveTurnstile(request.sitekey, request.pageUrl, request.tabId).then(token => {
      console.log('[TSolver] Got token:', token.substring(0, 20) + '...');
      sendResponse({ success: true, token: token });
    }).catch(error => {
      console.error('[TSolver] Error:', error);
      sendResponse({ success: false, error: error.message });
    });
    
    return true; // Keep channel open for async response
  }
  
  if (request.type === 'SET_API_KEY') {
    API_KEY = request.apiKey;
    localStorage.setItem('anticaptcha_api_key', API_KEY);
    sendResponse({ success: true });
  });
});

async function solveTurnstile(sitekey, pageUrl, tabId) {
  if (!API_KEY) {
    throw new Error('Anti-Captcha API key not set. Please set it in extension options.');
  }
  
  console.log('[TSolver] Solving Turnstile challenge...');
  console.log('[TSolver] Sitekey:', sitekey);
  console.log('[TSolver] Page URL:', pageUrl);
  
  // Step 1: Create task
  const createResponse = await fetch(ANTI_CAPTCHA_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clientKey: API_KEY,
      task: {
        type: 'TurnstileTaskProxyless',
        websiteURL: pageUrl,
        websiteKey: sitekey
      },
      softId: 0,
      languagePool: 'en'
    })
  });
  
  const createData = await createResponse.json();
  
  if (!createData.taskId) {
    throw new Error('Failed to create task: ' + (createData.errorDescription || 'Unknown error'));
  }
  
  console.log('[TSolver] Task created:', createData.taskId);
  
  // Step 2: Poll for result
  const taskId = createData.taskId;
  let attempts = 0;
  const maxAttempts = 60; // 2 minutes
  
  while (attempts < maxAttempts) {
    await sleep(2000); // Wait 2 seconds before polling
    
    const resultResponse = await fetch('https://api.anti-captcha.com/getTaskResult', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientKey: API_KEY,
        taskId: taskId
      })
    });
    
    const resultData = await resultResponse.json();
    
    if (resultData.solution && resultData.solution.cloudflareToken) {
      console.log('[TSolver] Solution found!');
      return resultData.solution.cloudflareToken;
    }
    
    if (resultData.errorId) {
      throw new Error('API error: ' + resultData.errorDescription);
    }
    
    if (resultData.isReady === false) {
      attempts++;
      console.log('[TSolver] Waiting... attempt', attempts, 'of', maxAttempts);
    }
  }
  
  throw new Error('Timeout waiting for solution');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
