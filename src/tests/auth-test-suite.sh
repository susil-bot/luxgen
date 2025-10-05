#!/bin/bash

# LuxGen Authentication Test Suite
# =================================

echo "🧪 LuxGen Authentication Test Suite"
echo "===================================="
echo ""

# Configuration
API_BASE="http://localhost:3000"
TENANT_ID="luxgen"
TEST_EMAIL="testuser$(date +%s)@luxgen.com"
TEST_PASSWORD="SecurePass123!"
AUTH_TOKEN=""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_status="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -n "Testing $test_name... "
    
    # Run the test command and capture response
    response=$(eval "$test_command" 2>/dev/null)
    status_code=$(echo "$response" | tail -n1)
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}❌ FAIL${NC} (Expected: $expected_status, Got: $status_code)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

# Function to extract JSON value
extract_json() {
    local json="$1"
    local key="$2"
    echo "$json" | jq -r ".$key" 2>/dev/null || echo "null"
}

echo "🔧 Test Configuration:"
echo "  API Base: $API_BASE"
echo "  Tenant ID: $TENANT_ID"
echo "  Test Email: $TEST_EMAIL"
echo "  Test Password: $TEST_PASSWORD"
echo ""

# Test 1: Health Check
echo "📋 Test 1: Health Check"
run_test "Health Check" \
    "curl -s -w '%{http_code}' -o /dev/null $API_BASE/health" \
    "200"
echo ""

# Test 2: User Registration
echo "📋 Test 2: User Registration"
echo "Testing registration with valid data..."

registration_response=$(curl -s -X POST $API_BASE/api/v1/auth/register \
    -H "Content-Type: application/json" \
    -H "x-tenant-id: $TENANT_ID" \
    -d "{
        \"firstName\": \"Test\",
        \"lastName\": \"User\",
        \"email\": \"$TEST_EMAIL\",
        \"password\": \"$TEST_PASSWORD\",
        \"role\": \"user\",
        \"department\": \"Engineering\"
    }")

registration_success=$(extract_json "$registration_response" "success")
registration_status=$(curl -s -w '%{http_code}' -o /dev/null -X POST $API_BASE/api/v1/auth/register \
    -H "Content-Type: application/json" \
    -H "x-tenant-id: $TENANT_ID" \
    -d "{
        \"firstName\": \"Test\",
        \"lastName\": \"User\",
        \"email\": \"$TEST_EMAIL\",
        \"password\": \"$TEST_PASSWORD\",
        \"role\": \"user\",
        \"department\": \"Engineering\"
    }")

if [ "$registration_success" = "true" ] && [ "$registration_status" = "201" ]; then
    echo -e "  Registration: ${GREEN}✅ PASS${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
    
    # Extract token for subsequent tests
    AUTH_TOKEN=$(extract_json "$registration_response" "data.token")
    USER_ID=$(extract_json "$registration_response" "data.userId")
    echo "  Token extracted: ${AUTH_TOKEN:0:20}..."
else
    echo -e "  Registration: ${RED}❌ FAIL${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))
echo ""

# Test 3: User Login
echo "📋 Test 3: User Login"
echo "Testing login with valid credentials..."

login_response=$(curl -s -X POST $API_BASE/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -H "x-tenant-id: $TENANT_ID" \
    -d "{
        \"email\": \"$TEST_EMAIL\",
        \"password\": \"$TEST_PASSWORD\"
    }")

login_success=$(extract_json "$login_response" "success")
login_status=$(curl -s -w '%{http_code}' -o /dev/null -X POST $API_BASE/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -H "x-tenant-id: $TENANT_ID" \
    -d "{
        \"email\": \"$TEST_EMAIL\",
        \"password\": \"$TEST_PASSWORD\"
    }")

if [ "$login_success" = "true" ] && [ "$login_status" = "200" ]; then
    echo -e "  Login: ${GREEN}✅ PASS${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "  Login: ${RED}❌ FAIL${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))
echo ""

# Test 4: Get Current User
echo "📋 Test 4: Get Current User"
if [ -n "$AUTH_TOKEN" ]; then
    echo "Testing get current user with valid token..."
    
    me_response=$(curl -s -X GET $API_BASE/api/v1/auth/me \
        -H "Authorization: Bearer $AUTH_TOKEN" \
        -H "x-tenant-id: $TENANT_ID" \
        -H "x-user-id: $USER_ID")
    
    me_success=$(extract_json "$me_response" "success")
    me_status=$(curl -s -w '%{http_code}' -o /dev/null -X GET $API_BASE/api/v1/auth/me \
        -H "Authorization: Bearer $AUTH_TOKEN" \
        -H "x-tenant-id: $TENANT_ID" \
        -H "x-user-id: $USER_ID")
    
    if [ "$me_success" = "true" ] && [ "$me_status" = "200" ]; then
        echo -e "  Get Current User: ${GREEN}✅ PASS${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "  Get Current User: ${RED}❌ FAIL${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
else
    echo -e "  Get Current User: ${YELLOW}⏭️  SKIP${NC} (No auth token)"
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))
echo ""

