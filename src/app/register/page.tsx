import Link from "next/link";
import { CreateUserForm } from "@/components/molecules";
import { ProtectedRoute, RoleGuard } from "@/components/organisms";

export default function RegisterPage() {
  return (
    <ProtectedRoute>
      <RoleGuard
        allowed={["Admin"]}
        fallback={
          <div className="flex min-h-screen items-center justify-center p-6">
            <main className="w-full max-w-md rounded-xl border border-foreground/15 p-6 text-center">
              <h1 className="mb-2 text-xl font-semibold">Acceso restringido</h1>
              <p className="text-sm opacity-80">
                Solo administradores pueden crear nuevas cuentas.
              </p>
              <Link className="mt-4 inline-block underline" href="/dashboard">
                Volver al tablero
              </Link>
            </main>
          </div>
        }
      >
        <div className="flex min-h-screen items-center justify-center p-6">
          <main className="w-full max-w-md rounded-xl border border-foreground/15 p-6">
            <h1 className="mb-1 text-2xl font-semibold">Crear usuario</h1>
            <p className="mb-6 text-sm opacity-80">
              Crea una cuenta para un miembro del equipo.
            </p>

            <CreateUserForm />

            <p className="mt-4 text-center text-sm opacity-80">
              <Link className="underline" href="/dashboard">
                Volver al tablero
              </Link>
            </p>
          </main>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
