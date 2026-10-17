const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

exports.createLoader = (globals = {}, overrides = {}) => {
  const cache = new Map();
  function load(file) {
    const filename = path.resolve(file);
    if (overrides[filename]) return overrides[filename];
    if (cache.has(filename)) return cache.get(filename);
    if (filename.endsWith('.json')) return JSON.parse(fs.readFileSync(filename, 'utf8'));
    const module = {exports: {}};
    cache.set(filename, module.exports);
    const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true}}).outputText;
    vm.runInNewContext(code, {exports: module.exports, module, URL, ...globals, require: specifier => {
      if (!specifier.startsWith('.')) return require(specifier);
      const base = path.resolve(path.dirname(filename), specifier);
      return load([base, base + '.ts', base + '.json'].find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile()) || base);
    }}, {filename});
    return module.exports;
  }
  return load;
};
