import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helper?: string;
  optional?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helper, optional, id, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;

    return (
      <div className={cn("flex flex-col gap-1.5 w-full", className)}>
        {label && (
          <label htmlFor={textareaId} className="text-[14px] font-semibold text-[var(--text-body)] flex justify-between">
            {label}
            {optional && <span className="text-[var(--text-meta)] font-normal text-[13px]">(optional)</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-[var(--border)] bg-[var(--surface-card)] px-3 py-2 text-[15px] text-[var(--text-heading)] transition-colors placeholder:text-[var(--text-meta-on-inverse)] focus:outline-none focus:border-[var(--focus-ring)] focus:ring-1 focus:ring-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-[var(--accent)] focus:border-[var(--accent)] focus:ring-[var(--focus-ring)]"
          )}
          ref={ref}
          {...props}
        />
        {helper && !error && <p className="text-[13px] text-[var(--text-meta)]">{helper}</p>}
        {error && <p className="text-[13px] text-[var(--text-accent)]">{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
