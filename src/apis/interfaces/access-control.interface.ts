import { UserRole } from "./login.interface";

export interface RoleCatalogDTO {
  id: string;
  key: UserRole;
  name: string;
}

export interface RolesCatalogResponse {
  roles: RoleCatalogDTO[];
}
