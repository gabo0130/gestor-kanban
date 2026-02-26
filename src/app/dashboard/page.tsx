"use client";

import Link from "next/link";
import { ProtectedRoute } from "@/components/organisms";
import { RoleGuard } from "@/components/organisms";
import { Button } from "@/components/atoms";
import { useAuth } from "@/contexts/auth-context";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <header className="border-b border-foreground/10 bg-background">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-xl font-semibold">Gestor Kanban</h1>
              <p className="text-sm opacity-70">Bienvenido, {user?.name}</p>
            </div>
            <RoleGuard allowed={["Admin"]}>
              <Link href="/dashboard/users">
                <Button variant="secondary">👥 Gestionar usuarios</Button>
              </Link>
            </RoleGuard>
            <Button variant="secondary" onClick={logout}>
              Cerrar sesión
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-7xl p-6">
          <div className="rounded-lg border border-foreground/10 bg-background p-8 text-center">
            <h2 className="mb-2 text-2xl font-semibold">Dashboard</h2>
            <p className="opacity-80">Entraste al tablero.</p>

            <div className="mt-6 text-left">
              <h3 className="mb-2 font-medium">Información de sesión:</h3>
              <ul className="space-y-1 text-sm opacity-80">
                <li>Email: {user?.email}</li>
                <li>Role: {user?.role}</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
