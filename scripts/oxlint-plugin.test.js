import { describe, it } from 'node:test';
import { RuleTester } from 'oxlint/plugins-dev';

import { onlyArrowFunctions, paddingAroundMultilineBlocks } from './oxlint-plugin.ts';

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester();

ruleTester.run('padding-around-multiline-blocks', paddingAroundMultilineBlocks, {
  valid: [
    'function run() {\n  prepare();\n\n  if (ready) {\n    start();\n  }\n\n  finish();\n}',
    'function run() {\n  if (ready) { start(); }\n}',
    'function run() {\n  if (ready) {\n    start();\n  }\n}'
  ],
  invalid: [
    {
      code: 'function run() {\n  prepare();\n  if (ready) {\n    start();\n  }\n  finish();\n}',
      errors: [{ messageId: 'before' }, { messageId: 'after' }]
    }
  ]
});

ruleTester.run('only-arrow-functions', onlyArrowFunctions, {
  valid: [
    'const run = () => {};',
    'const handlers = { run: () => {} };',
    'const run = () => callback();'
  ],
  invalid: [
    {
      code: 'function run() {}',
      errors: [{ messageId: 'function' }]
    },
    {
      code: 'const run = function () {};',
      errors: [{ messageId: 'function' }]
    },
    {
      code: 'const handlers = { run() {} };',
      errors: [{ messageId: 'method' }]
    },
    {
      code: 'class Runner { run() {} }',
      errors: [{ messageId: 'method' }]
    }
  ]
});
