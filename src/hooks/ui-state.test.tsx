import { act, renderHook } from "@testing-library/react";
import { UIStateProvider, useUIState } from "./ui-state";

describe("useUIState", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <UIStateProvider>{children}</UIStateProvider>
  );

  it("manages loading and modal state", () => {
    const { result } = renderHook(() => useUIState(), { wrapper });

    expect(result.current.loading).toBe(false);
    expect(result.current.modal.open).toBe(false);

    act(() => {
      result.current.setLoading(true);
      result.current.showErrorModal("Algo salió mal");
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.modal).toEqual({
      open: true,
      title: "Error",
      message: "Algo salió mal",
    });

    act(() => {
      result.current.closeModal();
      result.current.setLoading(false);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.modal.open).toBe(false);
  });

  it("throws when used outside provider", () => {
    expect(() => renderHook(() => useUIState())).toThrow(
      "useUIState must be used inside UIStateProvider"
    );
  });
});
