/**
 * A small schema language for editable content. The same definitions drive
 * the dashboard's form editor (components/admin/ContentEditor) and validate
 * what the server stores, so a save can only ever write data the site can
 * render. Definitions are plain objects so they can be passed to the client.
 */

export type Field =
  | { type: 'text'; label: string; help?: string; placeholder?: string }
  /** Multi-line text. A line break in headings becomes a line break on large screens. */
  | { type: 'textarea'; label: string; help?: string; rows?: number }
  /** A photo with its alt text and pixel size: `{ src, alt, width, height }`. */
  | { type: 'photo'; label: string; help?: string }
  /** Just an image URL. */
  | { type: 'imageUrl'; label: string; help?: string }
  /** An uploaded document (e.g. a PDF); the value is its URL. Empty when there is none. */
  | { type: 'file'; label: string; help?: string }
  | { type: 'select'; label: string; options: { value: string; label: string }[]; help?: string }
  | { type: 'boolean'; label: string; help?: string }
  | { type: 'number'; label: string; help?: string }
  | { type: 'object'; label?: string; help?: string; fields: Record<string, Field> }
  /** Something that can be switched off, e.g. an optional cut-out photo. */
  | { type: 'optional'; label: string; help?: string; field: Field }
  | {
      type: 'list';
      label: string;
      help?: string;
      item: Field;
      /** For lists of objects: which property to show as each row's title. */
      itemTitle?: string;
      min?: number;
      max?: number;
    }
  /** One of several shapes, chosen by the value of `tag` (e.g. a page block's `kind`). */
  | {
      type: 'union';
      label: string;
      help?: string;
      tag: string;
      variants: Record<string, { label: string; fields: Record<string, Field> }>;
    };

export interface Photo {
  src: string;
  alt: string;
  width: number;
  height: number;
}

// ── Helpers for writing schemas ────────────────────────────────────────────

export const text = (label: string, extra: Partial<Extract<Field, { type: 'text' }>> = {}): Field => ({ type: 'text', label, ...extra });
export const textarea = (label: string, extra: Partial<Extract<Field, { type: 'textarea' }>> = {}): Field => ({ type: 'textarea', label, ...extra });
export const photo = (label: string, help?: string): Field => ({ type: 'photo', label, help });
export const imageUrl = (label: string, help?: string): Field => ({ type: 'imageUrl', label, help });
export const file = (label: string, help?: string): Field => ({ type: 'file', label, help });
export const bool = (label: string, help?: string): Field => ({ type: 'boolean', label, help });
export const num = (label: string, help?: string): Field => ({ type: 'number', label, help });
export const select = (label: string, options: Record<string, string>, help?: string): Field => ({
  type: 'select',
  label,
  help,
  options: Object.entries(options).map(([value, optionLabel]) => ({ value, label: optionLabel })),
});
export const object = (fields: Record<string, Field>, label?: string, help?: string): Field => ({ type: 'object', fields, label, help });
export const optional = (label: string, field: Field, help?: string): Field => ({ type: 'optional', label, field, help });
export const list = (
  label: string,
  item: Field,
  extra: Partial<Extract<Field, { type: 'list' }>> = {}
): Field => ({ type: 'list', label, item, ...extra });

// ── Validation ─────────────────────────────────────────────────────────────

export class ContentValidationError extends Error {
  constructor(public readonly issues: string[]) {
    super(issues.join('\n'));
  }
}

