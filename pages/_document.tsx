import { Html, Head, Main, NextScript } from 'next/document'

// Resolve the saved preference before the first paint, including blocked storage.
const themeInit = `(function(){var p='system';try{p=localStorage.getItem('tb-theme')||'system'}catch(e){}var d=p==='dark'||(p!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;r.dataset.theme=d?'dark':'light';r.style.colorScheme=d?'dark':'light'})();`

export default function Document() {
  return <Html lang="en" suppressHydrationWarning>
    <Head><script id="tb-theme-init" dangerouslySetInnerHTML={{ __html: themeInit }} /></Head>
    <body><Main /><NextScript /></body>
  </Html>
}
