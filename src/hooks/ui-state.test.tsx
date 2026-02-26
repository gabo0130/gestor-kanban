import { act, renderHook } from "@testing-library/react";
import {
  setUIBridge,
  uiShowModal,
  uiStartLoading,
  uiStopLoading,
  UIStateProvider,
  useUIState,
} from "./ui-state";

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
      variant: "error",
    });

    act(() => {
      result.current.closeModal();
      result.current.setLoading(false);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.modal.open).toBe(false);
  });

  it("handles loading counter with start/stop", () => {
    const { result } = renderHook(() => useUIState(), { wrapper });

    expect(result.current.loading).toBe(false);

    act(() => {
      result.current.startLoading();
      result.current.startLoading();
    });

    expect(result.current.loading).toBe(true);

    act(() => {
      result.current.stopLoading();
    });

    expect(result.current.loading).toBe(true);

    act(() => {
      result.current.stopLoading();
      result.current.stopLoading();
    });

    expect(result.current.loading).toBe(false);
  });

  it("supports all modal helper variants", () => {
    const { result } = renderHook(() => useUIState(), { wrapper });

    act(() => {
      result.current.showSuccessModal("ok");
    });
    expect(result.current.modal.variant).toBe("success");
    expect(result.current.modal.title).toBe("Operación exitosa");

    act(() => {
      result.current.showWarningModal("ojo");
    });
    expect(result.current.modal.variant).toBe("warning");
    expect(result.current.modal.title).toBe("Advertencia");

    act(() => {
      result.current.showInfoModal("dato");
    });
    expect(result.current.modal.variant).toBe("info");
    expect(result.current.modal.title).toBe("Información");
  });

  it("routes helper bridge calls through configured handlers", () => {
    const startLoading = jest.fn();
    const stopLoading = jest.fn();
    const showModal = jest.fn();

    setUIBridge({ startLoading, stopLoading, showModal });

    uiStartLoading();
    uiStopLoading();
    uiShowModal({ message: "bridge", title: "Title", variant: "warning" });

    expect(startLoading).toHaveBeenCalledTimes(1);
    expect(stopLoading).toHaveBeenCalledTimes(1);
    expect(showModal).toHaveBeenCalledWith({
      message: "bridge",
      title: "Title",
      variant: "warning",
    });
  });

  it("uses default title and variant in showModal", () => {
    const { result } = renderHook(() => useUIState(), { wrapper });

    act(() => {
      result.current.showModal({ message: "solo mensaje" });
    });

    expect(result.current.modal).toEqual({
      open: true,
      title: "Información",
      message: "solo mensaje",
      variant: "info",
    });
  });

  it("throws when used outside provider", () => {
    expect(() => renderHook(() => useUIState())).toThrow(
      "useUIState must be used inside UIStateProvider"
    );
  });
});
