#!/usr/bin/env node

/**
 * Command-line API tester for Google Air Quality API
 * Tests different request formats to identify what works
 */

const API_KEY = 'AIzaSyDwCV6x16j99RnQr-1pm5KE4cA8JEX9e_M';
const BASE_URL = 'https://airquality.googleapis.com/v1/currentConditions:lookup';

// Test location: San Francisco
const TEST_LOCATION = { latitude: 37.7749, longitude: -122.4194 };

// Colors for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(colors[color] + message + colors.reset);
}

function logSection(title) {
    console.log('\n' + colors.bright + colors.cyan + '='.repeat(70) + colors.reset);
    console.log(colors.bright + colors.cyan + title + colors.reset);
    console.log(colors.bright + colors.cyan + '='.repeat(70) + colors.reset + '\n');
}

async function makeRequest(requestBody, testName) {
    const url = `${BASE_URL}?key=${API_KEY}`;

    log(`Testing: ${testName}`, 'bright');
    log(`Request body: ${JSON.stringify(requestBody, null, 2)}`, 'blue');

    try {
        const startTime = Date.now();
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        const responseTime = Date.now() - startTime;
        const responseText = await response.text();

        if (response.ok) {
            const data = JSON.parse(responseText);
            log(`✅ SUCCESS! (${responseTime}ms)`, 'green');
            log(`Status: ${response.status} ${response.statusText}`, 'green');
            log(`AQI: ${data.indexes?.[0]?.aqi || 'N/A'}`, 'green');
            log(`Category: ${data.indexes?.[0]?.category || 'N/A'}`, 'green');
            log(`Pollutants found: ${data.pollutants?.length || 0}`, 'green');
            log(`Pollens found: ${data.pollens?.length || 0}`, 'green');

            // Show some pollen data if available
            if (data.pollens && data.pollens.length > 0) {
                log('\nPollen data:', 'cyan');
                data.pollens.forEach(pollen => {
                    log(`  - ${pollen.displayName}: ${pollen.indexInfo?.category || 'N/A'}`, 'cyan');
                });
            }

            return { success: true, data, status: response.status, responseTime };
        } else {
            log(`❌ FAILED (${responseTime}ms)`, 'red');
            log(`Status: ${response.status} ${response.statusText}`, 'red');
            log(`Response: ${responseText}`, 'yellow');

            // Provide helpful hints
            if (response.status === 403) {
                log('\n💡 Error 403 usually means:', 'yellow');
                log('   1. Billing is not enabled (most common)', 'yellow');
                log('   2. API is not enabled in Google Cloud Console', 'yellow');
                log('   3. API key restrictions are blocking the request', 'yellow');
                log('\n   👉 Check: https://console.cloud.google.com/billing', 'yellow');
            } else if (response.status === 400) {
                log('\n💡 Error 400 means the request format is invalid', 'yellow');
                log('   This helps identify which fields cause issues', 'yellow');
            }

            return { success: false, status: response.status, error: responseText, responseTime };
        }
    } catch (error) {
        log(`❌ NETWORK ERROR`, 'red');
        log(`Error: ${error.message}`, 'red');
        return { success: false, error: error.message };
    }
}

async function runAllTests() {
    logSection('🧪 Google Air Quality API Test Suite');

    log(`API Key: ${API_KEY.substring(0, 20)}...${API_KEY.substring(API_KEY.length - 5)}`, 'cyan');
    log(`Test Location: San Francisco (${TEST_LOCATION.latitude}, ${TEST_LOCATION.longitude})`, 'cyan');

    const results = {};

    // Test 1: Minimal request
    logSection('Test 1: Minimal Request (Just Location)');
    results.test1 = await makeRequest({
        location: TEST_LOCATION
    }, 'Test 1');

    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s between requests

    // Test 2: Standard request
    logSection('Test 2: Standard Request (Location + Language)');
    results.test2 = await makeRequest({
        location: TEST_LOCATION,
        languageCode: "en"
    }, 'Test 2');

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test 3: Current app.js format (reduced extraComputations)
    logSection('Test 3: Current app.js Format (LOCAL_AQI + POLLUTANT_CONCENTRATION)');
    results.test3 = await makeRequest({
        location: TEST_LOCATION,
        extraComputations: [
            "LOCAL_AQI",
            "POLLUTANT_CONCENTRATION"
        ],
        languageCode: "en"
    }, 'Test 3');

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test 4: Full request (old format)
    logSection('Test 4: Full Request (All extraComputations)');
    results.test4 = await makeRequest({
        location: TEST_LOCATION,
        extraComputations: [
            "POLLUTANT_CONCENTRATION",
            "LOCAL_AQI",
            "HEALTH_RECOMMENDATIONS",
            "POLLUTANT_ADDITIONAL_INFO"
        ],
        languageCode: "en"
    }, 'Test 4');

    // Summary
    logSection('📊 Test Summary');

    const testResults = [
        { name: 'Test 1 (Minimal)', result: results.test1 },
        { name: 'Test 2 (Standard)', result: results.test2 },
        { name: 'Test 3 (Current app.js)', result: results.test3 },
        { name: 'Test 4 (Full/Old)', result: results.test4 }
    ];

    testResults.forEach(({ name, result }) => {
        if (result.success) {
            log(`✅ ${name}: PASSED (${result.responseTime}ms)`, 'green');
        } else {
            log(`❌ ${name}: FAILED (${result.status || 'Network Error'})`, 'red');
        }
    });

    // Overall assessment
    logSection('🎯 Overall Assessment');

    const passedTests = testResults.filter(t => t.success).length;
    const totalTests = testResults.length;

    if (passedTests === totalTests) {
        log('🎉 ALL TESTS PASSED! Your API is fully functional!', 'green');
        log('✅ The app should work perfectly.', 'green');
    } else if (passedTests > 0) {
        log(`⚠️  ${passedTests}/${totalTests} tests passed`, 'yellow');
        log('✅ The app will work with automatic fallback.', 'yellow');
        if (results.test1.success) {
            log('✅ Core functionality is working (Test 1 passed)', 'green');
        }
        if (results.test3.success) {
            log('✅ Current app.js implementation will work perfectly!', 'green');
        } else if (results.test1.success) {
            log('ℹ️  App will automatically fall back to minimal request', 'cyan');
        }
    } else {
        log('❌ ALL TESTS FAILED', 'red');
        log('🔧 Action needed:', 'yellow');
        if (results.test1.status === 403) {
            log('   1. Enable billing: https://console.cloud.google.com/billing', 'yellow');
            log('   2. Enable Air Quality API: https://console.cloud.google.com/apis/library/airquality.googleapis.com', 'yellow');
            log('   3. Check API key restrictions: https://console.cloud.google.com/apis/credentials', 'yellow');
        }
    }

    console.log('\n');
}

// Run tests
runAllTests().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
