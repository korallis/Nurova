'use client';

import { useRef, useState } from 'react';
import { FileText, ImageIcon, Images, Loader2, Upload, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { PHOTO_LIBRARY } from '@/lib/content/photo-library';
import type { Photo } from '@/lib/content/fields';
import { IMAGE_ACCEPT, imageSize, uploadError, uploadFile } from './uploads';
import { cn } from '@/lib/utils';

const inputClass =
  'w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-brand-ink focus:border-brand-coral focus:outline-none focus:ring-2 focus:ring-brand-coral/30';

const smallButton =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-brand-ink transition hover:border-brand-ink disabled:cursor-not-allowed disabled:opacity-50';

function LibraryDialog({ open, onClose, onPick }: { open: boolean; onClose: () => void; onPick: (photo: (typeof PHOTO_LIBRARY)[number]) => void }) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-4xl overflow-y-auto p-6">
        <DialogTitle className="text-lg font-bold text-brand-ink">Choose a photo</DialogTitle>
        <p className="text-xs text-neutral-500">Photos with a chequered background are cut-outs (transparent background).</p>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PHOTO_LIBRARY.map((photo) => (
            <li key={photo.src}>
              <button
                type="button"
                onClick={() => {
                  onPick(photo);
                  onClose();
                }}
                className="group block w-full cursor-pointer overflow-hidden rounded-lg border border-neutral-200 text-left hover:border-brand-coral"
              >
                <span
                  className={cn(
                    'block aspect-[4/3] bg-contain bg-center bg-no-repeat',
                    photo.transparent && 'bg-[conic-gradient(#eee_25%,#fff_0_50%,#eee_0_75%,#fff_0)] bg-[length:16px_16px]'
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.src} alt="" loading="lazy" className="h-full w-full object-contain" />
                </span>
                <span className="block truncate px-2 py-1 text-[11px] text-neutral-500 group-hover:text-brand-ink">
                  {photo.src.split('/').pop()}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

/** Upload / choose / paste an image; reports the URL and its pixel size. */
function ImagePicker({ src, onChange }: { src: string; onChange: (src: string, size: { width: number; height: number }) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [libraryOpen, setLibraryOpen] = useState(false);

  const pickFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const url = await uploadFile(file, 'image');
      onChange(url, await imageSize(url));
    } catch (e) {
      setError(uploadError(e));
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className="flex h-28 w-40 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-[conic-gradient(#f3f3f3_25%,#fff_0_50%,#f3f3f3_0_75%,#fff_0)] bg-[length:16px_16px]">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="h-full w-full object-contain" />
        ) : (
          <ImageIcon className="h-8 w-8 text-neutral-300" aria-hidden="true" />
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap gap-2">
          <button type="button" className={smallButton} disabled={busy} onClick={() => fileRef.current?.click()}>
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            {busy ? 'Uploading…' : 'Upload'}
          </button>
          <button type="button" className={smallButton} onClick={() => setLibraryOpen(true)}>
            <Images className="h-3.5 w-3.5" /> Site photos
          </button>
          {src && (
            <button type="button" className={smallButton} onClick={() => onChange('', { width: 0, height: 0 })}>
              <X className="h-3.5 w-3.5" /> Remove
            </button>
          )}
        </div>
        <input
          type="text"
          className={inputClass}
          value={src}
          placeholder="…or paste an image URL"
          onChange={(e) => onChange(e.target.value, { width: 0, height: 0 })}
          onBlur={async (e) => e.target.value && onChange(e.target.value, await imageSize(e.target.value))}
        />
        {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
        <input
          ref={fileRef}
          type="file"
          accept={IMAGE_ACCEPT}
          className="hidden"
          onChange={(e) => pickFile(e.target.files?.[0])}
        />
      </div>
      <LibraryDialog open={libraryOpen} onClose={() => setLibraryOpen(false)} onPick={(p) => onChange(p.src, p)} />
    </div>
  );
}

/** Just a URL (e.g. the home pillar photos). */
export function ImageUrlInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <ImagePicker src={value} onChange={(src) => onChange(src)} />;
}

/** A photo with alt text and size. */
export function PhotoInput({ value, onChange }: { value: Photo; onChange: (value: Photo) => void }) {
  const photo = value ?? { src: '', alt: '', width: 0, height: 0 };
  return (
    <div className="space-y-2">
      <ImagePicker src={photo.src} onChange={(src, size) => onChange({ ...photo, src, width: size.width || photo.width, height: size.height || photo.height })} />
      <label className="block text-xs font-semibold text-neutral-600">
        Description for screen readers (alt text)
        <input
          type="text"
          className={cn(inputClass, 'mt-1')}
          value={photo.alt}
          placeholder="e.g. Smiling girl holding a green folder"
          onChange={(e) => onChange({ ...photo, alt: e.target.value })}
        />
      </label>
    </div>
  );
}

interface GalleryImageValue {
  src: string;
  alt: string;
}

/** An ordered list of photos, e.g. a blog post's gallery. */
export function GalleryInput({ value, onChange }: { value: GalleryImageValue[]; onChange: (value: GalleryImageValue[]) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const set = (index: number, image: GalleryImageValue) => onChange(value.map((item, i) => (i === index ? image : item)));
  const move = (index: number, by: -1 | 1) => {
    const next = [...value];
    [next[index], next[index + by]] = [next[index + by], next[index]];
    onChange(next);
  };

  // Several photos at once, added to the end in the order chosen.
  const uploadMany = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setError('');
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) urls.push(await uploadFile(file, 'image'));
      onChange([...value, ...urls.map((src) => ({ src, alt: '' }))]);
    } catch (e) {
      setError(uploadError(e));
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {value.length === 0 && <p className="text-xs text-neutral-500">No photos yet. The carousel is hidden until you add some.</p>}

      <ol className="space-y-3">
        {value.map((image, i) => (
          <li key={i} className="space-y-2 rounded-lg border border-neutral-200 p-3">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-500">
              <span>Photo {i + 1}</span>
              <span className="flex gap-1">
                <button type="button" className={smallButton} disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Move photo ${i + 1} up`}>
                  ↑
                </button>
                <button type="button" className={smallButton} disabled={i === value.length - 1} onClick={() => move(i, 1)} aria-label={`Move photo ${i + 1} down`}>
                  ↓
                </button>
                <button type="button" className={smallButton} onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label={`Remove photo ${i + 1}`}>
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            </div>
            <ImagePicker src={image.src} onChange={(src) => set(i, { ...image, src })} />
            <label className="block text-xs font-semibold text-neutral-600">
              Description (alt text)
              <input type="text" className={cn(inputClass, 'mt-1')} value={image.alt} onChange={(e) => set(i, { ...image, alt: e.target.value })} />
            </label>
          </li>
        ))}
      </ol>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={smallButton} disabled={busy} onClick={() => fileRef.current?.click()}>
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          {busy ? 'Uploading…' : 'Upload photos'}
        </button>
        <button type="button" className={smallButton} onClick={() => onChange([...value, { src: '', alt: '' }])}>
          <Images className="h-3.5 w-3.5" /> Add from site photos / URL
        </button>
      </div>
      {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
      <input
        ref={fileRef}
        type="file"
        multiple
        accept={IMAGE_ACCEPT}
        className="hidden"
        onChange={(e) => uploadMany(e.target.files)}
      />
    </div>
  );
}

/** An uploaded document such as a policy PDF. */
export function FileInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const pickFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      onChange(await uploadFile(file, 'document'));
    } catch (e) {
      setError(uploadError(e));
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className={smallButton} disabled={busy} onClick={() => fileRef.current?.click()}>
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          {busy ? 'Uploading…' : value ? 'Replace PDF' : 'Upload PDF'}
        </button>
        {value && (
          <>
            <a href={value} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-brand-ink underline">
              <FileText className="h-3.5 w-3.5" /> View current file
            </a>
            <button type="button" className={smallButton} onClick={() => onChange('')}>
              <X className="h-3.5 w-3.5" /> Remove
            </button>
          </>
        )}
      </div>
      {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
      <input ref={fileRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => pickFile(e.target.files?.[0])} />
    </div>
  );
}

export { inputClass };
