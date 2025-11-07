# 🔧 Troubleshooting Guide

## Your Issue: API 403 Error - "Forbidden"

I've detected that your Google Air Quality API is returning a **403 Forbidden** error. This is the most common issue when setting up the app.

---

## 🎯 THE FIX (99% chance this is your issue)

### The Air Quality API Requires Billing to be Enabled

Even though the API has a **FREE tier** (up to 1,500 requests/day at no cost), Google requires you to have a billing account set up.

### ✅ Enable Billing (5 minutes):

1. **Go to Google Cloud Console Billing:**
   - 👉 https://console.cloud.google.com/billing

2. **Link a Billing Account:**
   - Click "Link a billing account"
   - Enter your payment method (credit/debit card)
   - **Don't worry**: You get $300 free credits + the API has a generous free tier

3. **Set Up Budget Alerts (Recommended):**
   - Set a $5 budget alert
   - You'll be notified if you somehow exceed the free tier
   - Go to: https://console.cloud.google.com/billing/budgets

4. **Re-enable the Air Quality API:**
   - Go to: https://console.cloud.google.com/apis/library/airquality.googleapis.com
   - Click "Enable" (or "Manage" then "Disable" then "Enable" again)

5. **Test Again:**
   - Open: http://localhost:8000/diagnostic.html
   - Click "Test Air Quality API"
   - Should now work!

---

## 📊 Free Tier Information

**Google Air Quality API Free Tier:**
- ✅ 1,500 requests per day = **FREE**
- ✅ For personal use, you'll likely stay under this limit
- ✅ Each location update = 1 request
- ✅ Even if you check every hour, that's only 24 requests/day

**Cost if you exceed:**
- $5.00 per 1,000 requests after the free tier
- Highly unlikely for personal use

---

## 🧪 Use the Diagnostic Tool

I've created a diagnostic page to help you test:

### Open in your browser:
```
http://localhost:8000/diagnostic.html
```

### Tests it runs:
1. ✅ API Key Check
2. ✅ Geolocation Test
3. ✅ Air Quality API Test
4. ✅ Weather API Test
5. ✅ Full Integration Test

This will show you **exactly** what's failing with detailed error messages.

---

## 🔍 Other Possible Issues (Less Common)

### Issue 2: API Not Actually Enabled

Even though you said it's enabled, double-check:

1. Go to: https://console.cloud.google.com/apis/library/airquality.googleapis.com
2. Make sure it says "API Enabled" (green checkmark)
3. If not, click "Enable"

### Issue 3: API Key Restrictions Too Strict

If you set up HTTP referrer restrictions:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click your API key
3. Under "Application restrictions":
   - If "HTTP referrers" is selected, make sure you have: `http://localhost:*/*`
4. Under "API restrictions":
   - Make sure "Air Quality API" is checked
5. Save

### Issue 4: Wrong Project Selected

Make sure you're using the API key from the same project where you enabled the API:

1. Check project name in top-left of Cloud Console
2. Verify API key is from the same project
3. Verify Air Quality API is enabled in that project

### Issue 5: Browser/Network Issues

- **Clear browser cache** (Ctrl+Shift+Delete)
- **Try incognito mode**
- **Disable ad blockers**
- **Try a different browser** (Chrome works best)
- **Check firewall/antivirus** isn't blocking Google APIs

---

## 📝 Step-by-Step Diagnostic Process

### Step 1: Open Diagnostic Tool
```
http://localhost:8000/diagnostic.html
```

### Step 2: Run Tests in Order

1. **API Key Check** - Should show "✓ Found"
2. **Geolocation** - Click "Test Location Access", allow permissions
3. **Air Quality API** - Click "Test Air Quality API"

### Step 3: Read the Error

The diagnostic tool will show you:
- ✅ Exact HTTP status code
- ✅ Full error message
- ✅ Specific solutions for your error

---

## 🎯 Most Common Error Messages

### "Error 403: Forbidden"
**→ Billing not enabled** (most common)
- Solution: Enable billing (see above)

### "Error 403: The request is missing a valid API key"
**→ API key not configured**
- Check app.js has your key

### "Error 400: Bad Request"
**→ Request format issue**
- This shouldn't happen with our code
- Try the diagnostic tool

### "Error 429: Too Many Requests"
**→ Rate limit exceeded**
- Wait a few minutes
- Check if you're making too many requests

### "Network Error" or "Failed to fetch"
**→ Internet/firewall issue**
- Check internet connection
- Disable ad blockers
- Check firewall settings

---

## ✅ After Fixing

Once billing is enabled:

1. **Wait 2-3 minutes** for changes to propagate
2. **Refresh the page**
3. **Test with diagnostic tool**
4. **Try the main app**: http://localhost:8000

---

## 💡 Quick Checklist

Before asking for more help, verify:

- [ ] Billing is enabled in Google Cloud
- [ ] Air Quality API is enabled
- [ ] API key is correctly copied into app.js
- [ ] Tested with diagnostic.html
- [ ] Tried in incognito mode
- [ ] Allowed location permissions in browser

---

## 🆘 Still Not Working?

If you've done all the above and it still doesn't work:

1. **Run the diagnostic tool** and take a screenshot
2. **Check the browser console** (F12) for errors
3. **Share the exact error message** you're seeing

The diagnostic tool at `diagnostic.html` will give us the exact information needed to fix your specific issue!

---

## 📞 Next Steps

1. **Enable billing** (most important!)
2. **Open diagnostic.html** in your browser
3. **Run all 5 tests**
4. **Report back** with the results

Your app is ready to work - we just need to flip the billing switch! 🚀
