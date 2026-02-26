import { fireEvent, render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children and handles click", () => {
    const onClick = jest.fn();

    render(<Button onClick={onClick}>Guardar</Button>);

    fireEvent.click(screen.getByRole("button", { name: "Guardar" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("shows loading state and disables button", () => {
    render(<Button loading>Guardar</Button>);

    const button = screen.getByRole("button", { name: "Cargando..." });
    expect(button).toBeDisabled();
  });

  it("applies secondary variant class", () => {
    render(<Button variant="secondary">Cancelar</Button>);

    expect(screen.getByRole("button", { name: "Cancelar" })).toHaveClass("border");
  });
});
