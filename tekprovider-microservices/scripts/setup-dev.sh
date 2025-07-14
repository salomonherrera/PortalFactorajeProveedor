#!/bin/bash

echo "🚀 TekProvider Development Setup"
echo "================================"

# Check if .NET is installed
if ! command -v dotnet &> /dev/null; then
    echo "❌ .NET SDK not found. Please install .NET 8 SDK first."
    echo "   Download from: https://dotnet.microsoft.com/download/dotnet/8.0"
    exit 1
fi

echo "✅ .NET SDK found: $(dotnet --version)"

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432 &> /dev/null; then
    echo "⚠️  PostgreSQL not running. Starting with Docker..."
    docker-compose up -d postgres
    echo "⏳ Waiting for PostgreSQL to be ready..."
    sleep 10
fi

echo "✅ PostgreSQL is ready"

# Restore packages
echo "📦 Restoring NuGet packages..."
dotnet restore

# Build solution
echo "🔨 Building solution..."
dotnet build

# Run migrations
echo "🗄️  Running database migrations..."
cd TekProvider.Auth
dotnet ef database update
cd ..

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "   1. cd TekProvider.Auth"
echo "   2. dotnet run"
echo "   3. Open https://localhost:5001/swagger"
echo ""
echo "🔑 Default login credentials:"
echo "   Username: admin"
echo "   Password: admin"