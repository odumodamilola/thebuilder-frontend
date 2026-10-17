const assert = require('node:assert/strict');
const path = require('node:path');
const {createLoader} = require('./ts-module.cjs');
const persistent = new Map(); const session = new Map(); const calls = []; const events = [];
const storage = map => ({getItem: key => map.get(key) ?? null, setItem: (key, value) => map.set(key, value), removeItem: key => map.delete(key)});
const localStorage = storage(persistent);
const load = createLoader({window:{dispatchEvent:event=>events.push(event.type)}, Event, localStorage, sessionStorage:storage(session), crypto:{randomUUID:()=> 'local-consent-test-session'}}, {[path.resolve(__dirname,'../src/lib/http.ts')]:{http:async (...args)=>calls.push(args)}});
const consent = load(path.resolve(__dirname,'../src/lib/cookie-consent.ts'));
const {trackArticle} = load(path.resolve(__dirname,'../src/lib/analytics.ts'));
(async () => {
  assert.equal(consent.readCookieChoice(), null);
  persistent.set('tb-analytics-consent','yes');
  await trackArticle('local-fixture','view'); assert.equal(calls.length,0);
  consent.saveCookieChoice(false); await trackArticle('local-fixture','view'); assert.equal(calls.length,0);
  consent.saveCookieChoice(true); await trackArticle('local-fixture','view'); assert.equal(calls.length,1); assert.equal(calls[0][1].body.consent,true);
  assert(session.has('tb-analytics-session'));
  consent.saveCookieChoice(false); assert(!session.has('tb-analytics-session'));
  await trackArticle('local-fixture','share'); assert.equal(calls.length,1);
  for (const value of ['invalid json',JSON.stringify({version:1,analytics:true,savedAt:Date.now()-181*86400000}),JSON.stringify({version:1,analytics:true,savedAt:Date.now()+86400000}),JSON.stringify({version:0,analytics:true,savedAt:Date.now()})]) {
    persistent.set(consent.consentStorageKey,value); assert.equal(consent.readCookieChoice(),null);
  }
  consent.saveCookieChoice(true); persistent.clear(); assert.equal(consent.readCookieChoice(),null);
  localStorage.getItem=()=>{throw new Error('blocked')}; localStorage.setItem=()=>{throw new Error('blocked')};
  assert.equal(consent.readCookieChoice(),null); consent.saveCookieChoice(false); assert.equal(consent.readCookieChoice().analytics,false);
  assert(events.includes('tb-cookie-choice-changed'));
  console.log('Cookie consent: default/legacy denial, opt-in transport, withdrawal, identifier removal, expiry, invalid data, cross-tab clearing and blocked storage pass.');
})().catch(error=>{console.error(error.message);process.exitCode=1});
