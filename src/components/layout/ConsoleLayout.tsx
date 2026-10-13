'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';

const NAV = [
  { label: 'Dashboard', icon: 'layout-dashboard', href: '/console' },
  { label: 'Content', icon: 'file-text', href: '/console/content' },
  { label: 'Builders', icon: 'users', href: '/console/builders' },
  { label: 'Startups', icon: 'rocket', href: '/console/startups' },
  { label: 'Homepage', icon: 'layout-template', href: '/console/homepage' },
  { label: 'Nominations', icon: 'inbox', href: '/console/nominations', count: 7 },
  { label: 'Submissions', icon: 'send', href: '/console/submissions', count: 3 },
  { label: 'Media', icon: 'image', href: '/console/media' },
  { label: 'Taxonomy', icon: 'tags', href: '/console/taxonomy' },
  { label: 'Ads & Campaigns', icon: 'megaphone', href: '/console/ads' },
  { label: 'Users & Roles', icon: 'shield', href: '/console/users' },
  { label: 'Settings', icon: 'settings', href: '/console/settings' },
  { label: 'Audit Log', icon: 'scroll-text', href: '/console/audit' },
  { label: 'Analytics', icon: 'line-chart', href: '/console/analytics' }
];

export function ConsoleLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const expanded = !collapsed;
  
  return (
    <div className={`grid min-h-screen min-w-0 grid-cols-1 bg-console-bg font-ui transition-[grid-template-columns] duration-200 ease-standard ${expanded ? 'lg:grid-cols-[248px_minmax(0,1fr)]' : 'lg:grid-cols-[72px_minmax(0,1fr)]'}`}>
      {mobileOpen && <button type="button" aria-label="Close navigation" className="fixed inset-0 z-30 bg-navy-950/40 lg:hidden" onClick={() => setMobileOpen(false)} />}
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 flex h-screen w-[248px] flex-col overflow-hidden bg-navy-950 text-slate-300 transition-transform lg:sticky lg:top-0 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-3.5 border-b border-white/10">
          {expanded && (
            <span className="flex items-center gap-2">
              <span className="font-display font-bold text-white text-lg tracking-tight">The Builder<span className="text-brand-red">.</span></span>
              <span className="text-[11px] font-semibold text-slate-300">Console</span>
            </span>
          )}
          <button
            type="button" 
            onClick={() => setCollapsed(!collapsed)}
            aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
            className="hidden h-9 w-9 items-center justify-center rounded-lg border-0 bg-transparent text-slate-300 transition-colors hover:bg-white/10 lg:flex"
          >
            <Icon name={(expanded ? 'panel-left-close' : 'panel-left-open') as any} className="w-[18px] h-[18px]" />
          </button>
          <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close navigation" className="grid h-9 w-9 place-items-center rounded-lg text-slate-300 hover:bg-white/10 lg:hidden"><Icon name="x" className="h-5 w-5" /></button>
        </div>
        
        <nav aria-label="Console" className="flex-1 overflow-y-auto p-2">
          {NAV.map((n) => {
            const isActive = pathname === n.href || (n.href !== '/console' && pathname?.startsWith(n.href));
            
            return (
              <Link 
                key={n.label} 
                href={n.href}
                onClick={() => setMobileOpen(false)}
                title={expanded ? undefined : n.label}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-3 h-10 px-3 rounded-lg mb-0.5 text-sm whitespace-nowrap no-underline transition-colors ${isActive ? 'font-semibold text-white bg-white/10 shadow-[inset_2px_0_0_var(--brand-red)]' : 'font-medium text-slate-300 bg-transparent hover:bg-white/5 hover:text-white'}`}
              >
                <Icon name={n.icon as any} className="w-[18px] h-[18px]" />
                {expanded && <span className="flex-1">{n.label}</span>}
                {n.count && expanded && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-brand-red text-white">
                    {n.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        
        {expanded && (
          <div className="px-4 py-3 border-t border-white/10 text-xs text-slate-300">
            Times shown in Africa/Lagos (WAT)
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="min-w-0 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-16 min-w-0 items-center gap-2 border-b border-line bg-white px-3 sm:gap-3 sm:px-4 md:px-6">
          <button type="button" onClick={() => setMobileOpen(true)} aria-label="Open navigation" aria-expanded={mobileOpen} className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-navy-900 hover:bg-navy-50 lg:hidden"><Icon name="menu" className="h-5 w-5" /></button>
          <button type="button" className="hidden h-[38px] max-w-[420px] flex-1 items-center gap-2 rounded-lg border border-line bg-white px-3 text-left text-sm font-normal text-slate lg:flex">
            <Icon name="search" className="w-4 h-4" />
            <span className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis">Search content, Builders, users…</span>
            <span className="text-[11px] border border-line rounded px-1.5 py-px">⌘K</span>
          </button>
          
          <div className="ml-auto flex min-w-0 items-center gap-1.5 sm:gap-2.5">
            <div className="relative flex">
              <Link href="/console/editor" className="inline-flex items-center justify-center h-[36px] px-3 bg-navy-900 text-white text-sm font-medium rounded-l-lg hover:bg-navy-700 transition-colors">
                <Icon name="plus" className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">New story</span>
              </Link>
              <button 
                type="button" 
                onClick={() => setNewOpen(!newOpen)} 
                aria-label="More new options" 
                aria-expanded={newOpen}
                className="h-[36px] px-2.5 border-0 border-l border-white/20 rounded-r-lg bg-navy-900 text-white cursor-pointer flex items-center hover:bg-navy-700 transition-colors"
              >
                <Icon name="chevron-down" className="w-4 h-4" />
              </button>
              
              {newOpen && (
                <div role="menu" className="absolute right-0 top-[42px] w-[200px] bg-white border border-line rounded-xl shadow-[0_16px_40px_rgba(7,22,49,0.14)] p-1.5 z-30">
                  {[
                    ['Story', 'file-text', '/console/editor'], 
                    ['Builder', 'user-plus', '/console/builders'], 
                    ['Startup', 'rocket', '/console/startups'], 
                    ['Opportunity', 'briefcase', '/console/content']
                  ].map(([label, icon, href]) => (
                    <Link key={label} role="menuitem" href={href as string} className="flex items-center gap-2.5 h-[38px] px-2.5 rounded-md text-sm text-ink no-underline hover:bg-navy-50 transition-colors">
                      <Icon name={icon as any} className="w-4 h-4 text-slate" />
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <select aria-label="Edition" className="hidden h-[36px] rounded-lg border border-line bg-white px-2.5 font-ui text-[13px] font-semibold text-navy-900 outline-none transition-colors hover:bg-navy-50 md:block">
              <option>🇳🇬 Nigeria</option>
              <option>🇦🇺 Australia</option>
            </select>
            
            <button type="button" aria-label="Notifications, 3 unread" className="relative w-10 h-10 border-0 rounded-lg bg-transparent text-navy-900 cursor-pointer flex items-center justify-center hover:bg-navy-50 transition-colors">
              <Icon name="bell" className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-brand-red border-2 border-white box-content"></span>
            </button>
            
            <div className="flex items-center gap-2.5 pl-2.5 border-l border-line">
              <span aria-hidden="true" className="w-[34px] h-[34px] rounded-full bg-navy-900 text-white flex items-center justify-center font-bold text-[13px] font-ui">
                FO
              </span>
              <div className="hidden leading-[1.2] md:block">
                <div className="text-[13px] font-semibold text-navy-900">Folake Ojo</div>
                <div className="text-[11px] text-slate">Editor-in-Chief</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-w-0 flex-1 p-4 sm:p-5 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
