import { render, screen } from "@testing-library/react";
import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("renders with default size", () => {
    render(<Spinner />);

    const spinner = screen.getByRole("status", { name: "Cargando" });
    expect(spinner).toHaveClass("h-8");
  });

  it("renders with small size", () => {
    render(<Spinner size="sm" />);

    const spinner = screen.getByRole("status", { name: "Cargando" });
    expect(spinner).toHaveClass("h-4");
  });
});
