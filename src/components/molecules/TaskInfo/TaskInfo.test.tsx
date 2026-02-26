import { render, screen } from "@testing-library/react";
import { TaskInfo } from "./TaskInfo";

describe("TaskInfo", () => {
  it("renders fallback description and empty labels text", () => {
    render(
      <TaskInfo
        title="Implementar login"
        status="Todo"
        assignee="Ana"
      />
    );

    expect(screen.getByText("Implementar login")).toBeInTheDocument();
    expect(screen.getByText("Sin descripción")).toBeInTheDocument();
    expect(screen.getByText("Estado: Todo")).toBeInTheDocument();
    expect(screen.getByText("Asignado: Ana")).toBeInTheDocument();
    expect(screen.getByText("Etiquetas: Sin etiquetas")).toBeInTheDocument();
  });

  it("renders labels when provided", () => {
    render(
      <TaskInfo
        title="Task labels"
        description="Detalle"
        status="Done"
        assignee="Luis"
        labels={["frontend", "urgent"]}
      />
    );

    expect(screen.getByText("Detalle")).toBeInTheDocument();
    expect(screen.getByText("#frontend")).toBeInTheDocument();
    expect(screen.getByText("#urgent")).toBeInTheDocument();
  });
});
