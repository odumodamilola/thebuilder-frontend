// Mechanical migration of homepage utility colors to COLOR-TOKENS.md roles.
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const files = [
  ...fs.readdirSync(path.join(root, 'src/components/sections')).filter(n => /^Home.*\.tsx$/.test(n)).map(n => `src/components/sections/${n}`),
  ...['layout/Header', 'layout/Footer', 'layout/UtilityBar', 'brand/Wordmark', 'cards/StoryCard', 'cards/BuilderCard', 'cards/OpportunityRow', 'ui/PlaceholderImage', 'ui/Kicker', 'ui/SectionTitle', 'ui/NewsletterForm'].map(n => `src/components/${n}.tsx`),
];
const map = {
  'bg-navy-950': 'bg-[var(--surface-inverse-deep)]', 'bg-navy-900': 'bg-[var(--surface-inverse)]',
  'bg-navy-50': 'bg-[var(--surface-tint)]', 'bg-royal': 'bg-[var(--decoration-royal)]',
  'bg-brand-red': 'bg-[var(--accent)]', 'bg-red-700': 'bg-[var(--accent-hover)]',
  'bg-red-50': 'bg-[var(--surface-accent-soft)]', 'bg-line': 'bg-[var(--surface-tint)]',
  'bg-slate-100': 'bg-[var(--surface-skeleton)]', 'bg-slate-200': 'bg-[var(--surface-skeleton)]',
  'bg-white': 'bg-[var(--surface-card)]',
  'text-navy-900': 'text-[var(--text-heading)]', 'text-royal': 'text-[var(--text-royal)]',
  'text-brand-red': 'text-[var(--text-accent)]', 'text-red-700': 'text-[var(--text-link-hover)]',
  'text-red-400': 'text-[var(--text-on-inverse)]',
  'text-slate-300': 'text-[var(--text-meta-on-inverse)]',
  'text-slate-400': 'text-[var(--text-meta)]', 'text-slate-600': 'text-[var(--text-meta)]', 'text-slate': 'text-[var(--text-meta)]',
  'text-white': 'text-[var(--text-on-inverse)]',
  'border-line': 'border-[var(--border)]', 'border-white': 'border-[var(--border-inverse)]',
  'border-brand-red': 'border-[var(--accent)]',
  'ring-royal': 'ring-[var(--focus-ring)]', 'ring-white': 'ring-[var(--focus-ring)]',
  'ring-offset-royal': 'ring-offset-[var(--surface-inverse)]',
  'decoration-brand-red': 'decoration-[var(--text-accent)]',
};
for (const file of files) {
  let source = fs.readFileSync(path.join(root, file), 'utf8');
  source = source.replaceAll('bg-[#1e3a8a]', 'bg-[var(--surface-inverse)]')
    .replaceAll('bg-[#1d4ed8]', 'bg-[var(--decoration-royal)]')
    .replaceAll('bg-[radial-gradient(#3b82f6_1.5px,transparent_1.5px)] [background-size:16px_16px]', 'tb-dots')
    .replaceAll('bg-[radial-gradient(circle_at_90%_5%,rgba(30,63,143,.82),transparent_58%)]', 'bg-[radial-gradient(circle_at_90%_5%,var(--decoration-royal),transparent_58%)]')
    .replaceAll('bg-gradient-to-tr from-navy-950/65 via-navy-900/25 to-transparent', '[background:var(--hero-gradient)]')
    .replaceAll('var(--brand-red)', 'var(--accent)')
    .replaceAll("'1px #94a3b8'", "'1px var(--text-meta)'")
    .replaceAll('border-l-white', 'border-l-[var(--text-on-inverse)]');
  if (file.endsWith('HomeSpotlight.tsx')) source = source.replaceAll('text-[var(--text-meta)]', 'text-[var(--text-meta-on-inverse)]');
  if (file.endsWith('HomeTrending.tsx')) source = source.replaceAll('bg-[var(--surface-card)]', 'bg-[var(--surface-tint)]');
  if (file.endsWith('HomeNominate.tsx')) source = source.replace('overflow-hidden bg-[var(--decoration-royal)]', 'overflow-hidden bg-[var(--surface-inverse)]');
  if (file.endsWith('HomeHero.tsx')) source = source.replace('{lead.title}<span className="text-[var(--text-accent)]">.</span>', '{lead.title}.').replace('h-[500px] bg-[var(--surface-tint)]', 'h-[500px] bg-[var(--surface-skeleton)]');
  if (file.endsWith('HomeNominate.tsx') || file.endsWith('HomeDiaspora.tsx')) source = source.replace('<span className="text-[var(--text-accent)]">.</span>', '.');
  if (file.endsWith('Wordmark.tsx')) source = source.replace('<span className="text-[var(--text-accent)]">.</span>', '<span className={inverse ? "text-[var(--text-on-inverse)]" : "text-[var(--text-accent)]"}>.</span>');
  source = source.replace(/(?<![\w-])(?:bg|text|border|ring-offset|ring|decoration)-(?:navy-950|navy-900|navy-50|brand-red|red-700|red-400|red-50|slate-300|slate-400|slate-600|slate-200|slate-100|slate|white|royal|line)(?:\/\d+)?\b/g, token => {
    const [base, alpha] = token.split('/');
    return map[base] ? map[base] + (alpha && base !== 'border-white' ? '/' + alpha : '') : token;
  });
  fs.writeFileSync(path.join(root, file), source);
}
console.log(`Migrated ${files.length} homepage components to semantic colors.`);
