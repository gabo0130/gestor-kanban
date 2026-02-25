import {
  BoardStatusDefinition,
  KanbanBoardState,
  KanbanTask,
} from "@/modules/tasks/types/kanban.types";

export const createBoardState = (
  statuses: BoardStatusDefinition[],
  tasks: KanbanTask[]
): KanbanBoardState => {
  const columnOrder = statuses.map((status) => status.id);

  const columns = statuses.reduce<KanbanBoardState["columns"]>((acc, status) => {
    acc[status.id] = {
      id: status.id,
      title: status.label,
      taskIds: [],
    };
    return acc;
  }, {});

  const taskMap = tasks.reduce<KanbanBoardState["tasks"]>((acc, task) => {
    acc[task.id] = task;
    return acc;
  }, {});

  tasks.forEach((task) => {
    if (!columns[task.status]) {
      return;
    }
    columns[task.status].taskIds.push(task.id);
  });

  return {
    columnOrder,
    columns,
    tasks: taskMap,
  };
};

export const moveTask = (
  board: KanbanBoardState,
  source: { droppableId: string; index: number },
  destination: { droppableId: string; index: number }
): KanbanBoardState => {
  if (source.droppableId === destination.droppableId) {
    const column = board.columns[source.droppableId];

    if (!column) {
      return board;
    }

    const nextTaskIds = [...column.taskIds];
    const [movedTaskId] = nextTaskIds.splice(source.index, 1);

    if (!movedTaskId) {
      return board;
    }

    nextTaskIds.splice(destination.index, 0, movedTaskId);

    return {
      ...board,
      columns: {
        ...board.columns,
        [column.id]: {
          ...column,
          taskIds: nextTaskIds,
        },
      },
    };
  }

  const sourceColumn = board.columns[source.droppableId];
  const destinationColumn = board.columns[destination.droppableId];

  if (!sourceColumn || !destinationColumn) {
    return board;
  }

  const sourceTaskIds = [...sourceColumn.taskIds];
  const destinationTaskIds = [...destinationColumn.taskIds];
  const [movedTaskId] = sourceTaskIds.splice(source.index, 1);

  if (!movedTaskId) {
    return board;
  }

  destinationTaskIds.splice(destination.index, 0, movedTaskId);

  const movedTask = board.tasks[movedTaskId];

  return {
    ...board,
    columns: {
      ...board.columns,
      [sourceColumn.id]: {
        ...sourceColumn,
        taskIds: sourceTaskIds,
      },
      [destinationColumn.id]: {
        ...destinationColumn,
        taskIds: destinationTaskIds,
      },
    },
    tasks: movedTask
      ? {
          ...board.tasks,
          [movedTaskId]: {
            ...movedTask,
            status: destinationColumn.id,
          },
        }
      : board.tasks,
  };
};
