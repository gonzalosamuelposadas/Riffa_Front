# RifaApp - Aplicacion de Rifas

Aplicacion completa para gestionar rifas online con arquitectura separada Frontend/Backend.

## Stack Tecnologico

### Frontend
- **Next.js 16** con App Router
- **React 19**
- **Tailwind CSS 4**
- **React Query** para manejo de estado del servidor
- **Zustand** para estado global del carrito
- **React Hook Form + Zod** para formularios y validaciones

### Backend
- **NestJS 11** con arquitectura modular
- **Prisma ORM** para base de datos
- **PostgreSQL** como base de datos
- **JWT + Passport** para autenticacion
- **class-validator** para validacion de DTOs

## Caracteristicas

- Grilla interactiva de numeros con estados (disponible, vendido)
- Seleccion de numeros con limite configurable por rifa
- Panel de administracion protegido con JWT
- CRUD completo de rifas
- Registro de compradores con sus numeros
- Responsive design para movil y desktop

## Requisitos Previos

- Node.js 18+
- PostgreSQL 14+
- npm o yarn

## Estructura del Proyecto

```
rifa-app/
├── src/                    # Frontend Next.js
│   ├── app/                # Pages y layouts
│   ├── components/         # Componentes React
│   ├── contexts/           # Context providers (Auth)
│   ├── lib/                # Utilidades y servicios
│   ├── store/              # Estado global (Zustand)
│   └── types/              # Tipos TypeScript
├── backend/                # Backend NestJS
│   ├── src/
│   │   ├── auth/           # Modulo de autenticacion
│   │   ├── raffles/        # Modulo de rifas
│   │   ├── purchases/      # Modulo de compras
│   │   └── prisma/         # Servicio de Prisma
│   └── prisma/
│       └── schema.prisma   # Esquema de base de datos
└── .env                    # Variables de entorno frontend
```

## Instalacion

### 1. Clonar e instalar dependencias

```bash
# Instalar dependencias del frontend
cd rifa-app
npm install

# Instalar dependencias del backend
cd backend
npm install
```

### 2. Configurar variables de entorno

**Frontend (.env en la raiz):**
```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Backend (backend/.env):**
```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/rifa_db"
JWT_SECRET="tu-secreto-jwt-super-seguro"
FRONTEND_URL="http://localhost:3000"
PORT=4000
```

### 3. Configurar la base de datos

```bash
cd backend

# Crear las tablas
npm run db:push

# Poblar con datos de prueba (crea admin y rifas de ejemplo)
npm run db:seed
```

### 4. Iniciar los servidores

```bash
# Terminal 1 - Backend (puerto 4000)
cd backend
npm run start:dev

# Terminal 2 - Frontend (puerto 3000)
cd rifa-app
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Autenticacion
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| POST | `/api/auth/login` | Iniciar sesion |
| GET | `/api/auth/profile` | Obtener perfil (protegido) |
| GET | `/api/auth/session` | Verificar sesion |

### Rifas
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/raffles` | Listar rifas publicas |
| GET | `/api/raffles/admin` | Listar todas (protegido) |
| GET | `/api/raffles/:id` | Obtener rifa con numeros |
| POST | `/api/raffles` | Crear rifa (protegido) |
| PATCH | `/api/raffles/:id` | Actualizar rifa (protegido) |
| DELETE | `/api/raffles/:id` | Eliminar rifa (protegido) |

### Compras
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| POST | `/api/purchases` | Crear compra |
| GET | `/api/purchases` | Listar compras |
| GET | `/api/purchases/:id` | Obtener compra |
| GET | `/api/purchases/raffle/:raffleId` | Compras por rifa |

## Flujo de Compra

1. Usuario visita una rifa activa
2. Selecciona numeros disponibles
3. Hace clic en "Continuar"
4. Ingresa sus datos (nombre, email, telefono)
5. Confirma la compra
6. Los numeros se marcan como vendidos
7. Se registra la compra con los datos del comprador

## Credenciales por Defecto

Despues de ejecutar el seed:

- **Email:** admin@rifa.com
- **Password:** admin123

## Scripts Disponibles

### Frontend
```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de produccion
npm run start      # Iniciar produccion
npm run lint       # Ejecutar linter
```

### Backend
```bash
npm run start:dev  # Desarrollo con hot reload
npm run build      # Build de produccion
npm run start:prod # Iniciar produccion
npm run db:push    # Sincronizar schema con BD
npm run db:seed    # Poblar datos de prueba
npm run db:studio  # Abrir Prisma Studio
```

## Produccion

### Variables de Entorno

**Frontend:**
```env
NEXT_PUBLIC_API_URL="https://tu-api.com/api"
NEXT_PUBLIC_APP_URL="https://tu-app.com"
```

**Backend:**
```env
DATABASE_URL="postgresql://user:pass@host:5432/rifa_db_prod"
JWT_SECRET="secreto-muy-seguro-generado"
FRONTEND_URL="https://tu-app.com"
PORT=4000
```

### Deploy

- **Frontend:** Vercel, Netlify, Railway
- **Backend:** Railway, Render, DigitalOcean, AWS

## Licencia

MIT
