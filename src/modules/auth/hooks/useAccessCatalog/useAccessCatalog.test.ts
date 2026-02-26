import { waitFor, renderHook } from "@testing-library/react";
import { AxiosError } from "axios";
import { useAccessCatalog } from "./useAccessCatalog";
import { getRolesCatalog } from "@/apis/access-control.api";

jest.mock("@/apis/access-control.api", () => ({
  getRolesCatalog: jest.fn(),
}));

describe("useAccessCatalog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should load roles successfully", async () => {
    (getRolesCatalog as jest.Mock).mockResolvedValue({
      roles: [
        { id: "1", key: "admin", name: "Admin" },
        { id: "2", key: "", name: "Invalid" },
      ],
    });

    const { result } = renderHook(() => useAccessCatalog());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.roles).toEqual([{ id: "1", key: "admin", name: "Admin" }]);
    expect(result.current.error).toBeNull();
  });

  it("should handle API error", async () => {
    const axiosErr = new AxiosError("network");
    (axiosErr as AxiosError & { response?: unknown }).response = {
      data: { message: "Error backend roles" },
    } as unknown;

    (getRolesCatalog as jest.Mock).mockRejectedValue(axiosErr);

    const { result } = renderHook(() => useAccessCatalog());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.roles).toEqual([]);
    expect(result.current.error).toBe("Error backend roles");
  });

  it("should use default message for non-Axios errors", async () => {
    (getRolesCatalog as jest.Mock).mockRejectedValue(new Error("boom"));

    const { result } = renderHook(() => useAccessCatalog());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.roles).toEqual([]);
    expect(result.current.error).toBe("No se pudo cargar el catálogo de roles");
  });

  it("does not update state after unmount on successful request", async () => {
    let resolveRequest: ((value: unknown) => void) | undefined;
    (getRolesCatalog as jest.Mock).mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      })
    );

    const { result, unmount } = renderHook(() => useAccessCatalog());
    unmount();

    resolveRequest?.({ roles: [{ id: "1", key: "admin", name: "Admin" }] });

    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });
  });

  it("does not update error after unmount on failed request", async () => {
    let rejectRequest: ((reason?: unknown) => void) | undefined;
    (getRolesCatalog as jest.Mock).mockReturnValue(
      new Promise((_, reject) => {
        rejectRequest = reject;
      })
    );

    const { result, unmount } = renderHook(() => useAccessCatalog());
    unmount();

    rejectRequest?.(new Error("boom"));

    await waitFor(() => {
      expect(result.current.error).toBeNull();
    });
  });
});
