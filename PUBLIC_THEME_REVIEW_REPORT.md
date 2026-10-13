# Public route dark-mode review

Date: 13 October 2026

## Result

Reviewed all 37 non-console route files and 101 imported/shared source files. Fixed fixed-white surfaces, light-only text/borders, placeholders, controls, skeletons, chips, dialogs, notifications, and media gradients using the existing semantic theme palette. Both explicit dark mode and system-selected dark mode use the same values.

The review found a second defect: Tailwind 3 omits arbitrary CSS-variable color utilities with slash opacity, such as `bg-[var(--surface-card)]/95`. Replaced these across public screens and homepage components with supported `color-mix()` expressions. The production CSS check confirms all 108 theme-aware utilities are emitted. Highlights over inverse/navy sections use the inverse foreground as the tint source so they remain visible in dark mode.

Focus-ring offsets now follow the page surface instead of defaulting to white. Placeholder media gradients and success icons have light/dark values. Existing brand colors, layouts, routing, API calls, form validation, and theme persistence were retained. QR artwork intentionally retains fixed white/navy contrast.

## Route coverage

Source and prerendered HTML were checked for every route listed below. Conditional loading, empty, error, active, and success class branches are included in the source scan; their interactions were not visually exercised in this pass.

| Screen family | Routes |
| --- | --- |
| Home | `/`, `/home` |
| Editorial | `/stories`, `/stories/[slug]`, `/category/[slug]` |
| Directories and profiles | `/builders`, `/builders/[slug]`, `/startups`, `/startups/[slug]`, `/diaspora`, `/diaspora/[region]` |
| Discovery | `/videos`, `/videos/[id]`, `/opportunities`, `/opportunities/[slug]`, `/events`, `/search` |
| Information and forms | `/about`, `/newsletter`, `/nominate`, `/privacy`, `/terms` |
| Account | `/account`, `/onboarding` |
| Authentication | `/signin`, `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`, `/mfa`, `/mfa-setup` |
| System | `/404`, `/500`, `/maintenance`, `/offline`, `/system` |

## Verification executed

- `npm run check:theme`: passed.
  - 93 existing brand token comparisons against `COLOR-TOKENS.md`.
  - 12 first-paint preference/OS/storage scenarios.
  - 37 public route files and 101 imported/shared files scanned for fixed light surfaces and dark text.
  - 36 referenced CSS tokens defined; explicit/system dark palettes match.
  - 33 normal-text contrast comparisons across the core page/card/tint and inverse surfaces.
- `npm run type-check`: passed; the final production build also repeated TypeScript checking.
- `npm run lint`: passed with 0 errors and 54 existing warnings.
- `npm run build`: passed; generated all 53 static pages, including console routes.
- `node scripts/check-public-theme.cjs --build`: passed.
  - All 37 production public HTML screens contain theme initialization and no blocked fixed-light utilities.
  - All 108 referenced theme utilities exist in production CSS, including translucent colors.
  - Generated focus-ring defaults use the selected page surface.
- Git whitespace check (with CRLF endings recognized): passed.

Browser screenshots and live theme-toggle/interactivity comparisons were not executed in this pass because the established browser session rejects localhost navigation under its URL policy. These are source, palette, contrast, first-paint-script, and production-output checks, not a claim of a visual browser pass.

## Files changed

- `pages/account.tsx`
- `pages/nominate.tsx`
- `pages/onboarding.tsx`
- `pages/privacy.tsx`
- `pages/terms.tsx`
- `pages/videos/[id].tsx`
- `src/components/brand/NewsletterForm.tsx`
- `src/components/brand/PosterBand.tsx`
- `src/components/cards/StartupCard.tsx`
- `src/components/cards/VideoCard.tsx`
- `src/components/circuit-line.tsx`
- `src/components/layout/AppShell.tsx`
- `src/components/layout/PagePrimitives.tsx`
- `src/components/media.tsx`
- `src/components/ui/Badge.tsx`
- `src/components/ui/Breadcrumb.tsx`
- `src/components/ui/Button.tsx`
- `src/components/ui/checkbox.tsx`
- `src/components/ui/Headline.tsx`
- `src/components/ui/Icon.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/Modal.tsx`
- `src/components/ui/ReadingProgressBar.tsx`
- `src/components/ui/SearchPalette.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/ShareButtons.tsx`
- `src/components/ui/SiteHeader.tsx`
- `src/components/ui/Skeleton.tsx`
- `src/components/ui/StatusPill.tsx`
- `src/components/ui/textarea.tsx`
- `src/components/ui/Toast.tsx`
- `src/features/explore/ExploreScreens.tsx`
- `src/features/editorial/EditorialPages.tsx`
- `src/features/account/AuthScreen.tsx`
- `src/features/account/fields.tsx`
- `src/components/cards/StoryCard.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/UtilityBar.tsx`
- `src/components/sections/HomeHero.tsx`
- `src/components/sections/HomeNominate.tsx`
- `src/components/sections/HomeSpotlight.tsx`
- `src/components/sections/HomeVideos.tsx`
- `src/components/ui/NewsletterForm.tsx`
- `styles/globals.css`
- `tailwind.config.ts`
- `package.json`
- `scripts/check-public-theme.cjs`

The new `npm run check:theme` command provides a repeatable regression check. Run `node scripts/check-public-theme.cjs --build` after a build to additionally verify prerendered screens and generated CSS.

