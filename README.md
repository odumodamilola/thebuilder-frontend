# The Builder frontend

Connected Next.js 16 Pages Router / React 19 frontend for the clean Laravel 12 `/api/v1` candidate. The approved visual system and HTML-screen loaders are preserved. Use Node 22 or 24 LTS and the locked npm install.

## Local setup

Run `npm ci`, copy `.env.example` to a private `.env.local`, configure the loopback frontend/API URLs, and set `BUILDER_BUILD_TARGET=preview`. Generate a private random signing value of at least 32 characters and set the identical `BUILDER_SSR_SECRET` in the frontend server and Laravel environment. Never prefix that variable with `NEXT_PUBLIC_` or expose it in page props. Then run `npm run dev`, or `npm run build` followed by `npm start` for a local production-mode preview.

SSR reads use signed anonymous requests on an explicit public-path allowlist, a bounded two-second cache (256 entries / 8 MiB), and request coalescing. Laravel applies a separate bounded service budget; unsigned browser requests retain their IP limit. No visitor IP header is trusted for this purpose. Article details and public settings are not cached in this transport.

`npm run dev` explicitly uses Webpack. The installed Next.js Turbopack development server returns JSON for `_clientMiddlewareManifest.js`, which the browser attempts to execute as JavaScript. Keep `X-Content-Type-Options: nosniff` enabled; do not work around this by relabeling JSON or weakening browser protections. After switching bundlers, stop the previous dev server and reload the page. If the console reports hydration differences containing only `bis_skin_checked`, test in a browser profile without content-modifying extensions; those attributes are not emitted by this application.

Start the clean API from `.replatform/laravel12-backend` on the port configured in `.env.local` (currently `8012`). Starting the preserved legacy `backend` on another port does not satisfy that connection. The local preview also requires its configured database on port `3307`; XAMPP on `3306` is a separate database server.

## Quality checks

Run `npm run type-check`, `npm run lint`, `npm run check:theme`, `npm run check:settings`, `npm run check:auth`, `npm run check:editorial`, `npm run check:contract`, `npm run check:release`, `npm run format:check`, and `npm run build`.

`check-local-integration.cjs` and `check-local-release.cjs` require the guarded disposable MySQL preview and running frontend/API. They must never target production. The latter also verifies functional concurrency, real story redirects, legal edition rendering, sitemap and private-key exclusion from browser assets.

CI is consolidated in `.github/workflows/quality.yml` on Node 22/24. Its loopback build is explicitly a preview, not a production release. The full tooling audit has a dated, bounded risk policy in `contracts/tooling-risk.json`; runtime audit failures or new/changed/expired tooling risks block CI. No unpatched upstream advisory is represented as fixed.

## Release preparation

Use `.env.production.example` with the independently verified hosting/origins and real public Turnstile key. `BUILDER_BUILD_TARGET=release` is mandatory for public deployment; missing target defaults to release in production mode and missing/unsafe configuration fails. Preview builds only permit loopback origins. Run `npm run release:preflight` in the configured release environment and build a new immutable artifact. Public `NEXT_PUBLIC_*` values are compiled into the build; restarting with different public values is not a substitute for rebuilding.

Release preflight requires the approved NG same-site topology and confirmed publisher/legal content. `contracts/legal-content.json` contains edition-specific Terms, Privacy and Sponsored Content entries. Insert publisher-approved plain-text sections with unique IDs, heading/paragraphs, version, approval owner and approval timestamp, and confirm publisher contacts. Current entries deliberately remain pending; no legal approval or successful public-release preflight is claimed. The policy routes render the edition cookie on the server and show a noindex pending-publication notice until content is supplied.

Production deployment remains gated by actual hosting support, public HTTPS/CORS/session acceptance, live integrations, production backup/import/restore and rollback evidence, representative load/accessibility acceptance and activation authorization. See the clean API deployment/readiness documentation and the remediation report in `planning/clean-laravel-replatform`.

Builds now seal public configuration, legal-content hash and build ID in .next/builder-build.json. Startup rejects mismatches; changing environment values cannot promote a preview artifact. Use npm run build so the post-build seal is generated.

