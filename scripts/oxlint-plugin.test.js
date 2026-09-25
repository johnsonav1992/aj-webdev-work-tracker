import { describe, it } from 'node:test';
import { RuleTester } from 'oxlint/plugins-dev';

import { paddingAroundMultilineBlocks } from './oxlint-plugin.ts';

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
