import { asc } from 'drizzle-orm';
import { getCurrentAdmin } from '@/lib/auth/dal';
import { canAccess } from '@/lib/auth/permissions';
import { db, schema } from '@/lib/db';
import { newsletterSourceLabel } from '@/lib/forms/shared';

/**
 * CSV download of one inbox (for now, the newsletter list) for spreadsheets
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

  return new Response('Not found', { status: 404 });
}
