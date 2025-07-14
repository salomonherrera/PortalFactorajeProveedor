# TekProvider Microfrontends

## 🏗️ Arquitectura de Microfrontends con React

Este proyecto implementa una arquitectura de microfrontends moderna usando **Module Federation** de Webpack 5, permitiendo que cada módulo se desarrolle, despliegue y escale de forma independiente.

### 📁 Estructura del Proyecto

```
tekprovider-microfrontends/
├── shell-app/                 # 🏠 Aplicación contenedora principal
├── auth-mf/                   # 🔐 Microfrontend de autenticación
├── dashboard-mf/              # 📊 Microfrontend de dashboard
├── invoices-mf/               # 📄 Microfrontend de facturas
├── factoring-mf/              # 💰 Microfrontend de factoraje
├── support-mf/                # 🎫 Microfrontend de soporte
├── shared-components/         # 🧩 Librería de componentes compartidos
└── package.json               # 📦 Configuración de workspace
```

### 🚀 Tecnologías Utilizadas

- **React 18** con TypeScript
- **Vite** como bundler
- **Module Federation** para microfrontends
- **Tailwind CSS** para estilos
- **React Router** para navegación
- **React Hook Form** para formularios
- **Recharts** para gráficas
- **Lucide React** para iconos

### 🎯 Características Principales

#### **1. Shell Application (Puerto 3000)**
- ✅ **Contenedor principal** que orquesta todos los microfrontends
- ✅ **Routing centralizado** con React Router
- ✅ **Autenticación global** con Context API
- ✅ **Layout compartido** (Sidebar + Header)
- ✅ **Lazy loading** de microfrontends

#### **2. Shared Components Library**
- ✅ **Componentes reutilizables** (Button, Card, Modal, etc.)
- ✅ **Hooks personalizados** (useAuth, useApi, useLocalStorage)
- ✅ **Utilidades compartidas** (formatters, validators)
- ✅ **Tipos TypeScript** centralizados
- ✅ **Constantes de API** y rutas

#### **3. Auth Microfrontend (Puerto 3001)**
- ✅ **Login/Register** con validaciones
- ✅ **Integración con API** de autenticación
- ✅ **Diseño responsive** y moderno
- ✅ **Manejo de errores** robusto

#### **4. Dashboard Microfrontend (Puerto 3002)**
- ✅ **KPIs interactivos** con tendencias
- ✅ **Gráficas avanzadas** (Line, Bar, Pie)
- ✅ **Actividad reciente** en tiempo real
- ✅ **Responsive design** para móviles

#### **5. Invoices Microfrontend (Puerto 3003)**
- ✅ **CRUD completo** de facturas
- ✅ **Filtros avanzados** por estatus, fecha, cliente
- ✅ **Validaciones** en tiempo real
- ✅ **Exportación** de datos
- ✅ **Resumen estadístico** visual

#### **6. Factoring Microfrontend (Puerto 3004)**
- ✅ **Gestión de solicitudes** de factoraje
- ✅ **Selección múltiple** de facturas
- ✅ **Workflow completo** (crear → revisar → aprobar)
- ✅ **Dashboard de estatus** con métricas
- ✅ **Detalles financieros** completos

#### **7. Support Microfrontend (Puerto 3005)**
- ✅ **Sistema de tickets** completo
- ✅ **Gestión de notificaciones** en tiempo real
- ✅ **Prioridades y asignaciones** automáticas
- ✅ **Historial de actualizaciones** detallado
- ✅ **Dashboard de soporte** con métricas

### 🛠️ Instalación y Configuración

#### **Prerrequisitos**
- Node.js 18+
- npm 9+

#### **Instalación Rápida**
```bash
# Instalar todas las dependencias
npm run install:all

# Ejecutar todos los microfrontends
npm run dev
```

