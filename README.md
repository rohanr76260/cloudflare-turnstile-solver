# CloudFlare Turnstile Solver

A Chrome extension that automatically solves CloudFlare Turnstile challenges.

## Features
- Automatically detects Turnstile widget
- Simulates realistic mouse clicks
- Works across all frames on the page

## Installation

### Manual Installation (Developer Mode)
1. Download/clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (top-right toggle)
4. Click "Load unpacked"
5. Select the extension folder

### From ZIP File
1. Extract the ZIP file
2. Follow the Manual Installation steps above

## Files
- `manifest.json` - Extension configuration
- `script.js` - Main automation logic
- `background.js` - Background script
- `README.md` - This file

## Bug Fixes (v2.0.2)
- ✅ Fixed Shadow DOM queries to target correct widget element
- ✅ Increased detection frequency from 1s to 500ms intervals
- ✅ Improved widget selection logic
- ✅ Removed dangerous global attachShadow override

## Security Notes
- This extension respects Shadow DOM encapsulation
- Uses only public APIs provided by the browser
- Does not break security boundaries

## Author
Akmal Abar

## License
MIT
