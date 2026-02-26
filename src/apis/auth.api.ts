import { apiClient } from "./client";
import { LoginDTO, LoginResponse } from "./interfaces/login.interface";

export const login = async (data: LoginDTO): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};
