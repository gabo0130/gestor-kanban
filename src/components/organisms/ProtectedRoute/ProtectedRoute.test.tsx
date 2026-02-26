import { render, screen, waitFor } from "@testing-library/react";
import { ProtectedRoute } from "./ProtectedRoute";

const replaceMock = jest.fn();
const mockUseAuth = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

jest.mock("@/contexts/auth-context", () => ({
  useAuth: () => mockUseAuth(),
}));

describe("ProtectedRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading spinner while auth is loading", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: true });

    render(
      <ProtectedRoute>
        <div>Contenido</div>
      </ProtectedRoute>
    );

    expect(screen.getByRole("status", { name: "Cargando" })).toBeInTheDocument();
  });

  it("renders children when authenticated", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, isLoading: false });

    render(
      <ProtectedRoute>
        <div>Contenido</div>
      </ProtectedRoute>
    );

    expect(screen.getByText("Contenido")).toBeInTheDocument();
  });

  it("redirects to login when not authenticated", async () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: false });

    const { container } = render(
      <ProtectedRoute>
        <div>Contenido</div>
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/");
    });

    expect(container).toBeEmptyDOMElement();
  });
});
