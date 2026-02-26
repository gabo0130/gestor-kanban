import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { LoginForm } from "./LoginForm";

const pushMock = jest.fn();
const loginHookMock = jest.fn();
const setAuthSessionMock = jest.fn();
const setLoadingMock = jest.fn();
const showErrorModalMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock("@/modules/auth/hooks/useLogin/useLogin", () => ({
  useLogin: () => ({
    login: loginHookMock,
    loading: false,
  }),
}));

jest.mock("@/contexts/auth-context", () => ({
  useAuth: () => ({
    login: setAuthSessionMock,
  }),
}));

jest.mock("@/hooks/ui-state", () => ({
  useUIState: () => ({
    setLoading: setLoadingMock,
    showErrorModal: showErrorModalMock,
  }),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("logs in and redirects on success", async () => {
    const response = {
      token: "jwt",
      user: { id: "1", name: "Admin", email: "admin@x.com", role: "admin" },
    };
    loginHookMock.mockResolvedValue({ data: response, error: null });

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("Correo"), {
      target: { value: "admin@x.com" },
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "Secret123*" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));

    await waitFor(() => {
      expect(loginHookMock).toHaveBeenCalledWith({
        email: "admin@x.com",
        password: "Secret123*",
      });
      expect(setAuthSessionMock).toHaveBeenCalledWith(response);
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });

    expect(setLoadingMock).toHaveBeenCalledWith(true);
    expect(setLoadingMock).toHaveBeenLastCalledWith(false);
  });

  it("shows error modal when login fails", async () => {
    loginHookMock.mockResolvedValue({ data: null, error: "Credenciales inválidas" });

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("Correo"), {
      target: { value: "admin@x.com" },
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "Secret123*" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));

    await waitFor(() => {
      expect(showErrorModalMock).toHaveBeenCalledWith("Credenciales inválidas");
      expect(setAuthSessionMock).not.toHaveBeenCalled();
      expect(pushMock).not.toHaveBeenCalled();
    });
  });

  it("uses default error message when hook returns null error", async () => {
    loginHookMock.mockResolvedValue({ data: null, error: null });

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("Correo"), {
      target: { value: "admin@x.com" },
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "Secret123*" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));

    await waitFor(() => {
      expect(showErrorModalMock).toHaveBeenCalledWith("No se pudo iniciar sesión.");
    });
  });
});
