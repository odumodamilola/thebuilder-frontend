import Link from 'next/link'
import Wordmark from '../brand/Wordmark'
import NewsletterForm from '../ui/NewsletterForm'
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react'

const columns: Array<{ title: string; links: Array<[string, string]> }> = [
  { title: 'Explore', links: [['Stories', '/stories'], ['Startups', '/startups'], ['Diaspora', '/diaspora'], ['Industries', '/industries'], ['Videos', '/videos'], ['Opportunities', '/opportunities']] },
  { title: 'Builders', links: [['The Builders', '/builders'], ['Nominate a Builder', '/nominate'], ['Builder of the Month', '/builders'], ['Submit a story', '/account?tab=submit']] },
  { title: 'Company', links: [['About', '/about'], ['Editorial standards', '/about#standards'], ['Advertise with us', '/about#advertise'], ['Contact', '/about#contact']] },
  { title: 'Legal', links: [['Terms', '/terms'], ['Privacy', '/privacy'], ['Cookies', '/system?state=cookie'], ['Sponsored content policy', '/about#sponsored']] },
]

export default function Footer() {
  return (
    <footer className="bg-[var(--surface-inverse-deep)] px-4 py-16 text-[var(--text-on-inverse)] md:px-6 md:py-20">
      <div className="mx-auto grid max-w-container gap-12 md:grid-cols-2 lg:grid-cols-[1.55fr_repeat(4,1fr)] lg:gap-10">
        <div>
          <Wordmark inverse />
          <p className="mt-6 max-w-[360px] text-sm leading-6 text-[var(--text-meta-on-inverse)]">Telling the stories of African entrepreneurs, startups, professionals and diaspora builders.</p>
          <p className="text-sm leading-6 text-[var(--text-meta-on-inverse)]">Innovate · Connect · Grow.</p>
          <p className="mb-3 mt-8 text-sm font-semibold text-[var(--text-on-inverse)]">The Friday Builder newsletter</p>
          <NewsletterForm />
        </div>
        {columns.map(column => (
          <div key={column.title}>
            <h2 className="mb-6 text-[11px] font-bold uppercase tracking-[.08em] text-[var(--text-on-inverse)]">{column.title}</h2>
            <ul className="space-y-3 text-sm text-[var(--text-meta-on-inverse)]">
              {column.links.map(([label, href]) => <li key={label}><Link href={href} className="hover:text-[var(--text-on-inverse)]">{label}</Link></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-14 flex max-w-container flex-col gap-6 border-t border-[var(--border-inverse)] pt-8 text-xs text-[var(--text-meta-on-inverse)] md:flex-row md:items-center md:justify-between">
        <p>© The Builder. Powered by Osun Tech Exchange</p>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-[var(--border-inverse)] px-3 py-1 text-[var(--text-on-inverse)]">Nigeria</span>
          <span className="px-2 py-1">Australia</span>
          <span className="mx-1 h-6 w-px bg-[var(--surface-card)]/15" />
          <div aria-label="Social profiles are coming soon" className="flex gap-2">
            {[Linkedin, Twitter, Instagram, Youtube, Facebook].map((Icon, index) => <span key={index} className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-inverse)]"><Icon aria-hidden="true" className="h-3.5 w-3.5" /></span>)}
          </div>
        </div>
      </div>
    </footer>
  )
}
