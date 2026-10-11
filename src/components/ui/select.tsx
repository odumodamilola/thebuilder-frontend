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
          <label className="font-ui font-semibold text-sm text-navy-900">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            "h-11 px-4 rounded-lg bg-white border border-line text-ink font-ui text-base transition-colors appearance-none",
            "focus:outline-none focus:border-navy-900 focus:ring-1 focus:ring-navy-900",
            "disabled:bg-slate-50 disabled:text-slate-400",
            error && "border-brand-red focus:border-brand-red focus:ring-brand-red",
            className
          )}
          {...props}
        >
          {placeholder && <option value="" disabled hidden>{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {error && <span className="text-sm font-ui text-brand-red">{error}</span>}
      </div>
    )
  }
)
Select.displayName = 'Select'
