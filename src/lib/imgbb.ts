/**
 * Cloudflare R2 Image Upload Utility with Client-side WebP Compression.
 * Fully compatible drop-in replacement for previous ImgBB methods.
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

export async function uploadToR2(
  file: File,
  folder: string = 'general',
  compress: boolean = true
): Promise<ImgBBResponse> {
  let uploadFile: File = file;
  let contentType = file.type || 'image/jpeg';
  let filename = file.name;

  // 1. Client-side WebP Compression
  if (typeof window !== 'undefined' && compress && file.type.startsWith('image/') && !file.type.includes('svg') && !file.type.includes('gif')) {
    try {
      const imageCompression = (await import('browser-image-compression')).default;
      const compressionOptions = {
        maxSizeMB: 0.35,
        maxWidthOrHeight: 1400,
        useWebWorker: true,
        fileType: 'image/webp',
        initialQuality: 0.82,
      };

      const compressedBlob = await imageCompression(file, compressionOptions);
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      filename = `${nameWithoutExt}.webp`;
      contentType = 'image/webp';
      uploadFile = new File([compressedBlob], filename, { type: 'image/webp' });
    } catch (compErr) {
      console.warn('Client-side compression failed, uploading original:', compErr);
      uploadFile = file;
    }
  }

  // 2. Try direct Presigned PUT Upload to Cloudflare R2
  try {
    const presignedRes = await fetch('/api/upload/presigned', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename,
        contentType,
        folder,
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

  // 3. Fallback to /api/upload-image (which also uploads directly to Cloudflare R2)
  const formData = new FormData();
  formData.append('image', uploadFile);
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
export async function uploadToImgBB(file: File): Promise<ImgBBResponse> {
  return uploadToR2(file, 'general', true);
}

/**
 * Multiple file upload to Cloudflare R2
 */
export async function uploadMultipleToImgBB(files: File[]): Promise<string[]> {
  const uploadPromises = files.map(file => uploadToR2(file));
  const results = await Promise.all(uploadPromises);
  return results.map(result => result.data.url);
}

export const uploadImageToR2 = uploadToR2;
export const uploadMultipleToR2 = uploadMultipleToImgBB;
