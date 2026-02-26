import { createBoardState, moveTask } from "./kanban-state";
import { BoardStatusDefinition, KanbanTask } from "@/modules/tasks/types/kanban.types";

describe("kanban-state", () => {
  const statuses: BoardStatusDefinition[] = [
    { id: "Todo", label: "Todo" },
    { id: "Done", label: "Done" },
  ];

  const tasks: KanbanTask[] = [
    { id: "1", title: "T1", status: "Todo" },
    { id: "2", title: "T2", status: "Todo" },
    { id: "3", title: "T3", status: "Done" },
    { id: "4", title: "Ghost", status: "Unknown" },
  ];

  it("creates board state and ignores tasks with unknown status", () => {
    const board = createBoardState(statuses, tasks);

    expect(board.columnOrder).toEqual(["Todo", "Done"]);
    expect(board.columns.Todo.taskIds).toEqual(["1", "2"]);
    expect(board.columns.Done.taskIds).toEqual(["3"]);
    expect(board.tasks["4"]).toEqual({ id: "4", title: "Ghost", status: "Unknown" });
  });

  it("moves task inside same column", () => {
    const board = createBoardState(statuses, tasks);

    const nextBoard = moveTask(
      board,
      { droppableId: "Todo", index: 0 },
      { droppableId: "Todo", index: 1 }
    );

    expect(nextBoard.columns.Todo.taskIds).toEqual(["2", "1"]);
  });

  it("moves task across columns and updates status", () => {
    const board = createBoardState(statuses, tasks);

    const nextBoard = moveTask(
      board,
      { droppableId: "Todo", index: 1 },
      { droppableId: "Done", index: 1 }
    );

    expect(nextBoard.columns.Todo.taskIds).toEqual(["1"]);
    expect(nextBoard.columns.Done.taskIds).toEqual(["3", "2"]);
    expect(nextBoard.tasks["2"].status).toBe("Done");
  });

  it("returns original board when source/destination column does not exist", () => {
    const board = createBoardState(statuses, tasks);

    const nextBoard = moveTask(
      board,
      { droppableId: "Missing", index: 0 },
      { droppableId: "Todo", index: 0 }
    );

    expect(nextBoard).toBe(board);
  });

  it("returns original board when source index has no task in same column", () => {
    const board = createBoardState(statuses, tasks);

    const nextBoard = moveTask(
      board,
      { droppableId: "Todo", index: 99 },
      { droppableId: "Todo", index: 0 }
    );

    expect(nextBoard).toBe(board);
  });

  it("keeps task map when moved task entry is missing", () => {
    const board = createBoardState(statuses, tasks);
    const corruptedBoard = {
      ...board,
      tasks: {
        ...board.tasks,
      },
    };
    delete corruptedBoard.tasks["2"];

    const nextBoard = moveTask(
      corruptedBoard,
      { droppableId: "Todo", index: 1 },
      { droppableId: "Done", index: 1 }
    );

    expect(nextBoard.columns.Done.taskIds).toEqual(["3", "2"]);
    expect(nextBoard.tasks["2"]).toBeUndefined();
  });
});
