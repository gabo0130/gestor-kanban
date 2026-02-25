# Sistema de Autenticación y Rutas Privadas

## Arquitectura Implementada

### 1. Contexto de Autenticación (`AuthContext`)

**Ubicación:** `src/contexts/auth-context.tsx`

Proporciona estado global de autenticación para toda la aplicación.

#### Funcionalidades:
- **Persistencia automática**: Token y usuario se guardan en `localStorage` y cookies
- **Sincronización con Axios**: Configura automáticamente el header `Authorization: Bearer {token}`
- **Restauración de sesión**: Al recargar la página, recupera la sesión activa
- **Logout centralizado**: Limpia toda la información de sesión

#### Hook `useAuth()`:
```typescript
const { user, token, isAuthenticated, isLoading, login, logout } = useAuth();
```

- `user`: Datos del usuario autenticado (`{ id, name, email }`)
- `token`: JWT token actual
- `isAuthenticated`: Boolean indicando si hay sesión activa
- `isLoading`: Para mostrar spinner mientras carga sesión
- `login(response)`: Guardar sesión tras login exitoso
- `logout()`: Cerrar sesión y limpiar todo

---

### 2. Cliente API con Bearer Token Automático

**Ubicación:** `src/apis/client.ts`

El cliente Axios (`apiClient`) está configurado para:
- Inyectar automáticamente el token en todas las peticiones
- Interceptar errores 401/403 y hacer logout automático
- Limpiar cookies y localStorage si el token expira

**Uso en otros módulos:**
```typescript
import { apiClient } from "@/apis/client";

// El bearer token se añade automáticamente
const response = await apiClient.get("/projects");
```

---

### 3. Middleware de Next.js

**Ubicación:** `src/middleware.ts`

Protege rutas a nivel de servidor usando cookies.

#### Comportamiento:
- **Rutas protegidas** (`/dashboard/*`): Redirige a `/` si no hay token
- **Rutas de auth** (`/`): Redirige a `/dashboard` si ya está autenticado
- Lee la cookie `auth_token` para validar

**Agregar nuevas rutas protegidas:**
```typescript
const protectedRoutes = ["/dashboard", "/projects", "/tasks"];
```

---

### 4. Componente `ProtectedRoute`

**Ubicación:** `src/components/organisms/ProtectedRoute/ProtectedRoute.tsx`

Guard de rutas del lado del cliente para proteger páginas.

**Uso:**
```tsx
import { ProtectedRoute } from "@/components/organisms";

export default function MyPage() {
  return (
    <ProtectedRoute>
      {/* Contenido solo visible para usuarios autenticados */}
    </ProtectedRoute>
  );
}
```

Muestra un spinner mientras valida la sesión y redirige a login si no está autenticado.

---

### 5. Flujo de Login

**LoginForm** (`src/components/molecules/LoginForm/LoginForm.tsx`):

1. El usuario ingresa email y password
2. Se llama a `useLogin` que hace POST a `/auth/login`
3. Si es exitoso, se guarda la sesión con `setAuthSession(response)`
4. Automáticamente se configura:
   - Token en `localStorage` y cookie
   - Header `Authorization` en axios
   - Estado global `user` y `token`
5. Navega a `/dashboard`

---

### 6. Página Dashboard Protegida

**Ubicación:** `src/app/dashboard/page.tsx`

Ejemplo de página protegida que:
- Usa `<ProtectedRoute>` para proteger el acceso
- Muestra información del usuario autenticado con `useAuth()`
- Permite hacer logout con botón

---

## Guía de Uso Rápido

### Proteger una nueva ruta

1. **Agregar al middleware** (protección servidor):
```typescript
// src/middleware.ts
const protectedRoutes = ["/dashboard", "/mi-nueva-ruta"];
```

2. **Envolver la página** (protección cliente):
```tsx
// src/app/mi-nueva-ruta/page.tsx
import { ProtectedRoute } from "@/components/organisms";

export default function MiPagina() {
  return (
    <ProtectedRoute>
      {/* contenido */}
    </ProtectedRoute>
  );
}
```

### Acceder a datos del usuario

```tsx
import { useAuth } from "@/contexts/auth-context";

function Component() {
  const { user, isAuthenticated } = useAuth();
  
  return <div>Hola {user?.name}</div>;
}
```

### Hacer peticiones autenticadas

```typescript
import { apiClient } from "@/apis/client";

// El token se incluye automáticamente
const projects = await apiClient.get("/projects");
const newTask = await apiClient.post("/tasks", { title: "Mi tarea" });
```

### Cerrar sesión

```tsx
import { useAuth } from "@/contexts/auth-context";

function Header() {
  const { logout } = useAuth();
  
  return <button onClick={logout}>Salir</button>;
}
```

---

## Persistencia y Seguridad

### Almacenamiento:
- **localStorage**: `auth_token`, `auth_user` (restauración de sesión)
- **Cookie httpOnly=false**: `auth_token` (lectura por middleware)
- **Axios headers**: `Authorization: Bearer {token}` (peticiones API)

### Expiración:
- Cookie expira en 7 días
- Si el servidor devuelve 401/403, se limpia todo automáticamente

### Variables de entorno:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

## Próximos Pasos Sugeridos

1. **Refresh token**: Implementar renovación automática antes de expirar
2. **Roles y permisos**: Extender `AuthUser` con rol y crear guards por rol
3. **Validación de token**: Verificar validez del token en el servidor periódicamente
4. **SSR con sesión**: Usar cookies httpOnly y validar en `getServerSideProps`

---

## Estructura de Archivos Creados

```
src/
├── apis/
│   └── client.ts                    # Cliente axios con bearer automático
├── contexts/
│   └── auth-context.tsx            # Contexto global de auth
├── components/
│   ├── organisms/
│   │   └── ProtectedRoute/         # Guard de rutas cliente
│   └── molecules/
│       └── LoginForm/              # Formulario de login
├── app/
│   ├── providers.tsx               # Providers globales (Auth + UI)
│   └── dashboard/
│       └── page.tsx                # Página protegida ejemplo
└── middleware.ts                   # Middleware de Next.js
```