/** An empty value for a field, used when adding list items or switching union variants. */
export function emptyValue(field: Field): unknown {
  switch (field.type) {
    case 'text':
    case 'textarea':
    case 'imageUrl':
    case 'file':
      return '';
    case 'photo':
      return { src: '', alt: '', width: 0, height: 0 };
    case 'select':
      return field.options[0]?.value ?? '';
    case 'boolean':
      return false;
    case 'number':
      return 0;
    case 'object':
      return Object.fromEntries(Object.entries(field.fields).map(([k, f]) => [k, emptyValue(f)]));
    case 'optional':
      return null;
    case 'list':
      return [];
    case 'union': {
      const [tagValue, variant] = Object.entries(field.variants)[0];
      return { [field.tag]: tagValue, ...(emptyValue({ type: 'object', fields: variant.fields }) as object) };
    }
  }
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

/**
 * Checks `value` against `field` and returns a clean copy containing only the
 * known properties. Throws ContentValidationError listing every problem.
 */
export function validate(field: Field, value: unknown): unknown {
  const issues: string[] = [];
  const result = check(field, value, field.type === 'object' ? '' : field.label, issues);
  if (issues.length) throw new ContentValidationError(issues);
  return result;
}

function check(field: Field, value: unknown, path: string, issues: string[]): unknown {
  const at = path || 'value';
  switch (field.type) {
    case 'text':
    case 'textarea':
    case 'imageUrl':
    case 'file':
      if (typeof value !== 'string') {
        issues.push(`${at} must be text.`);
        return '';
      }
      if (value.length > 20000) issues.push(`${at} is too long.`);
      return value;

    case 'photo': {
      if (!isRecord(value) || typeof value.src !== 'string') {
        issues.push(`${at} needs an image.`);
        return emptyValue(field);
      }
      return {
        src: value.src,
        alt: typeof value.alt === 'string' ? value.alt : '',
        width: Number(value.width) || 0,
        height: Number(value.height) || 0,
      };
    }

    case 'select':
      // Built-in content leaves some choices out and relies on the first option as the default.
      if (value === undefined) return field.options[0]?.value;
      if (typeof value !== 'string' || !field.options.some((o) => o.value === value)) {
        issues.push(`${at} must be one of: ${field.options.map((o) => o.label).join(', ')}.`);
        return field.options[0]?.value;
      }
      return value;

    case 'boolean':
      return Boolean(value);

    case 'number': {
      const n = Number(value);
      if (!Number.isFinite(n)) issues.push(`${at} must be a number.`);
      return n;
    }

    case 'object': {
      if (!isRecord(value)) {
        issues.push(`${at} is missing.`);
        return emptyValue(field);
      }
      return Object.fromEntries(
        Object.entries(field.fields).map(([key, sub]) => [
          key,
          check(sub, value[key], `${path ? `${path} → ` : ''}${sub.type === 'object' ? sub.label ?? key : (sub as { label: string }).label}`, issues),
        ])
      );
    }

    // Stored as null when switched off, so defaults don't bring it back (see withDefaults).
    case 'optional':
      return value === undefined || value === null ? null : check(field.field, value, at, issues);

    case 'list': {
      if (value === undefined && !field.min) return [];
      if (!Array.isArray(value)) {
        issues.push(`${at} must be a list.`);
        return [];
      }
      if (field.min !== undefined && value.length < field.min) issues.push(`${at} needs at least ${field.min} item(s).`);
      if (field.max !== undefined && value.length > field.max) issues.push(`${at} can have at most ${field.max} item(s).`);
      return value.map((item, i) => check(field.item, item, `${at} #${i + 1}`, issues));
    }

    case 'union': {
      if (!isRecord(value) || typeof value[field.tag] !== 'string' || !(value[field.tag] as string in field.variants)) {
        issues.push(`${at} has an unknown type.`);
        return emptyValue(field);
      }
      const tagValue = value[field.tag] as string;
      const variant = field.variants[tagValue];
      const rest = check({ type: 'object', fields: variant.fields }, value, `${at} (${variant.label})`, issues) as object;
      return { [field.tag]: tagValue, ...rest };
    }
  }
}

/**
 * Fills gaps in stored content with the defaults, so fields added to a schema
 * after content was saved still render. Arrays are taken as stored.
 */
export function withDefaults<T>(stored: unknown, defaults: T): T {
  if (stored === undefined) return defaults;
  // null is a deliberate "switched off" optional value.
  if (stored === null) return null as T;
  if (!isRecord(stored) || !isRecord(defaults)) return stored as T;
  const merged: Record<string, unknown> = { ...defaults };
  for (const [key, value] of Object.entries(stored)) {
    merged[key] = key in defaults ? withDefaults(value, (defaults as Record<string, unknown>)[key]) : value;
  }
  return merged as T;
}
