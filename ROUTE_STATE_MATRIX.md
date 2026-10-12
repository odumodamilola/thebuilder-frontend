# Route and state matrix

Verified against the 35 supplied HTML artifacts and `UI_UX_AUDIT/03_DESIGN_SCREEN_CATALOG.md`. Query-state URLs are deterministic UI fixtures for visual review; API mutations are isolated behind `src/features/*/api.ts` for the Laravel integration.

| Screen | Route | Supported `state` values |
|---|---|---|
| SCR-001 | `/` | `default`, `loading`, `sponsored`, `hidden`; `edition=Nigeria\|Australia` |
| SCR-002 | `/stories` | `default`, `loading`, `empty`, `error` |
| SCR-003 | `/category/fintech` (also `/industries/fintech`) | `default`, `subcategory`, `empty-tab`, `loading` |
| SCR-004 | `/builders` | `default`, `loading`, `empty`, `year` |
| SCR-005 | `/builders/[slug]` | `none`, `with-state`, `without-state` |
| SCR-006 | `/startups` | `default`, `advanced` |
| SCR-007 | `/startups/[slug]` | `default`, `logo`, `no-stories` |
| SCR-008 | `/stories/[slug]` | `default`, `loading`, `sponsored`, `comments-soon`, `404` |
| SCR-009 | `/diaspora` | `default` |
| SCR-010 | `/diaspora/australia` | `default` |
| SCR-011 | `/videos` | `default`, `loading`, `empty` |
| SCR-012 | `/opportunities` | `default` |
| SCR-013 | `/opportunities/[slug]` | `default` |
| SCR-014 | `/search` | `default`, `palette`, `loading`, `none`, `short`; `q` |
| SCR-015 | `/newsletter` | `confirmed`, `unsubscribe`, `states` |
| SCR-016 | `/about` | `default` |
| SCR-017 | `/404`, `/500`, `/maintenance`, `/offline`, `/system?state=cookie\|tooltip` | matching state |
| SCR-018 | `/events` | `default` |
| SCR-019 | `/signin` or `/login` | `login`, `login-error`, `login-unverified`, `login-locked` |
| SCR-020 | `/register` | `register`, `register-more` |
| SCR-021 | `/verify-email` | `verify` |
| SCR-022 | `/forgot-password`, `/reset-password` | `forgot`, `forgot-sent`, `reset`, `reset-done` |
| SCR-023 | `/mfa-setup`, `/mfa` | `mfa-setup`, `mfa-codes`, `mfa`, `mfa-error` |
| SCR-024 | `/onboarding` | `step1`, `step2`, `done` |
| SCR-025 | `/account?state=feed` | `feed`, `feed-r2` |
| SCR-026 | `/account?state=saved` | `saved`, `saved-empty` |
| SCR-027 | `/account?state=recent` | `recent` |
| SCR-028 | `/account?state=interests` | `interests` |
| SCR-029 | `/account?state=profile` | `profile`, `profile-preview` |
| SCR-030 | `/account?state=settings` | `settings`, `settings-delete` |
| SCR-031 | `/account?state=submit` | `submit`, `submit-done` |
| SCR-032 | `/console` | `dashboard`, `dashboard-loading` |
| SCR-033 | `/console/content` | `content`, `content-empty` |
| SCR-034 | `/console/editor` | `editor`, `editor-changes`, `editor-history`, `editor-preview`, `editor-reject` |
| SCR-035 | `/console/homepage` | `homepage` |
| SCR-036 | `/console/builders` | `builders`, `builders-consent`, `builders-ready` |
| SCR-037 | `/console/startups` | `startups` |
| SCR-038 | `/console/nominations` | `nominations` |
| SCR-039 | `/console/media` | `media` |
| SCR-040 | `/console/taxonomy` | `taxonomy` |
| SCR-041 | `/console/audit` | `audit` |
| SCR-042 | `/console/analytics` | `analytics` |
| SCR-043 | `/console/submissions` | `submissions` |
| SCR-044 | `/console/ads` | `ads` |
| SCR-045 | `/console/users` | `users`, `users-roles` |
| SCR-046 | `/console/settings` | `settings` |
| SCR-047 | `/console/states` | `state-denied`, `state-session`, `state-unsaved`, `state-rollback` |

Additional advertised routes: `/videos/[id]`, `/privacy`, and `/terms`. `/home`, `/industries`, `/industries/[slug]`, `/team`, and `/careers` are explicit redirects to canonical destinations.
