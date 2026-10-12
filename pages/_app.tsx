import React from 'react';
import '../styles/globals.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/800.css';
import '@fontsource/source-serif-4/400.css';
import '@fontsource/source-serif-4/600.css';
import type { AppProps } from 'next/app';
import { EditionProvider } from '@/context/EditionContext';
import { ToastProvider } from '@/context/ToastContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AppShell } from '@/components/layout/AppShell';

export default function MyApp({ Component, pageProps }: AppProps) {
  // In development, clean up any stray service workers that might cache old chunks
  React.useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((reg) => reg.unregister());
      });
    }
  }, []);

  return (
    <EditionProvider>
      <ThemeProvider>
        <ToastProvider>
          <AppShell><Component {...pageProps} /></AppShell>
        </ToastProvider>
      </ThemeProvider>
    </EditionProvider>
  );
}
