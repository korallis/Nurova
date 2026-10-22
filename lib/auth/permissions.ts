/*
 * Who can use which part of the dashboard. Super admins can use everything,
 * including the Admins page. Managers only get the areas a super admin has
 * ticked for them. Shared by the server checks and the dashboard UI.
 */

export const ADMIN_AREAS = {
  content: { label: 'Website content', help: 'Pages, the coming-soon page and site settings' },
  inbox: { label: 'Inbox', help: 'Newsletter sign-ups and other messages from the website' },
} as const;

export type AdminArea = keyof typeof ADMIN_AREAS;
export type AdminRole = 'super_admin' | 'manager';

export const AREA_KEYS = Object.keys(ADMIN_AREAS) as AdminArea[];

export const ROLE_LABELS: Record<AdminRole, string> = { super_admin: 'Super admin', manager: 'Manager' };

export const isArea = (value: unknown): value is AdminArea => typeof value === 'string' && value in ADMIN_AREAS;

export interface AccessHolder {
  role: AdminRole;
  permissions: string[];
}

export const isSuperAdmin = (admin: AccessHolder) => admin.role === 'super_admin';

export function canAccess(admin: AccessHolder, area: AdminArea): boolean {
  return isSuperAdmin(admin) || admin.permissions.includes(area);
}

/**
 * The dashboard area a content document belongs to. Everything is Website
 * content for now; route keys elsewhere here if an area gets its own documents.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const contentArea = (_key: string): AdminArea => 'content';
