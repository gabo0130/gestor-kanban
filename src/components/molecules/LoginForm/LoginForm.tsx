"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/atoms";
import { useLogin } from "@/modules/auth/hooks/useLogin/useLogin";
import { useUIState } from "@/hooks/ui-state";
import { useAuth } from "@/contexts/auth-context";

type FormValues = {
  email: string;
  password: string;
};

export const LoginForm = () => {
  const router = useRouter();
  const { login: loginHook, loading } = useLogin();
  const { login: setAuthSession } = useAuth();
  const { setLoading, showErrorModal } = useUIState();
  const [values, setValues] = useState<FormValues>({ email: "", password: "" });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    const result = await loginHook(values);

    setLoading(false);

    if (result.error || !result.data) {
      showErrorModal(result.error ?? "No se pudo iniciar sesión.");
      return;
    }

    // Guardar sesión en contexto (esto configura el token en axios y localStorage)
    setAuthSession(result.data);

    // Navegar a dashboard
    router.push("/dashboard");
  };

  return (
    <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit}>
      <Input
        name="email"
        type="email"
        label="Correo"
        placeholder="correo@empresa.com"
        value={values.email}
        onChange={(event) =>
          setValues((prev) => ({ ...prev, email: event.target.value }))
        }
        required
      />

      <Input
        name="password"
        type="password"
        label="Contraseña"
        placeholder="******"
        value={values.password}
        onChange={(event) =>
          setValues((prev) => ({ ...prev, password: event.target.value }))
        }
        required
      />

      <Button type="submit" loading={loading} className="w-full">
        Iniciar sesión
      </Button>
    </form>
  );
};