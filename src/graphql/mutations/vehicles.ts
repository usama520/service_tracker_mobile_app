import { gql } from '@apollo/client';

export const CREATE_VEHICLE = gql`
  mutation CreateVehicle(
    $make: String!
    $model: String!
    $year: Int!
    $vin: String
    $licensePlate: String
    $color: String
    $notes: String
  ) {
    createVehicle(
      make: $make
      model: $model
      year: $year
      vin: $vin
      licensePlate: $licensePlate
      color: $color
      notes: $notes
    ) {
      vehicle {
        id
        make
        model
        year
        vin
        licensePlate
        color
        notes
        healthScore
        totalRepairCost
        currentOdometer
      }
      errors
    }
  }
`;

export const UPDATE_VEHICLE = gql`
  mutation UpdateVehicle(
    $id: ID!
    $make: String
    $model: String
    $year: Int
    $vin: String
    $licensePlate: String
    $color: String
    $notes: String
  ) {
    updateVehicle(
      id: $id
      make: $make
      model: $model
      year: $year
      vin: $vin
      licensePlate: $licensePlate
      color: $color
      notes: $notes
    ) {
      vehicle {
        id
        make
        model
        year
        vin
        licensePlate
        color
        notes
        healthScore
        totalRepairCost
        currentOdometer
      }
      errors
    }
  }
`;

export const DELETE_VEHICLE = gql`
  mutation DeleteVehicle($id: ID!) {
    deleteVehicle(id: $id) {
      vehicle {
        id
      }
      errors
    }
  }
`;


