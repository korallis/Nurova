import { integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * Super admins can do everything, including managing other admins. Managers
 * can only use the dashboard areas listed in their `permissions`.
 */
export const adminRole = pgEnum('admin_role', ['super_admin', 'manager']);

/** People who can sign in to /admin. Passwords are bcrypt hashes, never plain text. */
export const adminUsers = pgTable('admin_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  role: adminRole('role').notNull().default('manager'),
  /** Dashboard areas a manager can use, see lib/auth/permissions.ts. Ignored for super admins. */
  permissions: text('permissions').array().notNull().default([]),
  /** Consecutive failed logins; reset on success. */
  failedLogins: integer('failed_logins').notNull().default(0),
  /** Sign-in is refused until this time after too many failures. */
  lockedUntil: timestamp('locked_until', { withTimezone: true }),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Editable website content. One JSON document per page or item, identified by
 * a key such as `settings` or `coming-soon`. The shape of each document is
 * described in lib/content/registry.ts; pages fall back to the built-in
 * defaults when a key has no row.
 */
export const content = pgTable('content', {
  key: text('key').primaryKey(),
  data: jsonb('data').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  updatedBy: uuid('updated_by').references(() => adminUsers.id, { onDelete: 'set null' }),
});

/** Newsletter sign-ups, e.g. from the coming-soon page. */
export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  /** Where they signed up, e.g. coming-soon (see lib/forms/shared.ts). */
  source: text('source').notNull().default('coming-soon'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Private settings that only super admins can see, e.g. `email` for the
 * Microsoft Graph connection. Unlike `content`, nothing here is ever shown on
 * the website. Secrets inside are encrypted (lib/email/settings.ts).
 */
export const appSettings = pgTable('app_settings', {
  key: text('key').primaryKey(),
  value: jsonb('value').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  updatedBy: uuid('updated_by').references(() => adminUsers.id, { onDelete: 'set null' }),
});

export type AdminUser = typeof adminUsers.$inferSelect;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
