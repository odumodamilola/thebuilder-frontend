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
      inverse ? "text-white" : "text-brand-red",
      className
    )}>
      {inverse && <span className="text-brand-red text-[8px]">■</span>}
      {children}
    </span>
  )
}
