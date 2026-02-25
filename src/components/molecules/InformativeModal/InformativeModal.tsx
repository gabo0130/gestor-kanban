"use client";

import { Button } from "@/components/atoms";

type InformativeModalProps = {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
};

export const InformativeModal = ({
  open,
  title,
  message,
  onClose,
}: InformativeModalProps) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
      <div className="w-full max-w-md rounded-lg bg-background p-6">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm opacity-90">{message}</p>

        <div className="mt-5 flex justify-end">
          <Button onClick={onClose}>Entendido</Button>
        </div>
      </div>
    </div>
  );
};