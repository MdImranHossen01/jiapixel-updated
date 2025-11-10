export interface ImgBBResponse {
  data: {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    width: number;
    height: number;
    size: number;
    time: string;
    expiration: string;
    image: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    thumb: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
  };
  success: boolean;
  status: number;
}

export async function uploadToImgBB(file: File): Promise<ImgBBResponse> {
  const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  
  if (!IMGBB_API_KEY) {
    throw new Error('ImgBB API key is not configured');
  }

  const formData = new FormData();
  formData.append('image', file);

  // ImgBB API expects the image to be sent as base64 or binary file
  // We're using the file directly which works with their API
  const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`ImgBB upload failed: ${response.statusText}`);
  }

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(`ImgBB upload failed: ${data.error?.message || 'Unknown error'}`);
  }

  return data;
}

export async function uploadMultipleToImgBB(files: File[]): Promise<string[]> {
  const uploadPromises = files.map(file => uploadToImgBB(file));
  const results = await Promise.all(uploadPromises);
  return results.map(result => result.data.url);
}