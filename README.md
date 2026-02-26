# Gestor Kanban Multiusuario

Sistema de gestión de tareas estilo Kanban desarrollado con Next.js 16, React 19 y TypeScript.

## 🚀 Stack Tecnológico

### Frontend
- **Next.js 16** - Framework React con App Router
- **React 19** - UI library con React Compiler
- **TypeScript** - Tipado estático
- **Tailwind CSS v4** - Estilos utility-first
- **Axios** - Cliente HTTP
- **React Query** - Gestión de estado servidor (pendiente)

### Arquitectura
- **Atomic Design** - Componentes escalables (atoms, molecules, organisms, templates)
- **Feature-based modules** - Organización por funcionalidad (auth, projects, tasks)
- **Context API** - Estado global de UI y autenticación

---

## 📁 Estructura del Proyecto

```
src/
├── apis/              # Cliente HTTP y endpoints
├── app/               # Rutas de Next.js (App Router)
├── components/        # Componentes UI (Atomic Design)
│   ├── atoms/        # Botones, inputs, spinners
│   ├── molecules/    # Forms, modales
│   └── organisms/    # Guards de rutas, layouts
├── contexts/         # Contextos de React (auth, UI)
├── hooks/            # Custom hooks globales
├── modules/          # Módulos por funcionalidad
│   ├── auth/         # Autenticación
│   ├── projects/     # Gestión de proyectos
│   └── tasks/        # Gestión de tareas
└── middleware.ts     # Protección de rutas (Next.js)
```

---

## 🛠️ Instalación y Configuración

### 1. Clonar e instalar dependencias

```bash
git clone <repo-url>
cd gestor-kanban
npm install
```

### 2. Configurar variables de entorno

Crear archivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 3. Iniciar servidor de desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🔐 Sistema de Autenticación

### Características Implementadas
- ✅ Login con JWT
- ✅ Persistencia de sesión (localStorage + cookies)
- ✅ Bearer token automático en peticiones
- ✅ Rutas protegidas (middleware + guard cliente)
- ✅ Logout con limpieza completa
- ✅ Interceptor 401/403 con redirección

### Rutas
- `/` - Login (público)
- `/dashboard` - Dashboard (protegido)

### Documentación de Auth
Ver archivo **[AUTH_SYSTEM.md](AUTH_SYSTEM.md)** para detalles completos del sistema de autenticación.
---

## 📦 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm start` | Servidor de producción |
| `npm run lint` | Linter ESLint |
| `npm test` | Ejecutar tests (Jest) |

---

## 🎨 Componentes Reutilizables

### Átomos
- `Button` - Botón con variantes y estado de carga
- `Input` - Input con label y validación
- `Spinner` - Indicador de carga

### Moléculas
- `LoginForm` - Formulario de autenticación
- `InformativeModal` - Modal informativo

### Organismos
- `ProtectedRoute` - Guard de rutas protegidas

### Uso
```tsx
import { Button, Input } from "@/components/atoms";
import { LoginForm } from "@/components/molecules";
import { ProtectedRoute } from "@/components/organisms";
```

---

## 🌐 Estado Global

### Contexto de UI (`useUIState`)
```tsx
const { loading, setLoading, showErrorModal, closeModal } = useUIState();

// Mostrar loading global
setLoading(true);

// Mostrar modal de error
showErrorModal("Ocurrió un error", "Error");
```

### Contexto de Auth (`useAuth`)
```tsx
const { user, token, isAuthenticated, login, logout } = useAuth();

// Acceder a usuario actual
console.log(user?.name, user?.email);

// Cerrar sesión
logout();
```
## 📄 Licencia

Este proyecto está bajo la licencia MIT.

---

## 📚 Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Arquitectura del Sistema de Auth](AUTH_SYSTEM.md)
- [Guía de Implementación Backend](BACKEND_GUIDE.md)
