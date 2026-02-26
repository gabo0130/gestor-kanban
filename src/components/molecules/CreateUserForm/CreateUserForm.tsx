"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/atoms";
import { useCreateUser } from "@/modules/auth/hooks/useCreateUser/useCreateUser";
import { useAccessCatalog } from "@/modules/auth/hooks/useAccessCatalog/useAccessCatalog";
import { useUIState } from "@/hooks/ui-state";
import { UserRole } from "@/modules/auth/types/auth.types";

type FormValues = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export const CreateUserForm = () => {
  const router = useRouter();
  const { createUserWithRole, loading } = useCreateUser();
  const { setLoading, showErrorModal } = useUIState();
  const { roles, loading: rolesLoading, error: rolesError } = useAccessCatalog();
  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    password: "",
    role: "Member",
  });
  const selectedRole =
    roles.find((role) => role.key === values.role)?.key ?? roles[0]?.key ?? values.role;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    const result = await createUserWithRole({
      ...values,
      role: selectedRole,
    });

    setLoading(false);

    if (result.error || !result.data) {
      showErrorModal(result.error ?? "No se pudo crear el usuario.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit}>
      <Input
        name="name"
        label="Nombre"
        placeholder="Nombre completo"
        value={values.name}
        onChange={(event) =>
          setValues((prev) => ({ ...prev, name: event.target.value }))
        }
        required
      />

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

      <div className="flex w-full flex-col gap-1">
        <label htmlFor="role" className="text-sm font-medium">
          Rol
        </label>
        <select
          id="role"
          name="role"
          className="h-10 rounded-md border border-foreground/25 bg-background px-3 text-sm outline-none focus:border-foreground"
          value={selectedRole}
          onChange={(event) =>
            setValues((prev) => ({
              ...prev,
              role: event.target.value as UserRole,
            }))
          }
          disabled={rolesLoading || roles.length === 0}
          required
        >
          {roles.map((role) => (
            <option key={role.id} value={role.key}>
              {role.name}
            </option>
          ))}
        </select>
        {rolesError ? (
          <span className="text-xs text-foreground/70">No se pudieron cargar los roles.</span>
        ) : null}
      </div>

      <Button
        type="submit"
        loading={loading}
        disabled={rolesLoading || roles.length === 0}
        className="w-full"
      >
        Crear usuario
      </Button>
    </form>
  );
};
