import { render, screen } from "@testing-library/react";
import { AccessGuardFallback } from "./AccessGuardFallback";

describe("AccessGuardFallback", () => {
  it("renders default title and back link", () => {
    render(<AccessGuardFallback message="No tienes acceso" />);

    expect(screen.getByText("Permisos limitados")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: "Volver al dashboard" });
    expect(link).toHaveAttribute("href", "/dashboard");
  });

  it("renders custom title and back data", () => {
    render(
      <AccessGuardFallback
        title="Sin permisos"
        message="Solo admin"
        backHref="/"
        backLabel="Ir al inicio"
      />
    );

    expect(screen.getByText("Sin permisos")).toBeInTheDocument();
    expect(screen.getByText("Solo admin")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ir al inicio" })).toHaveAttribute("href", "/");
  });
});
