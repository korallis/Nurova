import { NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { getCurrentAdmin } from '@/lib/auth/dal';
import { canAccess } from '@/lib/auth/permissions';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'image/svg+xml'];
const DOCUMENT_TYPES = ['application/pdf'];

/**
 * Issues short-lived tokens so the dashboard can upload files straight to
 * Vercel Blob from the browser. Only signed-in admins get a token.
 */
export async function POST(request: Request): Promise<NextResponse> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: 'Uploads aren’t set up yet: add BLOB_READ_WRITE_TOKEN (Vercel → Storage → Blob).' },
      { status: 503 }
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        const admin = await getCurrentAdmin();
        if (!admin) throw new Error('Not signed in');
        // Uploads are for the editors of website content.
        if (!canAccess(admin, 'content')) throw new Error('Not allowed');
        const documents = clientPayload === 'document';
        return {
          allowedContentTypes: documents ? DOCUMENT_TYPES : IMAGE_TYPES,
          maximumSizeInBytes: documents ? 20 * 1024 * 1024 : 10 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Upload failed' }, { status: 400 });
  }
}
