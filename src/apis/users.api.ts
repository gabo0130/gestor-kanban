import { apiClient } from "./client";
import {
  CreateUserDTO,
  UpdateUserDTO,
  UserDTO,
  UsersResponse,
} from "./interfaces/users.interface";

export const getUsers = async (): Promise<UsersResponse> => {
  const response = await apiClient.get<UsersResponse>("/users");
  return response.data;
};

export const getUserById = async (userId: string): Promise<UserDTO> => {
  const response = await apiClient.get<UserDTO>(`/users/${userId}`);
  return response.data;
};

export const createUser = async (data: CreateUserDTO): Promise<UserDTO> => {
  const response = await apiClient.post<UserDTO>("/users", data);
  return response.data;
};

export const updateUser = async (
  userId: string,
  data: UpdateUserDTO
): Promise<UserDTO> => {
  const response = await apiClient.patch<UserDTO>(`/users/${userId}`, data);
  return response.data;
};

export const deleteUser = async (userId: string): Promise<void> => {
  await apiClient.delete(`/users/${userId}`);
};
