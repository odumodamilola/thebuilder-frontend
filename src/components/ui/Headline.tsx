import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface HeadlineProps {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "display" | "h1" | "h2" | "h3";
  uppercase?: boolean;
  inverse?: boolean;
  stop?: boolean;
  reveal?: boolean;
  highlight?: string;
  className?: string;
}

export function Headline({
  children,
  as: Component = "h2",
  size = "h2",
  uppercase,
  inverse,
  stop,
  reveal,
  highlight,
  className,
}: HeadlineProps) {
  return (
    <Component
      className={twMerge(
        "font-display font-bold",
        uppercase && "uppercase",
        inverse ? "text-white" : "text-navy-900",
        className
      )}
    >
      {children}
      {stop && <span className="text-brand-red">.</span>}
    </Component>
  );
}
