"use client";

import { Button } from "@/components/atoms";
import { UIModalVariant } from "@/hooks/ui-state";

type InformativeModalProps = {
  open: boolean;
  title: string;
  message: string;
  variant?: UIModalVariant;
  onClose: () => void;
};

const variantStyles: Record<UIModalVariant, { icon: string; accent: string }> = {
  error: { icon: "⛔", accent: "text-red-600" },
  success: { icon: "✅", accent: "text-emerald-700" },
  warning: { icon: "⚠️", accent: "text-amber-600" },
  info: { icon: "ℹ️", accent: "text-foreground" },
};

export const InformativeModal = ({
  open,
  title,
  message,
  variant = "info",
  onClose,
}: InformativeModalProps) => {
  if (!open) {
    return null;
  }

  const style = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
      <div className="w-full max-w-md rounded-lg bg-background p-6">
        <h2 className={`flex items-center gap-2 text-lg font-semibold ${style.accent}`}>
          <span aria-hidden="true">{style.icon}</span>
          <span>{title}</span>
        </h2>
        <p className="mt-2 text-sm opacity-90">{message}</p>

        <div className="mt-5 flex justify-end">
          <Button onClick={onClose}>Entendido</Button>
        </div>
      </div>
    </div>
  );
};