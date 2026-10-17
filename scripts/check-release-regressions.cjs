const assert = require('node:assert/strict');
const path = require('node:path');
const crypto = require('node:crypto');
const {createLoader} = require('./ts-module.cjs');
const {validateBuildEnvironment, approvedLegalContent, buildIdentity, assertBuildIdentity} = require('./release-environment.cjs');
const {assessToolingAudit, verifyBuildPatterns} = require('./check-tooling-risk.cjs');
const root = path.resolve(__dirname, '..');
const secret = 'test-only-ssr-signing-secret-64-characters-isolated';
let calls = 0;
let clock = Date.now();
const environment = {NEXT_PUBLIC_API_URL:'http://localhost:8012/api/v1', BUILDER_SSR_SECRET: secret};
const load = createLoader({process:{env:environment}, Buffer, Headers, AbortController, AbortSignal, DOMException, setTimeout, clearTimeout, Date: class extends Date {static now(){return clock;}}, fetch:async (url, init) => {
  calls++;
  const parsed = new URL(url);
  const timestamp = init.headers.get('X-Builder-SSR-Timestamp');
  assert.equal(init.headers.get('X-Builder-SSR-Signature'), crypto.createHmac('sha256', secret).update(timestamp+'\nGET\n'+parsed.pathname+parsed.search).digest('hex'));
  assert.equal(init.credentials,'omit');
  return new Response(JSON.stringify({data: parsed.searchParams.get('edition') || 'public'}), {status:200,headers:{'content-type':'application/json'}});
}});
const transport = load(path.join(root,'src/lib/public-server.ts'));
const http = load(path.join(root,'src/lib/http.ts'));
const {storyRedirect} = load(path.join(root,'src/lib/story-redirect.ts'));

