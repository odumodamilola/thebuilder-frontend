const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.join(__dirname,'..');
require('@next/env').loadEnvConfig(root,false);
const {validateBuildEnvironment,buildIdentity} = require('./release-environment.cjs');
const env={...process.env,NODE_ENV:'production'};
validateBuildEnvironment(env);
const built=JSON.parse(fs.readFileSync(path.join(root,'.next/required-server-files.json'),'utf8'));
for(const key of ['NEXT_PUBLIC_APP_URL','NEXT_PUBLIC_API_URL']) {
  if(built.config.env[key]!==env[key])throw new Error('Compiled origin mismatch: '+key);
}
const receipt={version:1,buildId:fs.readFileSync(path.join(root,'.next/BUILD_ID'),'utf8').trim(),configuration:buildIdentity(env),legalSha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'contracts/legal-content.json'))).digest('hex')};
fs.writeFileSync(path.join(root,'.next/builder-build.json'),JSON.stringify(receipt,null,2));
console.log('Build identity sealed; no private environment values included.');
