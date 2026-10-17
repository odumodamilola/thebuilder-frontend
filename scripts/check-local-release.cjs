const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {spawnSync} = require('node:child_process');
const root = path.resolve(__dirname,'../..');
const apiDir = path.join(root,'.replatform/laravel12-backend');
const runtime = path.join(root,'.replatform/runtime');
const api = process.env.BUILDER_LOCAL_API_URL || 'http://localhost:8012';
const frontend = 'http://localhost:3000';
const origin = new URL(api);
assert(origin.protocol === 'http:' && ['localhost','127.0.0.1'].includes(origin.hostname) && origin.pathname === '/' && !origin.search && !origin.hash && !origin.username && !origin.password,'Local release checks require a loopback API origin.');
function cli(args) {
  const result=spawnSync(process.env.PHP_BINARY || 'C:/tools/php85/php.exe',['-d','extension=sodium','-d','extension=curl','-d','extension=gd',...args],{cwd:apiDir,encoding:'utf8',timeout:60000});
  assert.equal(result.status,0,'Guarded preview CLI action failed.');
}
const passed=[];
const record=name=>{passed.push(name);console.log('PASS '+name);};
async function fetchLocal(url,options={}) { return fetch(url,{...options,redirect:'manual',signal:AbortSignal.timeout(20000)}); }
async function main() {
  cli([path.join(runtime,'assert-preview.php')]);
  cli(['artisan','cache:clear']);
  const environment=fs.readFileSync(path.join(apiDir,'.env'),'utf8');
  const secret=environment.split(/\r?\n/).find(line=>line.startsWith('BUILDER_SSR_SECRET='))?.slice('BUILDER_SSR_SECRET='.length);
  assert(secret?.length>=32,'A private local signing key is required.');
  try {
    for(let i=0;i<120;i++) assert.equal((await fetchLocal(api+'/api/v1/settings/public')).status,200);
    assert.equal((await fetchLocal(api+'/api/v1/home')).status,429);
    record('Unsigned browser abuse limit still applies at request 121');
    const uri='/api/v1/settings/public';
    for(let i=0;i<150;i++) {
      const timestamp=String(Math.floor(Date.now()/1000));
      const headers={'X-Builder-SSR-Timestamp':timestamp,'X-Builder-SSR-Signature':crypto.createHmac('sha256',secret).update(timestamp+'\nGET\n'+uri).digest('hex')};
      assert.equal((await fetchLocal(api+uri,{headers})).status,200);
    }
    const durations=[];
    let next=0;
    await Promise.all(Array.from({length:8},async()=>{
      while(next++<80) {
        const start=performance.now();
        const response=await fetchLocal(frontend+'/');
        assert.equal(response.status,200,'Anonymous SSR must remain available when its egress IP browser bucket is exhausted.');
        const html=await response.text();
        assert(!html.includes(secret),'Server signing secret must never enter HTML/props.');
        durations.push(performance.now()-start);
      }
    }));
    assert.equal(durations.length,80);
    record('150 signed API reads and 80 SSR pages remain available from the same limited egress IP');
    durations.sort((a,b)=>a-b);
    fs.writeFileSync(path.join(runtime,'ssr-local-traffic.json'),JSON.stringify({date:new Date().toISOString(),scope:'Local functional concurrency probe, not production capacity certification',requests:80,concurrency:8,status:200,p95Milliseconds:Math.round(durations[Math.floor(durations.length*.95)])},null,2));
  } finally {cli(['artisan','cache:clear']);}
  cli([path.join(runtime,'qa-redirect-fixture.php')]);
  try {
    const fixture=JSON.parse(fs.readFileSync(path.join(runtime,'qa-redirect-fixture.json'),'utf8'));
    const moved=await fetchLocal(frontend+fixture.from);
    assert.equal(moved.status,301);assert.equal(moved.headers.get('location'),fixture.to);
    assert.equal((await fetchLocal(frontend+fixture.to)).status,200);
    record('Historical story URL sends a real frontend 301 to a published article');
  } finally {cli([path.join(runtime,'qa-redirect-fixture.php'),'remove']);}
  cli([path.join(runtime,'qa-unicode-fixture.php')]);
  try {
    const fixture=JSON.parse(fs.readFileSync(path.join(runtime,'qa-unicode-fixture.json'),'utf8'));
    const response=await fetchLocal(frontend+'/stories/'+encodeURIComponent(fixture.slug));
    assert.equal(response.status,200);assert((await response.text()).includes('Local Unicode release fixture'));
    record('Valid Unicode article slugs survive signed SSR transport');
  } finally {cli([path.join(runtime,'qa-unicode-fixture.php'),'remove']);}
  for(const edition of ['Nigeria','Australia']) {
    const response=await fetchLocal(frontend+'/sponsored-content-policy',{headers:{Cookie:'tb-edition='+edition}});
    assert.equal(response.status,200);
    const html=(await response.text()).replace(/<!--[\s\S]*?-->/g,'');
    assert(html.includes('The Builder '+edition));
    assert(html.includes(edition==='Australia'?'TechPro Consulting Pty Ltd':'TechPro Nigeria'));
    assert(html.includes('awaiting publication') && html.includes('noindex'));
  }
  record('Legal pages render the requested edition and clearly mark pending publication');
  const privacy=await (await fetchLocal(frontend+'/privacy')).text();
  assert(!privacy.includes('privacy@thebuilder.africa') && !privacy.includes('newsletter preferences from account settings'));
  const about=await (await fetchLocal(frontend+'/about')).text();
  for(const id of ['standards','advertise','contact','sponsored']) assert(about.includes('id="'+id+'"'));
  assert(about.includes('href="/sponsored-content-policy"'));
  record('Public policy/contact links have real destinations and unsupported claims are removed');
  const sitemap=await fetchLocal(frontend+'/sitemap.xml');
  assert.equal(sitemap.status,200);assert(sitemap.headers.get('content-type').includes('xml'));
  record('Sitemap uses the signed public read transport');
  const staticRoot=path.join(root,'frontend/.next/static');
  function inspect(directory) {
    for(const entry of fs.readdirSync(directory,{withFileTypes:true})) {
      const file=path.join(directory,entry.name);
      if(entry.isDirectory())inspect(file);else assert(!fs.readFileSync(file).includes(Buffer.from(secret)),'Server signing secret must not enter browser assets.');
    }
  }
  inspect(staticRoot);
  record('Private SSR signing key absent from all built browser assets');
  fs.writeFileSync(path.join(runtime,'release-fixes-http.json'),JSON.stringify({date:new Date().toISOString(),passed,productionDataUsed:false,liveServicesVerified:false,deploymentActivated:false},null,2));
}
main().catch(error=>{console.error('FAIL '+error.message);process.exitCode=1;});
