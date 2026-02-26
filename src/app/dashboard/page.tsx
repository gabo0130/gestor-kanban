"use client";

import Link from "next/link";
import { Button, KanbanBoard } from "@/components/atoms";
import { ProtectedRoute, RoleGuard } from "@/components/organisms";
import { useAuth } from "@/contexts/auth-context";
import { useKanban } from "@/modules/kanban/hooks/useKanban";

const DEFAULT_BOARD_ID = "default";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { statuses, tasks, loading, error, refresh, persistTaskStatus } =
    useKanban(DEFAULT_BOARD_ID);

  const handleTaskMove = async (params: {
    taskId: string;
    toStatus: string;
    destinationIndex: number;
  }) => {
    const result = await persistTaskStatus(
      params.taskId,
      params.toStatus,
      params.destinationIndex
    );

    if (result.error) {
      await refresh();
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <header className="border-b border-foreground/10 bg-background">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-xl font-semibold">Gestor Kanban</h1>
              <p className="text-sm opacity-70">Bienvenido, {user?.name}</p>
            </div>

            <div className="flex items-center gap-2">
              <RoleGuard allowed={["Admin"]}>
                <Link href="/dashboard/users">
                  <Button variant="secondary">👥 Gestionar usuarios</Button>
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
            <h2 className="text-lg font-semibold">Tablero de tareas</h2>
            <p className="mt-1 text-sm opacity-75">
              Arrastra y suelta tareas entre estados.
            </p>
          </section>

          <section className="rounded-lg border border-foreground/10 bg-background p-4">
            {loading ? <p className="text-sm opacity-70">Cargando tablero...</p> : null}

            {!loading && error ? (
              <div className="flex items-center justify-between gap-3 rounded-md border border-foreground/20 p-3">
                <p className="text-sm">{error}</p>
                <Button variant="secondary" onClick={refresh}>
                  Reintentar
                </Button>
              </div>
            ) : null}

            {!loading && !error ? (
              <KanbanBoard
                statuses={statuses}
                tasks={tasks}
                onTaskMove={handleTaskMove}
              />
            ) : null}
          </section>

          <section className="rounded-lg border border-foreground/10 bg-background p-4">
            <h3 className="mb-2 text-sm font-medium">Información de sesión:</h3>
            <ul className="space-y-1 text-sm opacity-80">
              <li>Email: {user?.email ?? "-"}</li>
              <li>ID: {user?.id ?? "-"}</li>
              <li>Rol: {user?.role ?? "-"}</li>
            </ul>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}