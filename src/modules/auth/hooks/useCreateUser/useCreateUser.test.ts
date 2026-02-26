import { act, renderHook } from "@testing-library/react";
import { AxiosError } from "axios";
import { useCreateUser } from "./useCreateUser";
import { createUser } from "@/apis/users.api";

jest.mock("@/apis/users.api", () => ({
  createUser: jest.fn(),
}));

describe("useCreateUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create user successfully", async () => {
    const user = { id: "1", name: "Ana", email: "ana@x.com", role: "member" };
    (createUser as jest.Mock).mockResolvedValue(user);

    const { result } = renderHook(() => useCreateUser());
    let response;

    await act(async () => {
      response = await result.current.createUserWithRole({
        name: "Ana",
        email: "ana@x.com",
        password: "Secret123*",
        role: "member",
      });
    });

    expect(response).toEqual({ data: user, error: null });
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("should map Axios error message", async () => {
    const axiosErr = new AxiosError("Bad request");
    (axiosErr as AxiosError & { response?: unknown }).response = {
      data: { message: "Correo duplicado" },
    } as unknown;

    (createUser as jest.Mock).mockRejectedValue(axiosErr);

    const { result } = renderHook(() => useCreateUser());
    let response;

    await act(async () => {
      response = await result.current.createUserWithRole({
        name: "Ana",
        email: "ana@x.com",
        password: "Secret123*",
        role: "member",
      });
    });

    expect(response).toEqual({ data: null, error: "Correo duplicado" });
    expect(result.current.error).toBe("Correo duplicado");
    expect(result.current.loading).toBe(false);
  });

  it("should use default message for non-Axios errors", async () => {
    (createUser as jest.Mock).mockRejectedValue(new Error("boom"));

    const { result } = renderHook(() => useCreateUser());
    let response;

    await act(async () => {
      response = await result.current.createUserWithRole({
        name: "Ana",
        email: "ana@x.com",
        password: "Secret123*",
        role: "member",
      });
    });

    expect(response).toEqual({ data: null, error: "No se pudo crear el usuario" });
    expect(result.current.error).toBe("No se pudo crear el usuario");
  });

  it("should use default message for Axios errors without backend message", async () => {
    const axiosErr = new AxiosError("Bad request");
    (axiosErr as AxiosError & { response?: unknown }).response = {
      data: {},
    } as unknown;

    (createUser as jest.Mock).mockRejectedValue(axiosErr);

    const { result } = renderHook(() => useCreateUser());
    let response;

    await act(async () => {
      response = await result.current.createUserWithRole({
        name: "Ana",
        email: "ana@x.com",
        password: "Secret123*",
        role: "member",
      });
    });

    expect(response).toEqual({ data: null, error: "No se pudo crear el usuario" });
  });
});
