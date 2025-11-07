# 🌸 Pollen Monitor - Your Personal Allergy Assistant

A Progressive Web App (PWA) for monitoring pollen levels, air quality, and weather conditions to help manage your allergies. Perfect for travelers who need real-time air quality information wherever they go!

## Features

### Core Functionality
- **Real-time Pollen Monitoring**: Track tree, grass, and weed pollen levels
- **Air Quality Index (AQI)**: Monitor PM2.5, PM10, and Ozone levels
- **Weather Conditions**: Temperature, humidity, wind speed, and UV index
- **Location Tracking**: Quick location updates for travelers with GPS pinpointing
- **Favorite Locations**: Save frequently visited locations for quick access

### Allergy Management
- **Personalized Recommendations**: Get actionable advice based on current conditions
- **Hourly Forecasts**: Plan your day with hourly air quality predictions
- **Visual Indicators**: Easy-to-understand color-coded severity levels
- **Offline Support**: View cached data even without internet connection

### PWA Features
- **Installable**: Download and use like a native app on your phone
- **Offline Capable**: Works without internet connection
- **Fast Loading**: Optimized performance with service worker caching
- **Responsive Design**: Looks great on all devices

## Screenshots

![Pollen Monitor App](screenshots/home.png)

## Installation

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Google Cloud Platform account (for API access)

### Step 1: Get Google API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Air Quality API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Air Quality API"
   - Click "Enable"
4. Create an API key:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key
5. (Optional but recommended) Restrict the API key:
   - Click on the API key you just created
   - Under "API restrictions", select "Restrict key"
   - Choose "Air Quality API"
   - Save changes

### Step 2: Configure the App

1. Clone or download this repository
2. Open `app.js` in a text editor
3. Find the `CONFIG` object at the top of the file
4. Replace `YOUR_GOOGLE_API_KEY_HERE` with your actual API key:

```javascript
const CONFIG = {
    GOOGLE_API_KEY: 'your-actual-api-key-here',
    // ... rest of config
};
```

### Step 3: Generate Icons

1. Open `generate-icons.html` in your web browser
2. Click "Generate All Icons"
3. Download each generated icon
4. Save them in the `icons/` folder with the correct filenames:
   - `icon-72x72.png`
   - `icon-96x96.png`
   - `icon-128x128.png`
   - `icon-144x144.png`
   - `icon-152x152.png`
   - `icon-192x192.png`
   - `icon-384x384.png`
   - `icon-512x512.png`

### Step 4: Deploy

#### Option A: Local Testing
1. Install a local web server:
   ```bash
   # Using Python 3
   python -m http.server 8000

   # Using Node.js
   npx serve
   ```
2. Open `http://localhost:8000` in your browser

#### Option B: Deploy to a Web Server
1. Upload all files to your web hosting service
2. Make sure HTTPS is enabled (required for PWA features)
3. Access your site via the URL

#### Option C: GitHub Pages
1. Push code to a GitHub repository
2. Go to repository Settings > Pages
3. Select the branch to deploy (e.g., `main`)
4. Your app will be available at `https://yourusername.github.io/repository-name`

### Step 5: Install on Your Phone

1. Open the app URL in your mobile browser
2. **iOS (Safari)**:
   - Tap the Share button
   - Scroll down and tap "Add to Home Screen"
   - Tap "Add"
3. **Android (Chrome)**:
   - Tap the menu (three dots)
   - Tap "Add to Home Screen" or "Install App"
   - Tap "Install"

## Usage

### Getting Started
1. **Allow Location Access**: When prompted, allow the app to access your location
2. **View Current Conditions**: The app will display current air quality and pollen levels
3. **Check Recommendations**: Scroll down to see personalized allergy management tips

### For Travelers
1. **Quick Location Update**: Tap the "Update Location" button to refresh data for your current location
2. **Save Favorites**:
   - Tap the "Favorites" button
   - Click "Add Current Location"
   - Give it a name (e.g., "Home", "Office", "Park")
3. **Load Saved Locations**: Tap any saved favorite to quickly view conditions there

### Understanding the Data

#### Pollen Levels
- **Low**: Generally safe for most people
- **Moderate**: May affect very sensitive individuals
- **High**: Likely to affect people with allergies
- **Very High**: Affects most allergy sufferers

#### Air Quality Index (AQI)
- **Good (0-50)**: Air quality is satisfactory
- **Moderate (51-100)**: Acceptable for most people
- **Unhealthy for Sensitive Groups (101-150)**: May affect sensitive individuals
- **Unhealthy (151-200)**: Everyone may experience health effects
- **Very Unhealthy (201-300)**: Health alert
- **Hazardous (301+)**: Health warning of emergency conditions

#### UV Index
- **Low (0-2)**: Minimal danger
- **Moderate (3-5)**: Moderate risk
- **High (6-7)**: High risk
- **Very High (8-10)**: Very high risk
- **Extreme (11+)**: Extreme risk

## API Information

### Google Air Quality API
- **Data Source**: Google Air Quality API
- **Coverage**: Global
- **Update Frequency**: Hourly
- **Cost**: Free tier available (check current pricing)
- **Documentation**: [Google Air Quality API Docs](https://developers.google.com/maps/documentation/air-quality)

### Weather Data
- **Data Source**: Open-Meteo API
- **Coverage**: Global
- **Update Frequency**: Hourly
- **Cost**: Free (no API key required)
- **Documentation**: [Open-Meteo Docs](https://open-meteo.com/en/docs)

### Geocoding
- **Data Source**: BigDataCloud API
- **Purpose**: Convert coordinates to location names
- **Cost**: Free tier available

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## Troubleshooting

### Location Not Found
- Make sure location services are enabled in your browser settings
- Allow location permissions when prompted
- Try refreshing the page

### API Errors
- Verify your API key is correct in `app.js`
- Check that the Air Quality API is enabled in Google Cloud Console
- Ensure you haven't exceeded your API quota

### App Won't Install
- Make sure you're using HTTPS (required for PWA)
- Try using a different browser
- Clear browser cache and try again

### Data Not Loading
- Check your internet connection
- Verify the API key is valid
- Check browser console for error messages (F12)

## Privacy

This app:
- Only accesses your location when you explicitly request it
- Stores favorite locations locally on your device
- Does not collect or transmit personal information
- Only communicates with Google and Open-Meteo APIs for weather data

## Development

### Project Structure
```
pollen-monitor/
├── index.html           # Main HTML file
├── styles.css           # Styles and responsive design
├── app.js              # Application logic and API integration
├── manifest.json       # PWA manifest
├── service-worker.js   # Service worker for offline support
├── generate-icons.html # Icon generator utility
├── icons/             # App icons (various sizes)
└── screenshots/       # App screenshots
```

### Future Enhancements
- [ ] Push notifications for high pollen alerts
- [ ] Multi-day forecast
- [ ] Symptom tracking
- [ ] Medication reminders
- [ ] Historical data charts
- [ ] Export data functionality
- [ ] Multiple language support
- [ ] Dark mode

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have questions:
1. Check the Troubleshooting section above
2. Review the browser console for errors
3. Verify your API configuration
4. Check that all files are properly uploaded

## Credits

- Weather data provided by [Open-Meteo](https://open-meteo.com/)
- Air quality and pollen data from [Google Air Quality API](https://developers.google.com/maps/documentation/air-quality)
- Geocoding by [BigDataCloud](https://www.bigdatacloud.com/)

## Disclaimer

This app is for informational purposes only and should not be used as a substitute for professional medical advice. Always consult with healthcare professionals for allergy management.

---

Made with 💚 for allergy sufferers everywhere
