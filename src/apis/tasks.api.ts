
import { apiClient } from "./client";
import {
  BoardTaskDTO,
  CreateTaskDTO,
  UpdateTaskDTO,
  UpdateTaskStatusDTO,
  UpdateTaskStatusResponse,
} from "./interfaces/kanban.interface";

export const createTask = async (data: CreateTaskDTO): Promise<BoardTaskDTO> => {
  const response = await apiClient.post<BoardTaskDTO>("/tasks", data);
  return response.data;
};

export const updateTask = async (
  taskId: string,
  data: UpdateTaskDTO
): Promise<BoardTaskDTO> => {
  const response = await apiClient.patch<BoardTaskDTO>(`/tasks/${taskId}`, data);
  return response.data;
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await apiClient.delete(`/tasks/${taskId}`);
};

export const updateTaskStatus = async (
  taskId: string,
  data: UpdateTaskStatusDTO
): Promise<UpdateTaskStatusResponse> => {
  try {
    const response = await apiClient.patch<UpdateTaskStatusResponse>(
      `/tasks/${taskId}/status`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating task status:", error);
    throw error;
  }
};
