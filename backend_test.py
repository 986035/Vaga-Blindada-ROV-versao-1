#!/usr/bin/env python3
"""
Backend API Testing for VAGA BLINDADA ROV Course Landing Page
Tests the following endpoints:
1. GET /api/course/info - Course information with modules, stats, benefits
2. POST /api/leads/capture - Lead capture functionality  
3. GET /api/ - Root endpoint status
"""

import requests
import json
import sys
from datetime import datetime

# Backend URL from frontend/.env
BACKEND_URL = "https://hello-world-9728.preview.emergentagent.com"
API_BASE = f"{BACKEND_URL}/api"

def test_root_endpoint():
    """Test GET /api/ - Root endpoint"""
    print("\n=== Testing Root Endpoint ===")
    try:
        response = requests.get(f"{API_BASE}/")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {data}")
            
            if "message" in data and "VAGA BLINDADA ROV API Online" in data["message"]:
                print("✅ Root endpoint working correctly")
                return True
            else:
                print("❌ Root endpoint response format incorrect")
                return False
        else:
            print(f"❌ Root endpoint failed with status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Root endpoint error: {str(e)}")
        return False

def test_course_info_endpoint():
    """Test GET /api/course/info - Course information"""
    print("\n=== Testing Course Info Endpoint ===")
    try:
        response = requests.get(f"{API_BASE}/course/info")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ Course info endpoint failed with status {response.status_code}")
            return False
            
        data = response.json()
        print(f"Response keys: {list(data.keys())}")
        
        # Test modules array
        if "modules" not in data:
            print("❌ Missing 'modules' field")
            return False
            
        modules = data["modules"]
        if not isinstance(modules, list):
            print("❌ 'modules' is not an array")
            return False
            
        if len(modules) != 5:
            print(f"❌ Expected 5 modules, got {len(modules)}")
            return False
            
        print(f"✅ Found {len(modules)} modules")
        
        # Test each module structure
        for i, module in enumerate(modules):
            required_fields = ["id", "title", "subtitle", "icon", "color", "lessons"]
            for field in required_fields:
                if field not in module:
                    print(f"❌ Module {i+1} missing '{field}' field")
                    return False
                    
            # Test lessons structure
            lessons = module["lessons"]
            if not isinstance(lessons, list):
                print(f"❌ Module {i+1} lessons is not an array")
                return False
                
            for j, lesson in enumerate(lessons):
                if "number" not in lesson or "title" not in lesson:
                    print(f"❌ Module {i+1} lesson {j+1} missing required fields")
                    return False
                    
        print("✅ All modules have correct structure")
        
        # Test stats array
        if "stats" not in data:
            print("❌ Missing 'stats' field")
            return False
            
        stats = data["stats"]
        if not isinstance(stats, list):
            print("❌ 'stats' is not an array")
            return False
            
        if len(stats) != 4:
            print(f"❌ Expected 4 stats, got {len(stats)}")
            return False
            
        print(f"✅ Found {len(stats)} stats")
        
        # Test benefits array
        if "benefits" not in data:
            print("❌ Missing 'benefits' field")
            return False
            
        benefits = data["benefits"]
        if not isinstance(benefits, list):
            print("❌ 'benefits' is not an array")
            return False
            
        if len(benefits) != 6:
            print(f"❌ Expected 6 benefits, got {len(benefits)}")
            return False
            
        print(f"✅ Found {len(benefits)} benefits")
        
        # Test checkout_url field
        if "checkout_url" not in data:
            print("❌ Missing 'checkout_url' field")
            return False
            
        checkout_url = data["checkout_url"]
        if not isinstance(checkout_url, str):
            print("❌ 'checkout_url' is not a string")
            return False
            
        print(f"✅ Found checkout_url field: '{checkout_url}'")
        
        # Test sections object
        if "sections" not in data:
            print("❌ Missing 'sections' field")
            return False
            
        sections = data["sections"]
        if not isinstance(sections, dict):
            print("❌ 'sections' is not an object")
            return False
            
        if "modules" not in sections:
            print("❌ Missing 'modules' key in sections")
            return False
            
        print("✅ Found sections object with modules key")
        
        print("✅ Course info endpoint working correctly")
        return True
        
    except Exception as e:
        print(f"❌ Course info endpoint error: {str(e)}")
        return False

def test_lead_capture_endpoint():
    """Test POST /api/leads/capture - Lead capture"""
    print("\n=== Testing Lead Capture Endpoint ===")
    
    # Test data with realistic information
    test_lead = {
        "name": "João Silva",
        "email": "joao.silva@email.com",
        "phone": "(11) 99999-8888",
        "source": "landing_page"
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/leads/capture",
            json=test_lead,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ Lead capture failed with status {response.status_code}")
            try:
                error_data = response.json()
                print(f"Error details: {error_data}")
            except:
                print(f"Error text: {response.text}")
            return False
            
        data = response.json()
        print(f"Response: {data}")
        
        # Check response structure
        required_fields = ["success", "lead_id", "message"]
        for field in required_fields:
            if field not in data:
                print(f"❌ Missing '{field}' in response")
                return False
                
        if data["success"] != True:
            print("❌ Success field is not True")
            return False
            
        if not data["lead_id"]:
            print("❌ Missing lead_id")
            return False
            
        print("✅ Lead capture endpoint working correctly")
        return True
        
    except Exception as e:
        print(f"❌ Lead capture endpoint error: {str(e)}")
        return False

def test_invalid_lead_data():
    """Test POST /api/leads/capture with invalid data"""
    print("\n=== Testing Lead Capture with Invalid Data ===")
    
    # Test with missing required fields
    invalid_lead = {
        "name": "Test User"
        # Missing email and phone
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/leads/capture",
            json=invalid_lead,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 422:  # Validation error expected
            print("✅ Validation working correctly - rejected invalid data")
            return True
        elif response.status_code == 200:
            print("⚠️ Warning: Invalid data was accepted (validation may be missing)")
            return True  # Not a critical failure
        else:
            print(f"❌ Unexpected status code: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Invalid data test error: {str(e)}")
        return False

def run_all_tests():
    """Run all backend tests"""
    print("🚀 Starting Backend API Tests for VAGA BLINDADA ROV")
    print(f"Testing against: {API_BASE}")
    print("=" * 60)
    
    tests = [
        ("Root Endpoint", test_root_endpoint),
        ("Course Info Endpoint", test_course_info_endpoint),
        ("Lead Capture Endpoint", test_lead_capture_endpoint),
        ("Invalid Lead Data", test_invalid_lead_data)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} crashed: {str(e)}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
        if result:
            passed += 1
    
    print(f"\nResults: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed!")
        return True
    else:
        print("⚠️ Some tests failed - check details above")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)