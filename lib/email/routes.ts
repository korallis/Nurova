/** The website forms that can be emailed, as listed in Settings → Email. Shared by the dashboard and the server. */
export const EMAIL_ROUTES = [{ id: 'newsletter', label: 'Newsletter sign-ups', defaultOn: false }] as const;

export type EmailRoute = (typeof EMAIL_ROUTES)[number]['id'];

export const isEmailRoute = (value: unknown): value is EmailRoute => EMAIL_ROUTES.some((r) => r.id === value);

/** Splits "a@x.com, b@y.com" into valid addresses. */
export const parseAddresses = (value: string) =>
  value
    .split(/[,;\s]+/)
    .map((a) => a.trim())
    .filter((a) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a));
