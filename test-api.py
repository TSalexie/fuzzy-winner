#!/usr/bin/env python3

"""
Command-line API tester for Google Air Quality API
Tests different request formats to identify what works
"""

import json
import time
import sys
try:
    import urllib.request
    import urllib.error
except ImportError:
    print("Error: urllib is required")
    sys.exit(1)

API_KEY = 'AIzaSyB8aT336lZQAt-deQIevmtu1MwGcpBxVmI'
BASE_URL = 'https://airquality.googleapis.com/v1/currentConditions:lookup'

# Test location: San Francisco
TEST_LOCATION = {"latitude": 37.7749, "longitude": -122.4194}

# Colors for terminal output
class Colors:
    RESET = '\033[0m'
    BRIGHT = '\033[1m'
    GREEN = '\033[32m'
    RED = '\033[31m'
    YELLOW = '\033[33m'
    BLUE = '\033[34m'
    CYAN = '\033[36m'

def log(message, color='RESET'):
    color_code = getattr(Colors, color, Colors.RESET)
    print(f"{color_code}{message}{Colors.RESET}")

def log_section(title):
    print()
    log("=" * 70, 'CYAN')
    log(title, 'CYAN')
    log("=" * 70, 'CYAN')
    print()

def make_request(request_body, test_name):
    """Make an API request and return the results"""
    url = f"{BASE_URL}?key={API_KEY}"

    log(f"Testing: {test_name}", 'BRIGHT')
    log(f"Request body: {json.dumps(request_body, indent=2)}", 'BLUE')

    try:
        # Prepare request
        data = json.dumps(request_body).encode('utf-8')
        req = urllib.request.Request(
            url,
            data=data,
            headers={'Content-Type': 'application/json'}
        )

        # Make request
        start_time = time.time()
        try:
            response = urllib.request.urlopen(req, timeout=10)
            response_time = int((time.time() - start_time) * 1000)
            response_data = response.read().decode('utf-8')

            # Success
            data = json.loads(response_data)
            log(f"✅ SUCCESS! ({response_time}ms)", 'GREEN')
            log(f"Status: {response.status} {response.reason}", 'GREEN')

            aqi = data.get('indexes', [{}])[0].get('aqi', 'N/A')
            category = data.get('indexes', [{}])[0].get('category', 'N/A')
            pollutants_count = len(data.get('pollutants', []))
            pollens_count = len(data.get('pollens', []))

            log(f"AQI: {aqi}", 'GREEN')
            log(f"Category: {category}", 'GREEN')
            log(f"Pollutants found: {pollutants_count}", 'GREEN')
            log(f"Pollens found: {pollens_count}", 'GREEN')

            # Show pollen data if available
            if data.get('pollens'):
                log('\nPollen data:', 'CYAN')
                for pollen in data['pollens']:
                    display_name = pollen.get('displayName', 'Unknown')
                    pollen_category = pollen.get('indexInfo', {}).get('category', 'N/A')
                    log(f"  - {display_name}: {pollen_category}", 'CYAN')

            return {
                'success': True,
                'data': data,
                'status': response.status,
                'response_time': response_time
            }

        except urllib.error.HTTPError as e:
            response_time = int((time.time() - start_time) * 1000)
            error_text = e.read().decode('utf-8')

            log(f"❌ FAILED ({response_time}ms)", 'RED')
            log(f"Status: {e.code} {e.reason}", 'RED')
            log(f"Response: {error_text}", 'YELLOW')

            # Provide helpful hints
            if e.code == 403:
                log('\n💡 Error 403 usually means:', 'YELLOW')
                log('   1. Billing is not enabled (most common)', 'YELLOW')
                log('   2. API is not enabled in Google Cloud Console', 'YELLOW')
                log('   3. API key restrictions are blocking the request', 'YELLOW')
                log('\n   👉 Check: https://console.cloud.google.com/billing', 'YELLOW')
            elif e.code == 400:
                log('\n💡 Error 400 means the request format is invalid', 'YELLOW')
                log('   This helps identify which fields cause issues', 'YELLOW')

            return {
                'success': False,
                'status': e.code,
                'error': error_text,
                'response_time': response_time
            }

    except urllib.error.URLError as e:
        log(f"❌ NETWORK ERROR", 'RED')
        log(f"Error: {str(e.reason)}", 'RED')
        return {'success': False, 'error': str(e.reason)}

    except Exception as e:
        log(f"❌ ERROR", 'RED')
        log(f"Error: {str(e)}", 'RED')
        return {'success': False, 'error': str(e)}

