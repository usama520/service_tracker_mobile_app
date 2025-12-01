import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREATE_DIRECT_UPLOAD } from '../graphql/mutations/services';
import { generateMD5Checksum } from '../utils/md5';
import { getFileInfo, getMimeType, validateMediaFile } from '../utils/fileHelpers';

interface DirectUploadInput {
  filename: string;
  byteSize: number;
  contentType: string;
  checksum: string;
}

interface DirectUploadResponse {
  directUploadUrl: string;
  signedBlobId: string;
  uploadHeaders: string;
}

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

interface UseDirectUploadOptions {
  onProgress?: (progress: UploadProgress) => void;
}

interface UploadFileResult {
  signedBlobId: string;
}

export const useDirectUpload = (options?: UseDirectUploadOptions) => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);

  const [createDirectUpload, { loading: mutationLoading }] = useMutation<{
    createDirectUpload: {
      directUpload?: DirectUploadResponse;
      errors?: string[];
    };
  }>(CREATE_DIRECT_UPLOAD);

  const uploadFile = async (fileUri: string): Promise<UploadFileResult> => {
    try {
      // Get file info
      const fileInfo = await getFileInfo(fileUri);

      if (!fileInfo.exists) {
        throw new Error('File not found');
      }

      // Validate file
      const validation = validateMediaFile(fileUri, fileInfo.size);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Get file metadata
      const filename = fileUri.split('/').pop() || 'media.jpg';
      const contentType = getMimeType(fileUri);

      // Step 1: Generate MD5 checksum
      const checksum = await generateMD5Checksum(fileUri);

      // Step 2: Call GraphQL mutation to get signed URL
      const input: DirectUploadInput = {
        filename,
        byteSize: fileInfo.size,
        contentType,
        checksum,
      };

      const { data } = await createDirectUpload({
        variables: { input },
      });

      if (!data?.createDirectUpload) {
        throw new Error('Failed to get upload URL');
      }

      const { directUpload, errors } = data.createDirectUpload;

      if (errors && errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      if (!directUpload) {
        throw new Error('Invalid response from server');
      }

      // Parse upload headers
      let parsedHeaders: Record<string, string> = {};
      if (directUpload.uploadHeaders) {
        parsedHeaders = JSON.parse(directUpload.uploadHeaders);
      }

      // Step 3: Upload to signed URL with progress tracking
      await uploadToSignedUrl(
        fileUri,
        directUpload.directUploadUrl,
        parsedHeaders,
        contentType,
        (progress) => {
          setUploadProgress(progress);
          options?.onProgress?.(progress);
        }
      );

      setUploadProgress(null);
      return { signedBlobId: directUpload.signedBlobId };
    } catch (err) {
      setUploadProgress(null);
      if (err instanceof Error) {
        throw err;
      }
      throw new Error('Upload failed');
    }
  };

  return {
    uploadFile,
    loading: mutationLoading,
    uploadProgress,
  };
};

/**
 * Upload file to signed URL using XMLHttpRequest with progress tracking
 */
async function uploadToSignedUrl(
  fileUri: string,
  signedUrl: string,
  headers: Record<string, string>,
  contentType: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const progress: UploadProgress = {
          loaded: e.loaded,
          total: e.total,
          percentage: Math.round((e.loaded / e.total) * 100),
        };
        onProgress(progress);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload aborted'));
    });

    xhr.open('PUT', signedUrl);

    // Set headers from server
    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });

    // Set content type
    if (!headers['Content-Type'] && !headers['content-type']) {
      xhr.setRequestHeader('Content-Type', contentType);
    }

    // Read file and send
    fetch(fileUri)
      .then((response) => response.blob())
      .then((blob) => {
        xhr.send(blob);
      })
      .catch((error) => {
        reject(new Error(`Failed to read file: ${error.message}`));
      });
  });
}

