/*
 * The branded email every website form is forwarded in. Table-based with
 * inline styles so it renders in Outlook (desktop, web and mobile) as well as
 * Gmail and Apple Mail. Everything people typed is HTML-escaped.
 */

const BRAND = {
  coral: '#F45D5A',
  magenta: '#A3166E',
  purple: '#5B0A9E',
  violet: '#6B3FD9',
  ink: '#2A0B47',
  lilac: '#E9DDF7',
  page: '#F6F1FB',
};
const FONT = "'Lexend Deca', 'Segoe UI', Arial, sans-serif";

export const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/** Escaped, with line breaks kept. */
const text = (value: string) => escapeHtml(value).replace(/\r?\n/g, '<br>');

export interface EmailSection {
  title: string;
  fields: { label: string; value: string }[];
}

export interface BrandedEmail {
  /** Small label above the heading, e.g. "Website form · Newsletter". */
  eyebrow: string;
  heading: string;
  /** One or two sentences under the heading. */
  intro?: string;
  /** e.g. the received time, shown as a strip. */
  meta?: { label: string; value: string }[];
  sections: EmailSection[];
  button?: { label: string; href: string };
  /** Under the button, e.g. "Reply to this email to answer Jane directly." */
  note?: string;
  siteUrl: string;
  siteName: string;
}

function sectionHtml(section: EmailSection) {
  const rows = section.fields
    .map(
      (f, i) => `
          <tr>
            <td valign="top" style="padding:10px 14px;width:38%;font-family:${FONT};font-size:14px;line-height:20px;font-weight:bold;color:${BRAND.ink};background:${i % 2 ? '#ffffff' : BRAND.page};">${text(f.label)}</td>
            <td valign="top" style="padding:10px 14px;font-family:${FONT};font-size:14px;line-height:20px;color:${BRAND.ink};background:${i % 2 ? '#ffffff' : BRAND.page};">${text(f.value)}</td>
          </tr>`
    )
    .join('');
  return `
      <tr>
        <td style="padding:22px 32px 0 32px;">
          <p style="margin:0 0 8px 0;font-family:${FONT};font-size:13px;line-height:18px;font-weight:bold;letter-spacing:0.06em;text-transform:uppercase;color:${BRAND.magenta};">${text(section.title)}</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border-radius:8px;overflow:hidden;">${rows}
          </table>
        </td>
      </tr>`;
}

export function renderBrandedEmail(email: BrandedEmail): string {
  const meta = (email.meta ?? [])
    .map(
      (m) =>
        `<td style="padding:0 18px 0 0;font-family:${FONT};font-size:13px;line-height:18px;color:#ffffff;"><span style="opacity:0.85;">${text(m.label)}</span><br><strong style="font-size:15px;">${text(m.value)}</strong></td>`
    )
    .join('');
  const button = email.button
    ? `
      <tr>
        <td style="padding:28px 32px 0 32px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="border-radius:999px;background:${BRAND.coral};">
              <a href="${escapeHtml(email.button.href)}" style="display:inline-block;padding:13px 28px;font-family:${FONT};font-size:15px;line-height:18px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:999px;">${text(email.button.label)}</a>
            </td>
          </tr></table>
        </td>
      </tr>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<title>${text(email.heading)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.page};">
  <div style="display:none;max-height:0;overflow:hidden;">${text(email.intro ?? email.heading)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BRAND.page};">
    <tr>
      <td align="center" style="padding:28px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;">
          <tr>
            <td bgcolor="${BRAND.purple}" style="background:${BRAND.purple};background-image:linear-gradient(120deg,${BRAND.coral} 0%,${BRAND.magenta} 45%,${BRAND.purple} 75%,${BRAND.violet} 100%);padding:28px 32px 24px 32px;">
              <a href="${escapeHtml(email.siteUrl)}" style="font-family:${FONT};font-size:30px;line-height:34px;font-weight:bold;letter-spacing:-0.01em;color:#ffffff;text-decoration:none;">${text(email.siteName.toLowerCase())}</a>
              <p style="margin:18px 0 0 0;font-family:${FONT};font-size:13px;line-height:18px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;color:#ffffff;opacity:0.9;">${text(email.eyebrow)}</p>
              <h1 style="margin:6px 0 0 0;font-family:${FONT};font-size:26px;line-height:32px;font-weight:bold;color:#ffffff;">${text(email.heading)}</h1>
              ${meta ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:14px;"><tr>${meta}</tr></table>` : ''}
            </td>
          </tr>
          ${email.intro ? `<tr><td style="padding:24px 32px 0 32px;font-family:${FONT};font-size:15px;line-height:22px;color:${BRAND.ink};">${text(email.intro)}</td></tr>` : ''}
          ${email.sections.map(sectionHtml).join('')}
          ${button}
          ${email.note ? `<tr><td style="padding:16px 32px 0 32px;font-family:${FONT};font-size:13px;line-height:19px;color:#5d4b70;">${text(email.note)}</td></tr>` : ''}
          <tr><td style="padding:32px 0 0 0;"></td></tr>
          <tr>
            <td style="background:${BRAND.ink};padding:22px 32px;">
              <p style="margin:0;font-family:${FONT};font-size:13px;line-height:19px;color:#ffffff;"><strong>${text(email.siteName)}</strong></p>
              <p style="margin:6px 0 0 0;font-family:${FONT};font-size:11px;line-height:16px;color:${BRAND.lilac};">Sent automatically from the website. The same information is also in the dashboard Inbox.</p>
            </td>
          </tr>
          <tr><td style="background:${BRAND.coral};height:6px;line-height:6px;font-size:6px;">&nbsp;</td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
