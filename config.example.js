// Configuration Template
// Copy this file to config.js and add your API key

const CONFIG = {
    // Get your API key from: https://console.cloud.google.com/
    // IMPORTANT: Restrict this key in Google Cloud Console!
    GOOGLE_API_KEY: 'YOUR_GOOGLE_API_KEY_HERE',

    // Using Open-Meteo for weather (free, no API key needed)
    WEATHER_API_URL: 'https://api.open-meteo.com/v1/forecast',

    // Google Air Quality API
    AIR_QUALITY_API_URL: 'https://airquality.googleapis.com/v1/currentConditions:lookup'
};
