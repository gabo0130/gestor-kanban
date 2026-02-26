import { KanbanTask } from "@/modules/tasks/types/kanban.types";
import { TaskInfo } from "@/components/molecules";

type TaskCardProps = {
  task: KanbanTask;
  dragging?: boolean;
};

export const TaskCard = ({ task, dragging = false }: TaskCardProps) => {
  const assigneeText = task.assigneeName
    ? task.assigneeName
    : task.assigneeId
      ? `Usuario ${task.assigneeId}`
      : "Sin asignar";

  return (
    <article
      className={`rounded-md border border-foreground/15 bg-background p-3 shadow-sm transition-colors ${
        dragging ? "border-foreground/40" : ""
      }`}
    >
      <TaskInfo
        title={task.title}
        description={task.description}
        status={task.status}
        assignee={assigneeText}
        labels={task.labels}
      />
    </article>
  );
};
