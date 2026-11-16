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

/** The website forms that feed the dashboard Inbox. */
export const formKind = pgEnum('form_kind', ['enquiry']);
export const submissionStatus = pgEnum('submission_status', ['open', 'resolved', 'archived']);

/** A labelled answer, grouped into the form's sections so any form can be shown in the Inbox. */
export interface SubmissionSection {
  title: string;
  fields: { label: string; value: string }[];
}

/** One message sent through a website form. */
export const formSubmissions = pgTable('form_submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  form: formKind('form').notNull(),
  /** Given to the sender, e.g. NV-E-7KQ2XP. */
  reference: text('reference').notNull().unique(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull().default(''),
  /** One line for the inbox list. */
  subject: text('subject').notNull(),
  answers: jsonb('answers').$type<SubmissionSection[]>().notNull(),
  status: submissionStatus('status').notNull().default('open'),
  /** Set the first time someone opens it in the dashboard. */
  readAt: timestamp('read_at', { withTimezone: true }),
  notes: text('notes').notNull().default(''),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
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
export type FormSubmission = typeof formSubmissions.$inferSelect;
export type FormKind = (typeof formKind.enumValues)[number];
export type SubmissionStatus = (typeof submissionStatus.enumValues)[number];
