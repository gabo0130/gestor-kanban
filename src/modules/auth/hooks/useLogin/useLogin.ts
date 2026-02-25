import { useState } from "react";
import { AxiosError } from "axios";
import { login as loginApi } from "@/apis/auth.api";
import { LoginInput } from "@/modules/auth/types/auth.types";
import { LoginResponse } from "@/apis/interfaces/login.interface";

type LoginResult = {
  data: LoginResponse | null;
  error: string | null;
};

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginInput): Promise<LoginResult> => {
    try {
      setLoading(true);
      setError(null);
      const response = await loginApi(data);
      return { data: response, error: null };
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? err.response?.data?.message || "No se pudo iniciar sesión"
          : "No se pudo iniciar sesión";

      setError(message);
      return { data: null, error: message };
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};