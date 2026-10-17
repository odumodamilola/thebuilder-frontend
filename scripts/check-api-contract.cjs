const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const parser = require('@apidevtools/swagger-parser');

async function main() {
  const contractPath = process.env.BUILDER_CONTRACT_PATH || path.resolve(__dirname, '../contracts/openapi.json');
  const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
  await parser.validate(contract);
  const ids = new Set();
  const contentFilters = new Map(contract.paths['/console/content'].get.parameters.filter(parameter => parameter.in === 'query').map(parameter => [parameter.name, parameter.schema]));
  for (const name of ['q', 'status', 'edition', 'page', 'per_page']) assert(contentFilters.has(name), `Missing content query parameter ${name}`);
  assert.deepEqual(contentFilters.get('edition').enum, ['Nigeria', 'Australia', 'both']);
  let operations = 0;
  for (const [endpoint, methods] of Object.entries(contract.paths)) {
    assert(endpoint.startsWith('/') && !endpoint.startsWith('/api/'), 'Paths must be relative to the /api/v1 server.');
    for (const [method, operation] of Object.entries(methods)) {
      if (!['get', 'post', 'put', 'patch', 'delete'].includes(method)) continue;
      assert(!ids.has(operation.operationId), `Duplicate operation ID ${operation.operationId}`);
      ids.add(operation.operationId);
      assert(operation['x-frontend-route']);
      assert(operation['x-middleware']);
      assert(operation.responses['422'] && operation.responses['429']);
      if (endpoint.startsWith('/console/')) {
        assert(operation.security.some(item => item.SessionCookie));
        assert(operation['x-middleware'].includes('mfa'));
        assert(operation['x-middleware'].some(item => item.startsWith('permission:')));
      }
      operations++;
    }
  }
  console.log(`OpenAPI valid: ${Object.keys(contract.paths).length} paths, ${operations} operations; unique IDs, auth metadata and frontend mappings verified.`);
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
