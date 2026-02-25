import { LoginForm } from "@/components/molecules";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <main className="w-full max-w-md rounded-xl border border-foreground/15 p-6">
        <h1 className="mb-1 text-2xl font-semibold">Iniciar sesión</h1>
        <p className="mb-6 text-sm opacity-80">Accede para gestionar tu tablero Kanban.</p>

        <LoginForm />
      </main>
    </div>
  );
}
