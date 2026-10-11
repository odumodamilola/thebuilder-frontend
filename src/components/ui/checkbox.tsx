import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label: string | React.ReactNode
  error?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onCheckedChange?: (checked: boolean) => void
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, onChange, onCheckedChange, ...props }, ref) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e)
      onCheckedChange?.(e.target.checked)
    }

    return (
      <div className="flex flex-col gap-1">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            ref={ref}
            onChange={handleChange}
            className={cn(
              "w-5 h-5 rounded border border-line text-navy-900",
              "focus:ring-navy-900 focus:ring-offset-2",
              error && "border-brand-red",
              className
            )}
            {...props}
          />
          <span className="font-ui text-sm text-ink">{label}</span>
        </label>
        {error && <span className="text-sm font-ui text-brand-red">{error}</span>}
      </div>
    )
  }
)
Checkbox.displayName = 'Checkbox'