# Test 5: Forgot Password
echo "📋 Test 5: Forgot Password"
echo "Testing forgot password functionality..."

forgot_response=$(curl -s -X POST $API_BASE/api/v1/auth/forgot-password \
    -H "Content-Type: application/json" \
    -H "x-tenant-id: $TENANT_ID" \
    -d "{
        \"email\": \"$TEST_EMAIL\"
    }")

forgot_success=$(extract_json "$forgot_response" "success")
forgot_status=$(curl -s -w '%{http_code}' -o /dev/null -X POST $API_BASE/api/v1/auth/forgot-password \
    -H "Content-Type: application/json" \
    -H "x-tenant-id: $TENANT_ID" \
    -d "{
        \"email\": \"$TEST_EMAIL\"
    }")

if [ "$forgot_success" = "true" ] && [ "$forgot_status" = "200" ]; then
    echo -e "  Forgot Password: ${GREEN}✅ PASS${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "  Forgot Password: ${RED}❌ FAIL${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))
echo ""

# Test 6: Invalid Login
echo "📋 Test 6: Invalid Login"
echo "Testing login with invalid credentials..."

invalid_login_status=$(curl -s -w '%{http_code}' -o /dev/null -X POST $API_BASE/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -H "x-tenant-id: $TENANT_ID" \
    -d "{
        \"email\": \"$TEST_EMAIL\",
        \"password\": \"WrongPassword\"
    }")

if [ "$invalid_login_status" = "401" ]; then
    echo -e "  Invalid Login: ${GREEN}✅ PASS${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "  Invalid Login: ${RED}❌ FAIL${NC} (Expected: 401, Got: $invalid_login_status)"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))
echo ""

# Test 7: Registration with Invalid Email
echo "📋 Test 7: Registration with Invalid Email"
echo "Testing registration with invalid email format..."

invalid_email_status=$(curl -s -w '%{http_code}' -o /dev/null -X POST $API_BASE/api/v1/auth/register \
    -H "Content-Type: application/json" \
    -H "x-tenant-id: $TENANT_ID" \
    -d "{
        \"firstName\": \"Test\",
        \"lastName\": \"User\",
        \"email\": \"invalid-email\",
        \"password\": \"$TEST_PASSWORD\",
        \"role\": \"user\",
        \"department\": \"Engineering\"
    }")

if [ "$invalid_email_status" = "400" ]; then
    echo -e "  Invalid Email Registration: ${GREEN}✅ PASS${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "  Invalid Email Registration: ${RED}❌ FAIL${NC} (Expected: 400, Got: $invalid_email_status)"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))
echo ""

# Test 8: Logout
echo "📋 Test 8: User Logout"
if [ -n "$AUTH_TOKEN" ]; then
    echo "Testing user logout..."
    
    logout_response=$(curl -s -X POST $API_BASE/api/v1/auth/logout \
        -H "Authorization: Bearer $AUTH_TOKEN" \
        -H "x-tenant-id: $TENANT_ID")
    
    logout_success=$(extract_json "$logout_response" "success")
    logout_status=$(curl -s -w '%{http_code}' -o /dev/null -X POST $API_BASE/api/v1/auth/logout \
        -H "Authorization: Bearer $AUTH_TOKEN" \
        -H "x-tenant-id: $TENANT_ID")
    
    if [ "$logout_success" = "true" ] && [ "$logout_status" = "200" ]; then
        echo -e "  Logout: ${GREEN}✅ PASS${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "  Logout: ${RED}❌ FAIL${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
else
    echo -e "  Logout: ${YELLOW}⏭️  SKIP${NC} (No auth token)"
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))
echo ""

# Test Summary
echo "📊 Test Summary"
echo "==============="
echo -e "Total Tests: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed: ${RED}$FAILED_TESTS${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "\n🎉 ${GREEN}All tests passed!${NC} Authentication system is working correctly."
    exit 0
else
    echo -e "\n⚠️  ${RED}Some tests failed.${NC} Please check the authentication system."
    exit 1
fi
