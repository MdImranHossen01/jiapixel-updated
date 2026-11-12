import { S3Client, DeleteObjectCommand, DeleteObjectsCommand, PutObjectCommand } from '@aws-sdk/client-s3';

const accountId = process.env.R2_ACCOUNT_ID || '';
const accessKeyId = process.env.R2_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '';
export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'jiapixelmedia';
export const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://pub-0dadb28394cd4ea8b1f69260c1774617.r2.dev';

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

/**
 * Extracts the storage key from a full public R2 URL or relative path.
 * e.g., "https://pub-xxx.r2.dev/jiapixel/portfolios/abc.webp" -> "jiapixel/portfolios/abc.webp"
 */
export function extractR2Key(urlOrKey: string): string | null {
  if (!urlOrKey) return null;
  const trimmed = urlOrKey.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
  }

  try {
    const urlObj = new URL(trimmed);
    const pathname = urlObj.pathname.startsWith('/') ? urlObj.pathname.slice(1) : urlObj.pathname;
    return pathname || null;
  } catch {
    return null;
  }
}

/**
 * Server-side direct upload of File or Buffer to Cloudflare R2 with WebP conversion
 */
export async function uploadServerFileToR2(
  fileOrBuffer: File | Buffer,
  filename: string = 'image.jpg',
  folder: string = 'general',
  fileType: string = 'image/jpeg'
): Promise<{ url: string; fileKey: string; title: string }> {
  let buffer: Buffer;
  let contentType = fileType;
  let originalName = filename;

  if (fileOrBuffer && typeof (fileOrBuffer as any).arrayBuffer === 'function') {
    const file = fileOrBuffer as File;
    const bytes = await file.arrayBuffer();
    buffer = Buffer.from(bytes);
    contentType = file.type || fileType || 'image/jpeg';
    originalName = file.name || filename;
  } else {
    buffer = fileOrBuffer as Buffer;
  }

  const MAX_ALLOWED_BYTES = 1 * 1024 * 1024; // 1 MB
  if (buffer.length > MAX_ALLOWED_BYTES) {
    const sizeMB = (buffer.length / (1024 * 1024)).toFixed(2);
    throw new Error(`Image size cannot exceed 1 MB! Your file is ${sizeMB} MB.`);
  }

  const isSvg = contentType.includes('svg');
  const isGif = contentType.includes('gif');
  let ext = 'webp';

  if (!isSvg && !isGif) {
    try {
      const sharp = (await import('sharp')).default;
      const isBanner = folder === 'banners' || folder.includes('banner') || folder.includes('hero');
      const maxDim = isBanner ? 2160 : 1200;
      const targetSize = isBanner ? 400 * 1024 : 150 * 1024;

      const attempts = [
        { scale: 1.0, quality: 82 },
        { scale: 1.0, quality: 78 },
        { scale: 0.92, quality: 74 },
        { scale: 0.85, quality: 70 },
        { scale: 0.75, quality: 65 },
        { scale: 0.65, quality: 60 },
      ];

      let optimized = buffer;
      for (const attempt of attempts) {
        const dim = Math.max(100, Math.round(maxDim * attempt.scale));
        optimized = await sharp(buffer)
          .rotate()
          .resize({ width: dim, height: dim, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: attempt.quality, effort: 5 })
          .toBuffer();

        if (optimized.length <= targetSize) {
          break;
        }
      }

      buffer = optimized;
      contentType = 'image/webp';
      ext = 'webp';
    } catch {
      const rawExt = originalName.split('.').pop()?.toLowerCase() || 'jpg';
      ext = rawExt.replace(/[^a-z0-9]/g, '') || 'jpg';
    }
  } else {
    const rawExt = originalName.split('.').pop()?.toLowerCase() || (isSvg ? 'svg' : 'gif');
    ext = rawExt.replace(/[^a-z0-9]/g, '') || 'jpg';
  }

  const crypto = await import('crypto');
  const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '') || 'general';
  const fileKey = `jiapixel/${safeFolder}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileKey,
      Body: buffer,
      ContentType: contentType,
    })
  );

  const publicUrl = `${R2_PUBLIC_URL}/${fileKey}`;
  return { url: publicUrl, fileKey, title: originalName };
}

/**
 * Delete a single object from Cloudflare R2
 */
export async function deleteFromR2(urlOrKey: string): Promise<boolean> {
  const key = extractR2Key(urlOrKey);
  if (!key) return false;

  try {
    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
      })
    );
    return true;
  } catch (err) {
    console.error('Error deleting object from R2:', key, err);
    return false;
  }
}

/**
 * Delete multiple objects from Cloudflare R2 in a single batch
 */
export async function deleteMultipleFromR2(urlsOrKeys: string[]): Promise<number> {
  if (!Array.isArray(urlsOrKeys) || urlsOrKeys.length === 0) return 0;

  const validKeys = Array.from(
    new Set(
      urlsOrKeys
        .map(extractR2Key)
        .filter((k): k is string => Boolean(k) && typeof k === 'string')
    )
  );

  if (validKeys.length === 0) return 0;

  try {
    const chunks: string[][] = [];
    for (let i = 0; i < validKeys.length; i += 1000) {
      chunks.push(validKeys.slice(i, i + 1000));
    }

    let deletedCount = 0;
    for (const chunk of chunks) {
      const res = await r2Client.send(
        new DeleteObjectsCommand({
          Bucket: R2_BUCKET_NAME,
          Delete: {
            Objects: chunk.map((Key) => ({ Key })),
            Quiet: true,
          },
        })
      );
      deletedCount += chunk.length - (res.Errors?.length || 0);
    }

    return deletedCount;
  } catch (err) {
    console.error('Error batch deleting from R2:', err);
    return 0;
  }
}
