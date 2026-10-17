import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, rightElement, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className="font-ui font-semibold text-sm text-[var(--text-heading)]">
            {label}
          </label>
        )}
        <div className="relative w-full">
          <input
            ref={ref}
            className={cn(
              "h-11 px-4 w-full rounded-lg bg-[var(--surface-card)] border border-[var(--border)] text-[var(--text-body)] font-ui text-base transition-colors",
              "focus:outline-none focus:border-[var(--border-emphasis)] focus:ring-1 focus:ring-[var(--focus-ring)]",
              "placeholder:text-[var(--text-meta)] disabled:bg-[var(--surface-hover)] disabled:text-[var(--text-meta)]",
              rightElement && "pr-10",
              error &&
                "border-[var(--accent)] focus:border-[var(--accent)] focus:ring-[var(--focus-ring)]",
              className,
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-[var(--text-meta)]">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <span className="text-sm font-ui text-[var(--text-accent)]">
            {error}
          </span>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";
