import { cn } from '@/lib/utils'

export default function Wordmark({ inverse, className }: { inverse?: boolean, className?: string }) {
  return (
    <span className={cn(
      "font-display font-extrabold text-[24px] tracking-tighter leading-none",
      inverse ? "text-white" : "text-navy-900",
      className
    )}>
      THE BUILDER<span className="text-brand-red">.</span>
    </span>
  )
}
