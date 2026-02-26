import { render, screen } from "@testing-library/react";
import { Input } from "./Input";

describe("Input", () => {
  it("renders label and input", () => {
    render(<Input name="email" label="Correo" placeholder="correo@x.com" />);

    expect(screen.getByLabelText("Correo")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("correo@x.com")).toBeInTheDocument();
  });

  it("renders error message when provided", () => {
    render(<Input name="email" error="Correo inválido" />);

    expect(screen.getByText("Correo inválido")).toBeInTheDocument();
  });
});
