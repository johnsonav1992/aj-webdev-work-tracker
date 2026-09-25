import { randomUUID, scrypt, timingSafeEqual } from 'node:crypto';

import { database } from './database.ts';
import { accountMembers, accountSettings, accounts, authIdentities, users } from './schema.ts';

const passwordHashLength = 64;
const passwordCost = 32_768;
const passwordBlockSize = 8;
const passwordParallelization = 3;
const passwordMaxMemory = 64 * 1024 * 1024;

const deriveScrypt = (password: string, salt: Buffer): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    scrypt(
      password,
      salt,
      passwordHashLength,
      {
        N: passwordCost,
        r: passwordBlockSize,
        p: passwordParallelization,
        maxmem: passwordMaxMemory
      },
      (error, derived) => {
        if (error) reject(error);
        else resolve(derived);
      }
    );
  });

export interface AuthenticatedUser {
  id: string;
  email: string;
  displayName: string | null;
  accountId: string;
}

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

export const verifyPassword = async (password: string, encodedHash: string): Promise<boolean> => {
  const [algorithm, cost, blockSize, parallelization, saltText, hashText, ...extra] =
    encodedHash.split('$');

  if (
    algorithm !== 'scrypt' ||
    Number(cost) !== passwordCost ||
    Number(blockSize) !== passwordBlockSize ||
    Number(parallelization) !== passwordParallelization ||
    !saltText ||
    !hashText ||
    extra.length > 0
  ) {
    return false;
  }

  const salt = Buffer.from(saltText, 'base64url');
  const expected = Buffer.from(hashText, 'base64url');
  if (salt.length !== 16 || expected.length !== passwordHashLength) return false;

  const actual = await deriveScrypt(password, salt);

  return timingSafeEqual(actual, expected);
};

export const findUserByEmail = (email: string) =>
  database.findOne(users, { where: { email: normalizeEmail(email) } });

export const findAuthenticatedUser = async (
  userId: string,
  accountId: string
): Promise<AuthenticatedUser | null> => {
  const user = await database.find(users, userId);
  if (!user) return null;

  const membership = await database.findOne(accountMembers, {
    where: { account_id: accountId, user_id: userId }
  });
  if (!membership) return null;

  return { id: user.id, email: user.email, displayName: user.display_name, accountId };
};

export const findLoginUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user?.password_hash || !(await verifyPassword(password, user.password_hash))) return null;

  const membership = await database.findOne(accountMembers, {
    where: { user_id: user.id },
    orderBy: ['created_at', 'asc']
  });
  if (!membership) return null;

  return {
    id: user.id,
    email: user.email,
    displayName: user.display_name,
    accountId: membership.account_id
  } satisfies AuthenticatedUser;
};

export const findGoogleLoginUser = async (providerSubject: string) => {
  const identity = await database.findOne(authIdentities, {
    where: { provider: 'google', provider_subject: providerSubject }
  });
  if (!identity) return null;

  const user = await database.find(users, identity.user_id);
  if (!user) return null;

  const membership = await database.findOne(accountMembers, {
    where: { user_id: user.id },
    orderBy: ['created_at', 'asc']
  });
  if (!membership) return null;

  return {
    id: user.id,
    email: user.email,
    displayName: user.display_name,
    accountId: membership.account_id
  } satisfies AuthenticatedUser;
};

export const createGoogleUser = async (input: {
  email: string;
  displayName: string | null;
  providerSubject: string;
}) => {
  const email = normalizeEmail(input.email);
  const now = Date.now();
  const userId = randomUUID();
  const accountId = randomUUID();

  return database.transaction(async (transaction) => {
    const existingUser = await transaction.findOne(users, { where: { email } });
    const user = existingUser ?? {
      id: userId,
      email,
      display_name: input.displayName,
      password_hash: null,
      created_at: now,
      updated_at: now
    };

    if (!existingUser) await transaction.create(users, user);

    const membership = await transaction.findOne(accountMembers, {
      where: { user_id: user.id },
      orderBy: ['created_at', 'asc']
    });

    let accountIdForUser = membership?.account_id;

    if (!accountIdForUser) {
      await transaction.create(accounts, {
        id: accountId,
        name: input.displayName?.trim()
          ? `${input.displayName.trim()}'s Workspace`
          : 'My Workspace',
        created_at: now,
        updated_at: now
      });
      await transaction.create(accountMembers, {
        account_id: accountId,
        user_id: user.id,
        role: 'owner',
        created_at: now
      });
      await transaction.create(accountSettings, {
        account_id: accountId,
        key: 'default_currency',
        value_json: JSON.stringify('USD'),
        updated_at: now
      });
      accountIdForUser = accountId;
    }

    const identity = await transaction.findOne(authIdentities, {
      where: { provider: 'google', provider_subject: input.providerSubject }
    });

    if (!identity) {
      await transaction.create(authIdentities, {
        id: randomUUID(),
        user_id: user.id,
        provider: 'google',
        provider_subject: input.providerSubject,
        created_at: now
      });
    }

    return {
      id: user.id,
      email,
      displayName: user.display_name,
      accountId: accountIdForUser
    } satisfies AuthenticatedUser;
  });
};
