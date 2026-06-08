# Cloudflare Turnstile Solver

A Chrome extension that automatically solves Cloudflare Turnstile challenges.

## Installation

1. Download the extension files
2. Open `chrome://extensions/`
3. Enable "Developer mode" (top-right)
4. Click "Load unpacked"
5. Select the extension folder

## How it works

The extension automatically detects Cloudflare Turnstile challenges and:
- Finds the challenge iframe
- Locates and clicks the verification checkbox
- Triggers necessary events for verification

## Troubleshooting

If it doesn't work:
1. Disable and re-enable the extension
2. Refresh the page
3. Check the Console (F12) for error messages

## License

MIT
