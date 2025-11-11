import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MainNavigationProp, VehicleDetailRouteProp } from '../../navigation/types';
import { useVehicles } from '../../hooks/useVehicles';
import { useTheme } from '../../theme';
import { Vehicle } from '../../store/vehicleStore';

const VehicleDetailScreen: React.FC = () => {
  const navigation = useNavigation<MainNavigationProp>();
  const route = useRoute<VehicleDetailRouteProp>();
  const { fetchVehicle, selectedVehicle } = useVehicles();
  const theme = useTheme();
  const styles = createStyles(theme);
  const themeColors = theme.isDark ? theme.colors.dark : theme.colors.light;

  const [vehicle, setVehicle] = useState<Vehicle | null>(selectedVehicle);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadVehicle();
  }, [route.params.vehicleId]);

  const loadVehicle = async () => {
    setIsLoading(true);
    const result = await fetchVehicle(route.params.vehicleId);
    if (result.success && result.data) {
      setVehicle(result.data);
    }
    setIsLoading(false);
  };

  const handleViewTimeline = () => {
    if (vehicle) {
      navigation.navigate('Timeline', { vehicleId: vehicle.id });
    }
  };

  const handleAddService = () => {
    if (vehicle) {
      navigation.navigate('AddService', { vehicleId: vehicle.id });
    }
  };

  if (isLoading || !vehicle) {
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
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColors.text }]}>
            {vehicle.year} {vehicle.make} {vehicle.model}
          </Text>
          <View
            style={[
              styles.healthBadge,
              { backgroundColor: getHealthColor(vehicle.healthScore) },
            ]}
          >
            <Text style={styles.healthScore}>{vehicle.healthScore}</Text>
            <Text style={styles.healthLabel}>Health</Text>
          </View>
        </View>

        <View style={styles.detailsGrid}>
          {vehicle.licensePlate && (
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: themeColors.textTertiary }]}>
                License Plate
              </Text>
              <Text style={[styles.detailValue, { color: themeColors.text }]}>
                {vehicle.licensePlate}
              </Text>
            </View>
          )}

          {vehicle.vin && (
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: themeColors.textTertiary }]}>
                VIN
              </Text>
              <Text style={[styles.detailValue, { color: themeColors.text }]}>
                {vehicle.vin}
              </Text>
            </View>
          )}

          {vehicle.color && (
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: themeColors.textTertiary }]}>
                Color
              </Text>
              <Text style={[styles.detailValue, { color: themeColors.text }]}>
                {vehicle.color}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Statistics</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>
              {vehicle.currentOdometer.toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
              Miles
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: theme.colors.danger }]}>
              ${vehicle.totalRepairCost.toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
              Total Repairs
            </Text>
          </View>
        </View>
      </View>

      {vehicle.notes && (
        <View style={[styles.card, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Notes</Text>
          <Text style={[styles.notes, { color: themeColors.textSecondary }]}>
            {vehicle.notes}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={handleViewTimeline}
      >
        <Text style={styles.buttonText}>View Service History</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.buttonSecondary, { borderColor: theme.colors.primary }]}
        onPress={handleAddService}
      >
        <Text style={[styles.buttonSecondaryText, { color: theme.colors.primary }]}>
          Add New Service
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const getHealthColor = (score: number) => {
  if (score >= 80) return '#10B981';
  if (score >= 60) return '#F59E0B';
  return '#EF4444';
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
      marginBottom: theme.spacing.md,
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
      alignItems: 'flex-start',
      marginBottom: theme.spacing.md,
    },
    title: {
      ...theme.typography.h3,
      flex: 1,
      marginRight: theme.spacing.md,
    },
    healthBadge: {
      width: 60,
      height: 60,
      borderRadius: theme.borderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xs,
    },
    healthScore: {
      ...theme.typography.h3,
      color: '#FFFFFF',
    },
    healthLabel: {
      ...theme.typography.caption,
      color: '#FFFFFF',
      marginTop: 2,
    },
    detailsGrid: {
      gap: theme.spacing.md,
    },
    detailItem: {
      marginBottom: theme.spacing.sm,
    },
    detailLabel: {
      ...theme.typography.caption,
      marginBottom: theme.spacing.xs,
    },
    detailValue: {
      ...theme.typography.body,
    },
    sectionTitle: {
      ...theme.typography.h4,
      marginBottom: theme.spacing.md,
    },
    statsGrid: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    statCard: {
      flex: 1,
      alignItems: 'center',
      padding: theme.spacing.md,
      backgroundColor: themeColors.backgroundSecondary,
      borderRadius: theme.borderRadius.md,
    },
    statValue: {
      ...theme.typography.h3,
      marginBottom: theme.spacing.xs,
    },
    statLabel: {
      ...theme.typography.bodySmall,
    },
    notes: {
      ...theme.typography.body,
      lineHeight: 24,
    },
    button: {
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    buttonText: {
      ...theme.typography.button,
      color: '#FFFFFF',
    },
    buttonSecondary: {
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      alignItems: 'center',
      borderWidth: 2,
      marginBottom: theme.spacing.md,
    },
    buttonSecondaryText: {
      ...theme.typography.button,
    },
  });
};

export default VehicleDetailScreen;


