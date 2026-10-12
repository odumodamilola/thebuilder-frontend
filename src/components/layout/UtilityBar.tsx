'use client'
import { cn } from '@/lib/utils'
import { useEdition } from '@/context/EditionContext'
import { Laptop, Linkedin, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import Link from 'next/link'

export default function UtilityBar() {
  const { edition, setEdition } = useEdition()
  const { theme, setTheme } = useTheme()
  const d = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="h-utility bg-navy-950 flex items-center justify-between px-4 md:px-6 text-[12px] font-ui text-slate-300">
      <div className="flex items-center gap-4">
        <div className="flex gap-[2px]">
          {['Nigeria', 'Australia'].map((e) => (
            <button 
              key={e}
              onClick={() => setEdition(e as 'Nigeria' | 'Australia')}
              aria-pressed={edition === e}
              className={cn("h-6 px-2 rounded font-semibold whitespace-nowrap", edition === e ? "bg-white/15 text-white" : "text-slate-300")}
            >
              {e}
            </button>
          ))}
        </div>
        <span suppressHydrationWarning className="hidden lg:inline">{d}</span>
      </div>
      <div className="flex items-center gap-[14px]">
        <div aria-label="Colour theme" className="hidden items-center rounded-full border border-white/10 p-0.5 lg:flex">
          {([['light', Sun], ['dark', Moon], ['system', Laptop]] as const).map(([value, Icon]) => <button key={value} type="button" onClick={() => setTheme(value)} aria-label={`${value.charAt(0).toUpperCase()}${value.slice(1)} theme`} aria-pressed={theme === value} className={cn('flex h-6 w-6 items-center justify-center rounded-full text-slate-300', theme === value && 'bg-white/10 text-white')}><Icon aria-hidden="true" className="h-3 w-3" /></button>)}
        </div>
        <div aria-hidden="true" className="hidden items-center gap-3 text-slate-300 xl:flex"><Linkedin className="h-3 w-3" /><span className="text-[11px] font-bold">𝕏</span><span>◎</span><span>▶</span></div>
        <Link href="/nominate" className="flex items-center gap-[6px] text-white hover:text-red-400 transition-colors font-semibold whitespace-nowrap">
          <span className="w-[6px] h-[6px] bg-brand-red rounded-sm"></span>
          Nominate a Builder
        </Link>
      </div>
    </div>
  )
}
