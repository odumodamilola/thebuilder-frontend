const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '../..');
const apiDir = path.join(root, '.replatform/laravel12-backend');
const runtime = path.join(root, '.replatform/runtime');
const php = process.env.PHP_BINARY || 'C:/tools/php85/php.exe';
const api = process.env.BUILDER_LOCAL_API_URL || 'http://localhost:8000';
const previewOrigin = new URL(api);
assert(previewOrigin.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(previewOrigin.hostname) && previewOrigin.pathname === '/' && !previewOrigin.username && !previewOrigin.password && !previewOrigin.search && !previewOrigin.hash, 'HTTP acceptance requires a loopback API origin');
const frontend = 'http://localhost:3000';
const passed = [];
function record(name) { passed.push(name); console.log('PASS ' + name); }
function cli(args) {
  const result = spawnSync(php, ['-d', 'extension=sodium', '-d', 'extension=curl', '-d', 'extension=gd', ...args], { cwd: apiDir, encoding: 'utf8', timeout: 60000 });
  if (result.status !== 0) throw new Error('Isolated preview CLI precondition or queue processing failed.');
}
function client() {
  const cookies = new Map();
  async function request(endpoint, { method = 'GET', body, headers = {}, csrf = true, expected = 200 } = {}) {
    const url = endpoint.startsWith('/sanctum') || endpoint.startsWith('/api/') ? api + endpoint : api + '/api/v1' + endpoint;
    const response = await fetch(url, { method, redirect: 'manual', signal: AbortSignal.timeout(30000), headers: { Accept: 'application/json', Origin: frontend, 'X-Requested-With': 'XMLHttpRequest', Cookie: [...cookies].map(([name, value]) => name + '=' + value).join('; '), ...(body && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}), ...(csrf && cookies.has('XSRF-TOKEN') ? { 'X-XSRF-TOKEN': decodeURIComponent(cookies.get('XSRF-TOKEN')) } : {}), ...headers }, body: body ? body instanceof FormData ? body : JSON.stringify(body) : undefined });
    for (const header of response.headers.getSetCookie()) { const pair = header.split(';')[0]; const separator = pair.indexOf('='); cookies.set(pair.slice(0, separator), pair.slice(separator + 1)); }
    assert.equal(response.status, expected, `${method} ${endpoint.split('?')[0]} returned an unexpected status`);
    const text = await response.text();
    return { data: text && response.headers.get('content-type')?.includes('json') ? JSON.parse(text) : null, headers: response.headers, text };
  }
  return { request, cookies, csrf: () => request('/sanctum/csrf-cookie', { expected: 204 }) };
}
function totp() {
  const counter = Buffer.alloc(8); counter.writeBigUInt64BE(BigInt(Math.floor(Date.now() / 30000)));
  const hash = crypto.createHmac('sha1', Buffer.from('12345678901234567890')).update(counter).digest();
  const offset = hash[19] & 15;
  return String((hash.readUInt32BE(offset) & 0x7fffffff) % 1000000).padStart(6, '0');
}
async function main() {
  cli([path.join(runtime, 'assert-preview.php')]);
  cli(['artisan', 'cache:clear']);
  const reader = client();
  await reader.csrf();
  await reader.request('/auth/login', { method: 'POST', body: { email: 'nobody@example.test', password: 'NoRealPassword42' }, csrf: false, expected: 419 });
  record('Real HTTP CSRF rejects a mutation with an omitted token');
  const email = 'integration-' + crypto.randomUUID() + '@example.test';
  const password = 'Verified-' + crypto.randomBytes(16).toString('hex') + '42';
  const registration = await reader.request('/auth/register', { method: 'POST', body: { name: 'Integration reader', email, password, roles: ['admin'] }, expected: 201 });
  assert.deepEqual(registration.data.data.roles, ['registered_user']);
  assert(registration.headers.getSetCookie().some(cookie => cookie.includes('the_builder_session=') && /httponly/i.test(cookie)));
  await reader.request('/me/profile', { expected: 403 });
  record('Registration issues an HttpOnly session, ignores client roles and gates unverified accounts');
  const logPath = path.join(apiDir, 'storage/logs/laravel.log');
  const logOffset = fs.existsSync(logPath) ? fs.statSync(logPath).size : 0;
  cli(['artisan', 'queue:work', 'database', '--queue=mail', '--stop-when-empty', '--max-jobs=30', '--max-time=30']);
  const mail = fs.readFileSync(logPath).subarray(logOffset).toString().replace(/=\r?\n/g, '').replace(/=3D/gi, '=').replaceAll('&amp;', '&');
  const verification = mail.split(/[\s"<>]+/).find(value => value.startsWith(api + '/api/v1/auth/email/verify/'));
  assert(verification, 'The queued verification mail must contain its signed verification URL');
  const verificationUrl = new URL(verification);
  assert(/^[a-f0-9]{64}$/.test(verificationUrl.searchParams.get('signature')||''),'Mail signature parsing must preserve its hexadecimal value');
  await reader.request(verificationUrl.pathname + verificationUrl.search, { expected: 302 });
  assert((await reader.request('/me')).data.data.emailVerified);
  record('Queued verification mail produces a working signed URL and verifies the account');
  const categories = (await reader.request('/categories')).data.data.slice(0, 3).map(category => category.slug);
  await reader.request('/me/onboarding', { method: 'PUT', body: { interests: categories, country: 'Nigeria', city: 'Lagos', profession: 'Reader' } });
  await reader.request('/me/profile', { method: 'PATCH', body: { name: 'Verified integration reader', biography: 'A local integration fixture.', privacy: { biography: 'private' } } });
  assert.equal((await reader.request('/me/profile')).data.data.user.name, 'Verified integration reader');
  record('Onboarding, interests and profile changes persist through the API');
  const story = (await reader.request('/home')).data.data.lead;
  assert(story?.id, 'The isolated preview must contain its clearly marked article fixture');
  await reader.request('/me/bookmarks/' + story.id, { method: 'PUT', expected: 204 });
  assert((await reader.request('/me/bookmarks/' + story.id)).data.data.saved);
  await reader.request('/me/recent/' + story.id, { method: 'PUT', expected: 204 });
  assert((await reader.request('/me/recent')).data.data.some(article => article.id === story.id));
  await reader.request('/me/bookmarks/' + story.id, { method: 'DELETE', expected: 204 });
  assert.equal((await reader.request('/me/bookmarks/' + story.id)).data.data.saved, false);
  record('Reader bookmarks and reading history persist with correct removal');
  const admin = client(); await admin.csrf();
  const credentials = JSON.parse(fs.readFileSync(path.join(runtime, 'preview-user.json'), 'utf8'));
  await admin.request('/auth/login', { method: 'POST', body: credentials });
  await admin.request('/console/dashboard', { expected: 403 });
  await admin.request('/auth/mfa/challenge', { method: 'POST', body: { code: totp() }, expected: 204 });
  await admin.request('/console/dashboard');
  record('Privileged login requires a real MFA challenge before console access');
  cli([path.join(runtime,'create-media-fixture.php')]);
  const imageForm=new FormData();
  imageForm.append('file',new Blob([fs.readFileSync(path.join(runtime,'http-media-fixture.png'))],{type:'image/png'}),'local-acceptance.png');
  imageForm.append('alt','Generated local HTTP media acceptance fixture');
  const media=(await admin.request('/console/media',{method:'POST',body:imageForm,expected:201})).data.data;
  try {
    const mediaResponse=await fetch(media.url,{signal:AbortSignal.timeout(10000)});assert.equal(mediaResponse.status,200);assert(mediaResponse.headers.get('content-type').includes('image/webp'));
    const mediaBytes=Buffer.from(await mediaResponse.arrayBuffer());assert.equal(mediaBytes.toString('ascii',0,4),'RIFF');assert.equal(mediaBytes.toString('ascii',8,12),'WEBP');
    record('Multipart media upload re-encodes and serves a real public WebP asset');
  } finally {await admin.request('/console/media/'+media.id,{method:'DELETE',expected:204});}

  let article = (await admin.request('/console/content', { method: 'POST', body: { title: 'HTTP acceptance ' + crypto.randomUUID(), summary: 'Created, reviewed and published through actual HTTP requests.', body: '<p>Accepted editorial body.</p><script>window.bad=true</script>', categoryId: (await admin.request('/categories')).data.data[0].id }, expected: 201 })).data.data;
  assert(!article.body.includes('<script>'));
  await reader.request('/console/content/' + article.id + '/transition', { method: 'POST', body: { status: 'published' }, headers: { 'If-Match': String(article.version) }, expected: 403 });
  await admin.request('/articles/' + article.slug, { expected: 404 });
  for (const status of ['review', 'approved', 'published']) article = (await admin.request('/console/content/' + article.id + '/transition', { method: 'POST', body: { status }, headers: { 'If-Match': String(article.version) } })).data.data;
  assert.equal((await reader.request('/articles/' + article.slug)).data.data.title, article.title);
  const rendered = await fetch(frontend + '/stories/' + article.slug);
  assert.equal(rendered.status, 200); assert((await rendered.text()).includes(article.title));
  record('Editor create → submit → approve → publish is sanitized, authorized and visible in the built frontend');
  const contentQuery = new URLSearchParams({q: article.title, status: 'published', edition: 'both'});
  const matchingContent = (await admin.request('/console/content?' + contentQuery)).data;
  assert.equal(matchingContent.meta.total, 1); assert.equal(matchingContent.data[0].id, article.id);
  contentQuery.set('edition', 'Australia');
  assert.equal((await admin.request('/console/content?' + contentQuery)).data.meta.total, 0);
  record('Console content queries combine search, workflow status and edition on the API');
  const nominationBody = { type: 'Builder', name: 'Local nominated builder', industry: 'Technology', country: 'Nigeria', city: 'Lagos', reason: 'This is a local acceptance nomination with sufficient editorial context for review.', submitterName: 'Integration reader', submitterEmail: email, relationship: 'Colleague', consent: true };
  const idempotency = crypto.randomUUID();
  const nomination = await reader.request('/nominations', { method: 'POST', body: nominationBody, headers: { 'Idempotency-Key': idempotency }, expected: 201 });
  const replay = await reader.request('/nominations', { method: 'POST', body: nominationBody, headers: { 'Idempotency-Key': idempotency }, expected: 201 });
  assert.equal(replay.data.data.reference, nomination.data.data.reference);
  const nominations = (await admin.request('/console/nominations')).data.data;
  const storedNomination = nominations.find(item => item.reference === nomination.data.data.reference); assert(storedNomination);
  await admin.request('/console/nominations/' + storedNomination.id, { method: 'PATCH', body: { status: 'review' } });
  record('Nomination retries keep one reference and the record reaches editorial review');
  const readerId = registration.data.data.id;
  await admin.request('/console/users/' + readerId, { method: 'PATCH', body: { roles: ['content_editor'] } });
  await reader.request('/console/dashboard', { expected: 403 });
  assert((await admin.request('/console/audit')).data.data.some(event => event.event === 'user.updated' && event.subject_id === readerId));
  await admin.request('/console/users/' + readerId, { method: 'PATCH', body: { roles: ['registered_user'] } });
  record('Role changes enforce MFA and produce an audit record');
  const originalSettings=(await admin.request('/console/settings')).data.data;
  const restoredSettings={siteName:originalSettings.siteName||'The Builder',description:originalSettings.description??'Telling the stories of African entrepreneurs, startups, professionals and diaspora builders.',contactEmail:originalSettings.contactEmail||null,footer:originalSettings.footer??'© The Builder. Powered by Osun Tech Exchange',menus:originalSettings.menus??null,socialLinks:originalSettings.socialLinks||{}};
  try {
    await admin.request('/console/settings',{method:'PUT',body:{menus:[{label:'Local acceptance stories',url:'/stories'}],socialLinks:{youtube:'https://www.youtube.com/@example'},footer:'Local HTTP footer acceptance'}});
    const publicSettings=(await reader.request('/settings/public')).data.data;
    assert.equal(publicSettings.footer,'Local HTTP footer acceptance');
    const rendered=await fetch(frontend+'/stories');assert.equal(rendered.status,200);const page=await rendered.text();
    assert(page.includes('Local acceptance stories')&&page.includes('Local HTTP footer acceptance')&&page.includes('href="https://www.youtube.com/@example"'));
    record('Saved public navigation, footer and social settings reach the built SSR frontend');
  } finally {
    await admin.request('/console/settings',{method:'PUT',body:restoredSettings});
  }
  const cspPage = await fetch(frontend + '/signin'); const html = await cspPage.text();
  const theme = html.match(/<script[^>]*id="tb-theme-init"[^>]*>([\s\S]*?)<\/script>/); assert(theme);
  assert(cspPage.headers.get('content-security-policy').includes('sha256-' + crypto.createHash('sha256').update(theme[1]).digest('base64')));
  const privatePage = await fetch(frontend + '/console', { redirect: 'manual' }); assert.equal(privatePage.status, 307); assert(privatePage.headers.get('location').includes('/signin'));
  assert.equal((await fetch(frontend + '/stories/this-record-does-not-exist')).status, 404);
  record('Built frontend enforces private navigation, real 404s and the exact theme CSP hash');
  await reader.request('/auth/logout', { method: 'POST', expected: 204 });
  await reader.request('/me', { expected: 401 });
  record('Logout invalidates the HTTP session');
  const report = { date: new Date().toISOString(), transport: 'Real HTTP against isolated MySQL preview and production frontend build', passed, liveServicesTested: false };
  fs.writeFileSync(path.join(runtime, 'http-integration-results.json'), JSON.stringify(report, null, 2));
  console.log(`${passed.length} HTTP integration checks passed. No production or external email service was used.`);
}
main().catch(error => { console.error('FAIL ' + error.message); process.exitCode = 1; });
