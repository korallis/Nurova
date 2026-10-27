# Nurova

Marketing site and admin dashboard for Nurova, built with Next.js. Owned by **Muve Healthcare Ltd** and hosted entirely in the UK:

| Service | Where | Region |
| --- | --- | --- |
| Vercel project `nurova` | team `muve-healthcare` | functions in `lhr1` (London), pinned in `vercel.json` |
| Postgres (Neon, via Vercel Marketplace) | store `Nurova-DB` | `lhr1` |
| Vercel Blob (dashboard uploads) | store `nurova-uploads` | `lhr1` |

Dates in the dashboard and in notification emails use `en-GB` and `Europe/London`.

## Develop

```bash
bun install
vercel link --scope muve-healthcare --project nurova   # one-time
vercel env pull .env.local                              # DATABASE_URL, SESSION_SECRET, BLOB_READ_WRITE_TOKEN
bun dev
```

Open <http://localhost:3000>. Without `DATABASE_URL` the site serves its built-in copy; the dashboard at `/admin` needs the database.

## Dashboard, database and email

See [docs/dashboard.md](docs/dashboard.md) for migrations (`bun run db:migrate`), seeding, creating the first admin and Microsoft 365 email setup.

## Deploy

Pushes to `main` deploy to production through the Vercel GitHub integration. Environment variables live in Vercel → `muve-healthcare/nurova` → Settings → Environment Variables; the Neon and Blob stores set theirs automatically.
