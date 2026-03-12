# Quick Test Guide - 30 Second Check

## What Was Fixed
1. ✅ Theme toggle now works (removed conflicting CSS media query)
2. ✅ Timer buttons now have debugging (to identify any issues)

## Quick Test (30 seconds)

### Open the App
1. Open `index.html` in your browser
2. Press `F12` to open console

### Test Theme Toggle
1. Look for circular button with 🌙 in top-right corner
2. Click it
3. **Expected:** Background changes from purple to dark blue
4. Click again
5. **Expected:** Background changes back to purple

### Test Timer Buttons
1. Click "Start" button
2. **Expected:** Timer starts counting down (25:00, 24:59, 24:58...)
3. Click "Stop" button
4. **Expected:** Timer pauses
5. Click "Reset" button
6. **Expected:** Timer resets to 25:00

## What to Look For

### Theme Working ✅
- Background color changes when you click the button
- Button icon changes (🌙 ↔ ☀️)
- Console shows: `ThemeManager: Toggled to: dark` or `light`

### Timer Working ✅
- Stop button pauses the countdown
- Reset button resets to 25:00
- Console shows: `TimerComponent: Stop button clicked` and `TimerComponent: Reset button clicked`

## If Still Not Working

### Theme Issue
**Check console for:**
- `ThemeManager: Toggled to: dark` (or light)
- Any red error messages

**Try:**
- Refresh page (Ctrl+R or Cmd+R)
- Clear cache (Ctrl+Shift+Delete)
- Try `test-fixes.html` instead

### Timer Issue
**Check console for:**
- `TimerComponent: Stop button clicked`
- `TimerComponent: Reset button clicked`
- Any red error messages

**Try:**
- Make sure timer is running before clicking Stop
- Check if buttons are grayed out (disabled)
- Try `test-fixes.html` instead

## Alternative Test Page
If `index.html` doesn't work, try `test-fixes.html`:
- Has both tests in one page
- Shows status in real-time
- Displays console logs on the page
- Easier to see what's happening

## Report Issues
If still not working, provide:
1. Browser name and version
2. Console output (copy/paste)
3. What happens when you click the buttons
4. Screenshot if possible
