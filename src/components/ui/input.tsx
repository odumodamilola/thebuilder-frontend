import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  rightElement?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, rightElement, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className="font-ui font-semibold text-sm text-navy-900">
            {label}
          </label>
        )}
        <div className="relative w-full">
          <input
            ref={ref}
            className={cn(
              "h-11 px-4 w-full rounded-lg bg-white border border-line text-ink font-ui text-base transition-colors",
              "focus:outline-none focus:border-navy-900 focus:ring-1 focus:ring-navy-900",
              "placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-400",
              rightElement && "pr-10",
              error && "border-brand-red focus:border-brand-red focus:ring-brand-red",
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400">
              {rightElement}
            </div>
          )}
        </div>
        {error && <span className="text-sm font-ui text-brand-red">{error}</span>}
      </div>
    )
  }
)
Input.displayName = 'Input'
