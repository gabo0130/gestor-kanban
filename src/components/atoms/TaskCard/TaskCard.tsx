import { KanbanTask } from "@/modules/tasks/types/kanban.types";

type TaskCardProps = {
  task: KanbanTask;
  dragging?: boolean;
};

export const TaskCard = ({ task, dragging = false }: TaskCardProps) => {
  return (
    <article
      className={`rounded-md border border-foreground/15 bg-background p-3 shadow-sm transition-colors ${
        dragging ? "border-foreground/40" : ""
      }`}
    >
      <h4 className="text-sm font-medium">{task.title}</h4>
      {task.description ? (
        <p className="mt-1 text-xs opacity-75">{task.description}</p>
      ) : null}
    </article>
  );
};
