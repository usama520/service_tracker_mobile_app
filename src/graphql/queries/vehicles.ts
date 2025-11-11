import { gql } from '@apollo/client';

export const GET_VEHICLES = gql`
  query GetVehicles($ids: [ID!]) {
    vehicles(ids: $ids) {
      id
      make
      model
      year
      vin
      licensePlate
      color
      notes
      mainPhotoUrl
      healthScore
      totalRepairCost
      currentOdometer
    }
  }
`;

export const GET_VEHICLE = gql`
  query GetVehicle($id: ID!) {
    vehicle(id: $id) {
      id
      make
      model
      year
      vin
      licensePlate
      color
      notes
      mainPhotoUrl
      healthScore
      totalRepairCost
      currentOdometer
      services {
        id
        serviceDate
        cost
        odometer
        notes
        serviceType {
          id
          name
        }
      }
      accidents {
        id
        accidentDate
        severity
        totalRepairCost
      }
      reminders {
        id
        reminderType
        dueDate
        dueOdometer
        overdue
        isCompleted
      }
    }
  }
`;


