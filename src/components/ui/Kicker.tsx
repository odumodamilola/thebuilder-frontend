import { cn } from '@/lib/utils'

interface KickerProps {
  children: React.ReactNode
  inverse?: boolean
  className?: string
}

export default function Kicker({ children, inverse, className }: KickerProps) {
  return (
    <span className={cn(
      "font-ui font-semibold text-[12px] tracking-[0.08em] uppercase flex items-center gap-2",
      inverse ? "text-[var(--text-on-inverse)]" : "text-[var(--text-accent)]",
      className
    )}>
      {inverse && <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 bg-[var(--accent)]" />}
      {children}
    </span>
  )
}
