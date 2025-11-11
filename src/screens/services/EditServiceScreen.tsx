import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Switch,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MainNavigationProp, EditServiceRouteProp } from '../../navigation/types';
import { useServices } from '../../hooks/useServices';
import { useTheme } from '../../theme';
import { ServiceEntry } from '../../store/serviceStore';

const EditServiceScreen: React.FC = () => {
  const navigation = useNavigation<MainNavigationProp>();
  const route = useRoute<EditServiceRouteProp>();
  const { fetchService, updateService } = useServices();
  const theme = useTheme();
  const styles = createStyles(theme);
  const themeColors = theme.isDark ? theme.colors.dark : theme.colors.light;

  const [service, setService] = useState<ServiceEntry | null>(null);
  const [serviceDate, setServiceDate] = useState('');
  const [odometer, setOdometer] = useState('');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState('');
  const [technicianName, setTechnicianName] = useState('');
  const [isMajorRepair, setIsMajorRepair] = useState(false);
  const [warrantyProvided, setWarrantyProvided] = useState(false);
  const [warrantyDurationMonths, setWarrantyDurationMonths] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadService();
  }, [route.params.serviceId]);

  const loadService = async () => {
    setIsLoading(true);
    const result = await fetchService(route.params.serviceId);
    if (result.success && result.data) {
      const svc = result.data;
      setService(svc);
      setServiceDate(svc.serviceDate);
      setOdometer(svc.odometer.toString());
      setCost(svc.cost?.toString() || '');
      setNotes(svc.notes || '');
      setLocation(svc.location || '');
      setTechnicianName(svc.technicianName || '');
      setIsMajorRepair(svc.isMajorRepair);
      setWarrantyProvided(svc.warrantyProvided || false);
      setWarrantyDurationMonths(svc.warrantyDurationMonths?.toString() || '');
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!serviceDate || !odometer) {
      Alert.alert('Error', 'Please fill in date and odometer');
      return;
    }

    const odometerNum = parseInt(odometer, 10);
    if (isNaN(odometerNum) || odometerNum < 0) {
      Alert.alert('Error', 'Please enter a valid odometer reading');
      return;
    }

    const costNum = cost ? parseFloat(cost) : undefined;
    if (cost && (isNaN(costNum!) || costNum! < 0)) {
      Alert.alert('Error', 'Please enter a valid cost');
      return;
    }

    const warrantyMonths = warrantyDurationMonths
      ? parseInt(warrantyDurationMonths, 10)
      : undefined;
    if (warrantyDurationMonths && (isNaN(warrantyMonths!) || warrantyMonths! < 0)) {
      Alert.alert('Error', 'Please enter a valid warranty duration');
      return;
    }

    setIsSaving(true);
    const result = await updateService({
      id: route.params.serviceId,
      serviceDate,
      odometer: odometerNum,
      cost: costNum,
      notes: notes.trim() || undefined,
      location: location.trim() || undefined,
      isMajorRepair,
      technicianName: technicianName.trim() || undefined,
      warrantyProvided: warrantyProvided || undefined,
      warrantyDurationMonths: warrantyProvided ? warrantyMonths : undefined,
    });
    setIsSaving(false);

    if (result.success) {
      navigation.goBack();
    } else {
      Alert.alert('Error', result.error || 'Failed to update service');
    }
  };

  if (isLoading || !service) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={[styles.scrollView, { backgroundColor: themeColors.background }]}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: themeColors.text }]}>
              Service Date <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.border,
                  color: themeColors.text,
                },
              ]}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={themeColors.textTertiary}
              value={serviceDate}
              onChangeText={setServiceDate}
              editable={!isSaving}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: themeColors.text }]}>
              Odometer (miles) <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.border,
                  color: themeColors.text,
                },
              ]}
              placeholder="e.g., 45000"
              placeholderTextColor={themeColors.textTertiary}
              value={odometer}
              onChangeText={setOdometer}
              keyboardType="number-pad"
              editable={!isSaving}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: themeColors.text }]}>Cost</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.border,
                  color: themeColors.text,
                },
              ]}
              placeholder="e.g., 150.50"
              placeholderTextColor={themeColors.textTertiary}
              value={cost}
              onChangeText={setCost}
              keyboardType="decimal-pad"
              editable={!isSaving}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: themeColors.text }]}>Location</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.border,
                  color: themeColors.text,
                },
              ]}
              placeholder="e.g., Joe's Auto Shop"
              placeholderTextColor={themeColors.textTertiary}
              value={location}
              onChangeText={setLocation}
              editable={!isSaving}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: themeColors.text }]}>
              Technician Name
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.border,
                  color: themeColors.text,
                },
              ]}
              placeholder="e.g., John Smith"
              placeholderTextColor={themeColors.textTertiary}
              value={technicianName}
              onChangeText={setTechnicianName}
              editable={!isSaving}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: themeColors.text }]}>Notes</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                {
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.border,
                  color: themeColors.text,
                },
              ]}
              placeholder="Additional notes about this service..."
              placeholderTextColor={themeColors.textTertiary}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!isSaving}
            />
          </View>

          <View style={[styles.switchContainer, { borderColor: themeColors.border }]}>
            <Text style={[styles.switchLabel, { color: themeColors.text }]}>
              Major Repair
            </Text>
            <Switch
              value={isMajorRepair}
              onValueChange={setIsMajorRepair}
              disabled={isSaving}
              trackColor={{ false: themeColors.border, true: theme.colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.switchContainer, { borderColor: themeColors.border }]}>
            <Text style={[styles.switchLabel, { color: themeColors.text }]}>
              Warranty Provided
            </Text>
            <Switch
              value={warrantyProvided}
              onValueChange={setWarrantyProvided}
              disabled={isSaving}
              trackColor={{ false: themeColors.border, true: theme.colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          {warrantyProvided && (
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: themeColors.text }]}>
                Warranty Duration (months)
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: themeColors.surface,
                    borderColor: themeColors.border,
                    color: themeColors.text,
                  },
                ]}
                placeholder="e.g., 12"
                placeholderTextColor={themeColors.textTertiary}
                value={warrantyDurationMonths}
                onChangeText={setWarrantyDurationMonths}
                keyboardType="number-pad"
                editable={!isSaving}
              />
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.colors.primary },
              isSaving && styles.buttonDisabled,
            ]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Save Changes</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.buttonSecondary, { borderColor: themeColors.border }]}
            onPress={() => navigation.goBack()}
            disabled={isSaving}
          >
            <Text style={[styles.buttonSecondaryText, { color: themeColors.text }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) => {
  const themeColors = theme.isDark ? theme.colors.dark : theme.colors.light;

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
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
    form: {
      width: '100%',
    },
    inputContainer: {
      marginBottom: theme.spacing.md,
    },
    label: {
      ...theme.typography.label,
      marginBottom: theme.spacing.xs,
    },
    required: {
      color: theme.colors.danger,
    },
    input: {
      ...theme.typography.body,
      borderWidth: 1,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
    },
    textArea: {
      minHeight: 100,
    },
    switchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.md,
      borderWidth: 1,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
    },
    switchLabel: {
      ...theme.typography.body,
    },
    button: {
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      alignItems: 'center',
      marginTop: theme.spacing.md,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      ...theme.typography.button,
      color: '#FFFFFF',
    },
    buttonSecondary: {
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      alignItems: 'center',
      marginTop: theme.spacing.sm,
      borderWidth: 1,
    },
    buttonSecondaryText: {
      ...theme.typography.button,
    },
  });
};

export default EditServiceScreen;


