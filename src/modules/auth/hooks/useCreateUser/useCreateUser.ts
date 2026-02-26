import { useState } from "react";
import { AxiosError } from "axios";
import { createUser } from "@/apis/users.api";
import { UserDTO } from "@/apis/interfaces/users.interface";
import { CreateUserInput } from "@/modules/auth/types/auth.types";

type CreateUserResult = {
  data: UserDTO | null;
  error: string | null;
};

export const useCreateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUserWithRole = async (
    data: CreateUserInput
  ): Promise<CreateUserResult> => {
    try {
      setLoading(true);
      setError(null);
      const response = await createUser(data);
      return { data: response, error: null };
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? err.response?.data?.message || "No se pudo crear el usuario"
          : "No se pudo crear el usuario";

      setError(message);
      return { data: null, error: message };
    } finally {
      setLoading(false);
    }
  };

  return { createUserWithRole, loading, error };
};
