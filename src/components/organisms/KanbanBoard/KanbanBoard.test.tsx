import { act, render, screen } from "@testing-library/react";
import { KanbanBoard } from "./KanbanBoard";
import { BoardStatusDefinition, KanbanTask } from "@/modules/tasks/types/kanban.types";

let latestOnDragEnd: ((result: any) => void) | undefined;

jest.mock("@hello-pangea/dnd", () => ({
  DragDropContext: ({ children, onDragEnd }: { children: React.ReactNode; onDragEnd: (result: any) => void }) => {
    latestOnDragEnd = onDragEnd;
    return <div data-testid="drag-drop-context">{children}</div>;
  },
}));

jest.mock("@/components/molecules/KanbanColumn/KanbanColumn", () => ({
  KanbanColumn: ({
    column,
    tasks,
  }: {
    column: { id: string; title: string };
    tasks: Array<{ id: string; title: string }>;
  }) => (
    <section data-testid={`column-${column.id}`}>
      <h3>{column.title}</h3>
      {tasks.map((task) => (
        <p key={task.id}>{task.title}</p>
      ))}
    </section>
  ),
}));

describe("KanbanBoard", () => {
  const statuses: BoardStatusDefinition[] = [
    { id: "Todo", label: "Todo" },
    { id: "Done", label: "Done" },
  ];

  const tasks: KanbanTask[] = [
    { id: "1", title: "Task 1", status: "Todo" },
    { id: "2", title: "Task 2", status: "Done" },
  ];

  beforeEach(() => {
    latestOnDragEnd = undefined;
  });

  it("renders columns and tasks", () => {
    render(<KanbanBoard statuses={statuses} tasks={tasks} />);

    expect(screen.getByTestId("column-Todo")).toBeInTheDocument();
    expect(screen.getByTestId("column-Done")).toBeInTheDocument();
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });

  it("calls onTaskMove when drag ends with valid destination", () => {
    const onTaskMove = jest.fn();

    render(<KanbanBoard statuses={statuses} tasks={tasks} onTaskMove={onTaskMove} />);

    act(() => {
      latestOnDragEnd?.({
        source: { droppableId: "Todo", index: 0 },
        destination: { droppableId: "Done", index: 1 },
      });
    });

    expect(onTaskMove).toHaveBeenCalledWith({
      taskId: "1",
      fromStatus: "Todo",
      toStatus: "Done",
      destinationIndex: 1,
    });
  });

  it("does not call onTaskMove when destination is missing", () => {
    const onTaskMove = jest.fn();

    render(<KanbanBoard statuses={statuses} tasks={tasks} onTaskMove={onTaskMove} />);

    act(() => {
      latestOnDragEnd?.({
        source: { droppableId: "Todo", index: 0 },
        destination: null,
      });
    });

    expect(onTaskMove).not.toHaveBeenCalled();
  });

  it("does not call onTaskMove when dropped in same position", () => {
    const onTaskMove = jest.fn();

    render(<KanbanBoard statuses={statuses} tasks={tasks} onTaskMove={onTaskMove} />);

    act(() => {
      latestOnDragEnd?.({
        source: { droppableId: "Todo", index: 0 },
        destination: { droppableId: "Todo", index: 0 },
      });
    });

    expect(onTaskMove).not.toHaveBeenCalled();
  });
});
