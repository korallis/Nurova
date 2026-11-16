import { asc, eq } from 'drizzle-orm';
import { getCurrentAdmin } from '@/lib/auth/dal';
import { canAccess } from '@/lib/auth/permissions';
import { db, schema } from '@/lib/db';
import { INBOXES, SUBMISSION_STATUS_LABELS, newsletterSourceLabel } from '@/lib/forms/shared';
import type { FormKind } from '@/lib/db/schema';

/**
 * CSV download of one inbox (or the newsletter list) for spreadsheets
 * and email tools. Signed-in admins only.
 */

/** Quotes a cell, and stops spreadsheet apps running text that starts like a formula. */
function cell(value: string) {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

function csv(rows: string[][]) {
  // BOM so Excel opens UTF-8 (names with accents, “smart quotes”) correctly.
  return '﻿' + rows.map((row) => row.map(cell).join(',')).join('\r\n') + '\r\n';
}

function download(body: string, name: string) {
  return new Response(body, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${name}"`,
      'Cache-Control': 'private, no-store',
    },
  });
}

const stamp = () => new Date().toISOString().slice(0, 10);
const when = (d: Date) => d.toLocaleString('en-GB', { timeZone: 'Africa/Johannesburg' });

export async function GET(_request: Request, { params }: { params: Promise<{ form: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return new Response('Not signed in', { status: 401 });
  if (!canAccess(admin, 'inbox')) return new Response('Not allowed', { status: 403 });
  const { form } = await params;

  if (form === 'newsletter') {
    const subscribers = await db().select().from(schema.newsletterSubscribers).orderBy(asc(schema.newsletterSubscribers.createdAt));
    return download(
      csv([['Email', 'Signed up', 'Where'], ...subscribers.map((s) => [s.email, when(s.createdAt), newsletterSourceLabel(s.source)])]),
      `newsletter-${stamp()}.csv`
    );
  }

  if (!Object.hasOwn(INBOXES, form)) return new Response('Not found', { status: 404 });
  const messages = await db()
    .select()
    .from(schema.formSubmissions)
    .where(eq(schema.formSubmissions.form, form as FormKind))
    .orderBy(asc(schema.formSubmissions.createdAt));

  // One column per answer, in the order they first appear.
  const columns: string[] = [];
  for (const m of messages) for (const s of m.answers) for (const f of s.fields) {
    const key = `${s.title}: ${f.label}`;
    if (!columns.includes(key)) columns.push(key);
  }

  const rows = messages.map((m) => {
    const answers = new Map<string, string>(m.answers.flatMap((s) => s.fields.map((f) => [`${s.title}: ${f.label}`, f.value] as [string, string])));
    return [m.reference, when(m.createdAt), SUBMISSION_STATUS_LABELS[m.status], m.name, m.email, m.phone, m.subject, ...columns.map((c) => answers.get(c) ?? ''), m.notes];
  });

  return download(
    csv([['Reference', 'Received', 'Status', 'Name', 'Email', 'Phone', 'Subject', ...columns, 'Team notes'], ...rows]),
    `${form}-${stamp()}.csv`
  );
}
