import { column as c, belongsTo, hasMany, table } from 'remix/data-table';

export const accounts = table({
  name: 'accounts',
  columns: {
    id: c.uuid().notNull(),
    name: c.varchar(160).notNull(),
    created_at: c.integer().notNull(),
    updated_at: c.integer().notNull()
  }
});

export const users = table({
  name: 'users',
  columns: {
    id: c.uuid().notNull(),
    email: c.varchar(320).notNull(),
    display_name: c.varchar(160).nullable(),
    password_hash: c.text().nullable(),
    created_at: c.integer().notNull(),
    updated_at: c.integer().notNull()
  }
});

export const accountMembers = table({
  name: 'account_members',
  columns: {
    account_id: c
      .uuid()
      .references('accounts', 'id', 'account_members_account_fk')
      .onDelete('cascade')
      .notNull(),
    user_id: c
      .uuid()
      .references('users', 'id', 'account_members_user_fk')
      .onDelete('cascade')
      .notNull(),
    role: c.enum(['owner', 'admin', 'member']).notNull(),
    created_at: c.integer().notNull()
  },
  primaryKey: ['account_id', 'user_id']
});

export const authIdentities = table({
  name: 'auth_identities',
  columns: {
    id: c.uuid().notNull(),
    user_id: c
      .uuid()
      .references('users', 'id', 'auth_identities_user_fk')
      .onDelete('cascade')
      .notNull(),
    provider: c.enum(['google']).notNull(),
    provider_subject: c.varchar(255).notNull(),
    created_at: c.integer().notNull()
  }
});

export const accountSettings = table({
  name: 'account_settings',
  columns: {
    account_id: c
      .uuid()
      .references('accounts', 'id', 'account_settings_account_fk')
      .onDelete('cascade')
      .notNull(),
    key: c.varchar(100).notNull(),
    value_json: c.text().notNull(),
    updated_at: c.integer().notNull()
  },
  primaryKey: ['account_id', 'key']
});

export const clients = table({
  name: 'clients',
  columns: {
    id: c.uuid().notNull(),
    account_id: c
      .uuid()
      .references('accounts', 'id', 'clients_account_fk')
      .onDelete('cascade')
      .notNull(),
    name: c.varchar(200).notNull(),
    contact_name: c.varchar(160).nullable(),
    email: c.varchar(320).nullable(),
    phone: c.varchar(80).nullable(),
    notes: c.text().nullable(),
    status: c.enum(['active', 'archived']).notNull(),
    hourly_rate_minor: c.integer().nullable(),
    currency: c.varchar(3).notNull(),
    created_at: c.integer().notNull(),
    updated_at: c.integer().notNull()
  }
});

export const projects = table({
  name: 'projects',
  columns: {
    id: c.uuid().notNull(),
    account_id: c
      .uuid()
      .references('accounts', 'id', 'projects_account_fk')
      .onDelete('cascade')
      .notNull(),
    client_id: c.uuid().references('clients', 'id', 'projects_client_fk').notNull(),
    name: c.varchar(200).notNull(),
    description: c.text().nullable(),
    notes: c.text().nullable(),
    status: c.enum(['planned', 'active', 'completed', 'archived']).notNull(),
    started_on: c.date().nullable(),
    completed_on: c.date().nullable(),
    created_at: c.integer().notNull(),
    updated_at: c.integer().notNull()
  }
});

export const timeEntries = table({
  name: 'time_entries',
  columns: {
    id: c.uuid().notNull(),
    account_id: c
      .uuid()
      .references('accounts', 'id', 'time_entries_account_fk')
      .onDelete('cascade')
      .notNull(),
    project_id: c.uuid().references('projects', 'id', 'time_entries_project_fk').notNull(),
    work_date: c.date().notNull(),
    status: c.enum(['running', 'completed']).notNull(),
    source: c.enum(['timer', 'manual']).notNull(),
    started_at: c.integer().nullable(),
    ended_at: c.integer().nullable(),
    duration_seconds: c.integer().nullable(),
    hourly_rate_minor_snapshot: c.integer().nullable(),
    currency: c.varchar(3).notNull(),
    notes: c.text().nullable(),
    created_at: c.integer().notNull(),
    updated_at: c.integer().notNull()
  }
});

export const payments = table({
  name: 'payments',
  columns: {
    id: c.uuid().notNull(),
    account_id: c
      .uuid()
      .references('accounts', 'id', 'payments_account_fk')
      .onDelete('cascade')
      .notNull(),
    client_id: c.uuid().references('clients', 'id', 'payments_client_fk').notNull(),
    project_id: c.uuid().references('projects', 'id', 'payments_project_fk').nullable(),
    amount_minor: c.integer().notNull(),
    currency: c.varchar(3).notNull(),
    paid_on: c.date().notNull(),
    method: c.enum(['bank_transfer', 'card', 'check', 'cash', 'other']).notNull(),
    notes: c.text().nullable(),
    created_at: c.integer().notNull(),
    updated_at: c.integer().notNull()
  }
});

export const accountUsers = hasMany(accounts, accountMembers);
export const accountClients = hasMany(accounts, clients);
export const clientProjects = hasMany(clients, projects);
export const clientPayments = hasMany(clients, payments);
export const projectTimeEntries = hasMany(projects, timeEntries);
export const projectPayments = hasMany(projects, payments);
export const userAccountMemberships = hasMany(users, accountMembers);
export const userAuthIdentities = hasMany(users, authIdentities);
export const projectClient = belongsTo(projects, clients);
export const timeEntryProject = belongsTo(timeEntries, projects);
export const paymentClient = belongsTo(payments, clients);
export const paymentProject = belongsTo(payments, projects);
