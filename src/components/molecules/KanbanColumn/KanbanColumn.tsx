import { Draggable, Droppable } from "@hello-pangea/dnd";
import { TaskCard } from "@/components/atoms";
import { KanbanColumn as KanbanColumnType, KanbanTask } from "@/modules/tasks/types/kanban.types";

type KanbanColumnProps = {
  column: KanbanColumnType;
  tasks: KanbanTask[];
};

export const KanbanColumn = ({ column, tasks }: KanbanColumnProps) => {
  return (
    <section className="flex min-h-105 min-w-70 flex-col rounded-lg border border-foreground/10 bg-foreground/5 p-3 sm:min-w-80">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide">{column.title}</h3>
        <span className="rounded-full border border-foreground/20 px-2 py-0.5 text-xs opacity-80">
          {tasks.length}
        </span>
      </header>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex min-h-24 flex-1 flex-col gap-2 rounded-md p-1 transition-colors ${
              snapshot.isDraggingOver ? "bg-foreground/10" : ""
            }`}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(dragProvided, dragSnapshot) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                  >
                    <TaskCard task={task} dragging={dragSnapshot.isDragging} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </section>
  );
};
