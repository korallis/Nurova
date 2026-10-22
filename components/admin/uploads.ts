'use client';

import { upload } from '@vercel/blob/client';

/** File types the image pickers offer (the extensions help Windows' file dialog). Keep in step with /api/admin/upload. */
export const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml,.jpg,.jpeg,.png,.svg';

/** Uploads a file to Vercel Blob through /api/admin/upload and returns its public URL. */
export async function uploadFile(file: File, kind: 'image' | 'document'): Promise<string> {
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
  const blob = await upload(`${kind === 'image' ? 'images' : 'documents'}/${safeName}`, file, {
    access: 'public',
    handleUploadUrl: '/api/admin/upload',
    clientPayload: kind,
  });
  return blob.url;
}

/** An SVG's size from its width/height attributes or, failing that, its viewBox. */
async function svgSize(src: string): Promise<{ width: number; height: number }> {
  try {
    const svg = new DOMParser().parseFromString(await (await fetch(src)).text(), 'image/svg+xml').documentElement;
    const width = parseFloat(svg.getAttribute('width') ?? '');
    const height = parseFloat(svg.getAttribute('height') ?? '');
    if (width > 0 && height > 0) return { width: Math.round(width), height: Math.round(height) };
    const [, , vbWidth, vbHeight] = (svg.getAttribute('viewBox') ?? '').split(/[\s,]+/).map(Number);
    if (vbWidth > 0 && vbHeight > 0) return { width: Math.round(vbWidth), height: Math.round(vbHeight) };
  } catch {}
  return { width: 0, height: 0 };
}

/** Reads an image's pixel size in the browser (needed for correctly sized photos). */
export function imageSize(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      // SVGs without a fixed size report 0 (or a default); read their own dimensions instead.
      if (/\.svg(\?|$)/i.test(src)) svgSize(src).then((size) => resolve(size.width ? size : { width: img.naturalWidth, height: img.naturalHeight }));
      else resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = src;
  });
}

/** Friendly message for a failed upload. */
export function uploadError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (/BLOB_READ_WRITE_TOKEN|503|aren’t set up/i.test(message)) {
    return 'Uploads aren’t set up yet. Add BLOB_READ_WRITE_TOKEN in Vercel, or pick a photo from the library.';
  }
  if (/content type|allowed/i.test(message)) return 'That file type isn’t allowed.';
  if (/size|too large/i.test(message)) return 'That file is too large.';
  return `Upload failed: ${message}`;
}
