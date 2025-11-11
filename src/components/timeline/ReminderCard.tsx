import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { Reminder } from '../../store/serviceStore';
import { useTheme } from '../../theme';

type ReminderCardProps = {
  reminder: Reminder;
  onPress: () => void;
};

const ReminderCard: React.FC<ReminderCardProps> = ({ reminder, onPress }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const themeColors = theme.isDark ? theme.colors.dark : theme.colors.light;

  const getStatusColor = () => {
    if (reminder.isCompleted) return theme.colors.success;
    if (reminder.overdue) return theme.colors.danger;
    return theme.colors.warning;
  };

  const getStatusText = () => {
    if (reminder.isCompleted) return 'Completed';
    if (reminder.overdue) return 'Overdue';
    return 'Upcoming';
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: theme.colors.reminderCard }]}>
          <Text style={[styles.badgeText, { color: theme.colors.warning }]}>Reminder</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
      </View>

      <Text style={[styles.title, { color: themeColors.text }]}>
        {reminder.serviceType?.name || reminder.reminderType.replace('_', ' ')}
      </Text>

      <View style={styles.details}>
        {reminder.dueDate && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: themeColors.textTertiary }]}>
              Due Date:
            </Text>
            <Text style={[styles.detailValue, { color: themeColors.text }]}>
              {format(new Date(reminder.dueDate), 'MMM dd, yyyy')}
            </Text>
          </View>
        )}

        {reminder.dueOdometer && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: themeColors.textTertiary }]}>
              Due at:
            </Text>
            <Text style={[styles.detailValue, { color: themeColors.text }]}>
              {reminder.dueOdometer.toLocaleString()} mi
            </Text>
          </View>
        )}

        {!reminder.isCompleted && reminder.daysUntilDue !== null && reminder.daysUntilDue !== undefined && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: themeColors.textTertiary }]}>
              {reminder.overdue ? 'Overdue by:' : 'Days remaining:'}
            </Text>
            <Text
              style={[
                styles.detailValue,
                { color: reminder.overdue ? theme.colors.danger : theme.colors.success },
              ]}
            >
              {Math.abs(reminder.daysUntilDue)} days
            </Text>
          </View>
        )}

        {!reminder.isCompleted && reminder.milesUntilDue !== null && reminder.milesUntilDue !== undefined && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: themeColors.textTertiary }]}>
              {reminder.milesUntilDue < 0 ? 'Over by:' : 'Miles remaining:'}
            </Text>
            <Text
              style={[
                styles.detailValue,
                { color: reminder.milesUntilDue < 0 ? theme.colors.danger : theme.colors.success },
              ]}
            >
              {Math.abs(reminder.milesUntilDue).toLocaleString()} mi
            </Text>
          </View>
        )}
      </View>

      {reminder.notes && (
        <Text style={[styles.notes, { color: themeColors.textSecondary }]} numberOfLines={2}>
          {reminder.notes}
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
    },
    statusBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
    },
    statusText: {
      ...theme.typography.captionBold,
      color: '#FFFFFF',
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
    notes: {
      ...theme.typography.bodySmall,
      marginTop: theme.spacing.sm,
      fontStyle: 'italic',
    },
  });
};

export default ReminderCard;


