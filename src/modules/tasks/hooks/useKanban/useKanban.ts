import { AxiosError } from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getBoard, updateTaskStatus } from "@/apis/tasks.api";
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

export const useKanban = (boardId: string): UseKanbanResult => {
  const [statuses, setStatuses] = useState<BoardStatusDefinition[]>([]);
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBoard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getBoard(boardId);

      setStatuses(data.statuses.map((status) => ({ id: status.id, label: status.label })));
      setTasks(
        data.tasks.map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
        }))
      );
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo cargar el tablero."));
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  const persistTaskStatus = useCallback(
    async (taskId: string, status: string, position?: number) => {
      try {
        await updateTaskStatus(taskId, { status, position });
        return { error: null };
      } catch (err) {
        const message = getErrorMessage(err, "No se pudo actualizar el estado.");
        setError(message);
        return { error: message };
      }
    },
    []
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
