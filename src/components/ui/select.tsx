import { SelectHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  placeholder?: string
  options: { label: string; value: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, placeholder, options, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className="font-ui font-semibold text-sm text-[var(--text-heading)]">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            "h-11 px-4 rounded-lg bg-[var(--surface-card)] border border-[var(--border)] text-[var(--text-body)] font-ui text-base transition-colors appearance-none",
            "focus:outline-none focus:border-[var(--border-emphasis)] focus:ring-1 focus:ring-[var(--focus-ring)]",
            "disabled:bg-[var(--surface-hover)] disabled:text-[var(--text-meta)]",
            error && "border-[var(--accent)] focus:border-[var(--accent)] focus:ring-[var(--focus-ring)]",
            className
          )}
          {...props}
        >
          {placeholder && <option value="" disabled hidden>{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {error && <span className="text-sm font-ui text-[var(--text-accent)]">{error}</span>}
      </div>
    )
  }
)
Select.displayName = 'Select'
