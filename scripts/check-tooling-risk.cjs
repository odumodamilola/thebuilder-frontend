const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
function assessToolingAudit(report, policy, now = Date.now()) {
  assert(!report.error && report.metadata && report.vulnerabilities, 'A successful fresh npm audit is required.');
  assert(policy.owner && Date.parse(policy.reviewBy) > now, 'The tooling risk review is overdue.');
  for (const [name, vulnerability] of Object.entries(report.vulnerabilities)) {
    assert(policy.allowedAffectedPackages.includes(name) && vulnerability.severity === 'high' && vulnerability.isDirect !== undefined, 'New or changed tooling risk: ' + name);
    for (const via of vulnerability.via) {
      if (typeof via === 'object') assert(via.url === 'https://github.com/advisories/' + policy.id, 'An unreviewed advisory must block CI.');
      else assert(policy.allowedAffectedPackages.includes(via), 'Unreviewed advisory dependency: ' + via);
    }
  }
}
function verifyBuildPatterns(policy) {
  const config = fs.readFileSync(path.join(__dirname, '../tailwind.config.ts'), 'utf8');
  const source = ts.createSourceFile('tailwind.config.ts', config, ts.ScriptTarget.Latest, true);
  let values;
  function visit(node) {
    if (ts.isPropertyAssignment(node) && node.name.getText(source) === 'content') {
      assert(ts.isArrayLiteralExpression(node.initializer), 'Tailwind content must be a static array.');
      values = node.initializer.elements.map(element => { assert(ts.isStringLiteral(element), 'Dynamic content globs are forbidden.'); return element.text; });
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  assert.deepEqual(values, policy.allowedContentGlobs, 'Content globs require a new bounded-pattern review.');
  for (const file of ['tailwind.config.ts', 'eslint.config.mjs', 'postcss.config.js', 'postcss.config.cjs']) {
    const location = path.join(__dirname, '..', file);
    if (fs.existsSync(location)) assert(!/process\.(?:env|argv)/.test(fs.readFileSync(location, 'utf8')), 'Build patterns may not be taken from environment or CLI input.');
  }
}
module.exports = { assessToolingAudit, verifyBuildPatterns };
if (require.main === module) {
  try {
    const location = path.resolve(process.argv[2] || 'audit-tooling.json');
    assert(Date.now() - fs.statSync(location).mtimeMs < 86400000, 'Refresh the tooling audit within 24 hours.');
    const report = JSON.parse(fs.readFileSync(location, 'utf8').replace(/^\uFEFF/, ''));
    const policy = require('../contracts/tooling-risk.json');
    assessToolingAudit(report, policy);
    verifyBuildPatterns(policy);
    console.log('Tooling audit is limited to the reviewed development-only advisory; static input bounds verified. Review by ' + policy.reviewBy + '.');
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
