// Configuration
const CONFIG = {
    // Google API Key for Air Quality API
    // IMPORTANT: Replace with your actual API key from Google Cloud Console
    // Get your key at: https://console.cloud.google.com/apis/credentials
    GOOGLE_API_KEY: 'YOUR_GOOGLE_API_KEY_HERE',
    // Using Open-Meteo for weather (free, no API key needed)
    WEATHER_API_URL: 'https://api.open-meteo.com/v1/forecast',
    // Google Air Quality API
    AIR_QUALITY_API_URL: 'https://airquality.googleapis.com/v1/currentConditions:lookup'
};

// State Management
let currentLocation = null;
let currentData = null;
let deferredPrompt = null;

// DOM Elements
const elements = {
    locationBtn: document.getElementById('locationBtn'),
    favoritesBtn: document.getElementById('favoritesBtn'),
    locationName: document.getElementById('locationName'),
    loadingIndicator: document.getElementById('loadingIndicator'),
    errorMessage: document.getElementById('errorMessage'),
    mainContent: document.getElementById('mainContent'),
    installBtn: document.getElementById('installBtn'),
    favoritesModal: document.getElementById('favoritesModal'),
    closeFavoritesBtn: document.getElementById('closeFavoritesBtn'),
    addFavoriteBtn: document.getElementById('addFavoriteBtn'),
    favoritesList: document.getElementById('favoritesList')
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    checkForUpdates();
});

function initializeApp() {
    // Check if API key is configured
    if (CONFIG.GOOGLE_API_KEY === 'YOUR_GOOGLE_API_KEY_HERE') {
        showError('Please configure your Google API key in app.js. See README.md for instructions.');
        return;
    }

    // Try to get location automatically on load
    getCurrentLocation();
}

function setupEventListeners() {
    // Location button
    elements.locationBtn.addEventListener('click', () => {
        getCurrentLocation();
    });

    // Favorites button
    elements.favoritesBtn.addEventListener('click', () => {
        openFavoritesModal();
    });

    // Close favorites modal
    elements.closeFavoritesBtn.addEventListener('click', () => {
        closeFavoritesModal();
    });

    // Add favorite button
    elements.addFavoriteBtn.addEventListener('click', () => {
        addCurrentLocationToFavorites();
    });

    // Close modal on background click
    elements.favoritesModal.addEventListener('click', (e) => {
        if (e.target === elements.favoritesModal) {
            closeFavoritesModal();
        }
    });

    // PWA Install
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        document.getElementById('installPrompt').style.display = 'block';
    });

    elements.installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`Install prompt outcome: ${outcome}`);
        deferredPrompt = null;
        document.getElementById('installPrompt').style.display = 'none';
    });
}

// Geolocation Functions
function getCurrentLocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }

    showLoading();

    navigator.geolocation.getCurrentPosition(
        (position) => {
            currentLocation = {
                lat: position.coords.latitude,
                lon: position.coords.longitude
            };
            fetchAllData();
        },
        (error) => {
            let errorMsg = 'Unable to get your location. ';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMsg += 'Please enable location permissions.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMsg += 'Location information unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMsg += 'Location request timed out.';
                    break;
                default:
                    errorMsg += 'An unknown error occurred.';
            }
            showError(errorMsg);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // Cache for 5 minutes
        }
    );
}

// Data Fetching Functions
async function fetchAllData() {
    if (!currentLocation) {
        showError('No location available');
        return;
    }

    showLoading();

    try {
        // Fetch all data in parallel
        const [airQualityData, weatherData] = await Promise.all([
            fetchAirQuality(),
            fetchWeather()
        ]);

        currentData = {
            airQuality: airQualityData,
            weather: weatherData,
            timestamp: new Date()
        };

        updateUI();
        updateLocationName();
        hideLoading();
    } catch (error) {
        console.error('Error fetching data:', error);
        showError('Failed to fetch data: ' + error.message);
    }
}

