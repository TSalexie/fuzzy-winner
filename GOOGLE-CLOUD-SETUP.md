# 🔧 Complete Google Cloud Setup Guide for Pollen Monitor

This guide will walk you through the **complete setup** of Google Cloud Platform to use the Air Quality API. Follow every step carefully.

---

## 📋 What You'll Need

- A Google account (Gmail)
- A credit/debit card (for billing setup - but you get $300 free credits!)
- 15-20 minutes

---

## Part 1: Create or Select a Google Cloud Project

### Step 1: Go to Google Cloud Console

1. Open your browser and go to: **https://console.cloud.google.com/**
2. Sign in with your Google account
3. If this is your first time, you may need to accept the Terms of Service

### Step 2: Create a New Project (or Select Existing)

**Option A: Create a New Project (Recommended for this app)**

1. Click the **project dropdown** at the top of the page (next to "Google Cloud")
2. Click **"NEW PROJECT"** button in the top-right of the popup
3. Enter a project name: `pollen-monitor` (or any name you like)
4. Click **"CREATE"**
5. Wait 10-20 seconds for the project to be created
6. You'll see a notification when it's ready - click **"SELECT PROJECT"**

**Option B: Use Existing Project**

1. Click the **project dropdown** at the top
2. Select your existing project from the list
3. Make sure you remember which project you selected!

**✅ Checkpoint:** You should see your project name at the top-left of the page

---

## Part 2: Enable Billing (REQUIRED - Even Though API Has Free Tier)

This is the **most critical step**. The Air Quality API requires billing to be enabled, even though it has a generous free tier.

### Step 1: Go to Billing

1. In the left sidebar menu, click the **☰ hamburger menu** (three lines)
2. Scroll down and click **"Billing"**
3. Or go directly to: **https://console.cloud.google.com/billing**

### Step 2: Check Current Billing Status

You'll see one of these scenarios:

**Scenario A: "This project has no billing account"**
- This is what you'll likely see
- Click **"Link a billing account"** button
- Go to Step 3 below

**Scenario B: "Billing account already linked"**
- Great! Billing is already set up
- Skip to Part 3

**Scenario C: "Create billing account"**
- You don't have any billing account yet
- Click **"Create account"** button
- Follow the prompts to create your billing account

### Step 3: Set Up Billing Account

1. Click **"Create billing account"** or **"Link a billing account"**
2. Enter your billing information:
   - **Account name:** Choose any name (e.g., "My Billing Account")
   - **Country:** Select your country
   - Click **"Continue"**

3. Enter your payment information:
   - **Credit/debit card number**
   - **Expiration date**
   - **CVV/CVC**
   - **Billing address**
   - Click **"Submit and enable billing"**

4. **Important:** You'll get **$300 in free credits** for 90 days!

### Step 4: Link Billing to Your Project

1. After creating the billing account, you'll see a list of projects
2. Find your **pollen-monitor** project (or whatever you named it)
3. Click **"Link a billing account"** or select your billing account from dropdown
4. Click **"Set account"**

**✅ Checkpoint:** You should see "Billing account: [Your Account Name]" on the billing page

### Step 5: Set Up Budget Alerts (HIGHLY RECOMMENDED)

Protect yourself from unexpected charges:

1. Go to: **https://console.cloud.google.com/billing/budgets**
2. Click **"Create Budget"**
3. **Scope:**
   - Select your project
   - Click **"Next"**
4. **Amount:**
   - Budget type: **Specified amount**
   - Target amount: **$5.00** (or $10 if you prefer)
   - Click **"Next"**
5. **Actions:**
   - Check **"Email alerts to billing admins"**
   - Set thresholds: 50%, 90%, 100%
   - Click **"Finish"**

**✅ Checkpoint:** You'll receive an email confirmation about your budget alert

---

## Part 3: Enable the Air Quality API

### Step 1: Go to API Library

1. In the left sidebar, click **☰ menu**
2. Go to **"APIs & Services"** → **"Library"**
3. Or go directly to: **https://console.cloud.google.com/apis/library**

### Step 2: Search for Air Quality API

1. In the search box at the top, type: **"Air Quality API"**
2. You should see **"Air Quality API"** in the results
3. Click on it

### Step 3: Enable the API

1. You'll see the Air Quality API page
2. Click the blue **"Enable"** button
3. Wait 5-10 seconds while it enables
4. The page will refresh and show **"API enabled"** with a green checkmark

**✅ Checkpoint:** You should see "Manage" and "Try this API" buttons (not "Enable")

**⚠️ Common Issue:** If you see "API could not be enabled" error:
- This means billing is NOT properly linked
- Go back to Part 2 and verify billing is linked to THIS project
- Check the project name in the top-left corner

---

## Part 4: Create an API Key

### Step 1: Go to Credentials

1. In the left sidebar, click **"APIs & Services"** → **"Credentials"**
2. Or go to: **https://console.cloud.google.com/apis/credentials**

