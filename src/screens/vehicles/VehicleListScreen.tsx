import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainNavigationProp } from '../../navigation/types';
import { useVehicles } from '../../hooks/useVehicles';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../theme';
import { Vehicle } from '../../store/vehicleStore';

const VehicleListScreen: React.FC = () => {
  const navigation = useNavigation<MainNavigationProp>();
  const { vehicles, isLoading, fetchVehicles, selectVehicle } = useVehicles();
  const { logout } = useAuth();
  const theme = useTheme();
  const styles = createStyles(theme);
  const themeColors = theme.isDark ? theme.colors.dark : theme.colors.light;

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleRefresh = () => {
    fetchVehicles();
  };

  const handleVehiclePress = (vehicle: Vehicle) => {
    selectVehicle(vehicle);
    navigation.navigate('VehicleDetail', { vehicleId: vehicle.id });
  };

  const handleAddVehicle = () => {
    navigation.navigate('AddVehicle');
  };

  const handleLogout = async () => {
    await logout();
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const renderVehicleCard = ({ item }: { item: Vehicle }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}
      onPress={() => handleVehiclePress(item)}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.vehicleName, { color: themeColors.text }]}>
          {item.year} {item.make} {item.model}
        </Text>
        <View
          style={[
            styles.healthBadge,
            { backgroundColor: getHealthColor(item.healthScore) },
          ]}
        >
          <Text style={styles.healthText}>{item.healthScore}</Text>
        </View>
      </View>
      
      {item.licensePlate && (
        <Text style={[styles.licensePlate, { color: themeColors.textSecondary }]}>
          {item.licensePlate}
        </Text>
      )}
      
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={[styles.statLabel, { color: themeColors.textTertiary }]}>
            Odometer
          </Text>
          <Text style={[styles.statValue, { color: themeColors.text }]}>
            {item.currentOdometer.toLocaleString()} mi
          </Text>
        </View>
        
        <View style={styles.stat}>
          <Text style={[styles.statLabel, { color: themeColors.textTertiary }]}>
            Total Repairs
          </Text>
          <Text style={[styles.statValue, { color: themeColors.text }]}>
            ${item.totalRepairCost.toLocaleString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyTitle, { color: themeColors.text }]}>
        No Vehicles Yet
      </Text>
      <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>
        Add your first vehicle to start tracking maintenance
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {isLoading && vehicles.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={vehicles}
          renderItem={renderVehicleCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              tintColor={theme.colors.primary}
            />
          }
        />
      )}

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleAddVehicle}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
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
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    list: {
      padding: theme.spacing.md,
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
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    vehicleName: {
      ...theme.typography.h4,
      flex: 1,
    },
    healthBadge: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.full,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: theme.spacing.sm,
    },
    healthText: {
      ...theme.typography.bodySmallBold,
      color: '#FFFFFF',
    },
    licensePlate: {
      ...theme.typography.body,
      marginBottom: theme.spacing.sm,
    },
    statsRow: {
      flexDirection: 'row',
      marginTop: theme.spacing.sm,
    },
    stat: {
      flex: 1,
    },
    statLabel: {
      ...theme.typography.caption,
      marginBottom: theme.spacing.xs,
    },
    statValue: {
      ...theme.typography.bodyBold,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.xxxl,
    },
    emptyTitle: {
      ...theme.typography.h3,
      marginBottom: theme.spacing.sm,
    },
    emptyText: {
      ...theme.typography.body,
      textAlign: 'center',
    },
    fab: {
      position: 'absolute',
      right: theme.spacing.lg,
      bottom: theme.spacing.lg,
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 8,
    },
    fabText: {
      fontSize: 32,
      color: '#FFFFFF',
      fontWeight: '300',
    },
    logoutButton: {
      marginRight: theme.spacing.md,
    },
    logoutText: {
      ...theme.typography.body,
      color: theme.colors.danger,
    },
  });
};

export default VehicleListScreen;


