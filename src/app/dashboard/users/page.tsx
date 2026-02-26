"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { getUsers, updateUser } from "@/apis/users.api";
import { Button, Input, Spinner } from "@/components/atoms";
import { ProtectedRoute, RoleGuard } from "@/components/organisms";
import { useCreateUser } from "@/modules/auth/hooks/useCreateUser/useCreateUser";
import { useAccessCatalog } from "@/modules/auth/hooks/useAccessCatalog/useAccessCatalog";
import { UserDTO } from "@/apis/interfaces/users.interface";
import { UserRole } from "@/modules/auth/types/auth.types";

type CreateValues = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

type EditValues = {
  name: string;
  email: string;
  role: UserRole;
};

export default function UsersManagementPage() {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);

  const { roles, loading: loadingRoles, error: rolesError } = useAccessCatalog();
  const { createUserWithRole, loading: creatingUser } = useCreateUser();

  const [createValues, setCreateValues] = useState<CreateValues>({
    name: "",
    email: "",
    password: "",
    role: "member",
  });
  const [createError, setCreateError] = useState<string | null>(null);

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<EditValues>({
    name: "",
    email: "",
    role: "member",
  });
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const selectedCreateRole = useMemo(
    () => roles.find((role) => role.key === createValues.role)?.key ?? roles[0]?.key ?? createValues.role,
    [createValues.role, roles]
  );

  const loadUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      setUsersError(null);

      const response = await getUsers();
      setUsers(response.users);
    } catch {
      setUsersError("No se pudieron cargar los usuarios.");
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleCreateUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setCreateError(null);

    const result = await createUserWithRole({
      ...createValues,
      role: selectedCreateRole,
    });

    if (result.error || !result.data) {
      setCreateError(result.error ?? "No se pudo crear el usuario.");
      return;
    }

    setCreateValues({ name: "", email: "", password: "", role: selectedCreateRole });
    await loadUsers();
  };

  const startEdit = (user: UserDTO) => {
    setEditError(null);
    setEditingUserId(user.id);
    setEditValues({
      name: user.name,
      email: user.email,
      role: (user.role ?? "member") as UserRole,
    });
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setEditError(null);
  };

  const saveEdit = async (userId: string) => {
    try {
      setSavingUserId(userId);
      setEditError(null);

      await updateUser(userId, {
        name: editValues.name,
        email: editValues.email,
        role: editValues.role,
      });

      setEditingUserId(null);
      await loadUsers();
    } catch {
      setEditError("No se pudo actualizar el usuario.");
    } finally {
      setSavingUserId(null);
    }
  };

  return (
    <ProtectedRoute>
      <RoleGuard
        allowed={["Admin"]}
        fallback={
          <div className="flex min-h-screen items-center justify-center p-6">
            <main className="w-full max-w-md rounded-xl border border-foreground/15 p-6 text-center">
              <h1 className="mb-2 text-xl font-semibold">Acceso restringido</h1>
              <p className="text-sm opacity-80">Solo administradores pueden gestionar usuarios.</p>
              <Link className="mt-4 inline-block underline" href="/dashboard">
                Volver al tablero
              </Link>
            </main>
          </div>
        }
      >
        <div className="min-h-screen p-6">
          <main className="mx-auto w-full max-w-6xl space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">Gestión de usuarios</h1>
              <Link className="underline" href="/dashboard">
                Volver al dashboard
              </Link>
            </div>

            <section className="rounded-lg border border-foreground/15 p-6">
              <h2 className="mb-4 text-lg font-medium">Crear usuario</h2>
              <form className="grid gap-4 md:grid-cols-2" onSubmit={handleCreateUser}>
                <Input
                  name="create-name"
                  label="Nombre"
                  placeholder="Nombre completo"
                  value={createValues.name}
                  onChange={(event) =>
                    setCreateValues((prev) => ({ ...prev, name: event.target.value }))
                  }
                  required
                />

                <Input
                  name="create-email"
                  type="email"
                  label="Correo"
                  placeholder="correo@empresa.com"
                  value={createValues.email}
                  onChange={(event) =>
                    setCreateValues((prev) => ({ ...prev, email: event.target.value }))
                  }
                  required
                />

                <Input
                  name="create-password"
                  type="password"
                  label="Contraseña"
                  placeholder="******"
                  value={createValues.password}
                  onChange={(event) =>
                    setCreateValues((prev) => ({ ...prev, password: event.target.value }))
                  }
                  required
                />

                <div className="flex w-full flex-col gap-1">
                  <label htmlFor="create-role" className="text-sm font-medium">
                    Rol
                  </label>
                  <select
                    id="create-role"
                    name="create-role"
                    className="h-10 rounded-md border border-foreground/25 bg-background px-3 text-sm outline-none focus:border-foreground"
                    value={selectedCreateRole}
                    onChange={(event) =>
                      setCreateValues((prev) => ({
                        ...prev,
                        role: event.target.value as UserRole,
                      }))
                    }
                    disabled={loadingRoles || roles.length === 0}
                    required
                  >
                    {roles.map((role) => (
                      <option key={role.id} value={role.key}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>

                {createError ? <p className="text-sm text-red-600">{createError}</p> : null}
                {rolesError ? <p className="text-sm text-red-600">{rolesError}</p> : null}

                <div className="md:col-span-2">
                  <Button
                    type="submit"
                    loading={creatingUser}
                    disabled={loadingRoles || roles.length === 0}
                  >
                    Crear usuario
                  </Button>
                </div>
              </form>
            </section>

            <section className="rounded-lg border border-foreground/15 p-6">
              <h2 className="mb-4 text-lg font-medium">Listado de usuarios</h2>

              {loadingUsers ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" />
                  <span className="text-sm opacity-80">Cargando usuarios...</span>
                </div>
              ) : usersError ? (
                <p className="text-sm text-red-600">{usersError}</p>
              ) : users.length === 0 ? (
                <p className="text-sm opacity-80">No hay usuarios registrados.</p>
              ) : (
                <div className="space-y-3">
                  {users.map((user) => {
                    const isEditing = editingUserId === user.id;
                    const isSaving = savingUserId === user.id;

                    return (
                      <div
                        key={user.id}
                        className="grid gap-3 rounded-md border border-foreground/15 p-4 md:grid-cols-[1fr_1fr_180px_auto]"
                      >
                        {isEditing ? (
                          <>
                            <Input
                              name={`edit-name-${user.id}`}
                              value={editValues.name}
                              onChange={(event) =>
                                setEditValues((prev) => ({ ...prev, name: event.target.value }))
                              }
                              required
                            />
                            <Input
                              name={`edit-email-${user.id}`}
                              type="email"
                              value={editValues.email}
                              onChange={(event) =>
                                setEditValues((prev) => ({ ...prev, email: event.target.value }))
                              }
                              required
                            />
                            <select
                              className="h-10 rounded-md border border-foreground/25 bg-background px-3 text-sm outline-none focus:border-foreground"
                              value={editValues.role}
                              onChange={(event) =>
                                setEditValues((prev) => ({
                                  ...prev,
                                  role: event.target.value as UserRole,
                                }))
                              }
                              disabled={loadingRoles || roles.length === 0}
                            >
                              {roles.map((role) => (
                                <option key={role.id} value={role.key}>
                                  {role.name}
                                </option>
                              ))}
                            </select>
                            <div className="flex gap-2">
                              <Button onClick={() => saveEdit(user.id)} loading={isSaving}>
                                Guardar
                              </Button>
                              <Button variant="secondary" onClick={cancelEdit} disabled={isSaving}>
                                Cancelar
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="text-sm">{user.name}</p>
                            <p className="text-sm">{user.email}</p>
                            <p className="text-sm">{user.role ?? "-"}</p>
                            <div>
                              <Button variant="secondary" onClick={() => startEdit(user)}>
                                Editar
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}

                  {editError ? <p className="text-sm text-red-600">{editError}</p> : null}
                </div>
              )}
            </section>
          </main>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
