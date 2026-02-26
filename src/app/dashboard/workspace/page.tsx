"use client";

import Link from "next/link";
import { ProtectedRoute, RoleGuard } from "@/components/organisms";

export default function WorkspacePage() {
  return (
    <ProtectedRoute>
      <RoleGuard
        allowed={["Admin", "Manager"]}
        fallback={
          <div className="flex min-h-screen items-center justify-center p-6">
            <main className="w-full max-w-lg rounded-xl border border-foreground/15 p-6 text-center">
              <h1 className="mb-2 text-xl font-semibold">Permisos limitados</h1>
              <p className="text-sm opacity-80">Tu rol no puede acceder a gestión avanzada.</p>
              <Link className="mt-4 inline-block underline" href="/dashboard">
                Volver al dashboard
              </Link>
            </main>
          </div>
        }
      >
        <div className="flex min-h-screen items-center justify-center p-6">
          <main className="w-full max-w-2xl rounded-xl border border-foreground/15 p-6">
            <h1 className="text-xl font-semibold">Gestión movida a nuevas rutas</h1>
            <p className="mt-2 text-sm opacity-80">
              Ahora la gestión está separada por tablero para simplificar navegación y permisos.
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-sm">
              <li>
                <Link className="underline" href="/dashboard">
                  Dashboard (lista de tableros)
                </Link>
              </li>
              <li>
                <Link className="underline" href="/dashboard/boards/new">
                  Crear tablero (Admin)
                </Link>
              </li>
              <li>Por cada tablero: vista kanban, tareas y configuración.</li>
            </ul>
          </main>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
