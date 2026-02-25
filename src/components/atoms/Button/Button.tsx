import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: ButtonVariant;
	loading?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
	primary: "bg-foreground text-background",
	secondary: "border border-foreground/30 text-foreground",
};

export const Button = ({
	variant = "primary",
	loading = false,
	className = "",
	children,
	disabled,
	...props
}: ButtonProps) => {
	const isDisabled = disabled || loading;

	return (
		<button
			type="button"
			className={`inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`}
			disabled={isDisabled}
			{...props}
		>
			{loading ? "Cargando..." : children}
		</button>
	);
};
