import { UserRole } from "./login.interface";

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  role?: UserRole;
}

export interface UsersResponse {
  users: UserDTO[];
}
