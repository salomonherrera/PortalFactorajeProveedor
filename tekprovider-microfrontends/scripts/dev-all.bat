@echo off
echo 🚀 Starting TekProvider Microfrontends
echo =====================================

REM Create logs directory
if not exist logs mkdir logs

REM Install dependencies if needed
if not exist node_modules (
    echo 📦 Installing dependencies...
    call npm run install:all
)

REM Start Shared Components (build watch)
echo 🔄 Starting Shared Components...
cd shared-components
start "Shared Components" cmd /k "npm run dev"
cd ..
timeout /t 2 /nobreak >nul

REM Start Auth Microfrontend
echo 🔄 Starting Auth MF on port 3001...
cd auth-mf
start "Auth MF" cmd /k "npm run dev"
cd ..
timeout /t 2 /nobreak >nul

REM Start Dashboard Microfrontend
echo 🔄 Starting Dashboard MF on port 3002...
cd dashboard-mf
start "Dashboard MF" cmd /k "npm run dev"
cd ..
timeout /t 2 /nobreak >nul

REM Start Invoices Microfrontend
echo 🔄 Starting Invoices MF on port 3003...
cd invoices-mf
start "Invoices MF" cmd /k "npm run dev"
cd ..
timeout /t 2 /nobreak >nul

REM Start Factoring Microfrontend
echo 🔄 Starting Factoring MF on port 3004...
cd factoring-mf
start "Factoring MF" cmd /k "npm run dev"
cd ..
timeout /t 2 /nobreak >nul

REM Start Support Microfrontend
echo 🔄 Starting Support MF on port 3005...
cd support-mf
start "Support MF" cmd /k "npm run dev"
cd ..
timeout /t 2 /nobreak >nul

REM Start Config Microfrontend
echo 🔄 Starting Config MF on port 3006...
cd config-mf
start "Config MF" cmd /k "npm run dev"
cd ..
timeout /t 2 /nobreak >nul

REM Start Shell Application
echo 🔄 Starting Shell App on port 3000...
cd shell-app
start "Shell App" cmd /k "npm run dev"
cd ..

echo.
echo 🎉 All microfrontends started successfully!
echo.
echo 📋 Available URLs:
echo    🏠 Shell App:     http://localhost:3000
echo    🔐 Auth MF:       http://localhost:3001
echo    📊 Dashboard MF:  http://localhost:3002
echo    📄 Invoices MF:   http://localhost:3003
echo    💰 Factoring MF:  http://localhost:3004
echo    🎫 Support MF:    http://localhost:3005
echo    ⚙️  Config MF:     http://localhost:3006
echo.
echo 🔑 Default login credentials:
echo    Username: admin
echo    Password: admin
echo.
echo ℹ️  Each microfrontend runs in its own window
echo 🛑 Close individual windows to stop specific microfrontends
pause