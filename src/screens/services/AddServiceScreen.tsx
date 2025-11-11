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
import { format } from 'date-fns';
import { MainNavigationProp, AddServiceRouteProp } from '../../navigation/types';
import { useServices } from '../../hooks/useServices';
import { useTheme } from '../../theme';

const AddServiceScreen: React.FC = () => {
  const navigation = useNavigation<MainNavigationProp>();
  const route = useRoute<AddServiceRouteProp>();
  const { createService, fetchServiceTypes, serviceTypes } = useServices();
  const theme = useTheme();
  const styles = createStyles(theme);
  const themeColors = theme.isDark ? theme.colors.dark : theme.colors.light;

  const [serviceDate, setServiceDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [odometer, setOdometer] = useState('');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState('');
  const [technicianName, setTechnicianName] = useState('');
  const [isMajorRepair, setIsMajorRepair] = useState(false);
  const [warrantyProvided, setWarrantyProvided] = useState(false);
  const [warrantyDurationMonths, setWarrantyDurationMonths] = useState('');
  const [selectedServiceTypeId, setSelectedServiceTypeId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchServiceTypes();
  }, []);

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

    setIsLoading(true);
    const result = await createService({
      vehicleId: route.params.vehicleId,
      serviceTypeId: selectedServiceTypeId,
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
    setIsLoading(false);

    if (result.success) {
      navigation.goBack();
    } else {
      Alert.alert('Error', result.error || 'Failed to add service');
    }
  };

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
              editable={!isLoading}
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
              editable={!isLoading}
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
              editable={!isLoading}
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
              editable={!isLoading}
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
              editable={!isLoading}
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
              editable={!isLoading}
            />
          </View>

          <View style={[styles.switchContainer, { borderColor: themeColors.border }]}>
            <Text style={[styles.switchLabel, { color: themeColors.text }]}>
              Major Repair
            </Text>
            <Switch
              value={isMajorRepair}
              onValueChange={setIsMajorRepair}
              disabled={isLoading}
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
              disabled={isLoading}
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
                editable={!isLoading}
              />
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.colors.primary },
              isLoading && styles.buttonDisabled,
            ]}
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Add Service</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.buttonSecondary, { borderColor: themeColors.border }]}
            onPress={() => navigation.goBack()}
            disabled={isLoading}
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

export default AddServiceScreen;


