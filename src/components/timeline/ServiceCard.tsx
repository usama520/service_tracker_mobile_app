import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { ServiceEntry } from '../../store/serviceStore';
import { useTheme } from '../../theme';

type ServiceCardProps = {
  service: ServiceEntry;
  onPress: () => void;
};

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onPress }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const themeColors = theme.isDark ? theme.colors.dark : theme.colors.light;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: theme.colors.serviceCard }]}>
          <Text style={styles.badgeText}>Service</Text>
        </View>
        <Text style={[styles.date, { color: themeColors.textSecondary }]}>
          {format(new Date(service.serviceDate), 'MMM dd, yyyy')}
        </Text>
      </View>

      <Text style={[styles.title, { color: themeColors.text }]}>
        {service.serviceType?.name || 'Service Entry'}
      </Text>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: themeColors.textTertiary }]}>
            Odometer:
          </Text>
          <Text style={[styles.detailValue, { color: themeColors.text }]}>
            {service.odometer.toLocaleString()} mi
          </Text>
        </View>

        {service.cost !== null && service.cost !== undefined && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: themeColors.textTertiary }]}>
              Cost:
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.primary }]}>
              ${service.cost.toLocaleString()}
            </Text>
          </View>
        )}

        {service.location && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: themeColors.textTertiary }]}>
              Location:
            </Text>
            <Text style={[styles.detailValue, { color: themeColors.text }]}>
              {service.location}
            </Text>
          </View>
        )}
      </View>

      {service.isMajorRepair && (
        <View style={[styles.majorRepairBadge, { backgroundColor: theme.colors.warning }]}>
          <Text style={styles.majorRepairText}>Major Repair</Text>
        </View>
      )}

      {service.underWarranty && (
        <View style={[styles.warrantyBadge, { backgroundColor: theme.colors.success }]}>
          <Text style={styles.warrantyText}>Under Warranty</Text>
        </View>
      )}

      {service.photosUrls.length > 0 && (
        <Text style={[styles.photoCount, { color: themeColors.textSecondary }]}>
          📷 {service.photosUrls.length} photo{service.photosUrls.length > 1 ? 's' : ''}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) => {
  const themeColors = theme.isDark ? theme.colors.dark : theme.colors.light;

  return StyleSheet.create({
    card: {
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      borderWidth: 1,
      shadowColor: theme.colors.shadow.md,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    badge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
    },
    badgeText: {
      ...theme.typography.captionBold,
      color: theme.colors.primary,
    },
    date: {
      ...theme.typography.caption,
    },
    title: {
      ...theme.typography.h5,
      marginBottom: theme.spacing.sm,
    },
    details: {
      gap: theme.spacing.xs,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    detailLabel: {
      ...theme.typography.bodySmall,
      marginRight: theme.spacing.xs,
    },
    detailValue: {
      ...theme.typography.bodySmallBold,
    },
    majorRepairBadge: {
      marginTop: theme.spacing.sm,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      alignSelf: 'flex-start',
    },
    majorRepairText: {
      ...theme.typography.captionBold,
      color: '#FFFFFF',
    },
    warrantyBadge: {
      marginTop: theme.spacing.sm,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      alignSelf: 'flex-start',
    },
    warrantyText: {
      ...theme.typography.captionBold,
      color: '#FFFFFF',
    },
    photoCount: {
      ...theme.typography.caption,
      marginTop: theme.spacing.sm,
    },
  });
};

export default ServiceCard;


