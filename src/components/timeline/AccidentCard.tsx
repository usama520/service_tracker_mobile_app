import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { Accident } from '../../store/serviceStore';
import { useTheme } from '../../theme';

type AccidentCardProps = {
  accident: Accident;
  onPress: () => void;
};

const AccidentCard: React.FC<AccidentCardProps> = ({ accident, onPress }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const themeColors = theme.isDark ? theme.colors.dark : theme.colors.light;

  const getSeverityColor = () => {
    switch (accident.severity.toLowerCase()) {
      case 'severe':
        return theme.colors.danger;
      case 'moderate':
        return theme.colors.warning;
      case 'minor':
        return theme.colors.info;
      default:
        return theme.colors.info;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: themeColors.surface, borderColor: theme.colors.dangerDark }]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: theme.colors.accidentCard }]}>
          <Text style={[styles.badgeText, { color: theme.colors.danger }]}>Accident</Text>
        </View>
        <Text style={[styles.date, { color: themeColors.textSecondary }]}>
          {format(new Date(accident.accidentDate), 'MMM dd, yyyy')}
        </Text>
      </View>

      <View style={[styles.severityBadge, { backgroundColor: getSeverityColor() }]}>
        <Text style={styles.severityText}>
          {accident.severity.charAt(0).toUpperCase() + accident.severity.slice(1)}
        </Text>
      </View>

      {accident.description && (
        <Text style={[styles.description, { color: themeColors.text }]} numberOfLines={2}>
          {accident.description}
        </Text>
      )}

      <View style={styles.details}>
        {accident.location && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: themeColors.textTertiary }]}>
              Location:
            </Text>
            <Text style={[styles.detailValue, { color: themeColors.text }]}>
              {accident.location}
            </Text>
          </View>
        )}

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: themeColors.textTertiary }]}>
            Repair Cost:
          </Text>
          <Text style={[styles.detailValue, { color: theme.colors.danger }]}>
            ${accident.totalRepairCost.toLocaleString()}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: themeColors.textTertiary }]}>
            At Fault:
          </Text>
          <Text style={[styles.detailValue, { color: themeColors.text }]}>
            {accident.atFaultStatus.replace('_', ' ')}
          </Text>
        </View>

        {accident.policeReportFiled && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailValue, { color: theme.colors.info }]}>
              ✓ Police Report Filed
            </Text>
          </View>
        )}
      </View>

      {accident.photosUrls.length > 0 && (
        <Text style={[styles.photoCount, { color: themeColors.textSecondary }]}>
          📷 {accident.photosUrls.length} photo{accident.photosUrls.length > 1 ? 's' : ''}
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
      borderWidth: 2,
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
    },
    date: {
      ...theme.typography.caption,
    },
    severityBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      alignSelf: 'flex-start',
      marginBottom: theme.spacing.sm,
    },
    severityText: {
      ...theme.typography.captionBold,
      color: '#FFFFFF',
    },
    description: {
      ...theme.typography.body,
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
    photoCount: {
      ...theme.typography.caption,
      marginTop: theme.spacing.sm,
    },
  });
};

export default AccidentCard;


