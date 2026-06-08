# Turnstile Auto Solver v10 - Anti-Captcha Integration

## Setup

### 1. Get Anti-Captcha Account
1. Visit https://anti-captcha.com
2. Create free account (you get ~$10 free credits)
3. Copy your **API Key**

### 2. Install Extension
1. Extract ZIP
2. Go to `chrome://extensions/`
3. Enable **Developer mode**
4. Click **Load unpacked**
5. Select folder

### 3. Configure API Key
1. Open extension options (right-click extension → Options)
2. Paste your Anti-Captcha API key
3. Click Save

## How It Works

1. Extension detects Turnstile widget on page
2. Sends request to background script
3. Background script calls Anti-Captcha API
4. Anti-Captcha solves the challenge
5. Token is returned and used to bypass
6. Page auto-refreshes with verification

## Pricing

- **Free trial**: ~$10 credit
- **Regular**: $0.50 - $1.00 per captcha
- **Bulk**: Discounted rates available

## Debugging

Open DevTools (F12):
- Console tab shows `[TSolver]` messages
- Check if widget is detected
- Verify API key is set

## Troubleshooting

**"API key not set" error:**
- Set your API key in extension options

**"Failed to create task" error:**
- Check your API key is correct
- Check account has credits
- Check website is not blocked

**Widget not detected:**
- Refresh page
- Check page actually has Turnstile
- Open DevTools console

## Limitations

- Requires active Anti-Captcha account
- Costs money per solve
- Needs internet connection
- Some pages may still have additional verification
