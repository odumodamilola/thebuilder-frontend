import { cn } from '@/lib/utils'

interface SectionTitleProps {
  children?: React.ReactNode
  title?: string
  className?: string
  inverse?: boolean
}

export default function SectionTitle({ children, title, className, inverse }: SectionTitleProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <h2 className={cn("font-display font-bold text-3xl", inverse ? "text-white" : "text-navy-900")}>
        {title || children}
      </h2>
      <div className="w-12 h-[3px] bg-brand-red" />
    </div>
  )
}
