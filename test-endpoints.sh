#!/bin/bash
# Test script for BakeBase critical endpoints
# Usage: ./test-endpoints.sh <BASE_URL>
# Example: ./test-endpoints.sh https://your-app.railway.app

BASE_URL="${1:-http://localhost:3000}"

echo "🧪 Testing BakeBase Endpoints"
echo "================================"
echo "Base URL: $BASE_URL"
echo ""

# Test 1: Root endpoint
echo "1️⃣  Testing GET /"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ Status: 200 OK"
  echo "📦 Response:"
  echo "$BODY" | jq '.'
else
  echo "❌ Status: $HTTP_CODE (expected 200)"
  echo "$BODY"
fi
echo ""

# Test 2: Agent manifest
echo "2️⃣  Testing GET /.well-known/agent-manifest.json"
RESPONSE=$(curl -s -w "\n%{http_code}\n%{content_type}" "$BASE_URL/.well-known/agent-manifest.json")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 2 | head -n 1)
CONTENT_TYPE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | head -n -2)

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ Status: 200 OK"
  if [[ "$CONTENT_TYPE" == application/json* ]]; then
    echo "✅ Content-Type: $CONTENT_TYPE"
  else
    echo "⚠️  Content-Type: $CONTENT_TYPE (expected application/json)"
  fi
  echo "📦 Response (first 500 chars):"
  echo "$BODY" | jq '.' | head -c 500
  echo "..."
else
  echo "❌ Status: $HTTP_CODE (expected 200)"
  echo "$BODY"
fi
echo ""

# Test 3: Health check
echo "3️⃣  Testing GET /health"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/health")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ Status: 200 OK"
  echo "📦 Response:"
  echo "$BODY" | jq '.'
else
  echo "❌ Status: $HTTP_CODE (expected 200)"
  echo "$BODY"
fi
echo ""

echo "================================"
echo "✅ Tests complete!"
