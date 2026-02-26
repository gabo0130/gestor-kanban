import { render, screen } from "@testing-library/react";
import { RoleGuard } from "./RoleGuard";

const mockUseAuth = jest.fn();

jest.mock("@/contexts/auth-context", () => ({
  useAuth: () => mockUseAuth(),
}));

describe("RoleGuard", () => {
  it("renders children when role is allowed", () => {
    mockUseAuth.mockReturnValue({ user: { role: "admin" } });

    render(
      <RoleGuard allowed={["admin"]} fallback={<div>Sin acceso</div>}>
        <div>Contenido privado</div>
      </RoleGuard>
    );

    expect(screen.getByText("Contenido privado")).toBeInTheDocument();
  });

  it("renders fallback when role is not allowed", () => {
    mockUseAuth.mockReturnValue({ user: { role: "member" } });

    render(
      <RoleGuard allowed={["admin"]} fallback={<div>Sin acceso</div>}>
        <div>Contenido privado</div>
      </RoleGuard>
    );

    expect(screen.getByText("Sin acceso")).toBeInTheDocument();
  });

  it("renders nothing when user has no role and fallback is not provided", () => {
    mockUseAuth.mockReturnValue({ user: null });

    const { container } = render(
      <RoleGuard allowed={["admin"]}>
        <div>Contenido privado</div>
      </RoleGuard>
    );

    expect(container).toBeEmptyDOMElement();
  });
});
