'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Menu, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import Wordmark from '../brand/Wordmark'

const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Stories', href: '/stories', hasDropdown: true },
  { label: 'Startups', href: '/startups' },
  { label: 'The Builders', href: '/builders' },
  { label: 'Diaspora', href: '/diaspora' },
  { label: 'Industries', href: '/industries', hasDropdown: true },
  { label: 'Videos', href: '/videos' },
  { label: 'Opportunities', href: '/opportunities' },
  { label: 'Events', href: '/events', badge: 'Soon' },
  { label: 'About', href: '/about' },
]

const MEGA: Record<string, string[][]> = {
  Stories: [['Founder Stories', 'Interviews', 'Analysis', 'Opinion'], ['Business', 'Diaspora', 'Press Releases', 'Profiles']],
  Industries: [['Fintech', 'HealthTech', 'AgriTech', 'EdTech'], ['Creative Economy', 'Energy', 'Logistics', 'Climate']]
};

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mega, setMega] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        onMouseLeave={() => setMega(null)}
        className={cn(
          'sticky top-0 z-50 bg-white transition-all duration-300 flex items-center gap-[20px] px-[16px] lg:px-[24px]',
          scrolled || mega ? 'h-[60px] border-b border-line shadow-sm' : 'h-[72px] border-b border-transparent'
        )}
      >
        <Link href="/">
          <Wordmark />
        </Link>
        <nav className="hidden lg:flex items-center justify-center flex-1 gap-[12px] min-w-0 overflow-hidden h-full">
          {NAV.map((item) => (
            <Link key={item.href}
              href={item.href || '#'}
              onMouseEnter={() => setMega(MEGA[item.label] ? item.label : null)}
              className={cn(
                'relative text-[13.5px] font-ui group transition-colors flex items-center gap-[4px] h-[44px] px-[2px] mt-auto mb-auto',
                pathname === item.href ? 'text-navy-900 font-semibold' : item.badge ? 'text-slate-500 font-medium' : 'text-navy-900 font-medium'
              )}
            >
              {item.label}
              {item.hasDropdown && (
                <ChevronDown className="w-[14px] h-[14px]" />
              )}
              {item.badge && (
                <span className="text-[10px] font-bold bg-navy-50 text-slate-500 px-[5px] py-[1px] rounded-full uppercase tracking-wide">
                  {item.badge}
                </span>
              )}
              <span
                className={cn(
                  'absolute bottom-[6px] left-0 right-0 h-[2px] bg-brand-red origin-left transition-transform duration-250',
                  pathname === item.href || mega === item.label ? 'scale-x-100' : 'scale-x-0'
                )}
              />
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-[8px] ml-auto lg:ml-0">
          <button className="hidden md:flex items-center justify-center h-[40px] min-w-[44px] px-[10px] rounded-[8px] border border-line bg-white hover:bg-navy-50 transition-colors text-navy-900" title="Search (⌘K)">
            <Search className="w-[18px] h-[18px]" />
          </button>
          <button className="hidden md:block bg-brand-red text-white h-[40px] px-[16px] rounded-[8px] text-[15px] font-semibold hover:bg-red-700 transition-colors">
            Subscribe
          </button>
          <a href="/signin" className="hidden md:flex items-center h-[40px] px-[12px] rounded-[8px] text-[15px] font-semibold text-navy-900 hover:bg-navy-50 transition-colors">
            Sign in
          </a>
          <button className="lg:hidden text-navy-900 w-[44px] h-[44px] flex items-center justify-center" onClick={() => setMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {mega && (
        <div 
          className="hidden lg:block absolute left-0 right-0 top-full bg-white border-b border-line shadow-overlay animate-in fade-in slide-in-from-top-2 duration-250 z-40"
          onMouseEnter={() => setMega(mega)}
          onMouseLeave={() => setMega(null)}
        >
          <div className="max-w-container mx-auto p-[32px_24px] grid grid-cols-[1fr_1fr_1.4fr] gap-[32px]">
            {MEGA[mega]?.map((col, i) => (
              <ul key={i} className="flex flex-col gap-[4px]">
                {col.map(link => (
                  <li key={link}>
                    <a href="#" className="inline-block py-[8px] text-[15px] font-medium text-navy-900 hover:text-navy-700 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            ))}
            <div>{/* Featured area placeholder */}</div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-[rgba(11,32,70,0.40)] backdrop-blur-md flex justify-end transition-opacity">
          <div className="w-[80%] max-w-sm bg-white h-full shadow-overlay flex flex-col p-6 animate-in slide-in-from-right">
            <div className="flex justify-between items-center mb-8">
              <Wordmark />
              <button onClick={() => setMenuOpen(false)} className="text-navy-900">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-6">
              {NAV.map((item) => (
                <Link key={item.href}
                  href={item.href || '#'}
                  className={cn(
                    'text-lg font-bold font-display text-navy-900',
                    pathname === item.href && 'text-brand-red'
                  )}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-4">
              <button className="bg-navy-50 text-navy-900 px-4 py-3 rounded-md text-sm font-bold flex items-center justify-center gap-2">
                <Search className="w-4 h-4" /> Search
              </button>
              <button className="bg-brand-red text-white px-4 py-3 rounded-md text-sm font-bold">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
