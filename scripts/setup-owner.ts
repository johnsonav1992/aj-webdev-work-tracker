import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

import { createOwnerAccount } from '../app/db/auth.ts';
import { database } from '../app/db/database.ts';

const readSecret = (prompt: string): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!stdin.isTTY || typeof stdin.setRawMode !== 'function') {
      reject(new Error('Owner setup requires an interactive terminal.'));
      return;
    }

    stdout.write(prompt);
    stdin.setRawMode(true);
    stdin.resume();
    let value = '';

    const finish = (result: string) => {
      stdin.off('data', onData);
      stdin.setRawMode(false);
      stdin.pause();
      stdout.write('\n');
      resolve(result);
    };

    const onData = (chunk: Buffer) => {
      const input = chunk.toString('utf8');
      if (input === '\u0003') {
        stdin.off('data', onData);
        stdin.setRawMode(false);
        stdin.pause();
        reject(new Error('Owner setup cancelled.'));
        return;
      }
      if (input === '\r' || input === '\n') {
        finish(value);
        return;
      }
      if (input === '\u007f' || input === '\b') {
        value = Array.from(value).slice(0, -1).join('');
        return;
      }
      value += input;
    };

    stdin.on('data', onData);
  });

const main = async () => {
  const prompt = createInterface({ input: stdin, output: stdout });
  let accountName = '';
  let displayName = '';
  let email = '';
  try {
    accountName = (await prompt.question('Workspace name: ')).trim();
    displayName = (await prompt.question('Your name: ')).trim();
    email = (await prompt.question('Email: ')).trim().toLowerCase();
  } finally {
    prompt.close();
  }

  if (!accountName || !displayName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Enter a workspace name, your name, and a valid email address.');
  }

  const password = await readSecret('Password (at least 12 characters): ');
  const confirmation = await readSecret('Confirm password: ');
  if (password.length < 12 || Buffer.byteLength(password, 'utf8') > 1024) {
    throw new Error('Password must be at least 12 characters and no more than 1024 bytes.');
  }
  if (password !== confirmation) throw new Error('Passwords do not match.');

  const owner = await createOwnerAccount({ accountName, displayName, email, password });
  stdout.write(`\nOwner account created for ${owner.email}.\n`);
  stdout.write(`Account ID: ${owner.accountId}\n`);
  stdout.write('You can now sign in at /login.\n');
};

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Owner setup failed.');
  process.exitCode = 1;
} finally {
  await database.close();
}
