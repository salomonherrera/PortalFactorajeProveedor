# TekProvider Development Guide

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

#### Windows:
```cmd
scripts\setup-dev.bat
```

#### Linux/Mac:
```bash
chmod +x scripts/setup-dev.sh
./scripts/setup-dev.sh
```

### Option 2: Manual Setup

1. **Install Prerequisites**
   - .NET 8 SDK
   - PostgreSQL 15+ or Docker

2. **Setup Database**
   ```bash
   # Using Docker (Recommended)
   docker-compose up -d postgres
   
   # Or install PostgreSQL locally and create:
   # Database: tekprovider_db
   # User: tekprovider
   # Password: admin123
   ```

3. **Build and Run**
   ```bash
   dotnet restore
   dotnet build
   cd TekProvider.Auth
   dotnet ef database update
   dotnet run
   ```

## 🧪 Testing the API

### 1. Swagger UI
- URL: `https://localhost:5001/swagger`
- Interactive API documentation
- Test endpoints directly

### 2. Login Test
```bash
curl -X POST "https://localhost:5001/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

### 3. Get User Info
```bash
curl -X GET "https://localhost:5001/api/auth/me" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🗄️ Database Management

### View Data
```sql
-- Connect to PostgreSQL
psql -h localhost -U tekprovider -d tekprovider_db

-- Check tables
\dt

-- View users
SELECT * FROM "Users";

-- View invoices
SELECT * FROM "Invoices";
```

### Reset Database
```bash
cd TekProvider.Auth
dotnet ef database drop
dotnet ef database update
```

## 🔧 Development Workflow

### 1. Adding New Entities
1. Create entity in `TekProvider.Shared/Entities/`
2. Add DbSet to `TekProviderDbContext`
3. Create migration: `dotnet ef migrations add AddNewEntity`
4. Update database: `dotnet ef database update`

### 2. Adding New DTOs
1. Create DTO in `TekProvider.Shared/DTOs/`
2. Add AutoMapper mapping
3. Update controllers

### 3. Adding New Controllers
1. Create controller in appropriate API project
2. Inject required services
3. Add Swagger documentation
4. Test with Swagger UI

## 🐳 Docker Development

### Start All Services
```bash
docker-compose up -d
```

### View Logs
```bash
docker-compose logs -f auth-api
```

### Rebuild Services
```bash
docker-compose build auth-api
docker-compose up -d auth-api
```

## 📊 Monitoring

### Health Checks
- Auth API: `https://localhost:5001/health`

### Database Connections
```bash
# Check PostgreSQL
docker exec -it tekprovider-postgres psql -U tekprovider -d tekprovider_db

# Check Redis
docker exec -it tekprovider-redis redis-cli
```

## 🔍 Debugging

### Common Issues

1. **Port Already in Use**
   ```bash
   # Find process using port 5001
   netstat -ano | findstr :5001
   # Kill process
   taskkill /PID <PID> /F
   ```

2. **Database Connection Failed**
   - Check PostgreSQL is running
   - Verify connection string
   - Check firewall settings

3. **Migration Errors**
   ```bash
   # Reset migrations
   dotnet ef migrations remove
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```

### Logging
- Logs are written to console
- Configure logging in `appsettings.json`
- Use structured logging with Serilog (future enhancement)

## 🚀 Next Development Phases

### Phase 2: Complete APIs
- [ ] TekProvider.Invoices
- [ ] TekProvider.Factoring  
- [ ] TekProvider.Reports
- [ ] TekProvider.Support
- [ ] TekProvider.Gateway

### Phase 3: React Microfrontends
- [ ] Shell application
- [ ] Auth microfrontend
- [ ] Dashboard microfrontend
- [ ] Invoice microfrontend
- [ ] Reports microfrontend

### Phase 4: Production Ready
- [ ] Unit tests
- [ ] Integration tests
- [ ] CI/CD pipeline
- [ ] Kubernetes deployment
- [ ] Monitoring & logging

## 📚 Resources

- [.NET 8 Documentation](https://docs.microsoft.com/en-us/dotnet/)
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)
- [ASP.NET Core Web API](https://docs.microsoft.com/en-us/aspnet/core/web-api/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)

---

Happy coding! 🎉