async function fetchAirQuality() {
    const url = `${CONFIG.AIR_QUALITY_API_URL}?key=${CONFIG.GOOGLE_API_KEY}`;

    // Try with full request first
    let requestBody = {
        location: {
            latitude: currentLocation.lat,
            longitude: currentLocation.lon
        },
        extraComputations: [
            "LOCAL_AQI",
            "POLLUTANT_CONCENTRATION"
        ],
        languageCode: "en"
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (response.ok) {
            return await response.json();
        }

        // If we get a 400 error, it might be due to extraComputations
        // Try again with minimal request
        if (response.status === 400) {
            console.log('Retrying with minimal request...');
            requestBody = {
                location: {
                    latitude: currentLocation.lat,
                    longitude: currentLocation.lon
                }
            };

            const retryResponse = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (retryResponse.ok) {
                return await retryResponse.json();
            }
        }

        // Get detailed error message
        const errorText = await response.text();
        let errorMessage = `Air Quality API error: ${response.status}`;

        // Provide helpful error messages
        if (response.status === 403) {
            errorMessage += '\n\nThis usually means:\n';
            errorMessage += '1. Billing is not enabled (most common)\n';
            errorMessage += '2. API is not enabled for your project\n';
            errorMessage += '3. API key restrictions are blocking the request\n\n';
            errorMessage += 'Fix: Enable billing at https://console.cloud.google.com/billing';
        } else if (response.status === 400) {
            errorMessage += '\n\nBad Request - Check API configuration';
        } else if (response.status === 429) {
            errorMessage += '\n\nRate limit exceeded - Please wait a few minutes';
        }

        errorMessage += '\n\nDetails: ' + errorText;
        throw new Error(errorMessage);
    } catch (error) {
        // If it's already our custom error, re-throw it
        if (error.message.includes('Air Quality API error')) {
            throw error;
        }
        // Otherwise, wrap network errors
        throw new Error(`Network error: ${error.message}`);
    }
}

async function fetchWeather() {
    const url = `${CONFIG.WEATHER_API_URL}?latitude=${currentLocation.lat}&longitude=${currentLocation.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,uv_index&hourly=uv_index&timezone=auto`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
    }

    return await response.json();
}

