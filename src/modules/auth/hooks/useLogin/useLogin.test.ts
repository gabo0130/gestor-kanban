import { renderHook, act } from "@testing-library/react";
import { AxiosError } from "axios";
import { useLogin } from "./useLogin";
import * as authApi from "@/apis/auth.api";

jest.mock("@/apis/auth.api");

describe("useLogin", () => {
  it("should login successfully", async () => {
    (authApi.login as jest.Mock).mockResolvedValue({ token: "token" });

    const { result } = renderHook(() => useLogin());
    let response;

    await act(async () => {
      response = await result.current.login({
        email: "test@test.com",
        password: "123456",
      });
    });

    expect(response).toEqual({ data: { token: "token" }, error: null });
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBeFalsy();
  });

  it("should handle login error", async () => {
    (authApi.login as jest.Mock).mockRejectedValue(
      new Error("Invalid credentials")
    );

    const { result } = renderHook(() => useLogin());
    let response;

    await act(async () => {
      response = await result.current.login({
        email: "test@test.com",
        password: "wrong",
      });
    });

    expect(response).toEqual({ data: null, error: "No se pudo iniciar sesión" });
    expect(result.current.error).toBe("No se pudo iniciar sesión");
    expect(result.current.loading).toBeFalsy();
  });

  it("should map Axios backend message", async () => {
    const axiosErr = new AxiosError("Bad request");
    (axiosErr as AxiosError & { response?: unknown }).response = {
      data: { message: "Usuario bloqueado" },
    } as unknown;

    (authApi.login as jest.Mock).mockRejectedValue(axiosErr);

    const { result } = renderHook(() => useLogin());
    let response;

    await act(async () => {
      response = await result.current.login({
        email: "test@test.com",
        password: "123456",
      });
    });

    expect(response).toEqual({ data: null, error: "Usuario bloqueado" });
    expect(result.current.error).toBe("Usuario bloqueado");
  });

  it("should fallback when Axios error has no backend message", async () => {
    const axiosErr = new AxiosError("Bad request");
    (axiosErr as AxiosError & { response?: unknown }).response = {
      data: {},
    } as unknown;

    (authApi.login as jest.Mock).mockRejectedValue(axiosErr);

    const { result } = renderHook(() => useLogin());
    let response;

    await act(async () => {
      response = await result.current.login({
        email: "test@test.com",
        password: "123456",
      });
    });

    expect(response).toEqual({ data: null, error: "No se pudo iniciar sesión" });
  });
});