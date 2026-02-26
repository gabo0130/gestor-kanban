import { render, screen } from "@testing-library/react";
import { KanbanBoard } from "./KanbanBoard";

jest.mock("@hello-pangea/dnd", () => ({
  DragDropContext: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="drag-context">{children}</div>
  ),
}));

jest.mock("@/modules/tasks/utils/kanban-state", () => ({
  createBoardState: () => ({
    columnOrder: ["Todo", "Ghost"],
    columns: {
      Todo: { id: "Todo", title: "Todo", taskIds: ["1"] },
    },
    tasks: {
      "1": { id: "1", title: "Task 1", status: "Todo" },
    },
  }),
  moveTask: (board: unknown) => board,
}));

jest.mock("@/components/molecules/KanbanColumn/KanbanColumn", () => ({
  KanbanColumn: ({ column }: { column: { id: string; title: string } }) => (
    <section data-testid={`column-${column.id}`}>{column.title}</section>
  ),
}));

describe("KanbanBoard edge branches", () => {
  it("skips missing column entries from columnOrder", () => {
    render(<KanbanBoard statuses={[]} tasks={[]} />);

    expect(screen.getByTestId("column-Todo")).toBeInTheDocument();
    expect(screen.queryByTestId("column-Ghost")).not.toBeInTheDocument();
  });
});
