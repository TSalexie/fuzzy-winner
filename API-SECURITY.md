# API Key Security Guide 🔒

## Important: Understanding Client-Side API Keys

For a **client-side PWA** (Progressive Web App) that runs entirely in the browser, the API key **must be included in the code** for the app to work. This is normal and expected for this type of application.

However, you can protect your API key from unauthorized use by **restricting it in Google Cloud Console**.

## 🛡️ Secure Your API Key (Recommended)

Follow these steps to ensure your API key only works on YOUR domain:

### Step 1: Open Google Cloud Console

1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your API key in the list
3. Click on the key name to edit it

### Step 2: Add Application Restrictions

1. Scroll to **"Application restrictions"**
2. Select **"HTTP referrers (web sites)"**
3. Click **"Add an item"**
4. Add these referrers:

```
https://TSalexie.github.io/*
http://localhost:8000/*
http://localhost:*/*
http://127.0.0.1:*/*
```

The first line restricts the key to only work from your GitHub Pages site.
The others allow local testing.

### Step 3: Add API Restrictions

1. Scroll to **"API restrictions"**
2. Select **"Restrict key"**
3. From the dropdown, select **only**:
   - ✅ Air Quality API

4. Click **"Save"**

## ✅ What This Does

After restricting your API key:

- ✅ **Only your domain** can use the key
- ✅ **Only Air Quality API** calls work
- ✅ Even if someone copies your key from the code, **it won't work** on their domain
- ✅ You can safely have the key in your public GitHub repository

## 🔍 Why Client-Side Keys Are Different

**Server-Side Apps:**
- API keys are hidden on the server
- Users never see them
- Example: Node.js, Python backends

**Client-Side Apps (like yours):**
- Code runs in the browser
- API keys are visible in the code (this is normal!)
- Protection comes from **domain restrictions**, not hiding

**Popular apps that use this approach:**
- Google Maps on websites (visible API keys)
- Weather widgets
- Firebase apps
- Any static website with APIs

## 📊 Monitor Your Usage

Check your API usage regularly:
1. Go to: https://console.cloud.google.com/apis/dashboard
2. View usage statistics
3. Set up billing alerts (optional)

## 🚨 If Your Key Gets Compromised

If you suspect unauthorized use:

1. **Delete the old key** in Google Cloud Console
2. **Create a new key**
3. Add restrictions immediately
4. Update your `app.js` with the new key
5. Push to GitHub

## 💡 Best Practices

✅ **DO:**
- Restrict API keys by domain (HTTP referrers)
- Restrict to specific APIs only
- Monitor usage regularly
- Set up billing alerts
- Use separate keys for development and production

❌ **DON'T:**
- Share your key in emails or chat
- Use the same key for multiple projects
- Leave keys unrestricted
- Ignore usage spikes

## Alternative: Backend Proxy (Advanced)

For maximum security, you could create a backend server that holds the API key:

**Your App** → **Your Server** → **Google API**

This is more complex and requires:
- Node.js/Python server
- Hosting (Heroku, AWS, etc.)
- More maintenance

**For most personal PWAs, domain restrictions are sufficient!**

---

## Summary

Your API key is **protected by domain restrictions**, not by hiding it. This is the standard approach for client-side web applications. As long as you follow the restrictions above, your key is secure! 🔒
