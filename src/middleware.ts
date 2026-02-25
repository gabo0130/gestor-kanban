import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rutas que requieren autenticación
const protectedRoutes = ["/dashboard"];

// Rutas solo para usuarios no autenticados (login)
const authRoutes = ["/"];

export default function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  // Si está autenticado e intenta acceder a login, redirigir a dashboard
  if (authRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Si intenta acceder a ruta protegida sin token, redirigir a login
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
