import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline' | 'inverse'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  iconRight?: string
  href?: string
}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, iconRight, href, ...props }, ref) => {
    
    const classes = cn(
      'inline-flex items-center justify-center font-ui font-semibold transition-colors rounded-md disabled:opacity-50 disabled:cursor-not-allowed',
      {
        'bg-[var(--surface-inverse)] text-[var(--text-on-inverse)] hover:bg-[var(--primary-hover)]': variant === 'primary',
        'bg-[var(--surface-tint)] text-[var(--text-heading)] hover:bg-[var(--surface-skeleton)]': variant === 'secondary',
        'bg-[var(--accent)] text-[var(--text-on-inverse)] hover:bg-[var(--accent-hover)]': variant === 'accent',
        'bg-transparent text-[var(--text-heading)] hover:bg-[var(--surface-skeleton)]': variant === 'ghost',
        'border border-[var(--border)] text-[var(--text-body)] hover:border-[var(--border-strong)]': variant === 'outline',
        'bg-[var(--surface-card)] text-[var(--text-heading)] hover:bg-[var(--surface-skeleton)]': variant === 'inverse',
        'px-4 py-2 text-[14px]': size === 'sm',
        'px-6 py-3 text-[16px]': size === 'md',
        'px-8 py-4 text-[17px]': size === 'lg',
      },
      className
    )

    if (href) {
      return (
        <a href={href} className={classes} {...(props as any)}>
          {children}
          {iconRight && <span className="ml-2">—&gt;</span>}
        </a>
      )
    }

    return (
      <button
        ref={ref as any}
        disabled={loading || props.disabled}
        className={classes}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : null}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
export default Button
