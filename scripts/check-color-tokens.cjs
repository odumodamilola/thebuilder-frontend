const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const postcss = require('postcss');
const root = path.join(__dirname, '..');
const reference = fs.readFileSync(path.join(root, '../COLOR-TOKENS.md'), 'utf8');
const css = postcss.parse(fs.readFileSync(path.join(root, 'styles/globals.css'), 'utf8'));
const themes = { light: {}, dark: {}, system: {} };
css.walkRules(rule => {
  const target = rule.selector === ':root' && rule.parent.type === 'root' ? themes.light
    : rule.selector === '[data-theme="dark"]' ? themes.dark
    : rule.selector === '[data-theme="system"]' ? themes.system : null;
  if (target) rule.walkDecls(d => { if (d.prop.startsWith('--')) target[d.prop] = d.value; });
});
function normalize(value) {
  return value.toLowerCase().replace(/\s/g, '').replace(/0?\.(\d+)/g, value => String(Number(value))).replace(/#([0-9a-f])([0-9a-f])([0-9a-f])(?![0-9a-f])/g, '#$1$1$2$2$3$3');
}
function resolve(name, theme) {
  const value = theme[name];
  assert.ok(value, `Missing ${name}`);
  return value.replace(/var\((--[\w-]+)\)/g, (_, ref) => resolve(ref, theme));
}
// Compare every semantic row to the engineering reference in both dark modes.
let count = 0;
for (const line of reference.split('\n')) {
  const match = line.match(/^\| `(--[\w-]+)` \| `([^`]+)` \| `([^`]+)` \|/);
  if (!match) continue;
  const [, name, light, dark] = match;
  for (const [mode, expected] of [['light', light], ['dark', dark], ['system', dark]]) {
    let actual = resolve(name, { ...themes.light, ...themes[mode] });
    // CSS's space-separated rgb spelling is equivalent to rgba.
    actual = actual.replace(/rgb\((\d+) (\d+) (\d+) \/ (\d+)%\)/g, (_, r, g, b, a) => `rgba(${r},${g},${b},${Number(a) / 100})`);
    assert.equal(normalize(actual), normalize(expected), `${mode}: ${name}`);
    count++;
  }
}
assert.ok(count > 90, 'Semantic token table was not parsed');
console.log(`${count} semantic token checks passed against COLOR-TOKENS.md.`);

const vm = require('node:vm');
const documentSource = fs.readFileSync(path.join(root, 'pages/_document.tsx'), 'utf8');
const init = documentSource.match(/const themeInit = `([^`]+)`/)[1];
for (const preference of [null, 'light', 'dark', 'system', 'invalid', 'blocked']) {
  for (const osDark of [true, false]) {
    const element = { dataset: {}, style: {} };
    vm.runInNewContext(init, {
      localStorage: { getItem() { if (preference === 'blocked') throw new Error('Storage denied'); return preference; } },
      matchMedia: () => ({ matches: osDark }),
      document: { documentElement: element },
    });
    const expected = preference === 'dark' || (preference !== 'light' && osDark) ? 'dark' : 'light';
    assert.equal(element.dataset.theme, expected);
    assert.equal(element.style.colorScheme, expected);
  }
}
console.log('12 first-paint theme scenarios passed, including blocked storage.');
