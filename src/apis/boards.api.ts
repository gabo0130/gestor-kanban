import { apiClient } from "./client";
import {
  BoardDTO,
  BoardLabelDTO,
  CreateBoardDTO,
  CreateLabelDTO,
  GetBoardResponse,
  GetBoardsResponse,
  UpdateBoardDTO,
  UpdateLabelDTO,
} from "./interfaces/kanban.interface";

export const getBoards = async (): Promise<GetBoardsResponse> => {
  const response = await apiClient.get<GetBoardsResponse>("/boards");
  return response.data;
};

export const createBoard = async (data: CreateBoardDTO): Promise<BoardDTO> => {
  const response = await apiClient.post<BoardDTO>("/boards", data);
  return response.data;
};

export const updateBoard = async (
  boardId: string,
  data: UpdateBoardDTO
): Promise<BoardDTO> => {
  const response = await apiClient.patch<BoardDTO>(`/boards/${boardId}`, data);
  return response.data;
};

export const deleteBoard = async (boardId: string): Promise<void> => {
  await apiClient.delete(`/boards/${boardId}`);
};

export const getBoard = async (boardId: string): Promise<GetBoardResponse> => {
  const response = await apiClient.get<GetBoardResponse>(`/boards/${boardId}`);
  return response.data;
};

export const createBoardLabel = async (
  boardId: string,
  data: CreateLabelDTO
): Promise<BoardLabelDTO> => {
  const response = await apiClient.post<BoardLabelDTO>(`/boards/${boardId}/labels`, data);
  return response.data;
};

export const updateBoardLabel = async (
  boardId: string,
  labelId: string,
  data: UpdateLabelDTO
): Promise<BoardLabelDTO> => {
  const response = await apiClient.patch<BoardLabelDTO>(
    `/boards/${boardId}/labels/${labelId}`,
    data
  );
  return response.data;
};

export const deleteBoardLabel = async (boardId: string, labelId: string): Promise<void> => {
  await apiClient.delete(`/boards/${boardId}/labels/${labelId}`);
};
