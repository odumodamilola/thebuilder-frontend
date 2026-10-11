'use client'
import { cn } from '@/lib/utils'
import { useEdition } from '@/context/EditionContext'
import { Linkedin, Instagram, Youtube } from 'lucide-react'

export default function UtilityBar() {
  const { edition, setEdition } = useEdition()
  const d = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="h-8 bg-navy-950 flex items-center justify-between px-4 md:px-6 text-[12px] font-ui text-slate-300">
      <div className="flex items-center gap-4">
        <div className="flex gap-[2px]">
          {['Nigeria', 'Australia'].map((e) => (
            <button 
              key={e}
              onClick={() => setEdition(e as any)} 
              className={cn("h-6 px-2 rounded font-semibold whitespace-nowrap", edition === e ? "bg-white/12 text-white" : "text-slate-300")}
            >
              {e}
            </button>
          ))}
        </div>
        <span className="hidden lg:inline">{d}</span>
      </div>
      <div className="flex items-center gap-[14px]">
        <div className="hidden lg:flex items-center gap-[14px]">
          <a href="#" className="text-slate-300 hover:text-white transition-colors flex" aria-label="LinkedIn">
            <Linkedin className="w-[14px] h-[14px]" />
          </a>
          <a href="#" className="text-slate-300 hover:text-white transition-colors flex items-center justify-center font-bold text-[11px] leading-none w-[14px] h-[14px]" aria-label="X">
            𝕏
          </a>
          <a href="#" className="text-slate-300 hover:text-white transition-colors flex" aria-label="Instagram">
            <Instagram className="w-[14px] h-[14px]" />
          </a>
          <a href="#" className="text-slate-300 hover:text-white transition-colors flex" aria-label="YouTube">
            <Youtube className="w-[14px] h-[14px]" />
          </a>
        </div>
        <a href="/nominate" className="flex items-center gap-[6px] text-white hover:text-red-400 transition-colors font-semibold whitespace-nowrap">
          <span className="w-[6px] h-[6px] bg-brand-red rounded-sm"></span>
          Nominate a Builder
        </a>
      </div>
    </div>
  )
}
