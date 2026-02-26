export interface BoardStatusDTO {
  id: number;
  label: string;
}

export interface BoardLabelDTO {
  id: string;
  name: string;
  color?: string;
}

export interface BoardDTO {
  id: string;
  name: string;
  description?: string;
  statuses: BoardStatusDTO[];
  labels?: BoardLabelDTO[];
}

export interface GetBoardsResponse {
  boards: BoardDTO[];
}

export interface BoardTaskDTO {
  id: string;
  boardId?: string;
  title: string;
  description?: string;
  status: string;
  assigneeId?: string;
  labels?: string[];
}

export interface GetBoardResponse {
  board?: BoardDTO;
  statuses: BoardStatusDTO[];
  tasks: BoardTaskDTO[];
}

export interface CreateBoardDTO {
  name: string;
  description?: string;
  statuses: string[];
  labels?: string[];
}

export interface UpdateBoardDTO {
  name?: string;
  description?: string;
  statuses?: string[];
}

export interface CreateTaskDTO {
  boardId: string;
  title: string;
  description?: string;
  status: string;
  assigneeId?: string;
  labels?: string[];
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: string;
  assigneeId?: string;
  labels?: string[];
}

export interface CreateLabelDTO {
  name: string;
  color?: string;
}

export interface UpdateLabelDTO {
  name?: string;
  color?: string;
}

export interface UpdateTaskStatusDTO {
  status: string;
  position?: number;
}

export interface UpdateTaskStatusResponse {
  task: BoardTaskDTO;
}
