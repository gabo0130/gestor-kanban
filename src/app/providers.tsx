"use client";

import { ReactNode } from "react";
import { Spinner } from "@/components/atoms";
import { InformativeModal } from "@/components/molecules";
import { UIStateProvider, useUIState } from "@/hooks/ui-state";
import { AuthProvider } from "@/contexts/auth-context";

const GlobalUI = () => {
  const { loading, modal, closeModal } = useUIState();

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