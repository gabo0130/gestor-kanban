import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CreateUserForm } from "./CreateUserForm";

const pushMock = jest.fn();
const setLoadingMock = jest.fn();
const showErrorModalMock = jest.fn();
const createUserWithRoleMock = jest.fn();
const mockUseAccessCatalog = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock("@/modules/auth/hooks/useCreateUser/useCreateUser", () => ({
  useCreateUser: () => ({
    createUserWithRole: createUserWithRoleMock,
    loading: false,
  }),
}));

jest.mock("@/modules/auth/hooks/useAccessCatalog/useAccessCatalog", () => ({
  useAccessCatalog: () => mockUseAccessCatalog(),
}));

jest.mock("@/hooks/ui-state", () => ({
  useUIState: () => ({
    setLoading: setLoadingMock,
    showErrorModal: showErrorModalMock,
  }),
}));

describe("CreateUserForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAccessCatalog.mockReturnValue({
      roles: [{ id: "1", key: "member", name: "Member" }],
      loading: false,
      error: null,
    });
  });

  it("submits and redirects on success", async () => {
    createUserWithRoleMock.mockResolvedValue({
      data: { id: "1", name: "Ana", email: "ana@x.com", role: "member" },
      error: null,
    });

    render(<CreateUserForm />);

    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Ana" } });
    fireEvent.change(screen.getByLabelText("Correo"), {
      target: { value: "ana@x.com" },
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "Secret123*" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Crear usuario" }));

    await waitFor(() => {
      expect(createUserWithRoleMock).toHaveBeenCalledWith({
        name: "Ana",
        email: "ana@x.com",
        password: "Secret123*",
        role: "member",
      });
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });

    expect(setLoadingMock).toHaveBeenCalledWith(true);
    expect(setLoadingMock).toHaveBeenLastCalledWith(false);
  });

  it("shows error modal when creation fails", async () => {
    createUserWithRoleMock.mockResolvedValue({ data: null, error: "Correo duplicado" });

    render(<CreateUserForm />);

    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Ana" } });
    fireEvent.change(screen.getByLabelText("Correo"), {
      target: { value: "ana@x.com" },
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "Secret123*" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Crear usuario" }));

    await waitFor(() => {
      expect(showErrorModalMock).toHaveBeenCalledWith("Correo duplicado");
      expect(pushMock).not.toHaveBeenCalled();
    });
  });

  it("uses default error message when hook returns null error", async () => {
    createUserWithRoleMock.mockResolvedValue({ data: null, error: null });

    render(<CreateUserForm />);

    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Ana" } });
    fireEvent.change(screen.getByLabelText("Correo"), {
      target: { value: "ana@x.com" },
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "Secret123*" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Crear usuario" }));

    await waitFor(() => {
      expect(showErrorModalMock).toHaveBeenCalledWith("No se pudo crear el usuario.");
    });
  });

  it("shows roles loading error message", () => {
    mockUseAccessCatalog.mockReturnValue({
      roles: [],
      loading: false,
      error: "No se pudo cargar",
    });

    render(<CreateUserForm />);

    expect(screen.getByText("No se pudieron cargar los roles.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Crear usuario" })).toBeDisabled();
  });
});
