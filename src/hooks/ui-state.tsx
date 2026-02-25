"use client";

import { createContext, ReactNode, useContext, useMemo, useState } from "react";

type InfoModalState = {
  open: boolean;
  title: string;
  message: string;
};

type UIStateContextValue = {
  loading: boolean;
  setLoading: (value: boolean) => void;
  modal: InfoModalState;
  showErrorModal: (message: string, title?: string) => void;
  closeModal: () => void;
};

const defaultModal: InfoModalState = {
  open: false,
  title: "",
  message: "",
};

const UIStateContext = createContext<UIStateContextValue | null>(null);

export const UIStateProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<InfoModalState>(defaultModal);

  const showErrorModal = (message: string, title = "Error") => {
    setModal({ open: true, title, message });
  };

  const closeModal = () => {
    setModal(defaultModal);
  };

  const value = useMemo(
    () => ({ loading, setLoading, modal, showErrorModal, closeModal }),
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