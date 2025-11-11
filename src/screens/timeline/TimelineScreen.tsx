import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MainNavigationProp, TimelineRouteProp } from '../../navigation/types';
import { useServices } from '../../hooks/useServices';
import { useTheme } from '../../theme';
import TimelineItem from '../../components/timeline/TimelineItem';
import { TimelineItem as TimelineItemType } from '../../store/serviceStore';

const TimelineScreen: React.FC = () => {
  const navigation = useNavigation<MainNavigationProp>();
  const route = useRoute<TimelineRouteProp>();
  const { timelineItems, isLoading, fetchServices, fetchAccidents, fetchReminders } = useServices();
  const theme = useTheme();
  const styles = createStyles(theme);
  const themeColors = theme.isDark ? theme.colors.dark : theme.colors.light;

  useEffect(() => {
    loadData();
  }, [route.params.vehicleId]);

  const loadData = async () => {
    await Promise.all([
      fetchServices(route.params.vehicleId),
      fetchAccidents(),
      fetchReminders(),
    ]);
  };

  const handleRefresh = () => {
    loadData();
  };

  const handleItemPress = (item: TimelineItemType) => {
    if (item.type === 'service') {
      navigation.navigate('ServiceDetail', { serviceId: item.id });
    }
    // Could add navigation for accidents and reminders detail screens
  };

  const handleAddService = () => {
    navigation.navigate('AddService', { vehicleId: route.params.vehicleId });
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleAddService} style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const renderItem = ({ item }: { item: TimelineItemType }) => (
    <TimelineItem item={item} onPress={handleItemPress} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyTitle, { color: themeColors.text }]}>
        No Service History Yet
      </Text>
      <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>
        Start tracking by adding your first service record
      </Text>
      <TouchableOpacity
        style={[styles.emptyButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleAddService}
      >
        <Text style={styles.emptyButtonText}>Add Service</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {isLoading && timelineItems.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={timelineItems}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.type}-${item.id}`}
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
    </View>
  );
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
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.xxxl,
    },
    emptyTitle: {
      ...theme.typography.h3,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    emptyText: {
      ...theme.typography.body,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    emptyButton: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
    },
    emptyButtonText: {
      ...theme.typography.button,
      color: '#FFFFFF',
    },
    addButton: {
      marginRight: theme.spacing.md,
    },
    addButtonText: {
      ...theme.typography.bodyBold,
      color: theme.colors.primary,
    },
  });
};

export default TimelineScreen;


