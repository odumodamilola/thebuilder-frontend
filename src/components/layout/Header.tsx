import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ChevronDown, Menu, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import Wordmark from '../brand/Wordmark'
import UtilityBar from './UtilityBar'
import { SearchPalette } from '../ui/SearchPalette'

const MEGA = {
  Stories: [['Founder Stories', '/stories?category=founder-stories'], ['Interviews', '/stories?category=interviews'], ['Analysis', '/stories?category=analysis'], ['Opinion', '/stories?category=opinion'], ['Business', '/stories?category=business'], ['Diaspora', '/stories?category=diaspora']],
  Industries: [['Fintech', '/industries/fintech'], ['HealthTech', '/industries/healthtech'], ['AgriTech', '/industries/agritech'], ['EdTech', '/industries/edtech'], ['Creative Economy', '/industries/creative-economy'], ['Energy', '/industries/energy']],
} as const
const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Stories', href: '/stories' },
  { label: 'Startups', href: '/startups' },
  { label: 'The Builders', href: '/builders' },
  { label: 'Diaspora', href: '/diaspora' },
  { label: 'Industries', href: '/industries' },
  { label: 'Videos', href: '/videos' },
  { label: 'Opportunities', href: '/opportunities' },
  { label: 'Events', href: '/events' },
  { label: 'About', href: '/about' },
]

export default function Header() {
  const router = useRouter()
  const [compact, setCompact] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mega, setMega] = useState<keyof typeof MEGA | null>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  const drawer = useRef<HTMLDivElement>(null)

  useEffect(() => { const onScroll = () => setCompact(window.scrollY > 80); onScroll(); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll) }, [])
  useEffect(() => { const onKey = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setSearchOpen(true) } if (event.key === 'Escape') { setMega(null); setMenuOpen(false) } }; document.addEventListener('keydown', onKey); return () => document.removeEventListener('keydown', onKey) }, [])
  useEffect(() => {
    if (!menuOpen) return
    const previous = document.body.style.overflow
    const trigger = menuButton.current
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !drawer.current) return
      const focusable = Array.from(drawer.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'))
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', trapFocus)
    closeButton.current?.focus()
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', trapFocus)
      trigger?.focus()
    }
  }, [menuOpen])

  const isActive = (href: string) => href === '/' ? router.pathname === '/' || router.pathname === '/home' : router.pathname.startsWith(href)
  return <>
    <UtilityBar />
    <header className={cn('sticky top-0 z-40 border-b bg-[var(--surface-card)] transition-[height,box-shadow] duration-small', compact || mega ? 'h-header-compact border-line shadow-sm' : 'h-header border-transparent')}>
      <div className="mx-auto flex h-full max-w-container items-center gap-5 px-4 lg:px-6">
        <Link href="/" aria-label="The Builder home"><Wordmark /></Link>
        <nav aria-label="Primary" className="hidden h-full min-w-0 flex-1 items-center justify-center gap-3 overflow-hidden xl:flex">
          {NAV.map(item => { const menu = item.label in MEGA ? item.label as keyof typeof MEGA : null; return <div key={item.href} className="flex h-full items-center" onMouseEnter={() => setMega(menu)} onMouseLeave={() => menu && setMega(null)}>
            <Link href={item.href} aria-current={isActive(item.href) ? 'page' : undefined} aria-expanded={menu ? mega === menu : undefined} aria-haspopup={menu ? 'menu' : undefined} onFocus={() => setMega(menu)} className={cn('relative flex h-11 items-center gap-1 whitespace-nowrap px-0.5 font-ui text-[13.5px] font-medium text-[var(--text-heading)]', isActive(item.href) && 'font-semibold')}>
              {item.label}{menu && <ChevronDown aria-hidden="true" className="h-3.5 w-3.5" />}<span aria-hidden="true" className={cn('absolute inset-x-0 bottom-1.5 h-0.5 origin-left bg-brand-red transition-transform duration-small', isActive(item.href) || mega === menu ? 'scale-x-100' : 'scale-x-0')} />
            </Link>
            {menu && mega === menu && <div role="menu" aria-label={`${menu} sections`} className="absolute inset-x-0 top-full border-b border-line bg-[var(--surface-card)] shadow-overlay" onMouseEnter={() => setMega(menu)} onMouseLeave={() => setMega(null)}><div className="mx-auto grid max-w-container grid-cols-2 gap-x-8 gap-y-1 px-6 py-7">{MEGA[menu].map(([label, href]) => <Link role="menuitem" key={href} href={href} className="min-h-11 rounded-md px-3 py-2 text-[15px] font-medium text-[var(--text-heading)] hover:bg-[var(--surface-tint)]">{label}</Link>)}</div></div>}
          </div> })}
        </nav>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <button type="button" onClick={() => setSearchOpen(true)} aria-label="Search" aria-keyshortcuts="Control+K Meta+K" className="tb-control hidden items-center justify-center rounded-md border border-line bg-[var(--surface-card)] text-[var(--text-heading)] hover:bg-[var(--surface-tint)] md:flex"><Search aria-hidden="true" className="h-[18px] w-[18px]" /></button>
          <Link href="/newsletter" className="hidden h-10 items-center rounded-md bg-brand-red px-4 text-[15px] font-semibold text-white hover:bg-red-700 md:flex">Subscribe</Link>
          <Link href="/signin" className="hidden h-10 items-center rounded-md px-3 text-[15px] font-semibold text-[var(--text-heading)] hover:bg-[var(--surface-tint)] md:flex">Sign in</Link>
          <button ref={menuButton} type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen} className="tb-control flex items-center justify-center text-[var(--text-heading)] xl:hidden"><Menu aria-hidden="true" className="h-6 w-6" /></button>
        </div>
      </div>
    </header>
    {menuOpen && <div className="fixed inset-0 z-50 flex justify-end bg-[var(--overlay)] backdrop-blur-[6px]" role="presentation" onMouseDown={event => event.currentTarget === event.target && setMenuOpen(false)}><div ref={drawer} role="dialog" aria-modal="true" aria-label="Site navigation" className="flex h-full w-[min(86%,390px)] flex-col overflow-y-auto bg-[var(--surface-card)] p-6 shadow-overlay"><div className="mb-8 flex items-center justify-between"><Wordmark /><button ref={closeButton} type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu" className="tb-control flex items-center justify-center rounded-md text-[var(--text-heading)]"><X aria-hidden="true" className="h-6 w-6" /></button></div><nav aria-label="Mobile" className="flex flex-col gap-1">{NAV.map(item => <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? 'page' : undefined} onClick={() => setMenuOpen(false)} className={cn('flex min-h-11 items-center rounded-md px-3 font-display text-lg font-bold text-[var(--text-heading)] hover:bg-[var(--surface-tint)]', isActive(item.href) && 'text-brand-red')}>{item.label}</Link>)}</nav><div className="mt-auto grid gap-3 pt-8"><button type="button" onClick={() => { setMenuOpen(false); setSearchOpen(true) }} className="min-h-11 rounded-md bg-[var(--surface-tint)] font-semibold text-[var(--text-heading)]">Search</button><Link href="/newsletter" onClick={() => setMenuOpen(false)} className="flex min-h-11 items-center justify-center rounded-md bg-brand-red font-semibold text-white">Subscribe</Link></div></div></div>}
    <SearchPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
  </>
}
