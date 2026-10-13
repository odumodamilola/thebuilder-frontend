import { useRouter } from 'next/router'
import Header from './Header'
import Footer from './Footer'

type ShellKind = 'public' | 'focused' | 'console'

function shellForPath(pathname: string): ShellKind {
  if (pathname.startsWith('/console')) return 'console'
  if (/^\/(signin|login|signup|register|forgot-password|reset-password|verify|verify-email|mfa|mfa-setup|onboarding)(\/|$)/.test(pathname)) return 'focused'
  return 'public'
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useRouter()
  const shell = shellForPath(pathname)

  if (shell !== 'public') {
    return <div className={shell === 'console' ? 'min-h-screen bg-[var(--surface-console)]' : 'min-h-screen bg-surface-page'}>{children}</div>
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface-page text-text-body">
      <a href="#main-content" className="tb-skip-link">Skip to main content</a>
      <Header />
      <div id="main-content" tabIndex={-1} className="flex-1 outline-none">{children}</div>
      <Footer />
    </div>
  )
}
