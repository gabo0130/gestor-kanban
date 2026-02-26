
export type UserRole = "Admin" | "Manager" | "Member" | (string & {});

export interface AuthUserDTO {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUserDTO;
}