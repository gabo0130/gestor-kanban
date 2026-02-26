"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createBoard } from "@/apis/boards.api";
import { Button, Input } from "@/components/atoms";
import { ProtectedRoute, RoleGuard } from "@/components/organisms";

const COMMON_BOARD_TEMPLATES = [
  {
    key: "software",
    name: "Desarrollo de Software",
    statuses: ["Backlog", "En progreso", "Code review", "QA", "Done"],
    labels: ["feature", "bug", "hotfix", "tech-debt"],
  },
  {
    key: "marketing",
    name: "Marketing & Contenido",
    statuses: ["Ideas", "Planificado", "En curso", "Aprobación", "Publicado"],
    labels: ["campaña", "social", "email", "seo"],
  },
  {
    key: "product",
    name: "Product Discovery",
    statuses: ["Ideas", "Research", "Definición", "Implementación", "Validación"],
    labels: ["ux", "impacto-alto", "quick-win", "experimento"],
  },
  {
    key: "toDo",
    name: "To Do List",
    statuses: ["Backlog", "To Do", "In Progress", "Done"],
    labels: ["task", "priority-high", "priority-medium", "priority-low"],
  },
];

type BoardFormValues = {
  name: string;
  description: string;
  statusesText: string;
  labelsText: string;
};

const parseCsv = (value: string): string[] =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export default function NewBoardPage() {
  const router = useRouter();
  const [values, setValues] = useState<BoardFormValues>({
    name: "",
    description: "",
    statusesText: "Backlog, En progreso, Done",
    labelsText: "feature, bug",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyTemplate = (templateKey: string) => {
    const template = COMMON_BOARD_TEMPLATES.find((item) => item.key === templateKey);

    if (!template) {
      return;
    }

    setValues({
      name: template.name,
      description: "",
      statusesText: template.statuses.join(", "),
      labelsText: template.labels.join(", "),
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      setSubmitting(true);
      const board = await createBoard({
        name: values.name,
        description: values.description || undefined,
        statuses: parseCsv(values.statusesText),
        labels: parseCsv(values.labelsText),
      });

      router.push(`/dashboard/boards/${board.id}/settings`);
    } catch {
      setError("No se pudo crear el tablero.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <RoleGuard
        allowed={["Admin"]}
        fallback={
          <div className="flex min-h-screen items-center justify-center p-6">
            <main className="w-full max-w-lg rounded-xl border border-foreground/15 p-6 text-center">
              <h1 className="mb-2 text-xl font-semibold">Acceso denegado</h1>
              <p className="text-sm opacity-80">Solo Admin puede crear tableros.</p>
              <Link className="mt-4 inline-block underline" href="/dashboard">
                Volver al dashboard
              </Link>
            </main>
          </div>
        }
      >
        <div className="min-h-screen p-6">
          <main className="mx-auto w-full max-w-4xl space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">Crear tablero</h1>
              <Link className="underline" href="/dashboard">
                Volver al dashboard
              </Link>
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <section className="rounded-lg border border-foreground/15 p-6">
              <h2 className="mb-3 text-lg font-medium">Plantillas comunes</h2>
              <div className="flex flex-wrap gap-2">
                {COMMON_BOARD_TEMPLATES.map((template) => (
                  <Button
                    key={template.key}
                    variant="secondary"
                    onClick={() => applyTemplate(template.key)}
                  >
                    Usar: {template.name}
                  </Button>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-foreground/15 p-6">
              <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
                <Input
                  name="board-name"
                  label="Nombre del tablero"
                  value={values.name}
                  onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
                  required
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
                  required
                />

                <Input
                  name="board-labels"
                  label="Etiquetas iniciales (coma separada)"
                  value={values.labelsText}
                  onChange={(event) =>
                    setValues((prev) => ({ ...prev, labelsText: event.target.value }))
                  }
                />

                <div className="md:col-span-2 flex gap-2">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Creando..." : "Crear tablero"}
                  </Button>
                  <Link href="/dashboard">
                    <Button variant="secondary" type="button">
                      Cancelar
                    </Button>
                  </Link>
                </div>
              </form>
            </section>
          </main>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}