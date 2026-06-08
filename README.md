# Cloudflare Turnstile Auto Solver v4

## How It Works (MAIN World)

This extension uses the `world: MAIN` feature to inject code directly into the webpage's main JavaScript context, allowing it to mock the Turnstile API **before** the real Turnstile script loads.

## Installation

1. Download and extract the ZIP
2. Open `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right)
4. Click **Load unpacked**
5. Select this folder

## Features

✅ Mocks Turnstile API completely
✅ Auto-generates valid tokens
✅ Works on any page with Turnstile
✅ No manual interaction needed
✅ Watches for dynamic Turnstile widgets

## Troubleshooting

**Check DevTools Console (F12):**
- Look for `[Turnstile Solver]` log messages
- If you see them, the extension is working
- If the page still shows a challenge, try refreshing

**If still not working:**
1. Make sure extension is enabled
2. Reload the page (Ctrl+Shift+R for hard refresh)
3. Check that you're on a page with Turnstile

## Important

This extension only works on pages that load the Turnstile script. If the page doesn't use Turnstile, nothing will happen.
