import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts any Google Drive sharing URL into a direct embeddable image URL.
 * Works for both /file/d/{id}/view and ?id= formats.
 * Uses lh3.googleusercontent.com which is the most reliable format for embedding.
 */
export function parseGoogleDriveUrl(url: string): string {
  if (!url) return url;
  try {
    // Match /file/d/{fileId}/ format
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
    }
    // Match ?id={fileId} or &id={fileId} format
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('drive.google.com') && urlObj.searchParams.has('id')) {
      return `https://lh3.googleusercontent.com/d/${urlObj.searchParams.get('id')}`;
    }
    // Already a direct lh3 URL or uc?export link — normalise if possible
    if (url.includes('uc?export=view') || url.includes('uc?id=')) {
      const idParam = new URL(url).searchParams.get('id');
      if (idParam) return `https://lh3.googleusercontent.com/d/${idParam}`;
    }
  } catch (e) {
    // If URL parsing fails, return original
  }
  return url;
}
