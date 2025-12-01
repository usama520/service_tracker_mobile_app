import CryptoJS from 'crypto-js';
import RNFS from 'react-native-fs';

/**
 * Generate MD5 checksum for a file using the file URI
 * Returns Base64-encoded MD5 hash matching Rails' Digest::MD5.base64digest
 */
export async function generateMD5Checksum(fileUri: string): Promise<string> {
  try {
    // Read file as base64
    const base64 = await RNFS.readFile(fileUri, 'base64');

    // Convert base64 to binary word array
    const wordArray = CryptoJS.enc.Base64.parse(base64);

    // Compute MD5 hash
    const hash = CryptoJS.MD5(wordArray);

    // Convert to base64 (matches Rails Digest::MD5.base64digest)
    return hash.toString(CryptoJS.enc.Base64);
  } catch (error) {
    console.error('MD5 generation failed:', error);
    throw new Error('Failed to generate file checksum');
  }
}

