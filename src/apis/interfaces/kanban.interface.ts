export interface BoardStatusDTO {
  id: string;
  label: string;
}

export interface BoardTaskDTO {
  id: string;
  title: string;
  description?: string;
  status: string;
}

export interface GetBoardResponse {
  statuses: BoardStatusDTO[];
  tasks: BoardTaskDTO[];
}

export interface UpdateTaskStatusDTO {
  status: string;
  position?: number;
}

export interface UpdateTaskStatusResponse {
  task: BoardTaskDTO;
}
