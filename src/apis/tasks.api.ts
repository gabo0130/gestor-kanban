
import { apiClient } from "./client";
import {
  GetBoardResponse,
  UpdateTaskStatusDTO,
  UpdateTaskStatusResponse,
} from "./interfaces/kanban.interface";

export const getBoard = async (boardId: string): Promise<GetBoardResponse> => {
  try {
    const response = await apiClient.get<GetBoardResponse>(`/boards/${boardId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching board:", error);
    throw error;
  }
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
