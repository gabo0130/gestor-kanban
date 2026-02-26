"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBoard } from "@/apis/boards.api";
import { BoardLabelDTO, BoardTaskDTO } from "@/apis/interfaces/kanban.interface";
import { UserDTO } from "@/apis/interfaces/users.interface";
import { createTask, deleteTask, updateTask } from "@/apis/tasks.api";
import { getUsers } from "@/apis/users.api";
import { Button, Input, NavButtonLink } from "@/components/atoms";
import {
  AccessGuardFallback,
  AssigneeSelect,
  AsyncListState,
  StatusSelect,
  TaskActions,
  TaskInfo,
  TaskLabelsSelector,
} from "@/components/molecules";
import { ProtectedRoute, RoleGuard } from "@/components/organisms";
import { useAuth } from "@/contexts/auth-context";

type TaskFormValues = {
  title: string;
  description: string;
  status: string;
  assigneeId: string;
  labels: string[];
};

type BoardStatusOption = {
  id: number;
  label: string;
  order: number;
};

const getBoardId = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value ?? "";

export default function BoardTasksManagementPage() {
  const { boardId: rawBoardId } = useParams();
  const boardId = getBoardId(rawBoardId);
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const canManageTasks = user?.role === "Admin" || user?.role === "Manager";

  const [boardTasks, setBoardTasks] = useState<BoardTaskDTO[]>([]);
  const [boardStatuses, setBoardStatuses] = useState<BoardStatusOption[]>([]);
  const [boardLabels, setBoardLabels] = useState<BoardLabelDTO[]>([]);
  const [members, setMembers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const [taskValues, setTaskValues] = useState<TaskFormValues>({
    title: "",
    description: "",
    status: "",
    assigneeId: "",
    labels: [],
  });
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskValues, setEditingTaskValues] = useState<TaskFormValues>({
    title: "",
    description: "",
    status: "",
    assigneeId: "",
    labels: [],
  });

  const loadBoardDetails = useCallback(async () => {
    if (!boardId || authLoading || !isAuthenticated || !canManageTasks) {
      setBoardTasks([]);
      setBoardStatuses([]);
      setBoardLabels([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getBoard(boardId);
      setBoardTasks(response.tasks);
      setBoardLabels(response.board?.labels ?? []);

      const nextStatuses: BoardStatusOption[] = response.statuses
        .map((status, index) => ({
          id: Number(status.id),
          label: status.label,
          order:
            typeof (status as { order?: number }).order === "number"
              ? (status as { order?: number }).order ?? index
              : index,
        }))
        .sort((left, right) => left.order - right.order);

      setBoardStatuses(nextStatuses);
      setTaskValues((prev) => ({
        ...prev,
        status: nextStatuses[0]?.label ?? "",
      }));
    } catch {
      setBoardTasks([]);
      setBoardStatuses([]);
      setBoardLabels([]);
    } finally {
      setLoading(false);
    }
  }, [authLoading, boardId, canManageTasks, isAuthenticated]);

  const loadMembers = useCallback(async () => {
    if (authLoading || !isAuthenticated || !canManageTasks) {
      setMembers([]);
      return;
    }

    try {
      const response = await getUsers();
      setMembers(response.users.filter((item) => item.role === "Member"));
    } catch {
      setMembers([]);
    }
  }, [authLoading, canManageTasks, isAuthenticated]);

  useEffect(() => {
    void loadBoardDetails();
    void loadMembers();
  }, [loadBoardDetails, loadMembers]);

  const handleCreateTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canManageTasks) {
      return;
    }

    try {
      await createTask({
        boardId,
        title: taskValues.title,
        description: taskValues.description || undefined,
        status: taskValues.status,
        assigneeId: taskValues.assigneeId || undefined,
        labels: taskValues.labels,
      });

      setTaskValues((prev) => ({ ...prev, title: "", description: "", labels: [] }));
      await loadBoardDetails();
    } catch {}
  };

  const startTaskEdit = (task: BoardTaskDTO) => {
    setEditingTaskId(task.id);
    setEditingTaskValues({
      title: task.title,
      description: task.description ?? "",
      status: task.status,
      assigneeId: task.assigneeId ? String(task.assigneeId) : "",
      labels: task.labels ?? [],
    });
  };

  const handleSaveTask = async (taskId: string) => {
    if (!canManageTasks) {
      return;
    }

    try {
      await updateTask(taskId, {
        title: editingTaskValues.title,
        description: editingTaskValues.description || undefined,
        status: editingTaskValues.status,
        assigneeId: editingTaskValues.assigneeId || undefined,
        labels: editingTaskValues.labels,
      });

      setEditingTaskId(null);
      await loadBoardDetails();
    } catch {}
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!canManageTasks) {
      return;
    }

    try {
      await deleteTask(taskId);
      await loadBoardDetails();
    } catch {}
  };

  const toggleCreateLabel = (labelName: string) => {
    setTaskValues((prev) => ({
      ...prev,
      labels: prev.labels.includes(labelName)
        ? prev.labels.filter((label) => label !== labelName)
        : [...prev.labels, labelName],
    }));
  };

  const toggleEditLabel = (labelName: string) => {
    setEditingTaskValues((prev) => ({
      ...prev,
      labels: prev.labels.includes(labelName)
        ? prev.labels.filter((label) => label !== labelName)
        : [...prev.labels, labelName],
    }));
  };

  const resolveAssigneeName = (task: BoardTaskDTO) => {
    if (task.assigneeName) {
      return task.assigneeName;
    }

    if (!task.assigneeId) {
      return "Sin asignar";
    }

    const assignee = members.find((member) => String(member.id) === String(task.assigneeId));
    return assignee?.name ?? `Usuario ${task.assigneeId}`;
  };

  return (
    <ProtectedRoute>
      <RoleGuard
        allowed={["Admin", "Manager"]}
        fallback={
          <AccessGuardFallback message="Solo Admin o Manager pueden gestionar tareas." />
        }
      >
        <div className="min-h-screen p-6">
          <main className="mx-auto w-full max-w-7xl space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">Gestión de tareas</h1>
              <div className="flex gap-3">
                <NavButtonLink href={`/dashboard/boards/${boardId}`} linkClassName="underline">
                  Ver tablero
                </NavButtonLink>
                <NavButtonLink href="/dashboard" linkClassName="underline">
                  Dashboard
                </NavButtonLink>
              </div>
            </div>
            <section className="rounded-lg border border-foreground/15 p-6">
              <h2 className="mb-3 text-lg font-medium">Crear tarea</h2>

              <form className="grid gap-3 md:grid-cols-2" onSubmit={handleCreateTask}>
                <Input
                  name="task-title"
                  label="Título"
                  value={taskValues.title}
                  onChange={(event) =>
                    setTaskValues((prev) => ({ ...prev, title: event.target.value }))
                  }
                  required
                />

                <Input
                  name="task-description"
                  label="Descripción"
                  value={taskValues.description}
                  onChange={(event) =>
                    setTaskValues((prev) => ({ ...prev, description: event.target.value }))
                  }
                />

                <StatusSelect
                  id="task-status"
                  value={taskValues.status}
                  options={boardStatuses}
                  required
                  onChange={(value) =>
                    setTaskValues((prev) => ({
                      ...prev,
                      status: value,
                    }))
                  }
                />

                <AssigneeSelect
                  id="task-assignee"
                  value={taskValues.assigneeId}
                  members={members}
                  onChange={(value) =>
                    setTaskValues((prev) => ({ ...prev, assigneeId: value }))
                  }
                />

                <TaskLabelsSelector
                  labels={boardLabels}
                  selectedLabels={taskValues.labels}
                  onToggle={toggleCreateLabel}
                />

                <div className="md:col-span-2">
                  <Button type="submit" disabled={!boardId || boardStatuses.length === 0}>
                    Crear tarea
                  </Button>
                </div>
              </form>
            </section>

            <section className="rounded-lg border border-foreground/15 p-6">
              <h2 className="mb-3 text-lg font-medium">Listado de tareas</h2>

              <AsyncListState
                loading={loading}
                isEmpty={boardTasks.length === 0}
                loadingText="Cargando tareas..."
                emptyText="No hay tareas para este tablero."
              />

              {!loading && boardTasks.length > 0 ? (
                <div className="space-y-3">
                  {boardTasks.map((task) => (
                    <div key={task.id} className="rounded-md border border-foreground/15 p-3">
                      {editingTaskId === task.id ? (
                        <div className="grid gap-2 md:grid-cols-2">
                          <Input
                            name={`edit-title-${task.id}`}
                            value={editingTaskValues.title}
                            onChange={(event) =>
                              setEditingTaskValues((prev) => ({ ...prev, title: event.target.value }))
                            }
                          />
                          <Input
                            name={`edit-description-${task.id}`}
                            value={editingTaskValues.description}
                            onChange={(event) =>
                              setEditingTaskValues((prev) => ({ ...prev, description: event.target.value }))
                            }
                          />
                          <StatusSelect
                            id={`edit-task-status-${task.id}`}
                            value={editingTaskValues.status}
                            options={boardStatuses}
                            onChange={(value) =>
                              setEditingTaskValues((prev) => ({
                                ...prev,
                                status: value,
                              }))
                            }
                          />
                          <AssigneeSelect
                            id={`edit-task-assignee-${task.id}`}
                            label="Asignado a"
                            value={editingTaskValues.assigneeId}
                            members={members}
                            onChange={(value) =>
                              setEditingTaskValues((prev) => ({ ...prev, assigneeId: value }))
                            }
                          />
                          <TaskLabelsSelector
                            labels={boardLabels}
                            selectedLabels={editingTaskValues.labels}
                            onToggle={toggleEditLabel}
                          />
                          <div className="flex gap-2 md:col-span-2">
                            <Button onClick={() => handleSaveTask(task.id)}>Guardar</Button>
                            <Button variant="secondary" onClick={() => setEditingTaskId(null)}>
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-3">
                          <TaskInfo
                            title={task.title}
                            description={task.description}
                            status={task.status}
                            assignee={resolveAssigneeName(task)}
                            labels={task.labels}
                          />
                          <TaskActions
                            onEdit={() => startTaskEdit(task)}
                            onDelete={() => handleDeleteTask(task.id)}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : null}
            </section>
          </main>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}