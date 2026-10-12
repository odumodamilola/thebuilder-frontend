import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ArrowLeft, Play } from 'lucide-react'

const videoTitles: Record<string, string> = {
  'vid-1': 'The Future of African Fintech',
}

export default function VideoDetailPage() {
  const router = useRouter()
  const id = String(router.query.id ?? 'vid-1')
  const title = videoTitles[id] ?? 'Builder conversation'

  return <>
    <Head><title>{title} · The Builder</title></Head>
    <main className="bg-navy-950 text-white">
      <div className="mx-auto max-w-container px-4 py-10 md:px-6 md:py-16">
        <Link href="/videos" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white"><ArrowLeft size={16}/>All videos</Link>
        <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr] lg:items-center">
          <button type="button" aria-label={`Play ${title}`} className="group relative aspect-video overflow-hidden rounded-xl bg-navy-900 ring-1 ring-white/15">
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_60%_25%,rgba(59,91,174,.55),transparent_45%)]"/>
            <span className="absolute inset-0 grid place-items-center"><span className="grid size-20 place-items-center rounded-full bg-brand-red transition-transform group-hover:scale-105"><Play aria-hidden fill="currentColor"/></span></span>
          </button>
          <div><p className="text-xs font-bold uppercase tracking-[.14em] text-brand-red">Builder video</p><h1 className="mt-3 font-display text-4xl font-extrabold leading-tight md:text-5xl">{title}</h1><p className="mt-5 leading-7 text-slate-300">A candid conversation about the decisions, detours and people behind the work.</p><p className="mt-5 text-sm text-slate-400">12:30 · Published 5 Oct 2026</p></div>
        </div>
      </div>
    </main>
  </>
}
