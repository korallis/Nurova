'use client';

import { useEffect, useState, useTransition } from 'react';
import { ArrowDown, ArrowUp, Check, Copy, ExternalLink, Loader2, Plus, Trash2 } from 'lucide-react';
import { emptyValue, type Field, type Photo } from '@/lib/content/fields';
import { saveContent, type SaveResult } from '@/lib/admin/content-actions';
import { FileInput, ImageUrlInput, PhotoInput, inputClass } from './MediaInputs';
import { cn } from '@/lib/utils';

type Value = unknown;
type Obj = Record<string, unknown>;

const labelClass = 'block text-sm font-semibold text-brand-ink';
const helpClass = 'mt-0.5 text-xs text-neutral-500';
const iconButton =
  'inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-neutral-500 transition hover:bg-neutral-100 hover:text-brand-ink disabled:cursor-not-allowed disabled:opacity-30';

function fieldLabel(field: Field): string | undefined {
  return 'label' in field ? field.label : undefined;
}

/** Short summary of a list item for its collapsed row. */
function itemSummary(field: Extract<Field, { type: 'list' }>, item: Value, index: number): string {
  if (typeof item === 'string') return item.slice(0, 80) || `Item ${index + 1}`;
  if (item && typeof item === 'object') {
    const o = item as Obj;
    const title = (field.itemTitle && o[field.itemTitle]) || o.title || o.label || o.heading;
    if (field.item.type === 'union') {
      const variant = field.item.variants[String(o[field.item.tag])]?.label;
      return [variant, typeof title === 'string' ? title : ''].filter(Boolean).join(': ') || `Item ${index + 1}`;
    }
    if (typeof title === 'string' && title) return title.slice(0, 80);
  }
  return `Item ${index + 1}`;
}

function FieldEditor({ field, value, onChange, depth }: { field: Field; value: Value; onChange: (v: Value) => void; depth: number }) {
  switch (field.type) {
    case 'text':
      return (
        <Labelled field={field}>
          <input type="text" className={inputClass} value={String(value ?? '')} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />
        </Labelled>
      );
    case 'textarea':
      return (
        <Labelled field={field}>
          <textarea className={cn(inputClass, 'resize-y leading-relaxed')} rows={field.rows ?? 3} value={String(value ?? '')} onChange={(e) => onChange(e.target.value)} />
        </Labelled>
      );
    case 'number':
      return (
        <Labelled field={field}>
          <input type="number" className={cn(inputClass, 'max-w-32')} value={Number(value ?? 0)} onChange={(e) => onChange(Number(e.target.value))} />
        </Labelled>
      );
    case 'boolean':
      return (
        <label className="flex cursor-pointer items-start gap-2.5">
          <input type="checkbox" className="mt-0.5 h-4 w-4 accent-brand-coral" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
          <span>
            <span className="text-sm font-semibold text-brand-ink">{field.label}</span>
            {field.help && <span className={cn(helpClass, 'block')}>{field.help}</span>}
          </span>
        </label>
      );
    case 'select':
      return (
        <Labelled field={field}>
          <select className={cn(inputClass, 'max-w-sm')} value={String(value ?? '')} onChange={(e) => onChange(e.target.value)}>
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Labelled>
      );
    case 'imageUrl':
      return (
        <Labelled field={field}>
          <ImageUrlInput value={String(value ?? '')} onChange={onChange} />
        </Labelled>
      );
    case 'photo':
      return (
        <Labelled field={field}>
          <PhotoInput value={value as Photo} onChange={onChange} />
        </Labelled>
      );
    case 'file':
      return (
        <Labelled field={field}>
          <FileInput value={String(value ?? '')} onChange={onChange} />
        </Labelled>
      );
    case 'object':
      return <ObjectEditor field={field} value={value} onChange={onChange} depth={depth} />;
    case 'optional': {
      const on = value !== null && value !== undefined;
      return (
        <div className="rounded-lg border border-dashed border-neutral-300 p-3">
          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              className="h-4 w-4 accent-brand-coral"
              checked={on}
              onChange={(e) => onChange(e.target.checked ? emptyValue(field.field) : null)}
            />
            <span className="text-sm font-semibold text-brand-ink">{field.label}</span>
          </label>
          {field.help && <p className={helpClass}>{field.help}</p>}
          {on && (
            <div className="mt-3">
              <FieldEditor field={field.field} value={value} onChange={onChange} depth={depth + 1} />
            </div>
          )}
        </div>
      );
    }
    case 'list':
      return <ListEditor field={field} value={value} onChange={onChange} depth={depth} />;
    case 'union':
      return <UnionEditor field={field} value={value} onChange={onChange} depth={depth} />;
  }
}

