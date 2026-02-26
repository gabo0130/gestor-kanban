"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  createBoardLabel,
  deleteBoard,
  deleteBoardLabel,
  getBoard,
  updateBoard,
  updateBoardLabel,
} from "@/apis/boards.api";
import { BoardLabelDTO } from "@/apis/interfaces/kanban.interface";
import { Button, Input, Spinner } from "@/components/atoms";
import { ProtectedRoute, RoleGuard } from "@/components/organisms";

type BoardValues = {
  name: string;
  description: string;
  statusesText: string;
};

type BoardStatusOption = {
  id: string;
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

export default function BoardSettingsPage() {
  const router = useRouter();
  const { boardId: rawBoardId } = useParams();
  const boardId = getBoardId(rawBoardId);

  const [values, setValues] = useState<BoardValues>({
    name: "",
    description: "",
    statusesText: "",
  });
  const [boardStatuses, setBoardStatuses] = useState<BoardStatusOption[]>([]);
  const [boardLabels, setBoardLabels] = useState<BoardLabelDTO[]>([]);
  const [newLabelName, setNewLabelName] = useState("");
  const [editingLabelId, setEditingLabelId] = useState<string | null>(null);
  const [editingLabelName, setEditingLabelName] = useState("");

  const [loading, setLoading] = useState(true);

  const loadBoardDetails = useCallback(async () => {
    if (!boardId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getBoard(boardId);

      const nextStatuses: BoardStatusOption[] = response.statuses
        .map((status, index) => ({
          id: String(status.id),
          label: status.label,
          order:
            typeof (status as { order?: number }).order === "number"
              ? (status as { order?: number }).order ?? index
              : index,
        }))
        .sort((left, right) => left.order - right.order);

      setBoardStatuses(nextStatuses);

      setValues({
        name: response.board?.name ?? "",
        description: response.board?.description ?? "",
        statusesText: nextStatuses.map((status) => status.label).join(", "),
      });
      setBoardLabels(response.board?.labels ?? []);
    } catch {
      setBoardStatuses([]);
      setBoardLabels([]);
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    void loadBoardDetails();
  }, [loadBoardDetails]);

  const handleUpdateBoard = async () => {
    try {
      await updateBoard(boardId, {
        name: values.name,
        description: values.description || undefined,
        statuses: parseCsv(values.statusesText),
      });
      await loadBoardDetails();
    } catch {}
  };

  const handleDeleteBoard = async () => {
    try {
      await deleteBoard(boardId);
      router.push("/dashboard");
    } catch {}
  };

  const handleCreateLabel = async () => {
    if (!newLabelName.trim()) {
      return;
    }

    try {
      await createBoardLabel(boardId, { name: newLabelName.trim() });
      setNewLabelName("");
      await loadBoardDetails();
    } catch {}
  };

  const handleSaveLabel = async (labelId: string) => {
    try {
      await updateBoardLabel(boardId, labelId, { name: editingLabelName });
      setEditingLabelId(null);
      setEditingLabelName("");
      await loadBoardDetails();
    } catch {}
  };

  const handleDeleteLabel = async (labelId: string) => {
    try {
      await deleteBoardLabel(boardId, labelId);
      await loadBoardDetails();
    } catch {}
  };

  return (
    <ProtectedRoute>
      <RoleGuard
        allowed={["Admin"]}
        fallback={
          <div className="flex min-h-screen items-center justify-center p-6">
            <main className="w-full max-w-lg rounded-xl border border-foreground/15 p-6 text-center">
              <h1 className="mb-2 text-xl font-semibold">Permisos limitados</h1>
              <p className="text-sm opacity-80">Solo Admin puede configurar tableros.</p>
              <Link className="mt-4 inline-block underline" href="/dashboard">
                Volver al dashboard
              </Link>
            </main>
          </div>
        }
      >
        <div className="min-h-screen p-6">
          <main className="mx-auto w-full max-w-5xl space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">Configuración del tablero</h1>
              <div className="flex gap-3">
                <Link className="underline" href={`/dashboard/boards/${boardId}`}>
                  <Button variant="secondary">Ver tablero</Button>
                </Link>
                <Link className="underline" href="/dashboard">
                  <Button variant="secondary">Dashboard</Button>
                </Link>
              </div>
            </div>
            <section className="rounded-lg border border-foreground/15 p-6">
              <h2 className="mb-3 text-lg font-medium">Datos del tablero</h2>

              {loading ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" />
                  <span className="text-sm opacity-80">Cargando configuración...</span>
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  <Input
                    name="board-name"
                    label="Nombre"
                    value={values.name}
                    onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
                  />

                  <Input
                    name="board-description"
                    label="Descripción"
                    value={values.description}
                    onChange={(event) =>
                      setValues((prev) => ({ ...prev, description: event.target.value }))
                    }
                  />

                  <Input
                    name="board-statuses"
                    label="Estados (coma separada)"
                    value={values.statusesText}
                    onChange={(event) =>
                      setValues((prev) => ({ ...prev, statusesText: event.target.value }))
                    }
                  />

                  {boardStatuses.length > 0 ? (
                    <div className="md:col-span-2 rounded-md border border-foreground/15 p-3">
                      <p className="mb-2 text-sm font-medium">Estados actuales</p>
                      <ul className="space-y-1 text-sm opacity-80">
                        {boardStatuses.map((status) => (
                          <li key={status.id}>
                            {status.order + 1}. {status.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  <div className="md:col-span-2 flex gap-2">
                    <Button onClick={handleUpdateBoard}>Guardar cambios</Button>
                    <Button variant="secondary" onClick={handleDeleteBoard}>
                      Eliminar tablero
                    </Button>
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-lg border border-foreground/15 p-6">
              <h2 className="mb-3 text-lg font-medium">Etiquetas</h2>

              <div className="mb-3 flex gap-2">
                <Input
                  name="new-label"
                  placeholder="Nueva etiqueta"
                  value={newLabelName}
                  onChange={(event) => setNewLabelName(event.target.value)}
                />
                <Button onClick={handleCreateLabel}>Crear etiqueta</Button>
              </div>

              <div className="space-y-2">
                {boardLabels.length === 0 ? (
                  <p className="text-sm opacity-75">No hay etiquetas para este tablero.</p>
                ) : (
                  boardLabels.map((label) => (
                    <div
                      key={label.id}
                      className="flex items-center justify-between rounded-md border border-foreground/15 p-3"
                    >
                      {editingLabelId === label.id ? (
                        <div className="flex w-full items-center gap-2">
                          <Input
                            name={`edit-label-${label.id}`}
                            value={editingLabelName}
                            onChange={(event) => setEditingLabelName(event.target.value)}
                          />
                          <Button onClick={() => handleSaveLabel(label.id)}>Guardar</Button>
                          <Button
                            variant="secondary"
                            onClick={() => {
                              setEditingLabelId(null);
                              setEditingLabelName("");
                            }}
                          >
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <>
                          <span>{label.name}</span>
                          <div className="flex gap-2">
                            <Button
                              variant="secondary"
                              onClick={() => {
                                setEditingLabelId(label.id);
                                setEditingLabelName(label.name);
                              }}
                            >
                              Editar
                            </Button>
                            <Button variant="secondary" onClick={() => handleDeleteLabel(label.id)}>
                              Eliminar
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
          </main>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}