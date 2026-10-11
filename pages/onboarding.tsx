import React from 'react';
import Head from 'next/head';

const Onboarding: React.FC = () => (
  <>
    <Head>
      <title>Onboarding</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <div dangerouslySetInnerHTML={{ __html: `<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">



<script src="2738e2e6-31d9-4ae9-8f49-c2c67e388c42"></script>
</head>
<body>

<x-dc>
<helmet>
  <style>/* Webfonts — Google Fonts (Montserrat display, Inter UI, Source Serif 4 reading) */
/* cyrillic-ext */
@font-face {font-family: 'Inter';font-style: normal;font-weight: 400;font-display: swap;src: url("e5d85730-a13a-493a-863d-eb71f4b0aa74") format('woff2');unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;}
/* ... (styles truncated for brevity) */
</style>
  <style>:root {
  /* Brand primitives (strict) */
  --navy-900: #0B2046;
  --navy-950: #071631;
  --navy-700: #13306A;
  --navy-50: #EEF1F7;
  --royal: #1E3F8F;
  --brand-red: #D8121B;
  --red-700: #B30F16;
  --red-50: #FCEBEC;
  --blush: #F3D9DC;
  --white: #FFFFFF;
  --ink: #0F172A;
  --slate: #5B6478;
  --slate-300: #A3ACBF; /* meta text on navy — slate fails AA on navy */
  --line: #E3E7EF;
  --line-dark: rgba(255,255,255,0.14);
  --console-bg: #F7F8FB;

  /* Semantic aliases */
  --surface-page: var(--white);
  --surface-card: var(--white);
  --surface-tint: var(--navy-50);
  --surface-inverse: var(--navy-900);
  --surface-inverse-deep: var(--navy-950);
  --surface-console: var(--console-bg);
  --surface-skeleton: var(--navy-50);

  --text-body: var(--ink);
  --text-heading: var(--navy-900);
  --text-meta: var(--slate);
  --text-on-inverse: var(--white);
  --text-meta-on-inverse: var(--slate-300);
  --text-accent: var(--brand-red);
  --text-error: var(--red-700);

  --border: var(--line);
  --border-strong: #C9D0DD;
  --border-inverse: var(--line-dark);

  --accent: var(--brand-red);
  --accent-hover: var(--red-700);
  --primary: var(--navy-900);
  --primary-hover: var(--navy-700);
  --focus-ring: var(--royal);

  --overlay: rgba(11,32,70,0.40);
  --hero-gradient: linear-gradient(20deg, rgba(7,22,49,0.92) 0%, rgba(11,32,70,0.55) 45%, rgba(11,32,70,0) 75%);
  --dot-grid: radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1.2px);
  --dot-grid-size: 18px 18px;
}
</style>
  <style>:root {
  --font-display: "Montserrat", "Clash Display", system-ui, sans-serif;
  --font-ui: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-serif: "Source Serif 4", "Source Serif Pro", Georgia, serif;

  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;
  --weight-black: 800;

  --tracking-display: -0.02em;
  --tracking-heading: -0.01em;
  --tracking-kicker: 0.08em;

  /* Scale — desktop (mobile overrides below) */
  --fs-display: 72px;  --lh-display: 76px;
  --fs-h1: 48px;       --lh-h1: 56px;
  --fs-h2: 32px;       --lh-h2: 40px;
  --fs-h3: 22px;       --lh-h3: 30px;
  --fs-body: 17px;     --lh-body: 28px;
  --fs-article: 19px;  --lh-article: 32px;
  --fs-meta: 13px;     --lh-meta: 18px;
  --fs-kicker: 12px;   --lh-kicker: 16px;
  --fs-label: 11px;
  --measure: 68ch;
}
@media (max-width: 767px) {
  :root {
    --fs-display: 40px; --lh-display: 44px;
    --fs-h1: 32px;      --lh-h1: 38px;
    --fs-h2: 24px;      --lh-h2: 30px;
    --fs-h3: 19px;      --lh-h3: 26px;
    --fs-article: 17px; --lh-article: 28px;
  }
}
</style>
  <style>:root {
  /* 8px base */
  --space-0: 0;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 40px;
  --space-8: 48px;
  --space-9: 64px;
  --space-10: 80px;
  --space-11: 96px;

  --container: 1280px;
  --gutter: 24px;
  --margin... (content truncated) </style>
</helmet>
</x-dc>
</body></html>` }} />
  </>
);

export default Onboarding;
