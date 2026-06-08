# Turnstile Auto Solver v5 - Hybrid Approach

## What's New

This version combines:
- **Content Script** - monitors page for Turnstile
- **Main World Script** - mocks API in page context
- **Fetch Interception** - catches API calls

## Installation

1. Extract the ZIP
2. Go to `chrome://extensions/`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked**
5. Select this folder

## How It Works

The extension:
1. Injects mock Turnstile API before the real script loads
2. Auto-generates tokens on `render()` calls
3. Intercepts fetch requests to Turnstile API
4. Shows a "✓ Verified" message in the challenge area

## Debugging

Open DevTools (F12) and check:
- Console tab for `[Turnstile Solver]` messages
- Network tab to see if requests are being intercepted

## Notes

- The extension modifies window.turnstile globally
- All Turnstile widgets will be auto-solved
- No additional configuration needed
