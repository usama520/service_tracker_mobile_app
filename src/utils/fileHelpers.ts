import RNFS from 'react-native-fs';

export interface FileInfo {
  uri: string;
  size: number;
  exists: boolean;
}

/**
 * Get file information including size and existence
 */
export async function getFileInfo(uri: string): Promise<FileInfo> {
  try {
    const fileInfo = await RNFS.stat(uri);

    return {
      uri,
      size: fileInfo.size || 0,
      exists: fileInfo.isFile(),
    };
  } catch (error) {
    return {
      uri,
      size: 0,
      exists: false,
    };
  }
}

/**
 * Extract file extension from URI
 */
export function getFileExtension(uri: string): string {
  const match = uri.match(/\.([^.]+)$/);
  return match ? match[1].toLowerCase() : '';
}

/**
 * Get MIME type from file extension
 * Supports images (JPEG, PNG) and videos (all common formats)
 */
export function getMimeType(uri: string): string {
  const ext = getFileExtension(uri);
  const mimeTypes: Record<string, string> = {
    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    // Videos
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
    mkv: 'video/x-matroska',
    webm: 'video/webm',
    '3gp': 'video/3gpp',
    m4v: 'video/mp4',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

/**
 * Check if file is a video based on MIME type
 */
export function isVideo(mimeType: string): boolean {
  return mimeType.startsWith('video/');
}

/**
 * Validate media file (image or video)
 * Returns validation result with error message if invalid
 */
export function validateMediaFile(
  uri: string,
  size: number,
  maxImageSize: number = 10 * 1024 * 1024, // 10MB
  maxVideoSize: number = 100 * 1024 * 1024 // 100MB
): { valid: boolean; error?: string } {
  const mimeType = getMimeType(uri);
  const isVideoFile = isVideo(mimeType);
  const allowedImageTypes = ['image/jpeg', 'image/png'];

  // Validate file type
  if (!isVideoFile && !allowedImageTypes.includes(mimeType)) {
    return { valid: false, error: 'Only JPEG, PNG images and videos are allowed' };
  }

  // Validate file size
  const maxSize = isVideoFile ? maxVideoSize : maxImageSize;
  if (size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
    const fileType = isVideoFile ? 'video' : 'image';
    return {
      valid: false,
      error: `${fileType} size must be less than ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}

