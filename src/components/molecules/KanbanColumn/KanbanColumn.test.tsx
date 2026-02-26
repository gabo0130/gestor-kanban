import { render, screen } from "@testing-library/react";
import { KanbanColumn } from "./KanbanColumn";

let draggingOver = false;
let dragging = false;

jest.mock("@hello-pangea/dnd", () => ({
  Droppable: ({
    children,
    droppableId,
  }: {
    droppableId: string;
    children: (provided: any, snapshot: any) => React.ReactNode;
  }) =>
    children(
      {
        innerRef: jest.fn(),
        droppableProps: { "data-droppable-id": droppableId },
        placeholder: <div data-testid="placeholder" />,
      },
      { isDraggingOver: draggingOver }
    ),
  Draggable: ({
    children,
    draggableId,
  }: {
    draggableId: string;
    children: (provided: any, snapshot: any) => React.ReactNode;
  }) =>
    children(
      {
        innerRef: jest.fn(),
        draggableProps: { "data-draggable-id": draggableId },
        dragHandleProps: {},
      },
      { isDragging: dragging }
    ),
}));

jest.mock("@/components/atoms", () => ({
  TaskCard: ({
    task,
    dragging: itemDragging,
  }: {
    task: { title: string };
    dragging?: boolean;
  }) => <div>{`${task.title}-${itemDragging ? "drag" : "idle"}`}</div>,
}));

describe("KanbanColumn", () => {
  beforeEach(() => {
    draggingOver = false;
    dragging = false;
  });

  it("renders title, count and tasks", () => {
    render(
      <KanbanColumn
        column={{ id: "Todo", title: "Por hacer", taskIds: ["1"] }}
        tasks={[{ id: "1", title: "Task 1", status: "Todo" }]}
      />
    );

    expect(screen.getByText("Por hacer")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Task 1-idle")).toBeInTheDocument();
    expect(screen.getByTestId("placeholder")).toBeInTheDocument();
  });

  it("applies dragging-over style and passes dragging state", () => {
    draggingOver = true;
    dragging = true;

    render(
      <KanbanColumn
        column={{ id: "Done", title: "Done", taskIds: ["2"] }}
        tasks={[{ id: "2", title: "Task 2", status: "Done" }]}
      />
    );

    expect(screen.getByText("Task 2-drag")).toBeInTheDocument();
  });
});
