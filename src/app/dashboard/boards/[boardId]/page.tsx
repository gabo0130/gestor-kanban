"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { Button, NavButtonLink } from "@/components/atoms";
import { ProtectedRoute, RoleGuard } from "@/components/organisms";
import { useAuth } from "@/contexts/auth-context";
import { useKanban } from "@/modules/tasks/hooks/useKanban/useKanban";

const KanbanBoard = dynamic(
  () =>
    import("@/components/organisms/KanbanBoard/KanbanBoard").then(
      (mod) => mod.KanbanBoard,
    ),
  { ssr: false },
);

const getBoardId = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : (value ?? "");

export default function BoardPage() {
  const { boardId: rawBoardId } = useParams();
  const boardId = getBoardId(rawBoardId);
  const { user, logout, isLoading: authLoading, isAuthenticated } = useAuth();
  const { statuses, tasks, loading, error, refresh, persistTaskStatus } =
    useKanban(boardId, !authLoading && isAuthenticated);

  const handleTaskMove = async (params: {
    taskId: string;
    toStatus: string;
    destinationIndex: number;
  }) => {
    const result = await persistTaskStatus(
      params.taskId,
      params.toStatus,
      params.destinationIndex,
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
              <h1 className="text-xl font-semibold">Tablero</h1>
              <p className="text-sm opacity-70">Usuario: {user?.name}</p>
            </div>

            <div className="flex items-center gap-2">
              <NavButtonLink href={`/dashboard`} linkClassName="underline">
                Volver al dashboard
              </NavButtonLink>

              <RoleGuard allowed={["Admin", "Manager"]}>
                <NavButtonLink
                  href={`/dashboard/boards/${boardId}/tasks`}
                  linkClassName="underline"
                >
                  Gestionar tareas
                </NavButtonLink>
              </RoleGuard>

              <RoleGuard allowed={["Admin"]}>
                <NavButtonLink
                  href={`/dashboard/boards/${boardId}/settings`}
                  linkClassName="underline"
                >
                  Configurar tablero
                </NavButtonLink>
              </RoleGuard>

              <Button variant="secondary" onClick={logout}>
                Cerrar sesión
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl space-y-4 p-6">
          <section className="rounded-lg border border-foreground/10 bg-background p-4">
            <h2 className="text-lg font-semibold">Kanban</h2>
            <p className="mt-1 text-sm opacity-75">
              Arrastra y suelta tareas entre estados.
            </p>
          </section>

          <section className="rounded-lg border border-foreground/10 bg-background p-4">
            {loading ? (
              <p className="text-sm opacity-70">Cargando tablero...</p>
            ) : null}

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
        </main>
      </div>
    </ProtectedRoute>
  );
}
