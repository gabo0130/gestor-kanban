import Link from "next/link";
import { ReactNode } from "react";
import { Button } from "@/components/atoms";

type NavButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  linkClassName?: string;
};

export const NavButtonLink = ({
  href,
  children,
  variant = "secondary",
  linkClassName,
}: NavButtonLinkProps) => {
  return (
    <Link className={linkClassName} href={href}>
      <Button variant={variant}>{children}</Button>
    </Link>
  );
};