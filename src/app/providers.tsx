"use client";

import { ReactNode, useEffect } from "react";
import { Spinner } from "@/components/atoms";
import { InformativeModal } from "@/components/molecules";
import { UIStateProvider, setUIBridge, useUIState } from "@/hooks/ui-state";
import { AuthProvider } from "@/contexts/auth-context";

const GlobalUI = () => {
  const { loading, modal, closeModal, startLoading, stopLoading, showModal } = useUIState();

  useEffect(() => {
    setUIBridge({ startLoading, stopLoading, showModal });
  }, [startLoading, stopLoading, showModal]);

  return (
    <>
      {loading ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/35">
          <Spinner />
        </div>
      ) : null}

      <InformativeModal
        open={modal.open}
        title={modal.title}
        message={modal.message}
        variant={modal.variant}
        onClose={closeModal}
      />
    </>
  );
};

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <UIStateProvider>
        {children}
        <GlobalUI />
      </UIStateProvider>
    </AuthProvider>
  );
};