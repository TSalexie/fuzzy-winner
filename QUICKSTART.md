# Quick Start Guide

## Get Your App Running in 5 Minutes!

### Step 1: Get Google API Key (2 minutes)
1. Visit: https://console.cloud.google.com/
2. Create a new project (or use existing)
3. Enable "Air Quality API" from the API library
4. Create credentials → API Key
5. Copy your API key

### Step 2: Configure App (1 minute)
1. Open `app.js` in a text editor
2. Replace this line:
   ```javascript
   GOOGLE_API_KEY: 'YOUR_GOOGLE_API_KEY_HERE',
   ```
   With:
   ```javascript
   GOOGLE_API_KEY: 'your-actual-key-here',
   ```
3. Save the file

### Step 3: Generate Icons (1 minute)
1. Open `generate-icons.html` in your browser
2. Download each icon by clicking the "Download" buttons
3. Save all icons into the `icons/` folder

### Step 4: Test Locally (1 minute)
Run one of these commands in the project folder:

**Python:**
```bash
python -m http.server 8000
```

**Node.js:**
```bash
npx serve
```

Then open: http://localhost:8000

### Step 5: Install on Phone
1. Deploy to a web server with HTTPS
2. Open the URL on your phone
3. Add to home screen

**Done!** 🎉

## Need More Help?
See the full [README.md](README.md) for detailed instructions.

## Common Issues

**"Please configure your Google API key"**
→ Make sure you edited `app.js` and saved it

**Location not working**
→ Allow location permissions in your browser

**Icons not showing**
→ Generate icons using `generate-icons.html`

**Data not loading**
→ Check browser console (F12) for errors
