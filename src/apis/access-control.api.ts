import { apiClient } from "./client";
import { RolesCatalogResponse } from "./interfaces/access-control.interface";

export const getRolesCatalog = async (): Promise<RolesCatalogResponse> => {
  const response = await apiClient.get<RolesCatalogResponse>("/roles");
  return response.data;
};
