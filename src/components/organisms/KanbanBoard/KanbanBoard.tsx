"use client";

import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useMemo, useState } from "react";
import { KanbanColumn } from "@/components/molecules";
import {
  BoardStatusDefinition,
  KanbanTask,
} from "@/modules/tasks/types/kanban.types";
import { createBoardState, moveTask } from "@/modules/tasks/utils/kanban-state";

type KanbanBoardProps = {
  statuses: BoardStatusDefinition[];
  tasks: KanbanTask[];
  onTaskMove?: (params: {
    taskId: string;
    fromStatus: string;
    toStatus: string;
    destinationIndex: number;
  }) => void | Promise<void>;
};

export const KanbanBoard = ({ statuses, tasks, onTaskMove }: KanbanBoardProps) => {
  const initialBoardState = useMemo(
    () => createBoardState(statuses, tasks),
    [statuses, tasks]
  );

  const [board, setBoard] = useState(initialBoardState);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColumn = board.columns[source.droppableId];
    const movedTaskId = sourceColumn?.taskIds[source.index];

    setBoard((currentBoard) => moveTask(currentBoard, source, destination));

    if (movedTaskId && onTaskMove) {
      void onTaskMove({
        taskId: movedTaskId,
        fromStatus: source.droppableId,
        toStatus: destination.droppableId,
        destinationIndex: destination.index,
      });
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-max gap-4">
          {board.columnOrder.map((columnId) => {
            const column = board.columns[columnId];

            if (!column) {
              return null;
            }

            const columnTasks = column.taskIds
              .map((taskId) => board.tasks[taskId])
              .filter(Boolean);

            return (
              <KanbanColumn key={column.id} column={column} tasks={columnTasks} />
            );
          })}
        </div>
      </div>
    </DragDropContext>
  );
};
