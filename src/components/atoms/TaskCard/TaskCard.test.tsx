import { render, screen } from "@testing-library/react";
import { TaskCard } from "./TaskCard";

jest.mock("@/components/molecules", () => ({
  TaskInfo: ({
    title,
    description,
    status,
    assignee,
    labels,
  }: {
    title: string;
    description?: string;
    status: string;
    assignee: string;
    labels?: string[];
  }) => (
    <div>
      <p>{title}</p>
      <p>{description ?? "no-desc"}</p>
      <p>{status}</p>
      <p>{assignee}</p>
      <p>{(labels ?? []).join(",")}</p>
    </div>
  ),
}));

describe("TaskCard", () => {
  it("shows assigneeName when available", () => {
    render(
      <TaskCard
        task={{
          id: "1",
          title: "Task",
          status: "Todo",
          assigneeName: "Ana",
          labels: ["frontend"],
        }}
      />
    );

    expect(screen.getByText("Ana")).toBeInTheDocument();
  });

  it("falls back to assigneeId and supports dragging style", () => {
    const { container } = render(
      <TaskCard
        task={{
          id: "2",
          title: "Task 2",
          status: "Done",
          assigneeId: "99",
        }}
        dragging
      />
    );

    expect(screen.getByText("Usuario 99")).toBeInTheDocument();
    expect(container.querySelector("article")).toHaveClass("border-foreground/40");
  });

  it("falls back to Sin asignar", () => {
    render(
      <TaskCard
        task={{
          id: "3",
          title: "Task 3",
          status: "Todo",
        }}
      />
    );

    expect(screen.getByText("Sin asignar")).toBeInTheDocument();
  });
});