#### **Instalación Manual**
```bash
# 1. Instalar dependencias del workspace
npm install

# 2. Instalar dependencias de cada microfrontend
npm install --workspaces

# 3. Ejecutar en desarrollo
npm run dev
```

### 🌐 URLs de Desarrollo

- **Shell App**: http://localhost:3000
- **Auth MF**: http://localhost:3001
- **Dashboard MF**: http://localhost:3002
- **Invoices MF**: http://localhost:3003
- **Factoring MF**: http://localhost:3004
- **Support MF**: http://localhost:3005

### 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev                    # Ejecutar todos los microfrontends
npm run dev:shell             # Solo shell application
npm run dev:auth              # Solo auth microfrontend
npm run dev:dashboard         # Solo dashboard microfrontend
npm run dev:invoices          # Solo invoices microfrontend
npm run dev:factoring         # Solo factoring microfrontend
npm run dev:support           # Solo support microfrontend

# Construcción
npm run build                 # Construir todos los proyectos
npm run build --workspace=shell-app  # Construir proyecto específico

# Calidad de código
npm run lint                  # Linting en todos los proyectos
npm run test                  # Tests en todos los proyectos
```

### 🔐 Autenticación

El sistema de autenticación está centralizado en el **Shell App** y se comparte con todos los microfrontends:

```typescript
// Uso en cualquier microfrontend
import { useAuth } from '@tekprovider/shared-components'

const MyComponent = () => {
  const { user, login, logout, isLoading } = useAuth()
  
  // Lógica del componente
}
```

### 🎨 Componentes Compartidos

La librería de componentes compartidos incluye:

```typescript
import { 
  Button, 
  Card, 
  Input, 
  Modal, 
  KPICard,
  DataTable,
  StatusBadge,
  LoadingSpinner 
} from '@tekprovider/shared-components'
```

### 📊 Integración con APIs

Cada microfrontend se conecta a las APIs correspondientes:

```typescript
import { API_ENDPOINTS, useApi } from '@tekprovider/shared-components'

// Ejemplo de uso
const { data, loading, error } = useApi(API_ENDPOINTS.INVOICES)
```

### 🚀 Despliegue

#### **Desarrollo Local**
```bash
npm run dev
```

#### **Producción**
```bash
npm run build
# Los archivos se generan en dist/ de cada proyecto
```

#### **Docker (Próximamente)**
```bash
docker-compose up --build
```

### 🔄 Próximos Pasos

#### **FASE 5: Optimizaciones y Testing**
- [ ] **Testing**: Unit tests con Jest/Vitest
- [ ] **E2E Testing**: Cypress/Playwright
- [ ] **Performance**: Code splitting avanzado
- [ ] **PWA**: Service workers y offline support
- [ ] **Accessibility**: WCAG 2.1 compliance
- [ ] **Internationalization**: Multi-idioma

#### **FASE 6: DevOps**
- [ ] **CI/CD**: GitHub Actions/Azure DevOps
- [ ] **Docker**: Containerización completa
- [ ] **Kubernetes**: Orquestación en producción
- [ ] **Monitoring**: Logging y métricas
- [ ] **Security**: Auditorías y penetration testing

### 🐛 Troubleshooting

#### **Puerto en uso**
```bash
# Cambiar puerto en vite.config.ts
server: {
  port: 3001, // Cambiar por puerto disponible
  cors: true
}
```

#### **Problemas de CORS**
```bash
# Verificar que las APIs estén corriendo
# Auth API: https://localhost:5001
# Gateway: https://localhost:5000
```

#### **Module Federation**
```bash
# Limpiar cache si hay problemas
rm -rf node_modules/.vite
npm run dev
```

### 📞 Soporte

Para problemas o preguntas:
1. Revisar la documentación de Vite
2. Consultar la documentación de Module Federation
3. Verificar que las APIs estén funcionando

---

**¡Arquitectura de microfrontends lista para desarrollo!** 🎉

Ejecuta `npm run dev` y visita http://localhost:3000 para comenzar.