async function main() {
  // Next dev strictly validates props; production JSON output alone misses this.
  const {isSerializableProps} = require('next/dist/lib/is-serializable-props');
  const optionalStory = {id:'story-without-image',title:'No media yet',image:undefined,seo:{title:undefined,description:null}};
  const propsLoader = createLoader({process:{env:{}}}, {
    [path.join(root,'src/lib/public-data.ts')]: {loadPublicData:async()=>({stories:[optionalStory],home:{latest:[optionalStory]},meta:undefined})},
    [path.join(root,'src/lib/public-server.ts')]: {publicServerHttp:async()=>({data:{}})},
    [path.join(root,'src/lib/http.ts')]: {HttpError:http.HttpError},
    [path.join(root,'src/lib/story-redirect.ts')]: {storyRedirect},
  });
  const context={req:{cookies:{}},query:{},res:{statusCode:200}};
  const result=await propsLoader(path.join(root,'src/lib/public-ssr.ts')).publicPageProps('/')(context);
  assert.equal(isSerializableProps('/','getServerSideProps',result.props),true);
  assert.equal(result.props.publicData.stories[0].title,optionalStory.title);
  assert.equal(Object.hasOwn(result.props.publicData.stories[0],'image'),false);
  assert.equal(Object.hasOwn(result.props.publicData.home.latest[0].seo,'title'),false);
  assert.equal(result.props.publicData.home.latest[0].seo.description,null);
  assert.equal(context.res.statusCode,200);
  assert.equal((await transport.publicServerHttp('/home',{query:{edition:'Nigeria'}})).data, 'Nigeria');
  await transport.publicServerHttp('/home',{query:{edition:'Nigeria'}});
  assert.equal(calls,1,'Repeated public reads should use the bounded cache.');
  assert.equal((await transport.publicServerHttp('/home',{query:{edition:'Australia'}})).data, 'Australia');
  assert.equal(calls,2,'Edition caches must not mix.');
  clock+=2001;
  await transport.publicServerHttp('/home',{query:{edition:'Nigeria'}});
  assert.equal(calls,3,'Public cache expires.');
  await transport.publicServerHttp('/settings/public'); await transport.publicServerHttp('/settings/public');
  assert.equal(calls,5,'Settings remain fresh after administrative changes.');
  const coalesceBefore=calls;
  await Promise.all(Array.from({length:5},()=>transport.publicServerHttp('/articles',{query:{q:'coalesce'}})));
  assert.equal(calls,coalesceBefore+1,'Simultaneous identical public reads coalesce.');
  await transport.publicServerHttp('/articles/'+encodeURIComponent('olúṣọlá-builder'));
  for (const [endpoint,options] of [['/console/content',{}],['/articles/%2fconsole',{}],['/home',{method:'POST'}],['/home',{headers:{Cookie:'value'}}],['https://evil.example',{}]])
    await assert.rejects(()=>transport.publicServerHttp(endpoint,options));
  for(let i=0;i<300;i++) await transport.publicServerHttp('/articles',{query:{page:i+1}});
  const before=calls; await transport.publicServerHttp('/home',{query:{edition:'Australia'}});
  assert.equal(calls,before+1,'Old entries are evicted from the bounded cache.');
  assert.equal(storyRedirect(new http.HttpError(301,'moved',{data:{redirect:'/stories/current-slug'}})),'/stories/current-slug');
  assert.equal(storyRedirect(new http.HttpError(301,'moved',{data:{redirect:'/stories/olúṣọlá-builder'}})),'/stories/olúṣọlá-builder');
  for(const value of ['//evil.example','/stories/../admin','/stories/a?x=1','/stories/%2fmalicious','https://evil.example','/stories/ok\r\nLocation:evil'])
    assert.equal(storyRedirect(new http.HttpError(301,'moved',{data:{redirect:value}})),null);
  assert.equal(storyRedirect(new http.HttpError(404,'missing')),null);

  const legal=structuredClone(require('../contracts/legal-content.json'));
  for(const edition of ['Nigeria','Australia']) {
    legal.publishers[edition].approved=true; legal.publishers[edition].contactEmail='editor@example.test';
    for(const key of ['terms','privacy','sponsored']) Object.assign(legal.policies[edition][key],{status:'approved',version:'test',approvedBy:'Test publisher',approvedAt:'2026-01-01T00:00:00Z',sections:[{id:'purpose',heading:'Test section',paragraphs:['Test fixture only.']}]});
  }
  const release={NODE_ENV:'production',NEXT_PUBLIC_APP_URL:'https://thebuilderng.com',NEXT_PUBLIC_API_URL:'https://api.thebuilderng.com/api/v1',BUILDER_SSR_SECRET:secret,SESSION_COOKIE_NAME:'the_builder_session',NEXT_PUBLIC_TURNSTILE_SITE_KEY:'production-site-key-fixture-only'};
  assert.equal(validateBuildEnvironment(release,legal).release,true);
  const seal={version:1,buildId:'isolated-build',configuration:buildIdentity(release),legalSha256:'test-only-hash'};
  assertBuildIdentity(release,seal,'isolated-build','test-only-hash');
  assert.throws(()=>assertBuildIdentity({...release,BUILDER_BUILD_TARGET:'preview'},seal,'isolated-build','test-only-hash'));
  assert.throws(()=>assertBuildIdentity({...release,NEXT_PUBLIC_APP_URL:'https://www.thebuilderng.com'},seal,'isolated-build','test-only-hash'));
  assert.throws(()=>assertBuildIdentity(release,seal,'other-build','test-only-hash'));
  assert.throws(()=>assertBuildIdentity(release,seal,'isolated-build','changed-legal-content'));
  assert.equal(approvedLegalContent(require('../contracts/legal-content.json')),false,'Pending real documents must not pass release approval.');
  assert.throws(()=>validateBuildEnvironment(release));
  for(const edit of [{NEXT_PUBLIC_APP_URL:undefined},{NEXT_PUBLIC_API_URL:'http://localhost:8012/api/v1'},{NEXT_PUBLIC_APP_URL:'https://thebuilderau.com'},{BUILDER_SSR_SECRET:''},{NEXT_PUBLIC_TURNSTILE_SITE_KEY:''},{NEXT_PUBLIC_TURNSTILE_SITE_KEY:'1x00000000000000000000AA'},{BUILDER_BUILD_TARGET:'preview'}])
    assert.throws(()=>validateBuildEnvironment({...release,...edit},legal));
  assert.equal(validateBuildEnvironment({...release,BUILDER_BUILD_TARGET:'preview',NEXT_PUBLIC_APP_URL:'http://localhost:3000',NEXT_PUBLIC_API_URL:'http://localhost:8012/api/v1'}).release,false);
  const risk=require('../contracts/tooling-risk.json'); verifyBuildPatterns(risk);
  const report={metadata:{},vulnerabilities:{}}; assessToolingAudit(report,risk);
  assert.throws(()=>assessToolingAudit({...report,vulnerabilities:{unexpected:{severity:'critical'}}},risk));
  assert.throws(()=>assessToolingAudit(report,risk,Date.parse(risk.reviewBy)+1));
  console.log('Release regressions: signed anonymous SSR, bounded edition cache, safe redirects, fail-closed build/legal configuration and tooling risk expiry pass.');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
