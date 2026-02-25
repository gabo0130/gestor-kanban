type SpinnerProps = {
  size?: "sm" | "md";
};

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-[3px]",
};

export const Spinner = ({ size = "md" }: SpinnerProps) => {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-foreground/20 border-t-foreground ${sizeClasses[size]}`}
      aria-label="Cargando"
      role="status"
    />
  );
};