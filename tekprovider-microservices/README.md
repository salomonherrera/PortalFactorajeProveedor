# TekProvider Microservices - .NET Core Setup Guide

## 🏗️ Architecture Overview

This project implements a complete microservices architecture for TekProvider using .NET Core 8, Entity Framework Core, and supports both PostgreSQL and Oracle databases.

```
tekprovider-microservices/
├── TekProvider.Shared/          # Shared entities, DTOs, interfaces
├── TekProvider.Auth/            # ✅ Authentication microservice
├── TekProvider.Gateway/         # ✅ API Gateway (Ocelot)
├── TekProvider.Invoices/        # ✅ Invoice management
├── TekProvider.Factoring/       # ✅ Factoring requests
├── TekProvider.Support/         # ✅ Support tickets & notifications
└── TekProvider.sln              # Solution file
```

## ✅ **FASE 2 COMPLETADA: APIs Completas**

### **🎯 Microservicios Implementados:**

#### **1. TekProvider.Auth (Puerto 5001)**
- ✅ JWT Authentication completo
- ✅ Login/Register endpoints
- ✅ Token validation
- ✅ User management

#### **2. TekProvider.Invoices (Puerto 5002)**
- ✅ CRUD completo de facturas
- ✅ Filtros por estatus y fechas
- ✅ Validación de folios únicos
- ✅ Cálculos de totales

#### **3. TekProvider.Factoring (Puerto 5003)**
- ✅ Gestión de solicitudes de factoraje
- ✅ Asociación con múltiples facturas
- ✅ Workflow de aprobación/rechazo
- ✅ Cálculo de comisiones y anticipos

#### **4. TekProvider.Support (Puerto 5004)**
- ✅ Sistema de tickets de soporte
- ✅ Asignación automática de ejecutivos
- ✅ Gestión de notificaciones
- ✅ Estados y prioridades

#### **5. TekProvider.Gateway (Puerto 5000)**
- ✅ API Gateway con Ocelot
- ✅ Routing a todos los microservicios
- ✅ Autenticación centralizada
- ✅ CORS y middleware

## 🔧 Prerequisites

