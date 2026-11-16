# Admin dashboard

The site has a built-in dashboard at **`/admin`** for editing website content, reading enquiries and seeing newsletter sign-ups. Content is stored in Postgres (Neon) through Drizzle, and images are uploaded to Vercel Blob. The setup is the same as the Muve Futures site.

## What can be edited

| In the dashboard | Where it appears |
| --- | --- |
| **Website content → Site settings & coming-soon page** | Site name, tagline, browser-tab title and search description, social links, the coming-soon card and form headings, and the thank-you screen shown after an enquiry |
| **Inbox → Enquiries** | Messages from the “Get in touch” form. Mark them open, resolved or archived, add team notes, reply by email, export as CSV |
| **Inbox → Newsletter** | Everyone who subscribed on the thank-you screen. Export as CSV for your email tool |
| **Admins** | Add or remove people who can sign in, choose what managers can use, change your password |
| **Settings** (super admins) | Email notifications through Microsoft 365: an email for each enquiry (on by default once set up) and, optionally, each sign-up |

Layout, colours and animations stay in code. Anything that hasn't been edited shows the site's original copy, so the site works even before the database is set up.

## One-time setup

1. **Create the database.** In [Neon](https://neon.tech), create a project and copy its connection string.
   In Vercel you can instead add Neon from **Storage → Create Database**, which sets `DATABASE_URL` for you.

2. **Set the environment variables** locally in `.env.local` (copy `.env.example`) and in Vercel → **Settings → Environment Variables**:

   | Variable | Value |
   | --- | --- |
   | `DATABASE_URL` | Neon connection string |
   | `SESSION_SECRET` | A random secret: `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"` |
   | `BLOB_READ_WRITE_TOKEN` | Set automatically when you connect a **Vercel Blob** store (Storage → Blob). Needed for uploads |

3. **Create the tables** (run once, and again whenever `lib/db/schema.ts` changes):

   ```bash
   bun run db:migrate
   ```

4. **Copy the current site copy into the database:**

   ```bash
   bun run db:seed
   ```

   This never overwrites anything already saved. `bun run db:seed -- --force` resets everything to the original copy.

5. **Create your admin account:**

   ```bash
   bun run admin:create
   ```

   You'll be asked for an email, name and password (at least 10 characters). Run it again with the same email to reset a forgotten password.

6. Sign in at **`/admin/login`**.

## Day to day

- **Saving** updates the live site straight away; the next visitor sees the change.
- **Reset to original** discards saved edits for that page.
- **Social links:** leave a link empty until the account exists. Its icon still shows on the coming-soon page but isn't clickable.

## Launching the full site (developers)

`/` redirects to `/coming-soon` (see `next.config.ts`). At launch, add the home page and swap the redirect, as the comment there explains. Public pages that share a header and footer go in `app/(site)/`, as on Muve Futures.

## Changing the content structure (developers)

- Tables: `lib/db/schema.ts`. After changing it run `bun run db:generate` then `bun run db:migrate`.
- Each editable document has a schema in `lib/content/schemas.ts` (which builds the dashboard form and validates saves), a type and defaults in `lib/content/pages.ts`, and an entry in `lib/content/registry.ts`.
- Pages read content with `getSingle()` from `lib/content/queries.ts`. Reads are cached and tagged; saves refresh them.
- The “I’m enquiring” and “What can we help with?” choices are in `lib/forms/shared.ts`; the form checks them on the server too.
- Muve Futures also has collections (services, audiences, legal pages), a blog and careers. Copy those modules across from it when Nurova needs them.

## Security

- Passwords are hashed with bcrypt; five wrong attempts lock the account for 15 minutes.
- Sessions are signed, HttpOnly cookies lasting 7 days. Removing an admin signs them out immediately.
- `proxy.ts` keeps signed-out visitors away from `/admin`, and every dashboard page, action and the upload endpoint checks the session against the database as well.
- Uploads accept images (up to 10 MB) and PDFs (up to 20 MB) from signed-in admins only.
- The website forms have a hidden honeypot field and a minimum fill time to keep bots out, and a repeated enquiry within two minutes isn’t saved twice.
- The enquiry form asks people not to include medical records or identifiable patient information.
- The Microsoft client secret is stored encrypted, and the dashboard is marked `noindex` so it stays out of search engines.
