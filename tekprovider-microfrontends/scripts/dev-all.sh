#!/bin/bash

echo "🚀 Starting TekProvider Microfrontends"
echo "====================================="

# Function to start microfrontend in background
start_mf() {
    local mf_name=$1
    local port=$2
    local path=$3
    
    echo "🔄 Starting $mf_name on port $port..."
    cd "$path"
    npm run dev > "../logs/$mf_name.log" 2>&1 &
    local pid=$!
    echo "$pid" > "../logs/$mf_name.pid"
    cd ..
    echo "✅ $mf_name started (PID: $pid)"
}

# Create logs directory
mkdir -p logs

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm run install:all
fi

# Start all microfrontends
start_mf "Shared Components" 0 "shared-components"
sleep 2
start_mf "Auth MF" 3001 "auth-mf"
sleep 2
start_mf "Dashboard MF" 3002 "dashboard-mf"
sleep 2
start_mf "Invoices MF" 3003 "invoices-mf"
sleep 2
start_mf "Factoring MF" 3004 "factoring-mf"
sleep 2
start_mf "Support MF" 3005 "support-mf"
sleep 2
start_mf "Shell App" 3000 "shell-app"

echo ""
echo "🎉 All microfrontends started successfully!"
echo ""
echo "📋 Available URLs:"
echo "   🏠 Shell App:     http://localhost:3000"
echo "   🔐 Auth MF:       http://localhost:3001"
echo "   📊 Dashboard MF:  http://localhost:3002"
echo "   📄 Invoices MF:   http://localhost:3003"
echo "   💰 Factoring MF:  http://localhost:3004"
echo "   🎫 Support MF:    http://localhost:3005"
echo ""
echo "🔑 Default login credentials:"
echo "   Username: admin"
echo "   Password: admin"
echo ""
echo "📊 To view logs: tail -f logs/[mf-name].log"
echo "🛑 To stop all: ./scripts/stop-all.sh"

# Wait for user input
echo ""
echo "Press Ctrl+C to stop all services..."
trap 'echo ""; echo "🛑 Stopping all services..."; kill $(cat logs/*.pid 2>/dev/null) 2>/dev/null; rm -f logs/*.pid; echo "✅ All services stopped"; exit 0' INT

# Keep script running
while true; do
    sleep 1
done