### Required Software
- **.NET 8 SDK** - [Download here](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Visual Studio 2022** or **VS Code** with C# extension
- **PostgreSQL 15+** - [Download here](https://www.postgresql.org/download/)
- **Oracle Database** (optional) - [Download here](https://www.oracle.com/database/technologies/oracle-database-software-downloads.html)

### Verify Installation
```bash
dotnet --version  # Should show 8.0.x
```

## 🚀 **Ejecutar Todos los Microservicios**

### **Opción 1: Scripts Automatizados**
```bash
# Windows
scripts\run-all-apis.bat

# Linux/Mac
chmod +x scripts/run-all-apis.sh
./scripts/run-all-apis.sh
```

### **Opción 2: Manual (5 terminales)**
```bash
# Terminal 1 - Auth API
cd TekProvider.Auth && dotnet run --urls="https://localhost:5001"

# Terminal 2 - Invoices API  
cd TekProvider.Invoices && dotnet run --urls="https://localhost:5002"

# Terminal 3 - Factoring API
cd TekProvider.Factoring && dotnet run --urls="https://localhost:5003"

# Terminal 4 - Support API
cd TekProvider.Support && dotnet run --urls="https://localhost:5004"

# Terminal 5 - API Gateway
cd TekProvider.Gateway && dotnet run --urls="https://localhost:5000"
```

### **URLs de las APIs:**
- **API Gateway**: `https://localhost:5000`
- **Auth API**: `https://localhost:5001/swagger`
- **Invoices API**: `https://localhost:5002/swagger`
- **Factoring API**: `https://localhost:5003/swagger`
- **Support API**: `https://localhost:5004/swagger`

## 🗄️ Database Setup

### PostgreSQL Setup
1. Install PostgreSQL
2. Create database:
```sql
CREATE DATABASE tekprovider_db;
CREATE USER tekprovider WITH PASSWORD 'admin123';
GRANT ALL PRIVILEGES ON DATABASE tekprovider_db TO tekprovider;
```

### Oracle Setup (Alternative)
1. Install Oracle Database
2. Create user:
```sql
CREATE USER tekprovider IDENTIFIED BY admin123;
GRANT CONNECT, RESOURCE, DBA TO tekprovider;
```

## 🚀 Local Development Setup

### 1. Clone and Restore
```bash
# Navigate to the project directory
cd tekprovider-microservices

# Restore all packages
dotnet restore

# Build the solution
dotnet build
```

### 2. Database Configuration

#### For PostgreSQL (Default):
Update `appsettings.json` in each API project:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=tekprovider_db;Username=tekprovider;Password=admin123"
  },
  "DatabaseProvider": "PostgreSQL"
}
```

#### For Oracle:
Use `appsettings.Oracle.json` or update connection string:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=localhost:1521/XE;User Id=tekprovider;Password=admin123;"
  },
  "DatabaseProvider": "Oracle"
}
```

### 3. Run Database Migrations
```bash
# From TekProvider.Auth directory
cd TekProvider.Auth
dotnet ef database update

# Repeat for other microservices when created
```

### 4. Run the Authentication API
```bash
cd TekProvider.Auth
dotnet run
```

The API will be available at:
- **HTTP**: `http://localhost:5000`
- **HTTPS**: `https://localhost:5001`
- **Swagger**: `https://localhost:5001/swagger`

## 📋 **Endpoints Principales**

### **🔐 Authentication API (`/api/auth`)**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user info

### **📄 Invoices API (`/api/invoices`)**
- `GET /api/invoices` - Get user invoices
- `POST /api/invoices` - Create invoice
- `PUT /api/invoices/{id}` - Update invoice
- `GET /api/invoices/status/{status}` - Filter by status
- `GET /api/invoices/total` - Get total amount

### **💰 Factoring API (`/api/factoring`)**
- `GET /api/factoring` - Get factoring requests
- `POST /api/factoring` - Create factoring request
- `POST /api/factoring/{id}/approve` - Approve request
- `POST /api/factoring/{id}/reject` - Reject request
- `GET /api/factoring/total` - Get total factoring amount

### **🎫 Support API (`/api/support`)**
- `GET /api/support/tickets` - Get user tickets
- `POST /api/support/tickets` - Create ticket
- `POST /api/support/tickets/{id}/close` - Close ticket
- `GET /api/notifications` - Get notifications
- `POST /api/notifications/{id}/read` - Mark as read

## 📋 Project Structure Details

### TekProvider.Shared
Contains shared components used across all microservices:
- **Entities**: Database models (User, Invoice, FactoringRequest, etc.)
- **DTOs**: Data Transfer Objects
- **Enums**: Status enumerations
- **Interfaces**: Repository and service contracts
- **Repositories**: Generic repository implementation

### TekProvider.Auth
Authentication microservice with:
- JWT token generation and validation
- User registration and login
- Password hashing with BCrypt
- Swagger documentation

## 🔑 API Endpoints

### Authentication API (`/api/auth`)
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/validate` - Token validation
- `GET /api/auth/me` - Get current user info

### Example Login Request:
```json
{
  "username": "admin",
  "password": "admin"
}
```

### Example Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "companyName": "Servicios Empresariales Demo S.A. de C.V.",
    "email": "admin@serviciosempresariales.com",
    "providerCode": "PROV-001234"
  },
  "message": "Login exitoso"
}
```

### **Ejemplo: Crear Factura**
```json
POST /api/invoices
{
  "folio": "F023",
  "clientName": "Empresa Cliente S.A.",
  "amount": 150000.00,
  "issueDate": "2024-01-15T00:00:00Z",
  "dueDate": "2024-02-15T00:00:00Z",
  "description": "Servicios de consultoría",
  "clientRFC": "ECL123456789"
}
```

### **Ejemplo: Crear Solicitud de Factoraje**
```json
POST /api/factoring
{
  "invoiceIds": [1, 2, 3],
  "notes": "Solicitud urgente para flujo de efectivo"
}
```

## 🧪 Testing

### Using Swagger UI
1. Run the API: `dotnet run`
2. Navigate to: `https://localhost:5001/swagger`
3. Test endpoints directly from the browser

### Using curl
```bash
# Login
curl -X POST "https://localhost:5001/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'

# Get user info (with token)
curl -X GET "https://localhost:5001/api/auth/me" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### **Flujo Completo de Testing**
```bash
# 1. Login y obtener token
TOKEN=$(curl -s -X POST "https://localhost:5001/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}' | jq -r '.token')

# 2. Crear factura
curl -X POST "https://localhost:5002/api/invoices" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"folio":"F999","clientName":"Test Client","amount":100000,"issueDate":"2024-01-15T00:00:00Z","dueDate":"2024-02-15T00:00:00Z"}'

# 3. Obtener facturas
curl -X GET "https://localhost:5002/api/invoices" \
  -H "Authorization: Bearer $TOKEN"

# 4. Crear solicitud de factoraje
curl -X POST "https://localhost:5003/api/factoring" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"invoiceIds":[1,2],"notes":"Test factoring request"}'
```

## 🔄 Next Steps

### ✅ Phase 2: Complete APIs - **COMPLETADO**
- ✅ TekProvider.Invoices
- ✅ TekProvider.Factoring  
- ✅ TekProvider.Support
- ✅ TekProvider.Gateway

### Phase 3: React Microfrontends
- [ ] Shell application with Module Federation
- [ ] Auth microfrontend (Login/Register)
- [ ] Dashboard microfrontend (KPIs y gráficas)
- [ ] Invoice microfrontend (CRUD facturas)
- [ ] Factoring microfrontend (Solicitudes)
- [ ] Support microfrontend (Tickets)
- [ ] Shared component library
- Docker containerization
- Kubernetes orchestration
- CI/CD pipelines

## 🎯 **Estado Actual del Proyecto**

✅ **COMPLETADO**: Backend completo con 5 microservicios
🔄 **SIGUIENTE**: React Microfrontends
📋 **PENDIENTE**: Testing y DevOps

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Failed
- Verify PostgreSQL/Oracle is running
- Check connection string format
- Ensure database and user exist

#### 2. Migration Errors
```bash
# Reset migrations
dotnet ef database drop
dotnet ef migrations remove
dotnet ef migrations add InitialCreate
dotnet ef database update
```

#### 3. JWT Token Issues
- Verify `JwtSettings:SecretKey` in appsettings.json
- Ensure key is at least 32 characters long

#### 4. CORS Errors
- Check CORS policy in Program.cs
- Verify frontend URL is allowed

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Entity Framework Core documentation
3. Check .NET Core 8 documentation
4. Review PostgreSQL/Oracle connection guides

## 🔐 Security Notes

- Change default JWT secret key in production
- Use environment variables for sensitive data
- Implement proper password policies
- Enable HTTPS in production
- Regular security updates

---

**Ready to start development!** 🚀

Run `dotnet run` in the TekProvider.Auth directory and visit `https://localhost:5001/swagger` to begin testing the API.