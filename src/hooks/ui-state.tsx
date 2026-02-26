"use client";

import { createContext, ReactNode, useContext, useMemo, useState } from "react";

export type UIModalVariant = "error" | "success" | "warning" | "info";

type InfoModalState = {
  open: boolean;
  title: string;
  message: string;
  variant: UIModalVariant;
};

type UIStateContextValue = {
  loading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  setLoading: (value: boolean) => void;
  modal: InfoModalState;
  showModal: (params: {
    message: string;
    title?: string;
    variant?: UIModalVariant;
  }) => void;
  showErrorModal: (message: string, title?: string) => void;
  showSuccessModal: (message: string, title?: string) => void;
  showWarningModal: (message: string, title?: string) => void;
  showInfoModal: (message: string, title?: string) => void;
  closeModal: () => void;
};

const defaultModal: InfoModalState = {
  open: false,
  title: "",
  message: "",
  variant: "info",
};

const UIStateContext = createContext<UIStateContextValue | null>(null);

type UIBridge = {
  startLoading: () => void;
  stopLoading: () => void;
  showModal: (params: { message: string; title?: string; variant?: UIModalVariant }) => void;
};

let uiBridge: UIBridge = {
  startLoading: () => {},
  stopLoading: () => {},
  showModal: () => {},
};

export const setUIBridge = (bridge: UIBridge) => {
  uiBridge = bridge;
};

export const uiStartLoading = () => uiBridge.startLoading();
export const uiStopLoading = () => uiBridge.stopLoading();
export const uiShowModal = (params: {
  message: string;
  title?: string;
  variant?: UIModalVariant;
}) => uiBridge.showModal(params);

export const UIStateProvider = ({ children }: { children: ReactNode }) => {
  const [loadingCount, setLoadingCount] = useState(0);
  const [modal, setModal] = useState<InfoModalState>(defaultModal);

  const loading = loadingCount > 0;

  const startLoading = () => {
    setLoadingCount((current) => current + 1);
  };

  const stopLoading = () => {
    setLoadingCount((current) => Math.max(0, current - 1));
  };

  const setLoading = (value: boolean) => {
    setLoadingCount(value ? 1 : 0);
  };

  const showModal = ({
    message,
    title = "Información",
    variant = "info",
  }: {
    message: string;
    title?: string;
    variant?: UIModalVariant;
  }) => {
    setModal({ open: true, title, message, variant });
  };

  const showErrorModal = (message: string, title = "Error") => {
    showModal({ message, title, variant: "error" });
  };

  const showSuccessModal = (message: string, title = "Operación exitosa") => {
    showModal({ message, title, variant: "success" });
  };

  const showWarningModal = (message: string, title = "Advertencia") => {
    showModal({ message, title, variant: "warning" });
  };

  const showInfoModal = (message: string, title = "Información") => {
    showModal({ message, title, variant: "info" });
  };

  const closeModal = () => {
    setModal(defaultModal);
  };

  const value = useMemo(
    () => ({
      loading,
      startLoading,
      stopLoading,
      setLoading,
      modal,
      showModal,
      showErrorModal,
      showSuccessModal,
      showWarningModal,
      showInfoModal,
      closeModal,
    }),
    [loading, modal]
  );

  return <UIStateContext.Provider value={value}>{children}</UIStateContext.Provider>;
};

export const useUIState = () => {
  const context = useContext(UIStateContext);

  if (!context) {
    throw new Error("useUIState must be used inside UIStateProvider");
  }

  return context;
};