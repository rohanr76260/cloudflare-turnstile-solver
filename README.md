# Cloudflare Turnstile Auto Solver

## Features
- ✅ Automatically mocks Turnstile API
- ✅ Auto-generates valid tokens
- ✅ Works on all pages with Turnstile
- ✅ No configuration needed

## Installation

1. Download and extract the ZIP
2. Open `chrome://extensions/`
3. Enable **Developer mode** (top-right)
4. Click **Load unpacked**
5. Select this folder

## How It Works

The extension injects a script that:
1. Mocks the Turnstile API before it loads
2. Auto-generates tokens on render
3. Returns tokens immediately

## Troubleshooting

If it doesn't work:
1. Open DevTools (F12)
2. Check Console for `[Solver]` messages
3. Refresh the page
4. Make sure the extension is enabled

## Disclaimer

Use responsibly and only on your own websites.
