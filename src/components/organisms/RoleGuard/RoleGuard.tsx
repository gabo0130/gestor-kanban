"use client";

import { ReactNode } from "react";
import { useAuth } from "@/contexts/auth-context";
import { UserRole } from "@/modules/auth/types/auth.types";

type RoleGuardProps = {
  allowed: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
};

export const RoleGuard = ({ allowed, children, fallback = null }: RoleGuardProps) => {
  const { user } = useAuth();
  const role = user?.role;

  if (!role || !allowed.includes(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
