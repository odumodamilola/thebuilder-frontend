const fs = require('node:fs');
const zlib = require('node:zlib');
const path = require('node:path');
const file = process.argv[2] || 'Home.dc.html';
const html = fs.readFileSync(path.join(__dirname, '../../The Builder UI UX/Batch delivery planning (5)/offline', file), 'utf8');
const manifest = JSON.parse(html.match(/<script type="__bundler\/manifest">([\s\S]*?)<\/script>/)[1]);
for (const [id, entry] of Object.entries(manifest)) {
  if (!/javascript|html|json/.test(entry.mime)) continue;
  let bytes = Buffer.from(entry.data || entry.base64 || '', 'base64');
  try { bytes = zlib.gunzipSync(bytes); } catch {}
  const source = bytes.toString('utf8');
  if (process.argv[4] && !source.includes(process.argv[4])) continue;
  console.log(id, entry.mime);
  console.log(source.slice(0, process.argv[3] ? Number(process.argv[3]) : 1000));
}
