# 🧪 Testing Guide for Pollen Monitor

## Quick Start Testing

You now have **3 testing tools** to help debug your API setup:

### 1. **api-test.html** (NEW - Most Comprehensive)
The best tool for identifying API issues:

```bash
# Open in your browser
http://localhost:8000/api-test.html
```

**What it does:**
- Tests 4 different API request formats
- Shows exactly which format works
- Provides detailed error messages
- Tests from simplest to most complex requests

**How to use:**
1. Run Test 1 first (minimal request)
2. If Test 1 passes, run Test 2, 3, 4
3. Find which test passes and which fails
4. This tells us exactly what's wrong!

---

### 2. **diagnostic.html** (Existing - Full System Check)
Comprehensive diagnostic tool:

```bash
http://localhost:8000/diagnostic.html
```

**What it does:**
- Checks API key configuration
- Tests geolocation
- Tests Air Quality API
- Tests Weather API
- Full integration test

---

### 3. **Main App** (index.html)
The actual application:

```bash
http://localhost:8000/index.html
```

---

## Common Issues and Solutions

### ❌ Issue: All tests fail with 403 error

**Cause:** Billing not enabled (most common)

**Solution:**
1. Go to: https://console.cloud.google.com/billing
2. Click "Link a billing account"
3. Add a payment method (you get $300 free credits)
4. Wait 2-3 minutes
5. Re-test

---

### ❌ Issue: Test 1 passes, but Test 3 fails with 400 error

**Cause:** Some `extraComputations` fields not available

**Solution:**
- The app now automatically falls back to simpler requests
- You should still get air quality data
- Some advanced features might not be available

---

### ❌ Issue: Tests work in api-test.html but not in main app

**Cause:** Browser cache or service worker issues

**Solution:**
1. Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
2. Clear cache: Ctrl+Shift+Delete
3. Try incognito mode
4. Unregister service worker:
   - Open DevTools (F12)
   - Go to Application > Service Workers
   - Click "Unregister"

---

### ❌ Issue: 403 error persists even with billing enabled

**Cause:** API key restrictions

**Solution:**
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your API key
3. Under "Application restrictions":
   - Select "HTTP referrers (web sites)"
   - Add: `http://localhost:*/*`
   - Add: `http://127.0.0.1:*/*`
   - If deploying: Add your domain
4. Under "API restrictions":
   - Select "Restrict key"
   - Check "Air Quality API"
5. Save and wait 2-3 minutes

---

## Step-by-Step Testing Process

### Step 1: Start Local Server

```bash
# Python 3
python -m http.server 8000

# OR Node.js
npx serve -p 8000
```

### Step 2: Run api-test.html

1. Open: http://localhost:8000/api-test.html
2. Run Test 1 (click "Run Test 1")
3. Look at the result:

**✅ If Test 1 passes:**
- Your API key works!
- Billing is enabled
- API is accessible
- Run Tests 2, 3, 4 to see which features work

**❌ If Test 1 fails:**
- Check the error code (403, 400, 429, etc.)
- Follow the solution for that error code
- Common: 403 = Enable billing

### Step 3: Check Main App

1. Open: http://localhost:8000/index.html
2. Allow location access
3. Wait for data to load
4. If it works: 🎉 Success!
5. If not: Check browser console (F12) for errors

---

## Understanding Test Results

### Test 1: Minimal Request
- **Purpose:** Check if API key works at all
- **If passes:** Billing enabled, API accessible
- **If fails:** Billing issue or API not enabled

### Test 2: Standard Request
- **Purpose:** Check basic functionality with language code
- **If passes:** Normal operation should work
- **If fails after Test 1 passed:** Language code issue

### Test 3: Full Request (app.js format)
- **Purpose:** Test all features the app uses
- **If passes:** Everything works perfectly!
- **If fails after Test 2 passed:** extraComputations issue

### Test 4: Simplified with LOCAL_AQI only
- **Purpose:** Test with minimal but useful data
- **If passes:** Good fallback option
- **If fails after Test 1 passed:** LOCAL_AQI not available in your region

---

## What The App Now Does Automatically

The improved `app.js` now includes:

1. **Automatic Fallback:** If full request fails with 400, tries minimal request
2. **Better Error Messages:** Shows exactly what's wrong and how to fix it
3. **Reduced extraComputations:** Only requests essential fields by default
4. **Detailed Logging:** Check console for debugging info

---

## Checking Browser Console

Always check the browser console for detailed errors:

1. Press F12 (or right-click > Inspect)
2. Go to "Console" tab
3. Look for red error messages
4. Look for network errors in "Network" tab

**Common console messages:**
- `Air Quality API error: 403` → Enable billing
- `Air Quality API error: 400` → Request format issue (but app now handles this)
- `Network error` → Internet/firewall issue
- `Retrying with minimal request...` → App is using fallback (normal)

---

## Verifying Your Google Cloud Setup

### ✅ Checklist:

1. **Billing Enabled?**
   - Go to: https://console.cloud.google.com/billing
   - Should show an active billing account

2. **Air Quality API Enabled?**
   - Go to: https://console.cloud.google.com/apis/library/airquality.googleapis.com
   - Should show "API Enabled" with green checkmark

3. **API Key Valid?**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Your key should be listed
   - Click it to check restrictions

4. **Correct Project?**
   - Check project name in top-left corner
   - Make sure API key is from THIS project
   - Make sure Air Quality API is enabled in THIS project

---

## Success Indicators

You'll know everything works when:

1. ✅ api-test.html shows "SUCCESS" for at least Test 1
2. ✅ Main app loads without errors
3. ✅ You see AQI numbers and pollen data
4. ✅ Weather data displays
5. ✅ No red errors in browser console

---

## Still Having Issues?

If you've:
- ✅ Enabled billing
- ✅ Enabled Air Quality API
- ✅ Verified API key
- ✅ Waited 2-3 minutes
- ✅ Ran api-test.html

**And it still doesn't work:**

1. **Screenshot the api-test.html results** (all 4 tests)
2. **Screenshot the browser console** (F12 > Console tab)
3. **Screenshot your Google Cloud Console** showing:
   - Billing status
   - API enabled status
   - API key restrictions

This will help identify the exact issue!

---

## Quick Reference Commands

```bash
# Start server (Python)
python -m http.server 8000

# Start server (Node.js)
npx serve -p 8000

# Access testing tools
http://localhost:8000/api-test.html       # New comprehensive test
http://localhost:8000/diagnostic.html     # Full system check
http://localhost:8000/index.html          # Main app
```

---

## Expected Free Tier Usage

With normal use:
- 1-2 requests per location check = ~10-50 requests/day
- Free tier: 1,500 requests/day
- You'll use ~1-3% of free tier
- Extremely unlikely to incur charges

---

Good luck! The app is now more robust and should work even if some advanced features aren't available in your region. 🚀
