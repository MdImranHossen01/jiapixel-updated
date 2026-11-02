import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL, deleteMultipleFromR2 } from '@/lib/r2';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Portfolio from '@/models/Portfolios';
import Blog from '@/models/Blog';
import Post from '@/models/Post';
import Service from '@/models/Service';
import Project from '@/models/Project';
import User from '@/models/User';
import Category from '@/models/Category';

export interface OrphanImageItem {
  key: string;
  filename: string;
  size: number;
  formattedSize: string;
  lastModified: string;
  url: string;
}

export interface ScanResult {
  prefix: string;
  totalObjects: number;
  totalSize: number;
  formattedTotalSize: string;
  orphanCount: number;
  orphanSize: number;
  formattedOrphanSize: string;
  orphans: OrphanImageItem[];
  scannedAt: string;
}

function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function getPlatformStoragePrefix(): string {
  return 'jiapixel/';
}

/**
 * Scans Cloudflare R2 bucket for unused (orphaned) images in jiapixel.
 * Only flags images that are NOT referenced anywhere in the MongoDB database
 * and are older than minAgeMinutes (default: 60 minutes).
 */
export async function scanOrphanR2Images(options?: {
  prefix?: string;
  minAgeMinutes?: number;
}): Promise<ScanResult> {
  const targetPrefix = options?.prefix ?? getPlatformStoragePrefix();
  const minAgeMinutes = options?.minAgeMinutes ?? 60;
  const cutoffTime = Date.now() - minAgeMinutes * 60 * 1000;

  // 1. Fetch all objects from R2 under targetPrefix
  const r2Objects: Array<{ Key: string; Size: number; LastModified: Date }> = [];
  let continuationToken: string | undefined = undefined;

  do {
    const listCommand: ListObjectsV2Command = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      Prefix: targetPrefix,
      ContinuationToken: continuationToken,
    });

    const response = await r2Client.send(listCommand);
    if (response.Contents) {
      for (const obj of response.Contents) {
        if (obj.Key && typeof obj.Size === 'number') {
          r2Objects.push({
            Key: obj.Key,
            Size: obj.Size,
            LastModified: obj.LastModified ? new Date(obj.LastModified) : new Date(),
          });
        }
      }
    }
    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  const totalObjects = r2Objects.length;
  const totalSize = r2Objects.reduce((acc, curr) => acc + curr.Size, 0);

  // 2. Fetch all image-containing documents from MongoDB
  await connectDB();

  const [products, portfolios, blogs, posts, services, projects, users, categories] = await Promise.all([
    Product.find({}, { images: 1, featuredImage: 1, description: 1, detailedDescription: 1 }).lean().catch(() => []),
    Portfolio.find({}, { featuredImage: 1, content: 1 }).lean().catch(() => []),
    Blog.find({}, { featuredImage: 1, content: 1 }).lean().catch(() => []),
    Post.find({}, { featuredImage: 1, content: 1 }).lean().catch(() => []),
    Service.find({}, { featuredImage: 1, icon: 1, content: 1 }).lean().catch(() => []),
    Project.find({}, { featuredImage: 1, images: 1, description: 1 }).lean().catch(() => []),
    User.find({}, { avatar: 1, image: 1 }).lean().catch(() => []),
    Category.find({}, { image: 1 }).lean().catch(() => []),
  ]);

  const combinedDbText = JSON.stringify({
    products,
    portfolios,
    blogs,
    posts,
    services,
    projects,
    users,
    categories,
  });

  // 3. Find orphaned files
  const orphans: OrphanImageItem[] = [];
  let orphanSize = 0;

  for (const obj of r2Objects) {
    const filename = obj.Key.split('/').pop();
    if (!filename) continue;

    if (obj.LastModified.getTime() > cutoffTime) {
      continue;
    }

    const isReferenced = combinedDbText.includes(filename);

    if (!isReferenced) {
      orphanSize += obj.Size;
      orphans.push({
        key: obj.Key,
        filename,
        size: obj.Size,
        formattedSize: formatBytes(obj.Size),
        lastModified: obj.LastModified.toISOString(),
        url: `${R2_PUBLIC_URL}/${obj.Key}`,
      });
    }
  }

  return {
    prefix: targetPrefix,
    totalObjects,
    totalSize,
    formattedTotalSize: formatBytes(totalSize),
    orphanCount: orphans.length,
    orphanSize,
    formattedOrphanSize: formatBytes(orphanSize),
    orphans,
    scannedAt: new Date().toISOString(),
  };
}

export async function purgeOrphanR2Images(keys: string[]): Promise<{
  success: boolean;
  deletedCount: number;
}> {
  if (!keys || keys.length === 0) {
    return { success: true, deletedCount: 0 };
  }

  const deletedCount = await deleteMultipleFromR2(keys);
  return {
    success: true,
    deletedCount,
  };
}
