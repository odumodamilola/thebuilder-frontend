import { cn } from '@/lib/utils'

export default function Wordmark({ inverse, className }: { inverse?: boolean, className?: string }) {
  return (
    <span className={cn(
      "font-display font-extrabold text-[24px] tracking-tighter leading-none",
      inverse ? "text-[var(--text-on-inverse)]" : "text-[var(--text-heading)]",
      className
    )}>
      THE BUILDER<span className={inverse ? "text-[var(--text-on-inverse)]" : "text-[var(--text-accent)]"}>.</span>
    </span>
  )
}
