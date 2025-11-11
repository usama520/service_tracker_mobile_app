# Car Service Tracker

A modern React Native application for tracking vehicle maintenance, repairs, accidents, and reminders with a comprehensive timeline view.

## Features

### ✅ Completed Features

- **Authentication System**
  - User registration with email verification
  - Secure login with JWT tokens
  - Persistent authentication state

- **Vehicle Management**
  - Add, edit, and delete vehicles
  - Track vehicle details (make, model, year, VIN, license plate, color)
  - View vehicle health scores and statistics
  - Monitor total repair costs and current odometer readings

- **Service History Timeline**
  - Chronological display of all maintenance activities
  - Service records with detailed information
  - Accident records with severity tracking
  - Maintenance reminders with due date/mileage tracking
  - Beautiful card-based UI for each entry type

- **Service CRUD Operations**
  - Create detailed service records
  - Edit existing service entries
  - Delete service records
  - Track service costs, locations, technicians
  - Major repair and warranty tracking

- **Modern UI/UX**
  - Dark mode support
  - Card-based design with subtle shadows
  - Color-coded status indicators
  - Responsive layouts
  - Pull-to-refresh functionality
  - Loading states and error handling

## Tech Stack

- **Frontend:** React Native 0.82
- **State Management:** Zustand
- **API Communication:** Apollo Client (GraphQL)
- **Navigation:** React Navigation (Stack Navigator)
- **Date Handling:** date-fns
- **Type Safety:** TypeScript

## Architecture

### State Management (Zustand)
- `authStore.ts` - User authentication and token management
- `vehicleStore.ts` - Vehicle data and selection
- `serviceStore.ts` - Services, accidents, reminders, and filters

### API Layer
- `baseApi.ts` - Base API class with error handling
- `authApi.ts` - Authentication operations
- `vehicleApi.ts` - Vehicle CRUD operations
- `serviceApi.ts` - Service CRUD operations
- `accidentApi.ts` - Accident CRUD operations
- `reminderApi.ts` - Reminder CRUD operations

### Custom Hooks
- `useAuth()` - Authentication state and operations
- `useVehicles()` - Vehicle management
- `useServices()` - Service and timeline management

### Navigation Structure
- **Auth Stack:** Login, Register
- **Main Stack:** VehicleList, VehicleDetail, Timeline, AddService, EditService, ServiceDetail

## Setup Instructions

### Prerequisites
- Node.js >= 20
- npm or yarn
- React Native development environment set up
- iOS: Xcode (for iOS development)
- Android: Android Studio and SDK (for Android development)

### Installation

1. **Clone the repository** (if applicable)
   ```bash
   cd /Users/usamaarshad/Projects/car_service_tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install iOS pods** (iOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Configure GraphQL endpoint**
   Update the GraphQL endpoint in `src/graphql/client.ts`:
   ```typescript
   const GRAPHQL_ENDPOINT = "http://your-backend-url/graphql";
   ```

### Running the App

#### iOS
```bash
npm run ios
```

#### Android
```bash
npm run android
```

#### Start Metro bundler separately (optional)
```bash
npm start
```

## Project Structure

```
car_service_tracker/
├── App.tsx                      # Main app component
├── src/
│   ├── api/                     # API layer
│   │   ├── baseApi.ts
│   │   ├── authApi.ts
│   │   ├── vehicleApi.ts
│   │   ├── serviceApi.ts
│   │   ├── accidentApi.ts
│   │   └── reminderApi.ts
│   ├── components/              # Reusable components
│   │   ├── timeline/
│   │   │   ├── ServiceCard.tsx
│   │   │   ├── AccidentCard.tsx
│   │   │   ├── ReminderCard.tsx
│   │   │   └── TimelineItem.tsx
│   │   └── common/
│   ├── graphql/                 # GraphQL queries and mutations
│   │   ├── client.ts
│   │   ├── types.ts
│   │   ├── queries/
│   │   │   ├── vehicles.ts
│   │   │   └── services.ts
│   │   └── mutations/
│   │       ├── auth.ts
│   │       ├── vehicles.ts
│   │       └── services.ts
│   ├── hooks/                   # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useVehicles.ts
│   │   └── useServices.ts
│   ├── navigation/              # Navigation configuration
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── MainNavigator.tsx
│   │   └── types.ts
│   ├── screens/                 # Screen components
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── vehicles/
│   │   │   ├── VehicleListScreen.tsx
│   │   │   ├── VehicleDetailScreen.tsx
│   │   │   └── AddVehicleScreen.tsx
│   │   ├── timeline/
│   │   │   └── TimelineScreen.tsx
│   │   └── services/
│   │       ├── ServiceDetailScreen.tsx
│   │       ├── AddServiceScreen.tsx
│   │       └── EditServiceScreen.tsx
│   ├── store/                   # Zustand stores
│   │   ├── authStore.ts
│   │   ├── vehicleStore.ts
│   │   └── serviceStore.ts
│   └── theme/                   # Theme configuration
│       ├── colors.ts
│       ├── spacing.ts
│       ├── typography.ts
│       └── index.ts
├── android/                     # Android native code
├── ios/                         # iOS native code
└── package.json
```

## Key Features Detail

### Authentication
- JWT token-based authentication
- Tokens stored securely in AsyncStorage
- Auto-login on app restart
- Logout functionality

### Vehicle Management
- Add vehicles with comprehensive details
- Health score visualization (0-100)
- Total repair cost tracking
- Current odometer reading

### Timeline View
- Chronological display of all activities
- Three types of entries:
  - **Services:** Regular maintenance with cost, location, technician
  - **Accidents:** Severity tracking, repair costs, insurance info
  - **Reminders:** Upcoming maintenance with countdown

### Service Records
- Comprehensive service tracking:
  - Date, odometer, cost
  - Location and technician name
  - Service type categorization
  - Major repair flag
  - Warranty tracking (duration and status)
  - Notes for additional details
  - Photo support (structure in place)

## API Integration

The app integrates with a GraphQL backend API. Key mutations and queries:

### Auth
- `login` - User authentication
- `register` - New user registration

### Vehicles
- `vehicles` - Get all vehicles
- `vehicle(id)` - Get single vehicle with details
- `createVehicle` - Add new vehicle
- `updateVehicle` - Edit vehicle
- `deleteVehicle` - Remove vehicle

### Services
- `services(vehicleId)` - Get services for a vehicle
- `service(id)` - Get single service
- `serviceTypes` - Get available service types
- `createService` - Add new service
- `updateService` - Edit service
- `deleteService` - Remove service

### Accidents & Reminders
- Similar CRUD operations available

## Future Enhancements

Potential features for future development:

1. **Photo Support**
   - Implement react-native-image-picker integration
   - Photo gallery component
   - Photo upload to backend

2. **Advanced Filtering**
   - Date range filters
   - Service type filters
   - Cost range filters
   - Search functionality

3. **Statistics Dashboard**
   - Cost analysis charts
   - Service frequency graphs
   - Predictive maintenance alerts

4. **Export Features**
   - PDF report generation
   - CSV export for service history
   - Share vehicle records

5. **Push Notifications**
   - Reminder notifications
   - Overdue maintenance alerts

6. **Multi-vehicle Comparison**
   - Compare costs across vehicles
   - Fleet management features

## Contributing

This is a personal project, but suggestions and improvements are welcome!

## License

Proprietary - All rights reserved

## Support

For issues or questions, please contact the development team.
