import { act, renderHook } from "@testing-library/react";
import { AuthProvider, useAuth } from "./auth-context";
import { apiClient } from "@/apis/client";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe("auth-context", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    window.history.replaceState({}, "", "/dashboard");
    delete apiClient.defaults.headers.common["Authorization"];
  });

  it("throws when useAuth is used outside provider", () => {
    expect(() => renderHook(() => useAuth())).toThrow(
      "useAuth must be used inside AuthProvider"
    );
  });

  it("logs in and persists token/user", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login({
        token: "jwt-token",
        user: {
          id: "1",
          name: "Admin",
          email: "admin@x.com",
          role: "admin",
        },
      });
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.token).toBe("jwt-token");
    expect(result.current.user?.email).toBe("admin@x.com");
    expect(localStorage.getItem("auth_token")).toBe("jwt-token");
    expect(localStorage.getItem("auth_user")).toContain("admin@x.com");
    expect(apiClient.defaults.headers.common["Authorization"]).toBe("Bearer jwt-token");
  });

  it("restores session from localStorage on mount", () => {
    localStorage.setItem("auth_token", "restored");
    localStorage.setItem(
      "auth_user",
      JSON.stringify({
        id: "2",
        name: "Marta",
        email: "marta@x.com",
        role: "manager",
      })
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.token).toBe("restored");
    expect(result.current.user?.name).toBe("Marta");
  });

  it("cleans session on logout", () => {
    localStorage.setItem("auth_token", "x");
    localStorage.setItem("auth_user", JSON.stringify({ id: "1", name: "A", email: "a@x.com" }));

    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem("auth_token")).toBeNull();
    expect(localStorage.getItem("auth_user")).toBeNull();
    expect(apiClient.defaults.headers.common["Authorization"]).toBeUndefined();
  });
});
