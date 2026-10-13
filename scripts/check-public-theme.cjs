const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const postcss = require('postcss');
const selectorParser = require('postcss-selector-parser');

const root = path.resolve(__dirname, '..');
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
  entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
const routes = walk(path.join(root, 'pages')).filter(file =>
  file.endsWith('.tsx') && !path.relative(root, file).startsWith(`pages${path.sep}console${path.sep}`) &&
  !path.basename(file).startsWith('_'));
const sources = new Set();

function inspect(file) {
  if (sources.has(file)) return;
  sources.add(file);
  const source = fs.readFileSync(file, 'utf8');
  const imports = ts.preProcessFile(source, true, true).importedFiles;
  for (const { fileName } of imports) {
    const base = fileName.startsWith('@/') ? path.join(root, 'src', fileName.slice(2))
      : fileName.startsWith('.') ? path.resolve(path.dirname(file), fileName) : null;
    if (!base) continue;
    const target = ['.tsx', '.ts', '/index.tsx', '/index.ts'].map(ext => base + ext)
      .find(candidate => fs.existsSync(candidate));
    if (target) inspect(target);
  }
}
routes.forEach(inspect);
inspect(path.join(root, 'pages/_app.tsx'));
// Include reusable public controls even when not used by the current route fixture.
walk(path.join(root, 'src/components')).filter(file => file.endsWith('.tsx') &&
  !file.endsWith('ConsoleLayout.tsx')).forEach(inspect);

const fixedColors = /(?<![\w-])(?:bg-(?:white|navy-(?:50|700|800|900|950)|console-bg|line|slate-(?:50|100|200)|red-50|blush)|text-(?:navy-900|ink|slate(?:-(?:300|400|600|700))?)|border-(?:line|navy-900))(?:\/\d+)?(?![\w-])/g;
const failures = [];
for (const file of sources) {
  const source = fs.readFileSync(file, 'utf8');
  for (const match of source.matchAll(fixedColors)) failures.push(`${path.relative(root, file)}: ${match[0]}`);
}
assert.deepEqual(failures, [], 'Public screens must use theme-aware surface/text/border colors');

const themes = { light: {}, dark: {}, system: {} };
postcss.parse(fs.readFileSync(path.join(root, 'styles/globals.css'), 'utf8')).walkRules(rule => {
  const theme = rule.selector === ':root' && rule.parent.type === 'root' ? themes.light
    : rule.selector === '[data-theme="dark"]' ? themes.dark
    : rule.selector === '[data-theme="system"]' ? themes.system : null;
  if (theme) rule.walkDecls(decl => { if (decl.prop.startsWith('--')) theme[decl.prop] = decl.value; });
});
assert.deepEqual(themes.dark, themes.system, 'Explicit dark and OS dark must share the same palette');
const usedTokens = new Set();
const themedClasses = new Set();
for (const file of sources) {
  const source = fs.readFileSync(file, 'utf8');
  for (const match of source.matchAll(/var\((--[\w-]+)\)/g)) usedTokens.add(match[1]);
  for (const match of source.matchAll(/(?:[!\w-]+:)*!?(?:[\w-]+-)?\[[^\]\s]*var\(--[\w-]+\)[^\]\s]*\](?:\/\d+)?/g)) {
    assert.ok(!/\]\/\d+$/.test(match[0]), `Unsupported variable-color opacity: ${match[0]}`);
    themedClasses.add(match[0]);
  }
}
for (const token of usedTokens) assert.ok(themes.light[token], `Undefined public color/layout token: ${token}`);
function resolve(token, palette) {
  return palette[token].replace(/var\((--[\w-]+)\)/g, (_, ref) => resolve(ref, palette));
}
function luminance(hex) {
  const full = hex.length === 4 ? '#' + [...hex.slice(1)].map(c => c + c).join('') : hex;
  const [r, g, b] = full.slice(1).match(/../g).map(channel => {
    const value = parseInt(channel, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return r * 0.2126 + g * 0.7152 + b * 0.0722;
}
let contrastChecks = 0;
for (const mode of ['light', 'dark', 'system']) {
  const palette = { ...themes.light, ...themes[mode] };
  const pairs = ['--surface-page', '--surface-card', '--surface-tint'].flatMap(surface =>
    ['--text-heading', '--text-body', '--text-meta'].map(text => [text, surface]));
  pairs.push(['--text-on-inverse', '--surface-inverse'], ['--text-meta-on-inverse', '--surface-inverse-deep']);
  for (const [text, surface] of pairs) {
    const a = luminance(resolve(text, palette)), b = luminance(resolve(surface, palette));
    const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    assert.ok(ratio >= 4.5, `${mode}: ${text} on ${surface} contrast ${ratio.toFixed(2)}:1`);
    contrastChecks++;
  }
}

console.log(`${routes.length} public route files and ${sources.size} reachable/shared source files checked: no fixed light surfaces or dark text utilities.`);
console.log(`${usedTokens.size} referenced tokens defined; explicit/system dark palettes match; ${contrastChecks} text contrast checks passed.`);

if (process.argv.includes('--build')) {
  for (const file of routes) {
    const relative = path.relative(path.join(root, 'pages'), file)
      .replace(/[\\/]index\.tsx$/, '.tsx').replace(/\.tsx$/, '.html');
    const htmlPath = path.join(root, '.next/server/pages', relative);
    assert.ok(fs.existsSync(htmlPath), `Missing prerendered public screen: ${relative}`);
    const html = fs.readFileSync(htmlPath, 'utf8');
    const classes = [...html.matchAll(/class="([^"]*)"/g)].map(match => match[1]).join(' ');
    assert.deepEqual([...classes.matchAll(fixedColors)].map(match => match[0]), [], `Fixed theme colors in ${relative}`);
    assert.ok(html.includes('tb-theme-init'), `Missing first-paint theme script: ${relative}`);
  }
  console.log(`${routes.length} production public HTML screens checked for fixed light colors and first-paint theme initialization.`);
  const emittedClasses = new Set();
  let themedRingOffset = false;
  walk(path.join(root, '.next/static')).filter(file => file.endsWith('.css')).forEach(file => {
    const css = postcss.parse(fs.readFileSync(file, 'utf8'));
    css.walkDecls('--tw-ring-offset-color', decl => {
      if (decl.value === 'var(--surface-page)') themedRingOffset = true;
    });
    css.walkRules(rule => {
      selectorParser(selectors => selectors.walkClasses(node => emittedClasses.add(node.value))).processSync(rule.selector);
    });
  });
  assert.ok(themedRingOffset, 'Focus-ring offsets must follow the selected theme');
  for (const utility of themedClasses) assert.ok(emittedClasses.has(utility), `Theme utility absent from production CSS: ${utility}`);
  console.log(`${themedClasses.size} theme-aware utilities confirmed in generated production CSS, including translucent colors.`);
}
