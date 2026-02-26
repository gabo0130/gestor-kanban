import { render, screen } from "@testing-library/react";
import { NavButtonLink } from "./NavButtonLink";

describe("NavButtonLink", () => {
  it("renders link and child text", () => {
    render(<NavButtonLink href="/dashboard">Ir al dashboard</NavButtonLink>);

    const link = screen.getByRole("link", { name: "Ir al dashboard" });
    const button = screen.getByRole("button", { name: "Ir al dashboard" });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/dashboard");
    expect(button).toHaveClass("border");
  });

  it("applies primary variant when provided", () => {
    render(
      <NavButtonLink href="/dashboard/boards/new" variant="primary">
        Crear tablero
      </NavButtonLink>
    );

    const button = screen.getByRole("button", { name: "Crear tablero" });
    expect(button).toHaveClass("bg-foreground");
  });

  it("applies custom class to link", () => {
    render(
      <NavButtonLink href="/dashboard/users" linkClassName="w-full">
        Gestionar usuarios
      </NavButtonLink>
    );

    expect(screen.getByRole("link", { name: "Gestionar usuarios" })).toHaveClass("w-full");
  });
});
