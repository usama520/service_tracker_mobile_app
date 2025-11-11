import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// Main Stack
export type MainStackParamList = {
  VehicleList: undefined;
  VehicleDetail: { vehicleId: string };
  AddVehicle: undefined;
  Timeline: { vehicleId: string };
  ServiceDetail: { serviceId: string };
  AddService: { vehicleId: string };
  EditService: { serviceId: string };
};

// Root Stack
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

// Navigation prop types
export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type MainNavigationProp = NativeStackNavigationProp<MainStackParamList>;

// Route prop types
export type VehicleDetailRouteProp = RouteProp<MainStackParamList, 'VehicleDetail'>;
export type TimelineRouteProp = RouteProp<MainStackParamList, 'Timeline'>;
export type ServiceDetailRouteProp = RouteProp<MainStackParamList, 'ServiceDetail'>;
export type AddServiceRouteProp = RouteProp<MainStackParamList, 'AddService'>;
export type EditServiceRouteProp = RouteProp<MainStackParamList, 'EditService'>;


