import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import { launchImageLibrary, launchCamera, ImagePickerResponse } from 'react-native-image-picker';
import { useDirectUpload } from '../hooks/useDirectUpload';
import { useTheme } from '../theme';
import { validateMediaFile, getMimeType, isVideo } from '../utils/fileHelpers';

interface MediaUploaderProps {
  onUploadComplete: (signedIds: string[]) => void;
  multiple?: boolean;
  maxMedia?: number;
}

interface SelectedMedia {
  uri: string;
  name: string;
  size: number;
  type: 'image' | 'video';
  signedId?: string;
  uploading?: boolean;
  progress?: number;
  error?: string;
}

export default function MediaUploader({
  onUploadComplete,
  multiple = false,
  maxMedia = 10,
}: MediaUploaderProps) {
  const [media, setMedia] = useState<SelectedMedia[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const theme = useTheme();
  const themeColors = theme.isDark ? theme.colors.dark : theme.colors.light;
  const styles = createStyles(theme);

  const { uploadFile, uploadProgress } = useDirectUpload({
    onProgress: (progress) => {
      // Progress is handled per-file below
    },
  });

  const requestPermission = async (): Promise<boolean> => {
    // react-native-image-picker handles permissions automatically
    return true;
  };

  const pickFromLibrary = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    launchImageLibrary(
      {
        mediaType: 'mixed',
        allowsMultipleSelection: multiple,
        quality: 1,
        selectionLimit: multiple ? maxMedia : 1,
      },
      (response: ImagePickerResponse) => {
        if (response.didCancel || !response.assets) {
          return;
        }

        const newMedia: SelectedMedia[] = response.assets.map((asset) => {
          const mimeType = asset.type || getMimeType(asset.uri || '');
          return {
            uri: asset.uri || '',
            name: asset.fileName || asset.uri?.split('/').pop() || 'media.jpg',
            size: asset.fileSize || 0,
            type: isVideo(mimeType) ? 'video' : 'image',
          };
        });

        setMedia((prev) => {
          if (multiple) {
            const combined = [...prev, ...newMedia];
            return combined.slice(0, maxMedia);
          }
          return newMedia;
        });
      }
    );
  };

  const takePhoto = async () => {
    launchCamera(
      {
        mediaType: 'mixed',
        quality: 1,
        saveToPhotos: true,
      },
      (response: ImagePickerResponse) => {
        if (response.didCancel || !response.assets || response.assets.length === 0) {
          return;
        }

        const asset = response.assets[0];
        const mimeType = asset.type || getMimeType(asset.uri || '');
        const newMedia: SelectedMedia = {
          uri: asset.uri || '',
          name: asset.fileName || asset.uri?.split('/').pop() || 'photo.jpg',
          size: asset.fileSize || 0,
          type: isVideo(mimeType) ? 'video' : 'image',
        };

        setMedia((prev) => (multiple ? [...prev, newMedia] : [newMedia]));
      }
    );
  };

  const removeMedia = (index: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadMedia = async () => {
    if (media.length === 0) {
      Alert.alert('No Media', 'Please select at least one image or video');
      return;
    }

    setIsUploading(true);
    const signedIds: string[] = [];
    const errors: string[] = [];

    try {
      // Upload sequentially
      for (let i = 0; i < media.length; i++) {
        const item = media[i];

        // Skip if already uploaded
        if (item.signedId) {
          signedIds.push(item.signedId);
          continue;
        }

        // Skip if error
        if (item.error) {
          continue;
        }

        try {
          // Mark as uploading
          setMedia((prev) =>
            prev.map((m, idx) => (idx === i ? { ...m, uploading: true } : m))
          );

          const result = await uploadFile(item.uri);
          signedIds.push(result.signedBlobId);

          // Mark as uploaded
          setMedia((prev) =>
            prev.map((m, idx) =>
              idx === i
                ? { ...m, uploading: false, signedId: result.signedBlobId }
                : m
            )
          );
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Upload failed';
          errors.push(`${item.name}: ${errorMessage}`);

          // Mark error
          setMedia((prev) =>
            prev.map((m, idx) =>
              idx === i ? { ...m, uploading: false, error: errorMessage } : m
            )
          );
        }
      }

      if (signedIds.length > 0) {
        onUploadComplete(signedIds);
        Alert.alert('Success', `Uploaded ${signedIds.length} file(s)`);
      }

      if (errors.length > 0) {
        Alert.alert('Upload Errors', errors.join('\n'));
      }
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const clearAll = () => {
    setMedia([]);
  };

  return (
    <View style={styles.container}>
      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton, { backgroundColor: theme.colors.primary }]}
          onPress={pickFromLibrary}
          disabled={isUploading}
        >
          <Text style={styles.buttonText}>
            {multiple ? '📷 Select Media' : '📷 Select'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton, { backgroundColor: theme.colors.success }]}
          onPress={takePhoto}
          disabled={isUploading}
        >
          <Text style={styles.buttonText}>📸 Camera</Text>
        </TouchableOpacity>
      </View>

      {/* Selected Media */}
      {media.length > 0 && (
        <View style={styles.mediaContainer}>
          <View style={styles.header}>
            <Text style={[styles.headerText, { color: themeColors.text }]}>
              Selected ({media.length})
            </Text>
            <TouchableOpacity onPress={clearAll} disabled={isUploading}>
              <Text style={[styles.clearText, { color: theme.colors.danger }]}>Clear All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.mediaGrid}>
              {media.map((item, index) => (
                <View key={index} style={[styles.mediaCard, { backgroundColor: themeColors.surfaceSecondary }]}>
                  {item.type === 'image' ? (
                    <Image source={{ uri: item.uri }} style={styles.mediaPreview} />
                  ) : (
                    <View style={[styles.mediaPreview, styles.videoPlaceholder]}>
                      <Text style={styles.videoIcon}>🎥</Text>
                    </View>
                  )}

                  {/* Uploading Indicator */}
                  {item.uploading && (
                    <View style={[styles.overlay, { backgroundColor: themeColors.overlay }]}>
                      <ActivityIndicator size="large" color="#fff" />
                      {uploadProgress && (
                        <Text style={styles.progressText}>
                          {uploadProgress.percentage}%
                        </Text>
                      )}
                    </View>
                  )}

                  {/* Success Indicator */}
                  {item.signedId && !item.uploading && (
                    <View style={[styles.overlay, styles.successOverlay]}>
                      <Text style={styles.successText}>✓</Text>
                    </View>
                  )}

                  {/* Error Indicator */}
                  {item.error && (
                    <View style={[styles.overlay, styles.errorOverlay]}>
                      <Text style={styles.errorText}>✗</Text>
                    </View>
                  )}

                  {/* Remove Button */}
                  {!isUploading && (
                    <TouchableOpacity
                      style={[styles.removeButton, { backgroundColor: theme.colors.danger }]}
                      onPress={() => removeMedia(index)}
                    >
                      <Text style={styles.removeButtonText}>×</Text>
                    </TouchableOpacity>
                  )}

                  <Text style={[styles.mediaName, { color: themeColors.text }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={[styles.mediaSize, { color: themeColors.textSecondary }]}>
                    {(item.size / (1024 * 1024)).toFixed(2)} MB
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Upload Button */}
          <TouchableOpacity
            style={[
              styles.uploadButton,
              { backgroundColor: theme.colors.primary },
              (isUploading || media.every((m) => m.signedId)) && styles.disabledButton,
            ]}
            onPress={uploadMedia}
            disabled={isUploading || media.every((m) => m.signedId)}
          >
            <Text style={styles.uploadButtonText}>
              {isUploading
                ? 'Uploading...'
                : media.every((m) => m.signedId)
                ? 'All Uploaded'
                : `Upload ${media.filter((m) => !m.signedId).length} File(s)`}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: ReturnType<typeof useTheme>) => {
  const themeColors = theme.isDark ? theme.colors.dark : theme.colors.light;

  return StyleSheet.create({
    container: {
      padding: theme.spacing.md,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    button: {
      flex: 1,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
    },
    primaryButton: {
      // backgroundColor set dynamically
    },
    secondaryButton: {
      // backgroundColor set dynamically
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    mediaContainer: {
      marginTop: theme.spacing.sm,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    headerText: {
      fontSize: 16,
      fontWeight: '600',
    },
    clearText: {
      fontSize: 14,
      fontWeight: '600',
    },
    mediaGrid: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
    },
    mediaCard: {
      width: 140,
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
    },
    mediaPreview: {
      width: 140,
      height: 140,
      backgroundColor: themeColors.border,
    },
    videoPlaceholder: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    videoIcon: {
      fontSize: 48,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
    },
    successOverlay: {
      backgroundColor: 'rgba(16, 185, 129, 0.8)',
    },
    errorOverlay: {
      backgroundColor: 'rgba(239, 68, 68, 0.8)',
    },
    progressText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
      marginTop: theme.spacing.sm,
    },
    successText: {
      color: '#fff',
      fontSize: 48,
      fontWeight: 'bold',
    },
    errorText: {
      color: '#fff',
      fontSize: 48,
      fontWeight: 'bold',
    },
    removeButton: {
      position: 'absolute',
      top: 4,
      right: 4,
      borderRadius: 12,
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    removeButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    mediaName: {
      fontSize: 12,
      paddingHorizontal: theme.spacing.sm,
      paddingTop: theme.spacing.sm,
    },
    mediaSize: {
      fontSize: 10,
      paddingHorizontal: theme.spacing.sm,
      paddingBottom: theme.spacing.sm,
    },
    uploadButton: {
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      marginTop: theme.spacing.md,
    },
    disabledButton: {
      opacity: 0.6,
    },
    uploadButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });
};

