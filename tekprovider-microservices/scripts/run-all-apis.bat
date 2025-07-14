@echo off
echo 🚀 Starting TekProvider Microservices
echo ====================================

REM Create logs directory
if not exist logs mkdir logs

REM Start Auth API
echo 🔄 Starting Auth API on port 5001...
cd TekProvider.Auth
start "Auth API" cmd /k "dotnet run --urls=https://localhost:5001"
cd ..
timeout /t 3 /nobreak >nul

REM Start Invoices API
echo 🔄 Starting Invoices API on port 5002...
cd TekProvider.Invoices
start "Invoices API" cmd /k "dotnet run --urls=https://localhost:5002"
cd ..
timeout /t 2 /nobreak >nul

REM Start Factoring API
echo 🔄 Starting Factoring API on port 5003...
cd TekProvider.Factoring
start "Factoring API" cmd /k "dotnet run --urls=https://localhost:5003"
cd ..
timeout /t 2 /nobreak >nul

REM Start Support API
echo 🔄 Starting Support API on port 5004...
cd TekProvider.Support
start "Support API" cmd /k "dotnet run --urls=https://localhost:5004"
cd ..
timeout /t 2 /nobreak >nul

REM Start API Gateway
echo 🔄 Starting API Gateway on port 5000...
cd TekProvider.Gateway
start "API Gateway" cmd /k "dotnet run --urls=https://localhost:5000"
cd ..

echo.
echo 🎉 All APIs started successfully!
echo.
echo 📋 Available endpoints:
echo    🔐 Auth API:      https://localhost:5001/swagger
echo    📄 Invoices API:  https://localhost:5002/swagger
echo    💰 Factoring API: https://localhost:5003/swagger
echo    🎫 Support API:   https://localhost:5004/swagger
echo    🌐 API Gateway:   https://localhost:5000
echo.
echo 🔑 Default login credentials:
echo    Username: admin
echo    Password: admin
echo.
echo ℹ️  Each API runs in its own window
echo 🛑 Close individual windows to stop specific APIs
pause