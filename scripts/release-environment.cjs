const fs = require('node:fs');
const path = require('node:path');
function approvedLegalContent(document) {
  if (document?.version !== 1) return false;
  return ['Nigeria', 'Australia'].every(edition => {
    const publisher = document.publishers?.[edition];
    return publisher?.approved === true && typeof publisher.name === 'string' && publisher.name.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(publisher.contactEmail || '') &&
      ['terms', 'privacy', 'sponsored'].every(key => {
        const policy = document.policies?.[edition]?.[key];
        const at = Date.parse(policy?.approvedAt);
        const ids = new Set();
        return policy?.status === 'approved' && typeof policy.title === 'string' && policy.title.trim() && typeof policy.version === 'string' && policy.version.trim() &&
          typeof policy.approvedBy === 'string' && policy.approvedBy.trim() && Number.isFinite(at) && at <= Date.now() &&
          Array.isArray(policy.sections) && policy.sections.length > 0 && policy.sections.every(section => {
            if (!/^[a-z][a-z0-9-]*$/.test(section.id || '') || ids.has(section.id)) return false;
            ids.add(section.id);
            return typeof section.heading === 'string' && section.heading.trim() && Array.isArray(section.paragraphs) &&
              section.paragraphs.length > 0 && section.paragraphs.every(text => typeof text === 'string' && text.trim());
          });
      });
  });
}
function validateBuildEnvironment(env, legal = JSON.parse(fs.readFileSync(path.join(__dirname, '../contracts/legal-content.json'), 'utf8'))) {
  const target = env.BUILDER_BUILD_TARGET || (env.NODE_ENV === 'production' ? 'release' : 'preview');
  if (!['preview', 'release'].includes(target)) throw new Error('BUILDER_BUILD_TARGET must be preview or release.');
  if (env.NODE_ENV !== 'production') return { target, release: false };
  if (env.NEXT_PUBLIC_DESIGN_PREVIEW === 'true') throw new Error('Design preview is development-only.');
  const parse = name => {
    if (!env[name]) throw new Error('Missing required build configuration: ' + name);
    const value = new URL(env[name]);
    if (value.username || value.password || value.search || value.hash) throw new Error('Invalid release URL: ' + name);
    return value;
  };
  const app = parse('NEXT_PUBLIC_APP_URL');
  const api = parse('NEXT_PUBLIC_API_URL');
  if (app.pathname !== '/' || api.pathname !== '/api/v1') throw new Error('Use an application origin and a versioned /api/v1 API URL.');
  if (!env.BUILDER_SSR_SECRET || env.BUILDER_SSR_SECRET.length < 32) throw new Error('A server-only BUILDER_SSR_SECRET of at least 32 characters is required.');
  if (target === 'preview') {
    const loopback = value => ['localhost', '127.0.0.1', '[::1]'].includes(value.hostname) && ['http:', 'https:'].includes(value.protocol);
    if (!loopback(app) || !loopback(api)) throw new Error('Preview builds are restricted to loopback frontend/API origins.');
  } else {
    if (app.protocol !== 'https:' || api.protocol !== 'https:' || app.port || api.port || !['thebuilderng.com', 'www.thebuilderng.com'].includes(app.hostname) || !(api.hostname === 'thebuilderng.com' || api.hostname.endsWith('.thebuilderng.com')))
      throw new Error('Release origins must use approved same-site HTTPS domains.');
    if (env.SESSION_COOKIE_NAME !== 'the_builder_session') throw new Error('Configure the approved session cookie name.');
    if (!env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || /^[123]x0/.test(env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) || /replace|example|placeholder/i.test(env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)) throw new Error('A real production Turnstile site key is required.');
    if (!approvedLegalContent(legal)) throw new Error('Publisher-approved legal documents and confirmed contacts are required for both editions.');
  }
  return { target, release: target === 'release' };
}
function buildIdentity(env) {
  return Object.fromEntries(['BUILDER_BUILD_TARGET','NEXT_PUBLIC_APP_URL','NEXT_PUBLIC_API_URL','NEXT_PUBLIC_TURNSTILE_SITE_KEY','NEXT_PUBLIC_EVENTS_ENABLED','NEXT_PUBLIC_DESIGN_PREVIEW','SESSION_COOKIE_NAME'].map(key => [key, env[key] || (key === 'BUILDER_BUILD_TARGET' ? 'release' : '')]));
}
function assertBuildIdentity(env, receipt, buildId, legalHash) {
  if (receipt?.version !== 1 || receipt.buildId !== buildId || receipt.legalSha256 !== legalHash || JSON.stringify(receipt.configuration) !== JSON.stringify(buildIdentity(env)))
    throw new Error('Build/runtime configuration mismatch. Rebuild this frontend for the intended environment; preview artifacts cannot be promoted.');
}
module.exports = { approvedLegalContent, validateBuildEnvironment, buildIdentity, assertBuildIdentity };
if (require.main === module) {
  require('@next/env').loadEnvConfig(path.join(__dirname, '..'), false);
  try { validateBuildEnvironment({ ...process.env, NODE_ENV: 'production', BUILDER_BUILD_TARGET: 'release' }); console.log('Release environment and legal-content preflight passed.'); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
