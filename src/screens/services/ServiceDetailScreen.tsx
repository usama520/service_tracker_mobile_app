import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import { MainNavigationProp, ServiceDetailRouteProp } from '../../navigation/types';
import { useServices } from '../../hooks/useServices';
import { useTheme } from '../../theme';
import { ServiceEntry } from '../../store/serviceStore';

const ServiceDetailScreen: React.FC = () => {
  const navigation = useNavigation<MainNavigationProp>();
  const route = useRoute<ServiceDetailRouteProp>();
  const { fetchService, deleteService } = useServices();
  const theme = useTheme();
  const styles = createStyles(theme);
  const themeColors = theme.isDark ? theme.colors.dark : theme.colors.light;

  const [service, setService] = useState<ServiceEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadService();
  }, [route.params.serviceId]);

  const loadService = async () => {
    setIsLoading(true);
    const result = await fetchService(route.params.serviceId);
    if (result.success && result.data) {
      setService(result.data);
    }
    setIsLoading(false);
  };

  const handleEdit = () => {
    navigation.navigate('EditService', { serviceId: route.params.serviceId });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Service',
      'Are you sure you want to delete this service record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteService(route.params.serviceId);
            if (result.success) {
              navigation.goBack();
            } else {
              Alert.alert('Error', result.error || 'Failed to delete service');
            }
          },
        },
      ]
    );
  };

  if (isLoading || !service) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: themeColors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.card, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
        <Text style={[styles.title, { color: themeColors.text }]}>
          {service.serviceType?.name || 'Service Entry'}
        </Text>
        
        <View style={styles.dateRow}>
          <Text style={[styles.label, { color: themeColors.textTertiary }]}>Date</Text>
          <Text style={[styles.value, { color: themeColors.text }]}>
            {format(new Date(service.serviceDate), 'MMMM dd, yyyy')}
          </Text>
        </View>

        <View style={styles.detailsGrid}>
          <View style={styles.detailRow}>
            <Text style={[styles.label, { color: themeColors.textTertiary }]}>Odometer</Text>
            <Text style={[styles.value, { color: themeColors.text }]}>
              {service.odometer.toLocaleString()} miles
            </Text>
          </View>

          {service.cost !== null && service.cost !== undefined && (
            <View style={styles.detailRow}>
              <Text style={[styles.label, { color: themeColors.textTertiary }]}>Cost</Text>
              <Text style={[styles.value, { color: theme.colors.primary }]}>
                ${service.cost.toLocaleString()}
              </Text>
            </View>
          )}

          {service.location && (
            <View style={styles.detailRow}>
              <Text style={[styles.label, { color: themeColors.textTertiary }]}>Location</Text>
              <Text style={[styles.value, { color: themeColors.text }]}>{service.location}</Text>
            </View>
          )}

          {service.technicianName && (
            <View style={styles.detailRow}>
              <Text style={[styles.label, { color: themeColors.textTertiary }]}>Technician</Text>
              <Text style={[styles.value, { color: themeColors.text }]}>{service.technicianName}</Text>
            </View>
          )}
        </View>

        {service.notes && (
          <View style={styles.notesSection}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Notes</Text>
            <Text style={[styles.notes, { color: themeColors.textSecondary }]}>
              {service.notes}
            </Text>
          </View>
        )}

        <View style={styles.badges}>
          {service.isMajorRepair && (
            <View style={[styles.badge, { backgroundColor: theme.colors.warning }]}>
              <Text style={styles.badgeText}>Major Repair</Text>
            </View>
          )}

          {service.underWarranty && (
            <View style={[styles.badge, { backgroundColor: theme.colors.success }]}>
              <Text style={styles.badgeText}>Under Warranty</Text>
            </View>
          )}
        </View>

        {service.warrantyProvided && service.warrantyDurationMonths && (
          <View style={styles.warrantySection}>
            <Text style={[styles.label, { color: themeColors.textTertiary }]}>
              Warranty Duration
            </Text>
            <Text style={[styles.value, { color: themeColors.text }]}>
              {service.warrantyDurationMonths} months
            </Text>
          </View>
        )}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={handleEdit}
        >
          <Text style={styles.buttonText}>Edit Service</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttonDanger, { backgroundColor: theme.colors.danger }]}
          onPress={handleDelete}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) => {
  const themeColors = theme.isDark ? theme.colors.dark : theme.colors.light;

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      padding: theme.spacing.md,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      borderWidth: 1,
      shadowColor: theme.colors.shadow.md,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      marginBottom: theme.spacing.md,
    },
    title: {
      ...theme.typography.h3,
      marginBottom: theme.spacing.md,
    },
    dateRow: {
      marginBottom: theme.spacing.md,
      paddingBottom: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: themeColors.border,
    },
    detailsGrid: {
      gap: theme.spacing.md,
    },
    detailRow: {
      marginBottom: theme.spacing.sm,
    },
    label: {
      ...theme.typography.caption,
      marginBottom: theme.spacing.xs,
    },
    value: {
      ...theme.typography.bodyBold,
    },
    notesSection: {
      marginTop: theme.spacing.md,
      paddingTop: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: themeColors.border,
    },
    sectionTitle: {
      ...theme.typography.h5,
      marginBottom: theme.spacing.sm,
    },
    notes: {
      ...theme.typography.body,
      lineHeight: 24,
    },
    badges: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.md,
    },
    badge: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
    },
    badgeText: {
      ...theme.typography.captionBold,
      color: '#FFFFFF',
    },
    warrantySection: {
      marginTop: theme.spacing.md,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    button: {
      flex: 1,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      alignItems: 'center',
    },
    buttonDanger: {
      flex: 1,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      alignItems: 'center',
    },
    buttonText: {
      ...theme.typography.button,
      color: '#FFFFFF',
    },
  });
};

export default ServiceDetailScreen;


