import Link from "next/link";

type AccessGuardFallbackProps = {
  title?: string;
  message: string;
  backHref?: string;
  backLabel?: string;
};

export const AccessGuardFallback = ({
  title = "Permisos limitados",
  message,
  backHref = "/dashboard",
  backLabel = "Volver al dashboard",
}: AccessGuardFallbackProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <main className="w-full max-w-lg rounded-xl border border-foreground/15 p-6 text-center">
        <h1 className="mb-2 text-xl font-semibold">{title}</h1>
        <p className="text-sm opacity-80">{message}</p>
        <Link className="mt-4 inline-block underline" href={backHref}>
          {backLabel}
        </Link>
      </main>
    </div>
  );
};