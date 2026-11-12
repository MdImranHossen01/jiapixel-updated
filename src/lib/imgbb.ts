/**
 * Cloudflare R2 Image Upload Utility with Client-side WebP Compression.
 * Fully compatible drop-in replacement for previous ImgBB methods.
 * Supports both client-side and server-side execution seamlessly.
 */

export interface ImgBBResponse {
  data: {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    width?: number;
    height?: number;
    size?: number;
    time?: string;
    expiration?: string;
    image?: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    thumb?: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    fileKey?: string;
  };
  success: boolean;
  status: number;
}

/**
 * Helper to encode a canvas to WebP blob.
 * Strictly verifies `blob.type === 'image/webp'` so Safari/iOS WebKit PNG fallbacks
 * are rejected and routed to server-side Sharp optimization.
 */
function canvasToWebpBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob || blob.type !== 'image/webp') {
          resolve(null);
          return;
        }
        resolve(blob);
      },
      'image/webp',
      quality
    );
  });
}

async function compressImageInBrowser(
  file: File,
  targetMaxKB = 150,
  maxDim = 1200
): Promise<File> {
  if (!file.type.startsWith('image/') || file.type.includes('svg') || file.type.includes('gif')) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const targetBytes = targetMaxKB * 1024;
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const filename = `${nameWithoutExt}.webp`;

      const attempts = [
        { scale: 1.0, quality: 0.82 },
        { scale: 1.0, quality: 0.78 },
        { scale: 0.92, quality: 0.74 },
        { scale: 0.85, quality: 0.70 },
        { scale: 0.75, quality: 0.65 },
        { scale: 0.65, quality: 0.60 },
      ];

      let bestBlob: Blob | null = null;

      for (const attempt of attempts) {
        const w = Math.max(1, Math.round(width * attempt.scale));
        const h = Math.max(1, Math.round(height * attempt.scale));
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d');
        if (!ctx) break;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, w, h);

        const blob = await canvasToWebpBlob(c, attempt.quality);
        if (!blob) {
          return resolve(file);
        }

        bestBlob = blob;
        if (blob.size <= targetBytes) {
          return resolve(new File([blob], filename, { type: 'image/webp' }));
        }
      }

      if (bestBlob) {
        return resolve(new File([bestBlob], filename, { type: 'image/webp' }));
      }

      resolve(file);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

export async function uploadToR2(
  file: File,
  folder: string = 'general',
  compress: boolean = true
): Promise<ImgBBResponse> {
  // 0. 1 MB File Size Guard
  const MAX_ALLOWED_BYTES = 1 * 1024 * 1024; // 1 MB
  if (file.size > MAX_ALLOWED_BYTES) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    throw new Error(`Image size cannot exceed 1 MB! Your file is ${sizeMB} MB. Please upload an image under 1 MB.`);
  }

  // If running on the server (Node.js runtime / Next.js API Route)
  if (typeof window === 'undefined') {
    const { uploadServerFileToR2 } = await import('./r2');
    const result = await uploadServerFileToR2(file, file.name, folder, file.type);
    return {
      success: true,
      status: 200,
      data: {
        id: result.fileKey,
        title: result.title,
        url: result.url,
        display_url: result.url,
        url_viewer: result.url,
        fileKey: result.fileKey,
      },
    };
  }

  const isBanner = folder === 'banners' || folder.includes('banner') || folder.includes('hero');
  const targetMaxKB = isBanner ? 400 : 150;
  const targetMaxBytes = targetMaxKB * 1024;
  const maxDim = isBanner ? 2100 : 1200;

  let uploadFile: File = file;
  let contentType = file.type || 'image/jpeg';
  let filename = file.name;
  const isSvgOrGif = file.type.includes('svg') || file.type.includes('gif');

  // 1. Client-side WebP Compression
  if (compress && file.type.startsWith('image/') && !isSvgOrGif) {
    try {
      uploadFile = await compressImageInBrowser(file, targetMaxKB, maxDim);
      contentType = uploadFile.type || 'image/webp';
      filename = uploadFile.name || 'image.webp';
    } catch (compErr) {
      console.warn('Client-side compression failed, falling back to server:', compErr);
      uploadFile = file;
      contentType = file.type || 'image/jpeg';
      filename = file.name;
    }
  }

  // 2. Try direct Presigned PUT Upload to Cloudflare R2 ONLY if valid WebP <= targetMaxBytes (or SVG/GIF)
  const canUsePresigned =
    isSvgOrGif || (uploadFile.type === 'image/webp' && uploadFile.size <= targetMaxBytes);

  if (canUsePresigned) {
    try {
      const presignedRes = await fetch('/api/upload/presigned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename,
          contentType,
          folder,
          fileSize: uploadFile.size,
        }),
      });

      if (presignedRes.ok) {
        const { uploadUrl, publicUrl, fileKey } = await presignedRes.json();
        if (uploadUrl && publicUrl) {
          const directUploadRes = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': contentType,
            },
            body: uploadFile,
          });

          if (directUploadRes.ok) {
            return {
              success: true,
              status: 200,
              data: {
                id: fileKey,
                title: filename,
                url: publicUrl,
                display_url: publicUrl,
                url_viewer: publicUrl,
                fileKey,
              },
            };
          }
        }
      }
    } catch (presignedErr) {
      console.warn('Direct R2 presigned upload failed, falling back to /api/upload-image:', presignedErr);
    }
  }

  // 3. Fallback to /api/upload-image (server-side Sharp optimization + R2 upload)
  const formData = new FormData();
  if (uploadFile.type === 'image/webp' && uploadFile.size <= targetMaxBytes) {
    formData.append('image', uploadFile);
  } else {
    formData.append('image', file);
  }
  formData.append('folder', folder);

  const response = await fetch('/api/upload-image', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed with status: ${response.statusText}`);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Upload failed');
  }

  return {
    success: true,
    status: 200,
    data: data.data,
  };
}

/**
 * Backward-compatible drop-in replacement for existing code calling uploadToImgBB.
 * Automatically delegates to Cloudflare R2 with WebP compression.
 */
export async function uploadToImgBB(file: File, folder: string = 'general'): Promise<ImgBBResponse> {
  return uploadToR2(file, folder, true);
}

/**
 * Multiple file upload to Cloudflare R2
 */
export async function uploadMultipleToImgBB(files: File[], folder: string = 'general'): Promise<string[]> {
  const uploadPromises = files.map(file => uploadToR2(file, folder));
  const results = await Promise.all(uploadPromises);
  return results.map(result => result.data.url);
}

export const uploadImageToR2 = uploadToR2;
export const uploadMultipleToR2 = uploadMultipleToImgBB;