async function updateLocationName() {
    try {
        // Use reverse geocoding to get location name
        const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${currentLocation.lat}&longitude=${currentLocation.lon}&localityLanguage=en`;
        const response = await fetch(url);
        const data = await response.json();

        const locationName = data.city || data.locality || data.principalSubdivision || 'Unknown Location';
        elements.locationName.textContent = `${locationName}, ${data.countryCode || ''}`;
    } catch (error) {
        console.error('Error getting location name:', error);
        elements.locationName.textContent = `${currentLocation.lat.toFixed(4)}, ${currentLocation.lon.toFixed(4)}`;
    }
}

// UI Update Functions
function updateUI() {
    if (!currentData) return;

    // Update timestamp
    const lastUpdated = document.getElementById('lastUpdated');
    lastUpdated.textContent = `Updated: ${currentData.timestamp.toLocaleTimeString()}`;

    // Update pollen data
    updatePollenData();

    // Update air quality
    updateAirQualityData();

    // Update weather
    updateWeatherData();

    // Update overall status
    updateOverallStatus();

    // Update recommendations
    updateRecommendations();

    // Update hourly forecast
    updateHourlyForecast();
}

function updatePollenData() {
    const pollens = currentData.airQuality?.pollens || [];

    // Find specific pollen types
    const treePollen = pollens.find(p => p.code === 'TREE_UPI');
    const grassPollen = pollens.find(p => p.code === 'GRASS_UPI');
    const weedPollen = pollens.find(p => p.code === 'WEED_UPI');

    updateDataItem('treePollen', treePollen);
    updateDataItem('grassPollen', grassPollen);
    updateDataItem('weedPollen', weedPollen);
}

function updateAirQualityData() {
    const indexes = currentData.airQuality?.indexes || [];
    const pollutants = currentData.airQuality?.pollutants || [];

    // Get primary AQI
    const aqi = indexes.find(i => i.code === 'uaqi') || indexes[0];
    if (aqi) {
        const aqiElement = document.getElementById('aqiValue');
        aqiElement.querySelector('.value').textContent = aqi.aqi || '--';
        const badge = aqiElement.querySelector('.level-badge');
        badge.textContent = aqi.category || '--';
        badge.className = 'level-badge ' + getLevelClass(aqi.category);
    }

    // Update pollutants
    const pm25 = pollutants.find(p => p.code === 'pm25');
    if (pm25) {
        document.getElementById('pm25Value').querySelector('.value').textContent =
            pm25.concentration?.value?.toFixed(1) || '--';
    }

    const pm10 = pollutants.find(p => p.code === 'pm10');
    if (pm10) {
        document.getElementById('pm10Value').querySelector('.value').textContent =
            pm10.concentration?.value?.toFixed(1) || '--';
    }

    const ozone = pollutants.find(p => p.code === 'o3');
    if (ozone) {
        document.getElementById('ozoneValue').querySelector('.value').textContent =
            ozone.concentration?.value?.toFixed(1) || '--';
    }
}

function updateWeatherData() {
    const current = currentData.weather?.current;

    if (current) {
        document.getElementById('temperature').querySelector('.value').textContent =
            current.temperature_2m?.toFixed(1) || '--';

        document.getElementById('humidity').querySelector('.value').textContent =
            current.relative_humidity_2m || '--';

        document.getElementById('windSpeed').querySelector('.value').textContent =
            current.wind_speed_10m?.toFixed(1) || '--';

        const uvElement = document.getElementById('uvIndex');
        const uvValue = current.uv_index || 0;
        uvElement.querySelector('.value').textContent = uvValue.toFixed(1);
        const uvBadge = uvElement.querySelector('.level-badge');
        uvBadge.textContent = getUVCategory(uvValue);
        uvBadge.className = 'level-badge ' + getUVLevelClass(uvValue);
    }
}

function updateDataItem(elementId, data) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const valueSpan = element.querySelector('.value');
    const badgeSpan = element.querySelector('.level-badge');

    if (data && data.displayName) {
        const value = data.indexInfo?.value || '--';
        valueSpan.textContent = value;

        const category = data.indexInfo?.category || '--';
        badgeSpan.textContent = category;
        badgeSpan.className = 'level-badge ' + getLevelClass(category);
    } else {
        valueSpan.textContent = '--';
        badgeSpan.textContent = 'No data';
        badgeSpan.className = 'level-badge';
    }
}

function updateOverallStatus() {
    const statusElement = document.getElementById('overallStatus');
    const icon = statusElement.querySelector('.status-icon');
    const text = statusElement.querySelector('.status-text');

    // Calculate overall status based on AQI and pollen levels
    const indexes = currentData.airQuality?.indexes || [];
    const aqi = indexes.find(i => i.code === 'uaqi') || indexes[0];

    if (!aqi) {
        icon.textContent = '😐';
        text.textContent = 'Unknown';
        return;
    }

    const category = aqi.category?.toLowerCase() || '';

    if (category.includes('good') || category.includes('low')) {
        icon.textContent = '😊';
        text.textContent = 'Good';
    } else if (category.includes('moderate')) {
        icon.textContent = '😐';
        text.textContent = 'Moderate';
    } else if (category.includes('poor') || category.includes('high')) {
        icon.textContent = '😷';
        text.textContent = 'Poor';
    } else {
        icon.textContent = '😨';
        text.textContent = 'Very Poor';
    }
}

function updateRecommendations() {
    const recommendations = [];

    if (!currentData.airQuality) {
        recommendations.push('Unable to generate recommendations without air quality data');
    } else {
        const indexes = currentData.airQuality.indexes || [];
        const aqi = indexes.find(i => i.code === 'uaqi') || indexes[0];
        const pollens = currentData.airQuality.pollens || [];
        const weather = currentData.weather?.current;

        // AQI-based recommendations
        if (aqi) {
            const category = aqi.category?.toLowerCase() || '';
            if (category.includes('poor') || category.includes('unhealthy')) {
                recommendations.push('Air quality is poor. Limit outdoor activities');
                recommendations.push('Keep windows closed to prevent outdoor allergens from entering');
            }
        }

        // Pollen-based recommendations
        const highPollen = pollens.some(p => {
            const category = p.indexInfo?.category?.toLowerCase() || '';
            return category.includes('high') || category.includes('very');
        });

        if (highPollen) {
            recommendations.push('High pollen levels detected. Take allergy medication if prescribed');
            recommendations.push('Avoid outdoor activities during peak pollen hours (morning and evening)');
            recommendations.push('Shower and change clothes after being outdoors');
        }

        // Weather-based recommendations
        if (weather) {
            if (weather.wind_speed_10m > 20) {
                recommendations.push('Windy conditions may increase pollen spread. Stay indoors if possible');
            }

            if (weather.relative_humidity_2m > 70) {
                recommendations.push('High humidity may increase mold growth. Monitor indoor air quality');
            }

            if (weather.uv_index > 6) {
                recommendations.push('High UV index. Wear sunglasses and sunscreen if going outdoors');
            }
        }

        // General recommendations
        if (recommendations.length === 0) {
            recommendations.push('Conditions are favorable. Enjoy your day!');
            recommendations.push('Stay hydrated and monitor for any allergy symptoms');
        }
    }

    const list = document.getElementById('recommendations');
    list.innerHTML = recommendations.map(r => `<li>${r}</li>`).join('');
}

function updateHourlyForecast() {
    const container = document.getElementById('hourlyForecast');

    // Since Google Air Quality API doesn't provide hourly forecast,
    // we'll use the UV index from weather API as a proxy
    const hourlyUV = currentData.weather?.hourly?.uv_index || [];

    if (hourlyUV.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Hourly forecast not available</p>';
        return;
    }

    // Show next 8 hours
    const now = new Date();
    const currentHour = now.getHours();

    let html = '';
    for (let i = 0; i < Math.min(8, hourlyUV.length); i++) {
        const hour = (currentHour + i) % 24;
        const uvIndex = hourlyUV[i] || 0;

        html += `
            <div class="hour-item">
                <div class="hour-time">${hour}:00</div>
                <div class="hour-aqi" style="color: ${getUVColor(uvIndex)}">${uvIndex.toFixed(1)}</div>
                <div class="hour-pollen">UV Index</div>
            </div>
        `;
    }

    container.innerHTML = html;
}

// Helper Functions
function getLevelClass(category) {
    if (!category) return '';
    const cat = category.toLowerCase();

    if (cat.includes('good') || cat.includes('low')) return 'level-good';
    if (cat.includes('moderate')) return 'level-moderate';
    if (cat.includes('high') && !cat.includes('very')) return 'level-high';
    if (cat.includes('very') || cat.includes('poor') || cat.includes('unhealthy')) return 'level-very-high';

    return '';
}

function getUVCategory(uvIndex) {
    if (uvIndex < 3) return 'Low';
    if (uvIndex < 6) return 'Moderate';
    if (uvIndex < 8) return 'High';
    if (uvIndex < 11) return 'Very High';
    return 'Extreme';
}

function getUVLevelClass(uvIndex) {
    if (uvIndex < 3) return 'level-low';
    if (uvIndex < 6) return 'level-moderate';
    if (uvIndex < 8) return 'level-high';
    return 'level-very-high';
}

function getUVColor(uvIndex) {
    if (uvIndex < 3) return '#4CAF50';
    if (uvIndex < 6) return '#ff9800';
    if (uvIndex < 8) return '#f44336';
    return '#9c27b0';
}

// Favorites Management
function openFavoritesModal() {
    elements.favoritesModal.classList.remove('hidden');
    displayFavorites();
}

function closeFavoritesModal() {
    elements.favoritesModal.classList.add('hidden');
}

function addCurrentLocationToFavorites() {
    if (!currentLocation) {
        alert('No location available to save');
        return;
    }

    const name = prompt('Enter a name for this location:', elements.locationName.textContent);
    if (!name) return;

    const favorites = getFavorites();
    favorites.push({
        name: name,
        lat: currentLocation.lat,
        lon: currentLocation.lon,
        id: Date.now()
    });

    saveFavorites(favorites);
    displayFavorites();
}

function getFavorites() {
    try {
        const stored = localStorage.getItem('favorites');
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error loading favorites:', error);
        return [];
    }
}

function saveFavorites(favorites) {
    try {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (error) {
        console.error('Error saving favorites:', error);
        alert('Failed to save favorites');
    }
}

function displayFavorites() {
    const favorites = getFavorites();

    if (favorites.length === 0) {
        elements.favoritesList.innerHTML = '<p class="empty-state">No favorite locations yet</p>';
        return;
    }

    const html = favorites.map(fav => `
        <div class="favorite-item">
            <div class="favorite-info" onclick="loadFavorite(${fav.id})">
                <div class="favorite-name">${fav.name}</div>
                <div class="favorite-coords">${fav.lat.toFixed(4)}, ${fav.lon.toFixed(4)}</div>
            </div>
            <div class="favorite-actions">
                <button class="btn-icon-only" onclick="deleteFavorite(${fav.id})" title="Delete">🗑️</button>
            </div>
        </div>
    `).join('');

    elements.favoritesList.innerHTML = html;
}

window.loadFavorite = function(id) {
    const favorites = getFavorites();
    const favorite = favorites.find(f => f.id === id);

    if (favorite) {
        currentLocation = {
            lat: favorite.lat,
            lon: favorite.lon
        };
        closeFavoritesModal();
        fetchAllData();
    }
};

window.deleteFavorite = function(id) {
    if (!confirm('Delete this location?')) return;

    const favorites = getFavorites().filter(f => f.id !== id);
    saveFavorites(favorites);
    displayFavorites();
};

// UI State Functions
function showLoading() {
    elements.loadingIndicator.classList.remove('hidden');
    elements.errorMessage.classList.add('hidden');
    elements.mainContent.classList.add('hidden');
}

function hideLoading() {
    elements.loadingIndicator.classList.add('hidden');
    elements.mainContent.classList.remove('hidden');
}

function showError(message) {
    elements.errorMessage.classList.remove('hidden');
    elements.errorMessage.querySelector('p').textContent = message;
    elements.loadingIndicator.classList.add('hidden');
    elements.mainContent.classList.add('hidden');
}

// Service Worker Check
function checkForUpdates() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);

                // Check for updates every hour
                setInterval(() => {
                    registration.update();
                }, 3600000);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    }
}
