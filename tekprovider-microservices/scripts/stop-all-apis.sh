#!/bin/bash

echo "🛑 Stopping TekProvider Microservices"
echo "====================================="

# Function to stop API
stop_api() {
    local api_name=$1
    
    if [ -f "logs/$api_name.pid" ]; then
        local pid=$(cat "logs/$api_name.pid")
        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid"
            echo "✅ $api_name stopped (PID: $pid)"
        else
            echo "⚠️  $api_name was not running"
        fi
        rm -f "logs/$api_name.pid"
    else
        echo "⚠️  No PID file found for $api_name"
    fi
}

# Stop all APIs
stop_api "Auth API"
stop_api "Invoices API"
stop_api "Factoring API"
stop_api "Support API"
stop_api "API Gateway"

# Clean up
rm -f logs/*.pid

echo ""
echo "🎉 All APIs stopped successfully!"