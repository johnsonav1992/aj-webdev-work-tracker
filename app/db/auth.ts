import { createHash, randomBytes, randomUUID, scrypt, timingSafeEqual } from 'node:crypto';

import { database } from './database.ts';
import {
  accountInvitations,
  accountMembers,
  accountSettings,
  accounts,
  authIdentities,
  users
} from './schema.ts';

const passwordHashLength = 64;
const passwordCost = 32_768;
const passwordBlockSize = 8;
const passwordParallelization = 3;
const passwordMaxMemory = 64 * 1024 * 1024;
const invitationLifetimeMs = 7 * 24 * 60 * 60 * 1000;

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

export const hashPassword = async (password: string): Promise<string> => {
  const salt = randomBytes(16);
  const derived = await deriveScrypt(password, salt);

  return [
    'scrypt',
    passwordCost,
    passwordBlockSize,
    passwordParallelization,
    salt.toString('base64url'),
    derived.toString('base64url')
  ].join('$');
};

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

export const createOwnerAccount = async (input: {
  accountName: string;
  displayName: string;
  email: string;
  password: string;
}) => {
  const existingUsers = await database.findMany(users, { limit: 1 });
  if (existingUsers.length > 0) throw new Error('An owner account has already been provisioned.');

  const now = Date.now();
  const accountId = randomUUID();
  const userId = randomUUID();
  const normalizedEmail = normalizeEmail(input.email);
  const passwordHash = await hashPassword(input.password);

  await database.transaction(async (transaction) => {
    await transaction.create(accounts, {
      id: accountId,
      name: input.accountName.trim(),
      created_at: now,
      updated_at: now
    });
    await transaction.create(users, {
      id: userId,
      email: normalizedEmail,
      display_name: input.displayName.trim(),
      password_hash: passwordHash,
      created_at: now,
      updated_at: now
    });
    await transaction.create(accountMembers, {
      account_id: accountId,
      user_id: userId,
      role: 'owner',
      created_at: now
    });
    await transaction.create(accountSettings, {
      account_id: accountId,
      key: 'default_currency',
      value_json: JSON.stringify('USD'),
      updated_at: now
    });
  });

  return { accountId, userId, email: normalizedEmail };
};

export const createAccountInvitation = async (input: {
  accountId: string;
  email: string;
  createdByUserId: string;
}) => {
  const token = randomBytes(32).toString('base64url');
  const now = Date.now();
  const expiresAt = now + invitationLifetimeMs;

  await database.create(accountInvitations, {
    id: randomUUID(),
    account_id: input.accountId,
    email: normalizeEmail(input.email),
    token_hash: createHash('sha256').update(token).digest('hex'),
    created_by_user_id: input.createdByUserId,
    created_at: now,
    expires_at: expiresAt,
    accepted_at: null
  });

  return { token, expiresAt };
};

export const findValidInvitation = async (token: string) => {
  if (!/^[A-Za-z0-9_-]{40,50}$/.test(token)) return null;

  const invitation = await database.findOne(accountInvitations, {
    where: { token_hash: createHash('sha256').update(token).digest('hex') }
  });

  if (!invitation || invitation.accepted_at !== null || invitation.expires_at <= Date.now()) {
    return null;
  }

  return invitation;
};

export const createInvitedUser = async (input: {
  token: string;
  email: string;
  displayName: string;
  password: string;
}) => {
  const email = normalizeEmail(input.email);
  const invitation = await findValidInvitation(input.token);
  if (!invitation || invitation.email !== email)
    throw new Error('This invitation is invalid or expired.');
  if (await findUserByEmail(email)) throw new Error('This invitation is invalid or expired.');

  const now = Date.now();
  const userId = randomUUID();
  const passwordHash = await hashPassword(input.password);

  return database.transaction(async (transaction) => {
    const currentInvitation = await transaction.find(accountInvitations, invitation.id);

    if (
      !currentInvitation ||
      currentInvitation.accepted_at !== null ||
      currentInvitation.expires_at <= Date.now()
    ) {
      throw new Error('This invitation is invalid or expired.');
    }

    const duplicate = await transaction.findOne(users, { where: { email } });
    if (duplicate) throw new Error('This invitation is invalid or expired.');

    await transaction.create(users, {
      id: userId,
      email,
      display_name: input.displayName.trim(),
      password_hash: passwordHash,
      created_at: now,
      updated_at: now
    });
    await transaction.create(accountMembers, {
      account_id: currentInvitation.account_id,
      user_id: userId,
      role: 'member',
      created_at: now
    });
    await transaction.update(accountInvitations, currentInvitation.id, { accepted_at: now });

    return {
      id: userId,
      email,
      displayName: input.displayName.trim(),
      accountId: currentInvitation.account_id
    } satisfies AuthenticatedUser;
  });
};

export const createGoogleUserFromInvitation = async (input: {
  token: string;
  email: string;
  displayName: string | null;
  providerSubject: string;
}) => {
  const email = normalizeEmail(input.email);
  const invitation = await findValidInvitation(input.token);
  if (!invitation || invitation.email !== email)
    throw new Error('This invitation is invalid or expired.');

  const now = Date.now();
  const userId = randomUUID();

  return database.transaction(async (transaction) => {
    const currentInvitation = await transaction.find(accountInvitations, invitation.id);

    if (
      !currentInvitation ||
      currentInvitation.accepted_at !== null ||
      currentInvitation.expires_at <= Date.now()
    ) {
      throw new Error('This invitation is invalid or expired.');
    }

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
      where: { account_id: currentInvitation.account_id, user_id: user.id }
    });

    if (!membership) {
      await transaction.create(accountMembers, {
        account_id: currentInvitation.account_id,
        user_id: user.id,
        role: 'member',
        created_at: now
      });
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

    await transaction.update(accountInvitations, currentInvitation.id, { accepted_at: now });

    return {
      id: user.id,
      email,
      displayName: user.display_name,
      accountId: currentInvitation.account_id
    } satisfies AuthenticatedUser;
  });
};
