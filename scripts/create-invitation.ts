import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

import { createAccountInvitation } from '../app/db/auth.ts';
import { database } from '../app/db/database.ts';
import { accountMembers, users } from '../app/db/schema.ts';

const main = async () => {
  const prompt = createInterface({ input: stdin, output: stdout });
  let ownerEmail = '';
  let inviteEmail = '';
  try {
    ownerEmail = (await prompt.question('Owner email: ')).trim().toLowerCase();
    inviteEmail = (await prompt.question('Invite email: ')).trim().toLowerCase();
  } finally {
    prompt.close();
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerEmail)) {
    throw new Error('Enter a valid owner email address.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)) {
    throw new Error('Enter a valid invitation email address.');
  }

  const owner = await database.findOne(users, { where: { email: ownerEmail } });
  if (!owner) throw new Error('No account owner was found for that email.');

  const memberships = await database.findMany(accountMembers, {
    where: { user_id: owner.id, role: 'owner' },
    limit: 2
  });
  if (memberships.length !== 1) {
    throw new Error('Expected the owner to belong to exactly one workspace.');
  }

  const invitation = await createAccountInvitation({
    accountId: memberships[0].account_id,
    email: inviteEmail,
    createdByUserId: owner.id
  });
  const origin = new URL(
    process.env.APP_ORIGIN ?? `http://localhost:${process.env.PORT ?? '44100'}`
  );
  const inviteUrl = new URL('/signup', origin);
  inviteUrl.searchParams.set('token', invitation.token);

  stdout.write(`\nShare this one-time invitation link with ${inviteEmail}:\n`);
  stdout.write(`${inviteUrl.href}\n`);
  stdout.write(`Expires: ${new Date(invitation.expiresAt).toISOString()}\n`);
};

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Invitation creation failed.');
  process.exitCode = 1;
} finally {
  await database.close();
}
