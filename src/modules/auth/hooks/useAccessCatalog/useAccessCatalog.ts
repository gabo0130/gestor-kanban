import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { getRolesCatalog } from "@/apis/access-control.api";
import { RoleCatalogDTO } from "@/apis/interfaces/access-control.interface";

type UseAccessCatalogResult = {
  roles: RoleCatalogDTO[];
  loading: boolean;
  error: string | null;
};

export const useAccessCatalog = (): UseAccessCatalogResult => {
  const [roles, setRoles] = useState<RoleCatalogDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getRolesCatalog();

        if (!mounted) {
          return;
        }

        const validRoles = response.roles.filter((role) => Boolean(role.key));
        setRoles(validRoles);
      } catch (err) {
        if (!mounted) {
          return;
        }

        const message =
          err instanceof AxiosError
            ? err.response?.data?.message || "No se pudo cargar el catálogo de roles"
            : "No se pudo cargar el catálogo de roles";

        setError(message);
        setRoles([]);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return { roles, loading, error };
};
