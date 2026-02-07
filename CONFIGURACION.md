# Guia de Configuracion - RifaApp

Esta guia detalla todas las configuraciones necesarias para poner en marcha la aplicacion.

## Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Base de Datos](#base-de-datos)
4. [Variables de Entorno](#variables-de-entorno)
5. [Instalacion Paso a Paso](#instalacion-paso-a-paso)
6. [Produccion](#produccion)

---

## Requisitos Previos

- **Node.js** 18.0 o superior
- **PostgreSQL** 14.0 o superior
- **npm** o **yarn**

---

## Estructura del Proyecto

El proyecto esta dividido en dos partes:

```
rifa-app/
├── src/                    # Frontend (Next.js)
├── backend/                # Backend (NestJS)
├── .env                    # Variables del frontend
└── package.json            # Dependencias del frontend
```

---

## Base de Datos

### Opcion 1: PostgreSQL Local

1. **Instalar PostgreSQL**:
   ```bash
   # macOS con Homebrew
   brew install postgresql@14
   brew services start postgresql@14

   # Ubuntu/Debian
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   ```

2. **Crear usuario y base de datos**:
   ```bash
   # Conectar a PostgreSQL
   psql -U postgres

   # Crear usuario
   CREATE USER rifa_user WITH PASSWORD 'rifa_password_123';

   # Crear base de datos
   CREATE DATABASE rifa_db OWNER rifa_user;

   # Salir
   \q
   ```

3. **Verificar conexion**:
   ```bash
   psql -h localhost -U rifa_user -d rifa_db
   ```

### Opcion 2: PostgreSQL en la Nube

Servicios recomendados (tienen tier gratuito):
- **Supabase**: https://supabase.com
- **Railway**: https://railway.app
- **Neon**: https://neon.tech
- **ElephantSQL**: https://elephantsql.com

Copia la URL de conexion proporcionada.

---

## Variables de Entorno

### Frontend (.env en la raiz)

```env
# ===========================================
# API BACKEND (NestJS)
# ===========================================
NEXT_PUBLIC_API_URL="http://localhost:4000/api"

# ===========================================
# APLICACION
# ===========================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Backend (backend/.env)

```env
# ===========================================
# BASE DE DATOS
# ===========================================
DATABASE_URL="postgresql://rifa_user:rifa_password_123@localhost:5432/rifa_db?schema=public"

# ===========================================
# JWT - AUTENTICACION
# ===========================================
# Secreto para firmar tokens JWT
# Generar con: openssl rand -base64 32
JWT_SECRET="tu-secreto-jwt-super-seguro"

# ===========================================
# CORS
# ===========================================
FRONTEND_URL="http://localhost:3000"

# ===========================================
# SERVER
# ===========================================
PORT=4000
```

### Generar JWT_SECRET Seguro

```bash
# Usando OpenSSL
openssl rand -base64 32

# O usando Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Instalacion Paso a Paso

### 1. Instalar Dependencias

```bash
# Frontend
cd rifa-app
npm install

# Backend
cd backend
npm install
```

### 2. Configurar Variables de Entorno

```bash
# Copiar ejemplos (o crear manualmente)
# Frontend
cp .env.example .env

# Backend
cp backend/.env.example backend/.env
```

Edita los archivos con tus valores.

### 3. Crear Tablas en la Base de Datos

```bash
cd backend
npm run db:push
```

### 4. Crear Usuario Admin y Datos de Prueba

```bash
cd backend
npm run db:seed
```

Esto crea:
- Usuario admin (admin@rifa.com / admin123)
- 2 rifas de ejemplo con numeros

### 5. Iniciar Servidores

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

El backend estara en: http://localhost:4000

**Terminal 2 - Frontend:**
```bash
npm run dev
```

El frontend estara en: http://localhost:3000

---

## Comandos Disponibles

### Frontend

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de produccion |
| `npm run start` | Iniciar produccion |
| `npm run lint` | Ejecutar linter |

### Backend

| Comando | Descripcion |
|---------|-------------|
| `npm run start:dev` | Desarrollo con hot reload |
| `npm run build` | Build de produccion |
| `npm run start:prod` | Iniciar produccion |
| `npm run db:push` | Sincronizar schema con BD |
| `npm run db:seed` | Crear datos de prueba |
| `npm run db:studio` | Abrir Prisma Studio (GUI) |

---

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
JWT_SECRET="secreto-muy-seguro-generado-con-openssl"
FRONTEND_URL="https://tu-app.com"
PORT=4000
```

### Seguridad

1. **JWT_SECRET**: Usa un secreto fuerte (minimo 32 caracteres)
2. **Credenciales Admin**: Cambia las credenciales por defecto
3. **CORS**: Configura FRONTEND_URL con tu dominio real

### Deploy

**Frontend (Vercel):**
1. Conecta tu repositorio en vercel.com
2. Configura las variables de entorno
3. Deploy automatico en cada push

**Backend (Railway/Render):**
1. Conecta tu repositorio
2. Configura las variables de entorno
3. El comando de inicio es `npm run start:prod`

---

## Checklist de Configuracion

- [ ] PostgreSQL instalado y corriendo
- [ ] Base de datos creada
- [ ] Usuario de BD creado con permisos
- [ ] `.env` del frontend configurado
- [ ] `backend/.env` configurado
- [ ] `npm run db:push` ejecutado en backend
- [ ] `npm run db:seed` ejecutado en backend
- [ ] Backend corriendo en puerto 4000
- [ ] Frontend corriendo en puerto 3000
- [ ] Probado login en `/login` con admin@rifa.com
- [ ] Probado acceso a `/admin`

---

## Solucion de Problemas

### Error: P1001 - Can't reach database server
- Verifica que PostgreSQL esta corriendo
- Verifica el DATABASE_URL en backend/.env
- Prueba la conexion: `psql -h localhost -U tu_usuario -d tu_db`

### Error: CORS
- Verifica FRONTEND_URL en backend/.env
- Debe coincidir exactamente con la URL del frontend

### Error: JWT Invalid
- Verifica JWT_SECRET en backend/.env
- Asegurate de que no haya espacios extra

### Error: Cannot connect to API
- Verifica que el backend esta corriendo en puerto 4000
- Verifica NEXT_PUBLIC_API_URL en .env del frontend

### Limpiar y reinstalar

```bash
# Frontend
rm -rf node_modules
npm install

# Backend
cd backend
rm -rf node_modules
npm install
npm run db:push
```
