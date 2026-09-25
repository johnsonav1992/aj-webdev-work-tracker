create table accounts (
  id text primary key not null,
  name text not null,
  created_at integer not null,
  updated_at integer not null
);

create table users (
  id text primary key not null,
  email text not null collate nocase unique,
  display_name text,
  password_hash text,
  created_at integer not null,
  updated_at integer not null
);

create table account_members (
  account_id text not null references accounts(id) on delete cascade,
  user_id text not null references users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'member')),
  created_at integer not null,
  primary key (account_id, user_id)
);

create table auth_identities (
  id text primary key not null,
  user_id text not null references users(id) on delete cascade,
  provider text not null check (provider in ('google')),
  provider_subject text not null,
  created_at integer not null,
  unique (provider, provider_subject)
);

create table account_settings (
  account_id text not null references accounts(id) on delete cascade,
  key text not null,
  value_json text not null,
  updated_at integer not null,
  primary key (account_id, key)
);

create table clients (
  id text primary key not null,
  account_id text not null references accounts(id) on delete cascade,
  name text not null,
  contact_name text,
  email text,
  phone text,
  notes text,
  status text not null check (status in ('active', 'archived')),
  hourly_rate_minor integer check (hourly_rate_minor is null or hourly_rate_minor >= 0),
  currency text not null default 'USD' check (length(currency) = 3),
  created_at integer not null,
  updated_at integer not null
);

create table projects (
  id text primary key not null,
  account_id text not null references accounts(id) on delete cascade,
  client_id text not null references clients(id),
  name text not null,
  description text,
  notes text,
  status text not null check (status in ('planned', 'active', 'completed', 'archived')),
  started_on text,
  completed_on text,
  created_at integer not null,
  updated_at integer not null
);

create table time_entries (
  id text primary key not null,
  account_id text not null references accounts(id) on delete cascade,
  project_id text not null references projects(id),
  work_date text not null,
  status text not null check (status in ('running', 'completed')),
  source text not null check (source in ('timer', 'manual')),
  started_at integer,
  ended_at integer,
  duration_seconds integer check (duration_seconds is null or duration_seconds >= 0),
  hourly_rate_minor_snapshot integer check (
    hourly_rate_minor_snapshot is null or hourly_rate_minor_snapshot >= 0
  ),
  currency text not null default 'USD' check (length(currency) = 3),
  notes text,
  created_at integer not null,
  updated_at integer not null
);

create table payments (
  id text primary key not null,
  account_id text not null references accounts(id) on delete cascade,
  client_id text not null references clients(id),
  project_id text references projects(id) on delete set null,
  amount_minor integer not null check (amount_minor >= 0),
  currency text not null check (length(currency) = 3),
  paid_on text not null,
  method text not null check (method in ('bank_transfer', 'card', 'check', 'cash', 'other')),
  notes text,
  created_at integer not null,
  updated_at integer not null
);

create index account_members_user_idx on account_members(user_id);
create index auth_identities_user_idx on auth_identities(user_id);
create index clients_account_status_idx on clients(account_id, status);
create index projects_account_status_idx on projects(account_id, status);
create index projects_client_idx on projects(client_id);
create index time_entries_account_date_idx on time_entries(account_id, work_date);
create index time_entries_project_date_idx on time_entries(project_id, work_date);
create index payments_account_paid_on_idx on payments(account_id, paid_on);
create index payments_client_paid_on_idx on payments(client_id, paid_on);
