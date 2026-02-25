export type TaskStatus = string;

export type KanbanTask = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
};

export type KanbanColumn = {
  id: TaskStatus;
  title: string;
  taskIds: string[];
};

export type KanbanColumns = Record<string, KanbanColumn>;

export type KanbanTasks = Record<string, KanbanTask>;

export type KanbanBoardState = {
  columnOrder: string[];
  columns: KanbanColumns;
  tasks: KanbanTasks;
};

export type BoardStatusDefinition = {
  id: string;
  label: string;
};
