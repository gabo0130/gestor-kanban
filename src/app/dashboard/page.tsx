"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getBoards } from "@/apis/boards.api";
import { BoardDTO } from "@/apis/interfaces/kanban.interface";
import { Button } from "@/components/atoms";
import { ProtectedRoute, RoleGuard } from "@/components/organisms";
import { useAuth } from "@/contexts/auth-context";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [boards, setBoards] = useState<BoardDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBoards = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getBoards();
      setBoards(response.boards);
    } catch {
      setError("No se pudo cargar la lista de tableros.");
      setBoards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBoards();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <header className="border-b border-foreground/10 bg-background">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-xl font-semibold">Gestor Kanban</h1>
              <p className="text-sm opacity-70">Tableros asignados a {user?.name}</p>
            </div>

            <div className="flex items-center gap-2">
              <RoleGuard allowed={["Admin"]}>
                <Link href="/dashboard/users">
                  <Button variant="secondary">👥 Gestionar usuarios</Button>
                </Link>
              </RoleGuard>

              <RoleGuard allowed={["Admin"]}>
                <Link href="/dashboard/boards/new">
                  <Button variant="secondary">➕ Crear tablero</Button>
                </Link>
              </RoleGuard>

              <Button variant="secondary" onClick={logout}>
                Cerrar sesión
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl space-y-4 p-6">
          <section className="rounded-lg border border-foreground/10 bg-background p-4">
            <h2 className="text-lg font-semibold">Mis tableros</h2>
            <p className="mt-1 text-sm opacity-75">
              Selecciona un tablero para ver su kanban y administrar su contenido.
            </p>
          </section>

          <section className="rounded-lg border border-foreground/10 bg-background p-4">
            {loading ? <p className="text-sm opacity-70">Cargando tableros...</p> : null}

            {!loading && error ? (
              <div className="flex items-center justify-between gap-3 rounded-md border border-foreground/20 p-3">
                <p className="text-sm">{error}</p>
                <Button variant="secondary" onClick={loadBoards}>
                  Reintentar
                </Button>
              </div>
            ) : null}

            {!loading && !error ? (
              <div className="space-y-3">
                {boards.length === 0 ? (
                  <p className="text-sm opacity-75">No tienes tableros asignados todavía.</p>
                ) : (
                  boards.map((board) => (
                    <article
                      key={board.id}
                      className="flex flex-col justify-between gap-3 rounded-md border border-foreground/15 p-4 md:flex-row md:items-center"
                    >
                      <div>
                        <h3 className="font-medium">{board.name}</h3>
                        <p className="text-sm opacity-75">{board.description ?? "Sin descripción"}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Link href={`/dashboard/boards/${board.id}`}>
                          <Button variant="secondary">Abrir tablero</Button>
                        </Link>

                        <RoleGuard allowed={["Admin", "Manager"]}>
                          <Link href={`/dashboard/boards/${board.id}/tasks`}>
                            <Button variant="secondary">Gestionar tareas</Button>
                          </Link>
                        </RoleGuard>

                        <RoleGuard allowed={["Admin"]}>
                          <Link href={`/dashboard/boards/${board.id}/settings`}>
                            <Button variant="secondary">Configurar tablero</Button>
                          </Link>
                        </RoleGuard>
                      </div>
                    </article>
                  ))
                )}
              </div>
            ) : null}
          </section>

          <section className="rounded-lg border border-foreground/10 bg-background p-4">
            <h3 className="mb-2 text-sm font-medium">Información de sesión:</h3>
            <ul className="space-y-1 text-sm opacity-80">
              <li>Email: {user?.email ?? "-"}</li>
              <li>Rol: {user?.role ?? "-"}</li>
            </ul>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}