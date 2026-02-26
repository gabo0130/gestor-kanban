import { AxiosError } from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getBoard } from "@/apis/boards.api";
import { updateTaskStatus } from "@/apis/tasks.api";
import {
  BoardStatusDefinition,
  KanbanTask,
} from "@/modules/tasks/types/kanban.types";

type UseKanbanResult = {
  statuses: BoardStatusDefinition[];
  tasks: KanbanTask[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  persistTaskStatus: (
    taskId: string,
    status: string,
    position?: number
  ) => Promise<{ error: string | null }>;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message ?? fallback;
  }

  return fallback;
};

export const useKanban = (boardId: string, enabled = true): UseKanbanResult => {
  const [statuses, setStatuses] = useState<BoardStatusDefinition[]>([]);
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBoard = useCallback(async () => {
    if (!enabled || !boardId) {
      setStatuses([]);
      setTasks([]);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await getBoard(boardId);

      setStatuses(data.statuses.map((status) => ({ id: status.label, label: status.label })));
      setTasks(
        data.tasks.map((task) => ({
          id: String(task.id),
          title: task.title,
          description: task.description,
          status: task.status,
          assigneeId: task.assigneeId ? String(task.assigneeId) : undefined,
          assigneeName: task.assigneeName,
          labels: task.labels,
        }))
      );
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo cargar el tablero."));
    } finally {
      setLoading(false);
    }
  }, [boardId, enabled]);

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  const persistTaskStatus = useCallback(
    async (taskId: string, status: string, position?: number) => {
      if (!enabled) {
        return { error: "Sesión no disponible." };
      }

      try {
        await updateTaskStatus(taskId, { status, position });
        return { error: null };
      } catch (err) {
        const message = getErrorMessage(err, "No se pudo actualizar el estado.");
        setError(message);
        return { error: message };
      }
    },
    [enabled]
  );

  return useMemo(
    () => ({
      statuses,
      tasks,
      loading,
      error,
      refresh: fetchBoard,
      persistTaskStatus,
    }),
    [statuses, tasks, loading, error, fetchBoard, persistTaskStatus]
  );
};