function Labelled({ field, children }: { field: Field; children: React.ReactNode }) {
  return (
    <div>
      <span className={labelClass}>{fieldLabel(field)}</span>
      {'help' in field && field.help && <p className={helpClass}>{field.help}</p>}
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function ObjectEditor({ field, value, onChange, depth }: { field: Extract<Field, { type: 'object' }>; value: Value; onChange: (v: Value) => void; depth: number }) {
  const obj = (value && typeof value === 'object' ? value : {}) as Obj;
  const entries = Object.entries(field.fields);
  const inner = (
    <div className="space-y-5">
      {entries.map(([key, sub]) => (
        <FieldEditor key={key} field={sub} value={obj[key]} onChange={(v) => onChange({ ...obj, [key]: v })} depth={depth + 1} />
      ))}
    </div>
  );

  // Top-level groups become collapsible cards; nested groups are simple panels.
  if (depth === 0 || !field.label) return inner;
  if (depth === 1) {
    return (
      <details open className="group rounded-xl border border-neutral-200 bg-white shadow-xs">
        <summary className="cursor-pointer select-none list-none rounded-xl px-5 py-4 text-base font-bold text-brand-ink marker:hidden hover:bg-neutral-50">
          <span className="mr-2 inline-block transition group-open:rotate-90">▸</span>
          {field.label}
          {field.help && <span className="ml-2 text-xs font-normal text-neutral-500">{field.help}</span>}
        </summary>
        <div className="border-t border-neutral-100 px-5 py-5">{inner}</div>
      </details>
    );
  }
  return (
    <fieldset className="rounded-lg border border-neutral-200 bg-neutral-50/60 p-4">
      <legend className="px-1 text-sm font-bold text-brand-ink">{field.label}</legend>
      {field.help && <p className={cn(helpClass, 'mb-3')}>{field.help}</p>}
      {inner}
    </fieldset>
  );
}

function ListEditor({ field, value, onChange, depth }: { field: Extract<Field, { type: 'list' }>; value: Value; onChange: (v: Value) => void; depth: number }) {
  const items = Array.isArray(value) ? value : [];
  const simple = field.item.type === 'text' || field.item.type === 'textarea';
  const atMax = field.max !== undefined && items.length >= field.max;
  const atMin = field.min !== undefined && items.length <= field.min;

  const move = (from: number, to: number) => {
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  const controls = (i: number) => (
    <span className="flex shrink-0 items-center">
      <button type="button" className={iconButton} disabled={i === 0} onClick={() => move(i, i - 1)} aria-label="Move up">
        <ArrowUp className="h-4 w-4" />
      </button>
      <button type="button" className={iconButton} disabled={i === items.length - 1} onClick={() => move(i, i + 1)} aria-label="Move down">
        <ArrowDown className="h-4 w-4" />
      </button>
      {!simple && (
        <button type="button" className={iconButton} disabled={atMax} onClick={() => onChange([...items.slice(0, i + 1), structuredClone(items[i]), ...items.slice(i + 1)])} aria-label="Duplicate">
          <Copy className="h-4 w-4" />
        </button>
      )}
      <button
        type="button"
        className={cn(iconButton, 'hover:text-red-600')}
        disabled={atMin}
        onClick={() => onChange(items.filter((_, j) => j !== i))}
        aria-label="Remove"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </span>
  );

  return (
    <div>
      <span className={labelClass}>{field.label}</span>
      {field.help && <p className={helpClass}>{field.help}</p>}
      <ol className="mt-2 space-y-2">
        {items.map((item, i) =>
          simple ? (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-2 w-5 shrink-0 text-right text-xs text-neutral-400">{i + 1}.</span>
              <div className="flex-1">
                {field.item.type === 'textarea' ? (
                  <textarea className={cn(inputClass, 'resize-y')} rows={field.item.rows ?? 2} value={String(item ?? '')} onChange={(e) => onChange(items.map((v, j) => (j === i ? e.target.value : v)))} />
                ) : (
                  <input type="text" className={inputClass} value={String(item ?? '')} onChange={(e) => onChange(items.map((v, j) => (j === i ? e.target.value : v)))} />
                )}
              </div>
              {controls(i)}
            </li>
          ) : (
            <li key={i}>
              <details className="group rounded-lg border border-neutral-200 bg-white">
                <summary className="flex cursor-pointer select-none list-none items-center gap-2 px-3 py-2 marker:hidden hover:bg-neutral-50">
                  <span className="text-xs text-neutral-400 transition group-open:rotate-90">▸</span>
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-brand-ink">{itemSummary(field, item, i)}</span>
                  {controls(i)}
                </summary>
                <div className="border-t border-neutral-100 p-4">
                  <FieldEditor field={{ ...field.item, ...(field.item.type === 'object' ? { label: undefined } : {}) } as Field} value={item} onChange={(v) => onChange(items.map((x, j) => (j === i ? v : x)))} depth={depth + 2} />
                </div>
              </details>
            </li>
          )
        )}
      </ol>
      <button
        type="button"
        disabled={atMax}
        onClick={() => onChange([...items, emptyValue(field.item)])}
        className="mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-dashed border-neutral-400 px-3 py-1.5 text-xs font-semibold text-brand-ink transition hover:border-brand-coral hover:text-brand-coral disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="h-3.5 w-3.5" /> Add {simple ? 'line' : fieldLabel(field.item)?.toLowerCase() ?? 'item'}
      </button>
    </div>
  );
}

function UnionEditor({ field, value, onChange, depth }: { field: Extract<Field, { type: 'union' }>; value: Value; onChange: (v: Value) => void; depth: number }) {
  const obj = (value && typeof value === 'object' ? value : emptyValue(field)) as Obj;
  const current = String(obj[field.tag]);
  const variant = field.variants[current] ?? Object.values(field.variants)[0];

  const switchTo = (next: string) => {
    // Keep any copy that carries over (eyebrow, heading, text, photo…).
    const fresh = emptyValue({ type: 'union', label: '', tag: field.tag, variants: { [next]: field.variants[next] } }) as Obj;
    for (const key of Object.keys(fresh)) if (key !== field.tag && key in obj) fresh[key] = obj[key];
    onChange(fresh);
  };

  return (
    <div className="space-y-4">
      <div>
        <span className={labelClass}>{field.label} type</span>
        <select className={cn(inputClass, 'mt-1.5 max-w-sm')} value={current} onChange={(e) => switchTo(e.target.value)}>
          {Object.entries(field.variants).map(([key, v]) => (
            <option key={key} value={key}>
              {v.label}
            </option>
          ))}
        </select>
      </div>
      <ObjectEditor field={{ type: 'object', fields: variant.fields }} value={obj} onChange={(v) => onChange({ ...(v as Obj), [field.tag]: current })} depth={depth + 1} />
    </div>
  );
}

interface ContentEditorProps {
  contentKey: string;
  schema: Field;
  initial: unknown;
  publicPath: string;
}

/** Form editor for one content document, generated from its schema. */
export function ContentEditor({ contentKey, schema, initial, publicPath }: ContentEditorProps) {
  const [value, setValue] = useState<Value>(initial);
  const [dirty, setDirty] = useState(false);
  const [result, setResult] = useState<SaveResult | null>(null);
  const [pending, startTransition] = useTransition();

  // Warn before leaving with unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const save = () =>
    startTransition(async () => {
      const res = await saveContent(contentKey, value);
      setResult(res);
      if (res.ok) setDirty(false);
    });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      className="space-y-4"
    >
      <div className="sticky top-0 z-20 -mx-4 flex flex-wrap items-center gap-3 border-b border-neutral-200 bg-neutral-50/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand-coral px-5 py-2 text-sm font-bold text-white transition hover:brightness-95 disabled:opacity-60"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          {pending ? 'Saving…' : 'Save changes'}
        </button>
        <a href={publicPath} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-ink hover:underline">
          <ExternalLink className="h-4 w-4" /> View page
        </a>
        <span className="text-xs text-neutral-500" role="status">
          {dirty ? 'Unsaved changes' : result?.ok ? `Saved ${new Date(result.savedAt).toLocaleTimeString()}. The live site updates on the next visit.` : ''}
        </span>
      </div>

      {result && !result.ok && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-bold">Couldn’t save — please fix:</p>
          <ul className="mt-1 list-disc pl-5">
            {result.errors.slice(0, 10).map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <FieldEditor
        field={schema}
        value={value}
        onChange={(v) => {
          setValue(v);
          setDirty(true);
        }}
        depth={0}
      />
    </form>
  );
}
