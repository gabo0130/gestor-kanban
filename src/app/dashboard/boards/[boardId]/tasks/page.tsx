"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBoard } from "@/apis/boards.api";
import { BoardTaskDTO } from "@/apis/interfaces/kanban.interface";
import { UserDTO } from "@/apis/interfaces/users.interface";
import { createTask, deleteTask, updateTask } from "@/apis/tasks.api";
import { getUsers } from "@/apis/users.api";
import { Button, Input, Spinner } from "@/components/atoms";
import { ProtectedRoute, RoleGuard } from "@/components/organisms";

type TaskFormValues = {
  title: string;
  description: string;
  status: string;
  assigneeId: string;
  labelsText: string;
};

type BoardStatusOption = {
  id: number;
  label: string;
  order: number;
};

const parseCsv = (value: string): string[] =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const getBoardId = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value ?? "";

export default function BoardTasksManagementPage() {
  const { boardId: rawBoardId } = useParams();
  const boardId = getBoardId(rawBoardId);

  const [boardTasks, setBoardTasks] = useState<BoardTaskDTO[]>([]);
  const [boardStatuses, setBoardStatuses] = useState<BoardStatusOption[]>([]);
  const [members, setMembers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const [taskValues, setTaskValues] = useState<TaskFormValues>({
    title: "",
    description: "",
    status: "",
    assigneeId: "",
    labelsText: "",
  });
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskValues, setEditingTaskValues] = useState<TaskFormValues>({
    title: "",
    description: "",
    status: "",
    assigneeId: "",
    labelsText: "",
  });

  const loadBoardDetails = useCallback(async () => {
    if (!boardId) {
      setBoardTasks([]);
      setBoardStatuses([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getBoard(boardId);
      setBoardTasks(response.tasks);

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
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  const loadMembers = useCallback(async () => {
    try {
      const response = await getUsers();
      setMembers(response.users.filter((item) => item.role === "Member"));
    } catch {
      setMembers([]);
    }
  }, []);

  useEffect(() => {
    void loadBoardDetails();
    void loadMembers();
  }, [loadBoardDetails, loadMembers]);

  const handleCreateTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await createTask({
        boardId,
        title: taskValues.title,
        description: taskValues.description || undefined,
        status: taskValues.status,
        assigneeId: taskValues.assigneeId || undefined,
        labels: parseCsv(taskValues.labelsText),
      });

      setTaskValues((prev) => ({ ...prev, title: "", description: "", labelsText: "" }));
      await loadBoardDetails();
    } catch {}
  };

  const startTaskEdit = (task: BoardTaskDTO) => {
    setEditingTaskId(task.id);
    setEditingTaskValues({
      title: task.title,
      description: task.description ?? "",
      status: task.status,
      assigneeId: task.assigneeId ?? "",
      labelsText: (task.labels ?? []).join(", "),
    });
  };

  const handleSaveTask = async (taskId: string) => {
    try {
      await updateTask(taskId, {
        title: editingTaskValues.title,
        description: editingTaskValues.description || undefined,
        status: editingTaskValues.status,
        assigneeId: editingTaskValues.assigneeId || undefined,
        labels: parseCsv(editingTaskValues.labelsText),
      });

      setEditingTaskId(null);
      await loadBoardDetails();
    } catch {}
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      await loadBoardDetails();
    } catch {}
  };

  return (
    <ProtectedRoute>
      <RoleGuard
        allowed={["Admin", "Manager"]}
        fallback={
          <div className="flex min-h-screen items-center justify-center p-6">
            <main className="w-full max-w-lg rounded-xl border border-foreground/15 p-6 text-center">
              <h1 className="mb-2 text-xl font-semibold">Permisos limitados</h1>
              <p className="text-sm opacity-80">Solo Admin o Manager pueden gestionar tareas.</p>
              <Link className="mt-4 inline-block underline" href="/dashboard">
                Volver al dashboard
              </Link>
            </main>
          </div>
        }
      >
        <div className="min-h-screen p-6">
          <main className="mx-auto w-full max-w-7xl space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">Gestión de tareas</h1>
              <div className="flex gap-3">
                <Link className="underline" href={`/dashboard/boards/${boardId}`}>
                 <Button variant="secondary"> Ver tablero</Button>
                </Link>
                <Link className="underline" href="/dashboard">
                  <Button variant="secondary">Dashboard</Button>
                </Link>
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

                <div className="flex w-full flex-col gap-1">
                  <label htmlFor="task-status" className="text-sm font-medium">
                    Estado
                  </label>
                  <select
                    id="task-status"
                    className="h-10 rounded-md border border-foreground/25 bg-background px-3 text-sm outline-none focus:border-foreground"
                    value={taskValues.status}
                    onChange={(event) =>
                      setTaskValues((prev) => ({
                        ...prev,
                        status: event.target.value,
                      }))
                    }
                    required
                  >
                    {boardStatuses.map((status) => (
                      <option key={status.id} value={status.label}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex w-full flex-col gap-1">
                  <label htmlFor="task-assignee" className="text-sm font-medium">
                    Asignar a miembro
                  </label>
                  <select
                    id="task-assignee"
                    className="h-10 rounded-md border border-foreground/25 bg-background px-3 text-sm outline-none focus:border-foreground"
                    value={taskValues.assigneeId}
                    onChange={(event) =>
                      setTaskValues((prev) => ({ ...prev, assigneeId: event.target.value }))
                    }
                  >
                    <option value="">Sin asignar</option>
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  name="task-labels"
                  label="Etiquetas (coma separada)"
                  value={taskValues.labelsText}
                  onChange={(event) =>
                    setTaskValues((prev) => ({ ...prev, labelsText: event.target.value }))
                  }
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

              {loading ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" />
                  <span className="text-sm opacity-80">Cargando tareas...</span>
                </div>
              ) : boardTasks.length === 0 ? (
                <p className="text-sm opacity-75">No hay tareas para este tablero.</p>
              ) : (
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
                          <div className="flex w-full flex-col gap-1">
                            <label className="text-sm font-medium">Estado</label>
                            <select
                              className="h-10 rounded-md border border-foreground/25 bg-background px-3 text-sm outline-none focus:border-foreground"
                              value={editingTaskValues.status}
                              onChange={(event) =>
                                setEditingTaskValues((prev) => ({
                                  ...prev,
                                  status: event.target.value,
                                }))
                              }
                            >
                              {boardStatuses.map((status) => (
                                <option key={status.id} value={status.label}>
                                  {status.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex w-full flex-col gap-1">
                            <label className="text-sm font-medium">Asignado a</label>
                            <select
                              className="h-10 rounded-md border border-foreground/25 bg-background px-3 text-sm outline-none focus:border-foreground"
                              value={editingTaskValues.assigneeId}
                              onChange={(event) =>
                                setEditingTaskValues((prev) => ({ ...prev, assigneeId: event.target.value }))
                              }
                            >
                              <option value="">Sin asignar</option>
                              {members.map((member) => (
                                <option key={member.id} value={member.id}>
                                  {member.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <Input
                            name={`edit-labels-${task.id}`}
                            value={editingTaskValues.labelsText}
                            onChange={(event) =>
                              setEditingTaskValues((prev) => ({ ...prev, labelsText: event.target.value }))
                            }
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
                          <div>
                            <p className="font-medium">{task.title}</p>
                            <p className="text-sm opacity-80">{task.description ?? "Sin descripción"}</p>
                            <p className="text-xs opacity-70">Estado: {task.status}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="secondary" onClick={() => startTaskEdit(task)}>
                              Editar
                            </Button>
                            <Button variant="secondary" onClick={() => handleDeleteTask(task.id)}>
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </main>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}