### Step 2: Create API Key

1. Click **"+ CREATE CREDENTIALS"** at the top
2. Select **"API key"** from the dropdown
3. A popup will appear with your new API key
4. **IMPORTANT:** Click the **"Copy"** button to copy your key
5. Save it somewhere safe temporarily (you'll add it to the app shortly)
6. Click **"Close"**

**✅ Checkpoint:** Your new API key should appear in the credentials list

### Step 3: Restrict the API Key (IMPORTANT for Security)

1. In the credentials list, find your API key
2. Click the **pencil icon** (Edit) next to it
3. You'll see the "Edit API key" page

**Application Restrictions:**

Choose one of these options:

**Option A: For Development/Testing (Less Secure but Easier)**
1. Select **"None"** under Application restrictions
2. This allows the key to work from anywhere

**Option B: For Production (More Secure - RECOMMENDED)**
1. Select **"HTTP referrers (web sites)"**
2. Click **"Add an item"**
3. Add these referrers (one at a time):
   ```
   http://localhost:*/*
   http://127.0.0.1:*/*
   https://yourusername.github.io/*
   ```
4. Replace `yourusername` with your actual GitHub username if deploying to GitHub Pages
5. Add your production domain if you have one

**API Restrictions:**

1. Select **"Restrict key"**
2. In the dropdown, search for and check: **"Air Quality API"**
3. Click **"OK"**

**Name Your Key (Optional but Recommended):**
1. At the top, change the name to something meaningful: **"Pollen Monitor API Key"**

4. Click **"SAVE"** at the bottom

**⚠️ Important:** Wait **2-3 minutes** after saving for changes to propagate through Google's systems

**✅ Checkpoint:** Your API key now shows the restrictions you set

---

## Part 5: Add API Key to Your App

### Step 1: Open app.js

1. Open your project folder
2. Find and open **`app.js`** in a text editor

### Step 2: Replace the API Key

1. Find this line near the top (around line 4):
   ```javascript
   GOOGLE_API_KEY: 'AIzaSyDwCV6x16j99RnQr-1pm5KE4cA8JEX9e_M',
   ```

2. Replace the key with YOUR API key:
   ```javascript
   GOOGLE_API_KEY: 'YOUR_ACTUAL_API_KEY_HERE',
   ```

3. **Save the file**

**✅ Checkpoint:** Your API key is now in the app

---

## Part 6: Test Your Setup

### Step 1: Start Local Server

Open a terminal in your project folder and run:

```bash
# Using Python 3
python -m http.server 8000

# OR using Python 2
python -m SimpleHTTPServer 8000

# OR using Node.js
npx serve -p 8000
```

**✅ Checkpoint:** You should see "Serving HTTP on 0.0.0.0 port 8000"

### Step 2: Run Command-Line Test

In a **new terminal window** (keep the server running), run:

```bash
# First, update the API key in test-api.py
# Edit line 13 and replace with your API key

python3 test-api.py
```

**Expected Results:**

**✅ SUCCESS - All working:**
```
✅ Test 1 (Minimal): PASSED (200-400ms)
✅ Test 2 (Standard): PASSED (200-400ms)
✅ Test 3 (Current app.js): PASSED (200-400ms)
```

**❌ FAILURE - 403 Error:**
```
❌ Test 1 (Minimal): FAILED (403)
```
- Go back to Part 2 and verify billing is LINKED TO THIS PROJECT
- Verify you're in the correct project (check top-left)
- Wait 2-3 more minutes after enabling billing

**❌ FAILURE - 400 Error:**
```
✅ Test 1 (Minimal): PASSED
❌ Test 3 (Current app.js): FAILED (400)
```
- This is OK! The app has automatic fallback
- Some fields aren't available in your region

### Step 3: Test in Browser

1. Open your browser
2. Go to: **http://localhost:8000/api-test.html**
3. Click **"Run Test 1"**
4. You should see **"✅ SUCCESS!"** in green

### Step 4: Test the Main App

1. Go to: **http://localhost:8000/index.html**
2. Click **"Allow"** when asked for location permission
3. Wait 5-10 seconds
4. You should see:
   - Your location name
   - AQI value and category
   - Pollen levels
   - Weather data

**✅ SUCCESS!** Your app is working!

---

## 🔍 Troubleshooting Common Issues

### Issue: "Error 403: Forbidden"

**Cause:** Billing not enabled or API not enabled

**Solutions:**
1. Verify billing is linked to **this specific project**:
   - Go to: https://console.cloud.google.com/billing
   - Check project name in top-left
   - Make sure billing account is linked

2. Verify Air Quality API is enabled in **this specific project**:
   - Go to: https://console.cloud.google.com/apis/library/airquality.googleapis.com
   - Should show "API enabled" (green)
   - If not, click "Enable"

3. Wait 2-3 minutes after making changes

4. Check you're using the API key from the **same project**:
   - Go to: https://console.cloud.google.com/apis/credentials
   - Verify the key is listed

### Issue: "Error 400: Bad Request"

**Cause:** Request format issue (usually with extraComputations)

**Solution:**
- This is OK! The app automatically falls back to a simpler request
- As long as Test 1 passes, your app will work

### Issue: "API key not valid"

**Cause:** API key restrictions or wrong key

**Solutions:**
1. Check API key restrictions:
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click on your API key
   - Make sure Air Quality API is allowed
   - Make sure HTTP referrers include localhost

2. Verify you copied the correct key:
   - Re-copy from credentials page
   - Paste into app.js
   - Make sure there are no extra spaces

### Issue: Tests work but browser app doesn't

**Cause:** Browser cache or old service worker

**Solutions:**
1. Hard refresh: **Ctrl+Shift+R** (Windows/Linux) or **Cmd+Shift+R** (Mac)
2. Clear cache: **Ctrl+Shift+Delete**
3. Try incognito/private browsing mode
4. Unregister service worker:
   - Open DevTools (F12)
   - Go to Application tab
   - Click Service Workers
   - Click "Unregister"

### Issue: "Geolocation not available"

**Cause:** Location permissions not granted

**Solutions:**
1. Click the **location icon** in your browser's address bar
2. Select **"Allow"** for location access
3. Refresh the page
4. Try a different browser

---

## 📊 Understanding Your Free Tier

### What's Included for FREE:

- **1,500 requests per day** to Air Quality API
- **$300 in Google Cloud credits** (90 days)
- Unlimited Open-Meteo weather API requests

### What Counts as a Request:

- Each time you click "Update Location" = 1 request
- Each time you load a favorite location = 1 request

### Estimated Usage:

- **Normal use:** 10-50 requests/day (1-3% of free tier)
- **Heavy use:** 100 requests/day (6-7% of free tier)

### After Free Tier:

- **Cost:** $5.00 per 1,000 additional requests
- **For typical personal use:** You'll likely never exceed the free tier

---

## 🔐 Security Best Practices

### DO:
- ✅ Set up budget alerts
- ✅ Restrict API key to specific APIs
- ✅ Use HTTP referrer restrictions in production
- ✅ Keep your API key out of public GitHub repos
- ✅ Monitor usage regularly

### DON'T:
- ❌ Share your API key publicly
- ❌ Commit API key to GitHub (use .gitignore)
- ❌ Use the same key for multiple apps
- ❌ Leave "No restrictions" in production

---

## 📝 Quick Reference

### Important URLs:

- **Cloud Console:** https://console.cloud.google.com/
- **Billing:** https://console.cloud.google.com/billing
- **API Library:** https://console.cloud.google.com/apis/library
- **Credentials:** https://console.cloud.google.com/apis/credentials
- **Air Quality API:** https://console.cloud.google.com/apis/library/airquality.googleapis.com
- **Budget Alerts:** https://console.cloud.google.com/billing/budgets

### Testing Commands:

```bash
# Start server
python -m http.server 8000

# Test API (command line)
python3 test-api.py

# Test in browser
http://localhost:8000/api-test.html

# Main app
http://localhost:8000/index.html
```

---

## ✅ Final Checklist

Before reporting issues, verify:

- [ ] Project created in Google Cloud Console
- [ ] Billing account created
- [ ] Billing account **linked to your project**
- [ ] Air Quality API enabled in your project
- [ ] API key created
- [ ] API key has Air Quality API in restrictions
- [ ] API key copied to app.js (line 4)
- [ ] Waited 2-3 minutes after making changes
- [ ] Test 1 passes in test-api.py
- [ ] Browser test passes at api-test.html

If all checkboxes are ✅ and it still doesn't work:
1. Take screenshots of billing page, API status, and credentials page
2. Share the exact error message from test-api.py
3. Share the browser console error (F12 > Console tab)

---

## 🎉 Success Indicators

You'll know everything is working when:

1. ✅ `python3 test-api.py` shows Test 1 PASSED
2. ✅ Browser shows your location and AQI data
3. ✅ No red errors in browser console (F12)
4. ✅ Pollen and weather data displays correctly

---

## 🚀 Next Steps After Setup

Once your API is working:

1. **Deploy to production:**
   - GitHub Pages (free)
   - Netlify (free)
   - Vercel (free)

2. **Update API key restrictions:**
   - Add your production domain
   - Remove "None" restriction

3. **Customize the app:**
   - Change colors in styles.css
   - Modify recommendations
   - Add features

4. **Monitor usage:**
   - Check usage in Cloud Console
   - Adjust budget alerts if needed

---

**Need Help?**

If you're still stuck after following all steps:
1. Run `python3 test-api.py` and save the output
2. Check browser console (F12) for errors
3. Verify all checklist items above
4. Share specific error messages

Good luck! 🌸
