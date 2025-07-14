@echo off
echo 🚀 TekProvider Development Setup
echo ================================

REM Check if .NET is installed
dotnet --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ .NET SDK not found. Please install .NET 8 SDK first.
    echo    Download from: https://dotnet.microsoft.com/download/dotnet/8.0
    pause
    exit /b 1
)

echo ✅ .NET SDK found
dotnet --version

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Docker not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

echo ✅ Docker is running

REM Start PostgreSQL
echo ⚠️  Starting PostgreSQL with Docker...
docker-compose up -d postgres
echo ⏳ Waiting for PostgreSQL to be ready...
timeout /t 10 /nobreak >nul

echo ✅ PostgreSQL is ready

REM Restore packages
echo 📦 Restoring NuGet packages...
dotnet restore

REM Build solution
echo 🔨 Building solution...
dotnet build

REM Run migrations
echo 🗄️  Running database migrations...
cd TekProvider.Auth
dotnet ef database update
cd ..

echo ✅ Setup complete!
echo.
echo 🎯 Next steps:
echo    1. cd TekProvider.Auth
echo    2. dotnet run
echo    3. Open https://localhost:5001/swagger
echo.
echo 🔑 Default login credentials:
echo    Username: admin
echo    Password: admin
pause