def run_all_tests():
    """Run all API tests"""
    log_section('🧪 Google Air Quality API Test Suite')

    log(f"API Key: {API_KEY[:20]}...{API_KEY[-5:]}", 'CYAN')
    log(f"Test Location: San Francisco ({TEST_LOCATION['latitude']}, {TEST_LOCATION['longitude']})", 'CYAN')

    results = {}

    # Test 1: Minimal request
    log_section('Test 1: Minimal Request (Just Location)')
    results['test1'] = make_request({
        "location": TEST_LOCATION
    }, 'Test 1')
    time.sleep(1)  # Wait between requests

    # Test 2: Standard request
    log_section('Test 2: Standard Request (Location + Language)')
    results['test2'] = make_request({
        "location": TEST_LOCATION,
        "languageCode": "en"
    }, 'Test 2')
    time.sleep(1)

    # Test 3: Current app.js format
    log_section('Test 3: Current app.js Format (LOCAL_AQI + POLLUTANT_CONCENTRATION)')
    results['test3'] = make_request({
        "location": TEST_LOCATION,
        "extraComputations": [
            "LOCAL_AQI",
            "POLLUTANT_CONCENTRATION"
        ],
        "languageCode": "en"
    }, 'Test 3')
    time.sleep(1)

    # Test 4: Full request (old format)
    log_section('Test 4: Full Request (All extraComputations)')
    results['test4'] = make_request({
        "location": TEST_LOCATION,
        "extraComputations": [
            "POLLUTANT_CONCENTRATION",
            "LOCAL_AQI",
            "HEALTH_RECOMMENDATIONS",
            "POLLUTANT_ADDITIONAL_INFO"
        ],
        "languageCode": "en"
    }, 'Test 4')

    # Summary
    log_section('📊 Test Summary')

    test_results = [
        ('Test 1 (Minimal)', results['test1']),
        ('Test 2 (Standard)', results['test2']),
        ('Test 3 (Current app.js)', results['test3']),
        ('Test 4 (Full/Old)', results['test4'])
    ]

    for name, result in test_results:
        if result.get('success'):
            response_time = result.get('response_time', 0)
            log(f"✅ {name}: PASSED ({response_time}ms)", 'GREEN')
        else:
            status = result.get('status', 'Network Error')
            log(f"❌ {name}: FAILED ({status})", 'RED')

    # Overall assessment
    log_section('🎯 Overall Assessment')

    passed_tests = sum(1 for _, r in test_results if r.get('success'))
    total_tests = len(test_results)

    if passed_tests == total_tests:
        log('🎉 ALL TESTS PASSED! Your API is fully functional!', 'GREEN')
        log('✅ The app should work perfectly.', 'GREEN')
    elif passed_tests > 0:
        log(f"⚠️  {passed_tests}/{total_tests} tests passed", 'YELLOW')
        log('✅ The app will work with automatic fallback.', 'YELLOW')
        if results['test1'].get('success'):
            log('✅ Core functionality is working (Test 1 passed)', 'GREEN')
        if results['test3'].get('success'):
            log('✅ Current app.js implementation will work perfectly!', 'GREEN')
        elif results['test1'].get('success'):
            log('ℹ️  App will automatically fall back to minimal request', 'CYAN')
    else:
        log('❌ ALL TESTS FAILED', 'RED')
        log('🔧 Action needed:', 'YELLOW')
        if results['test1'].get('status') == 403:
            log('   1. Enable billing: https://console.cloud.google.com/billing', 'YELLOW')
            log('   2. Enable Air Quality API: https://console.cloud.google.com/apis/library/airquality.googleapis.com', 'YELLOW')
            log('   3. Check API key restrictions: https://console.cloud.google.com/apis/credentials', 'YELLOW')
        elif 'error' in results['test1']:
            log(f"   Network/Connection issue: {results['test1']['error']}", 'YELLOW')
            log('   Check your internet connection', 'YELLOW')

    print()

if __name__ == '__main__':
    try:
        run_all_tests()
    except KeyboardInterrupt:
        print("\n\nTests interrupted by user")
        sys.exit(0)
    except Exception as e:
        print(f"\nFatal error: {e}")
        sys.exit(1)
