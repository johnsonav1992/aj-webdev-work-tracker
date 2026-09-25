create table account_invitations (
  id text primary key not null,
  account_id text not null references accounts(id) on delete cascade,
  email text not null collate nocase,
  token_hash text not null unique,
  created_by_user_id text references users(id) on delete set null,
  created_at integer not null,
  expires_at integer not null,
  accepted_at integer
);

create index account_invitations_account_idx on account_invitations(account_id, created_at);
create index account_invitations_email_idx on account_invitations(email, expires_at);
