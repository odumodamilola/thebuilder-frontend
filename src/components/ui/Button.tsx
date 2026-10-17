import { LoadingDots } from "./LoadingDots";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    "primary" | "secondary" | "accent" | "ghost" | "outline" | "inverse";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  iconRight?: string;
  href?: string;
}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading,
      children,
      iconRight,
      href,
      ...props
    },
    ref,
  ) => {
    const classes = cn(
      "relative inline-flex items-center justify-center font-ui font-semibold transition-colors rounded-md disabled:opacity-50 disabled:cursor-not-allowed",
      {
        "bg-[var(--surface-inverse)] text-[var(--text-on-inverse)] hover:bg-[var(--primary-hover)]":
          variant === "primary",
        "bg-[var(--surface-tint)] text-[var(--text-heading)] hover:bg-[var(--surface-skeleton)]":
          variant === "secondary",
        "bg-[var(--accent)] text-[var(--text-on-inverse)] hover:bg-[var(--accent-hover)]":
          variant === "accent",
        "bg-transparent text-[var(--text-heading)] hover:bg-[var(--surface-skeleton)]":
          variant === "ghost",
        "border border-[var(--border)] text-[var(--text-body)] hover:border-[var(--border-strong)]":
          variant === "outline",
        "bg-[var(--surface-card)] text-[var(--text-heading)] hover:bg-[var(--surface-skeleton)]":
          variant === "inverse",
        "px-4 py-2 text-[14px]": size === "sm",
        "px-6 py-3 text-[16px]": size === "md",
        "px-8 py-4 text-[17px]": size === "lg",
      },
      className,
    );

    if (href && !loading && !props.disabled) {
      return (
        <a href={href} className={classes} {...(props as any)}>
          {children}
          {iconRight && <span className="ml-2">—&gt;</span>}
        </a>
      );
    }

    return (
      <button
        ref={ref as any}
        {...props}
        aria-busy={loading || undefined}
        disabled={loading || props.disabled}
        className={classes}
      >
        <span
          className="inline-flex items-center gap-2"
          style={{ visibility: loading ? "hidden" : "visible" }}
        >
          {children}
        </span>
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <LoadingDots />
          </span>
        )}
      </button>
    );
  },
);
Button.displayName = "Button";
export default Button;
