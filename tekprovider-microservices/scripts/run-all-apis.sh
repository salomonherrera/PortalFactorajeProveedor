#!/bin/bash

echo "🚀 Starting TekProvider Microservices"
echo "===================================="

# Function to start API in background
start_api() {
    local api_name=$1
    local port=$2
    local path=$3
    
    echo "🔄 Starting $api_name on port $port..."
    cd "$path"
    dotnet run --urls="https://localhost:$port" > "../logs/$api_name.log" 2>&1 &
    local pid=$!
    echo "$pid" > "../logs/$api_name.pid"
    cd ..
    echo "✅ $api_name started (PID: $pid)"
}

# Create logs directory
mkdir -p logs

# Start all APIs
start_api "Auth API" 5001 "TekProvider.Auth"
sleep 3
start_api "Invoices API" 5002 "TekProvider.Invoices"
sleep 2
start_api "Factoring API" 5003 "TekProvider.Factoring"
sleep 2
start_api "Support API" 5004 "TekProvider.Support"
sleep 2
start_api "API Gateway" 5000 "TekProvider.Gateway"

echo ""
echo "🎉 All APIs started successfully!"
echo ""
echo "📋 Available endpoints:"
echo "   🔐 Auth API:      https://localhost:5001/swagger"
echo "   📄 Invoices API:  https://localhost:5002/swagger"
echo "   💰 Factoring API: https://localhost:5003/swagger"
echo "   🎫 Support API:   https://localhost:5004/swagger"
echo "   🌐 API Gateway:   https://localhost:5000"
echo ""
echo "🔑 Default login credentials:"
echo "   Username: admin"
echo "   Password: admin"
echo ""
echo "📊 To view logs: tail -f logs/[api-name].log"
echo "🛑 To stop all APIs: ./scripts/stop-all-apis.sh"

# Wait for user input
echo ""
echo "Press Ctrl+C to stop all services..."
trap 'echo ""; echo "🛑 Stopping all services..."; kill $(cat logs/*.pid 2>/dev/null) 2>/dev/null; rm -f logs/*.pid; echo "✅ All services stopped"; exit 0' INT

# Keep script running
while true; do
    sleep 1
done