# Turnstile Auto Solver v8 - Network Level Interception

## How It Works

This version intercepts at the **network level** using:
1. **Declarative Net Request** - blocks Turnstile scripts
2. **WebRequest API** - intercepts and modifies API responses
3. **Content Script** - handles DOM manipulation
4. **Main World Injection** - provides mock API

## Features

✅ Blocks Cloudflare scripts at network level
✅ Redirects API calls to mock responses
✅ Auto-generates tokens
✅ Works on server-side challenges
✅ No page reloads needed

## Installation

1. Extract ZIP
2. Open `chrome://extensions/`
3. Enable **Developer mode**
4. Click **Load unpacked**
5. Select folder
6. Refresh the page

## How to Use

1. Go to a page with Cloudflare Turnstile challenge
2. The extension will:
   - Block the real Turnstile script
   - Inject a mock API
   - Auto-solve any widgets
3. Check console (F12) for `[TSolver]` messages

## Troubleshooting

If challenge still appears:
- Hard refresh (Ctrl+Shift+R)
- Check that `rules.json` is present
- Verify extension is enabled
- Open DevTools and look for `[TSolver]` logs

## Note

This extension works best on pages where JavaScript can bypass the challenge. Some server-side challenges may still require additional action.
