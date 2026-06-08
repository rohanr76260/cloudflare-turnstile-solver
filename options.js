// Load saved settings
document.addEventListener('DOMContentLoaded', () => {
  const apiKey = localStorage.getItem('anticaptcha_api_key') || '';
  if (apiKey) {
    document.getElementById('apiKey').value = apiKey.substring(0, 5) + '...';
  }
});

function saveSettings() {
  const apiKey = document.getElementById('apiKey').value.trim();
  
  if (!apiKey) {
    showStatus('Please enter your API key', 'error');
    return;
  }
  
  if (apiKey.length < 10) {
    showStatus('API key seems too short', 'error');
    return;
  }
  
  chrome.runtime.sendMessage(
    { type: 'SET_API_KEY', apiKey: apiKey },
    (response) => {
      if (response.success) {
        showStatus('✓ API key saved successfully!', 'success');
      }
    }
  );
}

function testSettings() {
  const apiKey = document.getElementById('apiKey').value.trim();
  
  if (!apiKey) {
    showStatus('Please enter your API key first', 'error');
    return;
  }
  
  showStatus('Testing connection...', 'success');
  
  fetch('https://api.anti-captcha.com/getBalance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientKey: apiKey })
  })
  .then(res => res.json())
  .then(data => {
    if (data.errorId) {
      showStatus('❌ API Error: ' + data.errorDescription, 'error');
    } else if (data.balance !== undefined) {
      showStatus('✓ Connected! Balance: $' + data.balance.toFixed(2), 'success');
    } else {
      showStatus('Unknown response', 'error');
    }
  })
  .catch(err => {
    showStatus('❌ Connection failed: ' + err.message, 'error');
  });
}

function showStatus(message, type) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = 'status ' + type;
}
