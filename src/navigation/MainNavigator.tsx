import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList } from './types';
import VehicleListScreen from '../screens/vehicles/VehicleListScreen';
import VehicleDetailScreen from '../screens/vehicles/VehicleDetailScreen';
import AddVehicleScreen from '../screens/vehicles/AddVehicleScreen';
import TimelineScreen from '../screens/timeline/TimelineScreen';
import ServiceDetailScreen from '../screens/services/ServiceDetailScreen';
import AddServiceScreen from '../screens/services/AddServiceScreen';
import EditServiceScreen from '../screens/services/EditServiceScreen';

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="VehicleList"
        component={VehicleListScreen}
        options={{ title: 'My Vehicles' }}
      />
      <Stack.Screen
        name="VehicleDetail"
        component={VehicleDetailScreen}
        options={{ title: 'Vehicle Details' }}
      />
      <Stack.Screen
        name="AddVehicle"
        component={AddVehicleScreen}
        options={{ title: 'Add Vehicle', presentation: 'modal' }}
      />
      <Stack.Screen
        name="Timeline"
        component={TimelineScreen}
        options={{ title: 'Service History' }}
      />
      <Stack.Screen
        name="ServiceDetail"
        component={ServiceDetailScreen}
        options={{ title: 'Service Details' }}
      />
      <Stack.Screen
        name="AddService"
        component={AddServiceScreen}
        options={{ title: 'Add Service', presentation: 'modal' }}
      />
      <Stack.Screen
        name="EditService"
        component={EditServiceScreen}
        options={{ title: 'Edit Service', presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;


