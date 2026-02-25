import { InputHTMLAttributes, forwardRef } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, className = "", error, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <div className="flex w-full flex-col gap-1">
        {label ? (
          <label htmlFor={inputId} className="text-sm font-medium">
            {label}
          </label>
        ) : null}

        <input
          ref={ref}
          id={inputId}
          className={`h-10 rounded-md border border-foreground/25 bg-background px-3 text-sm outline-none focus:border-foreground ${className}`}
          {...props}
        />

        {error ? <span className="text-sm text-red-600">{error}</span> : null}
      </div>
    );
  }
);

Input.displayName = "Input";