import { gql } from '@apollo/client';

export const CREATE_SERVICE = gql`
  mutation CreateService(
    $vehicleId: ID!
    $serviceTypeId: ID
    $accidentId: ID
    $serviceDate: ISO8601Date!
    $odometer: Int!
    $cost: Float
    $notes: String
    $location: String
    $isMajorRepair: Boolean
    $warrantyUntil: ISO8601Date
    $technicianName: String
    $warrantyProvided: Boolean
    $warrantyDurationMonths: Int
    $photos: [String!]
  ) {
    createService(
      vehicleId: $vehicleId
      serviceTypeId: $serviceTypeId
      accidentId: $accidentId
      serviceDate: $serviceDate
      odometer: $odometer
      cost: $cost
      notes: $notes
      location: $location
      isMajorRepair: $isMajorRepair
      warrantyUntil: $warrantyUntil
      technicianName: $technicianName
      warrantyProvided: $warrantyProvided
      warrantyDurationMonths: $warrantyDurationMonths
      photos: $photos
    ) {
      service {
        id
        serviceDate
        odometer
        cost
        notes
        location
        isMajorRepair
        warrantyUntil
        technicianName
        warrantyProvided
        warrantyDurationMonths
        underWarranty
        photosUrls
        serviceType {
          id
          name
        }
      }
      errors
    }
  }
`;

export const UPDATE_SERVICE = gql`
  mutation UpdateService(
    $id: ID!
    $serviceTypeId: ID
    $serviceDate: ISO8601Date
    $odometer: Int
    $cost: Float
    $notes: String
    $location: String
    $isMajorRepair: Boolean
    $warrantyUntil: ISO8601Date
    $technicianName: String
    $warrantyProvided: Boolean
    $warrantyDurationMonths: Int
    $photos: [String!]
    $removePhotoIds: [ID!]
  ) {
    updateService(
      id: $id
      serviceTypeId: $serviceTypeId
      serviceDate: $serviceDate
      odometer: $odometer
      cost: $cost
      notes: $notes
      location: $location
      isMajorRepair: $isMajorRepair
      warrantyUntil: $warrantyUntil
      technicianName: $technicianName
      warrantyProvided: $warrantyProvided
      warrantyDurationMonths: $warrantyDurationMonths
      photos: $photos
      removePhotoIds: $removePhotoIds
    ) {
      service {
        id
        serviceDate
        odometer
        cost
        notes
        location
        isMajorRepair
        warrantyUntil
        technicianName
        warrantyProvided
        warrantyDurationMonths
        underWarranty
        photosUrls
        serviceType {
          id
          name
        }
      }
      errors
    }
  }
`;

export const DELETE_SERVICE = gql`
  mutation DeleteService($id: ID!) {
    deleteService(id: $id) {
      service {
        id
      }
      errors
    }
  }
`;

export const CREATE_ACCIDENT = gql`
  mutation CreateAccident(
    $vehicleId: ID!
    $accidentDate: ISO8601Date!
    $severity: String!
    $atFaultStatus: String!
    $description: String
    $location: String
    $otherDriversInfo: String
    $policeReportFiled: Boolean
    $policeReportNumber: String
    $estimatedDamageCost: Float
    $insuranceClaimNumber: String
    $damageDescription: String
  ) {
    createAccident(
      vehicleId: $vehicleId
      accidentDate: $accidentDate
      severity: $severity
      atFaultStatus: $atFaultStatus
      description: $description
      location: $location
      otherDriversInfo: $otherDriversInfo
      policeReportFiled: $policeReportFiled
      policeReportNumber: $policeReportNumber
      estimatedDamageCost: $estimatedDamageCost
      insuranceClaimNumber: $insuranceClaimNumber
      damageDescription: $damageDescription
    ) {
      accident {
        id
        accidentDate
        severity
        atFaultStatus
        description
        location
        totalRepairCost
        photosUrls
      }
      errors
    }
  }
`;

export const UPDATE_ACCIDENT = gql`
  mutation UpdateAccident(
    $id: ID!
    $accidentDate: ISO8601Date
    $severity: String
    $atFaultStatus: String
    $description: String
    $location: String
    $otherDriversInfo: String
    $policeReportFiled: Boolean
    $policeReportNumber: String
    $estimatedDamageCost: Float
    $insuranceClaimNumber: String
    $damageDescription: String
  ) {
    updateAccident(
      id: $id
      accidentDate: $accidentDate
      severity: $severity
      atFaultStatus: $atFaultStatus
      description: $description
      location: $location
      otherDriversInfo: $otherDriversInfo
      policeReportFiled: $policeReportFiled
      policeReportNumber: $policeReportNumber
      estimatedDamageCost: $estimatedDamageCost
      insuranceClaimNumber: $insuranceClaimNumber
      damageDescription: $damageDescription
    ) {
      accident {
        id
        accidentDate
        severity
        atFaultStatus
        description
        location
        totalRepairCost
        photosUrls
      }
      errors
    }
  }
`;

export const DELETE_ACCIDENT = gql`
  mutation DeleteAccident($id: ID!) {
    deleteAccident(id: $id) {
      accident {
        id
      }
      errors
    }
  }
`;

export const CREATE_REMINDER = gql`
  mutation CreateReminder(
    $vehicleId: ID!
    $serviceTypeId: ID
    $reminderType: String!
    $dueDate: ISO8601Date
    $dueOdometer: Int
    $isCompleted: Boolean
    $notes: String
  ) {
    createReminder(
      vehicleId: $vehicleId
      serviceTypeId: $serviceTypeId
      reminderType: $reminderType
      dueDate: $dueDate
      dueOdometer: $dueOdometer
      isCompleted: $isCompleted
      notes: $notes
    ) {
      reminder {
        id
        reminderType
        dueDate
        dueOdometer
        isCompleted
        notes
        overdue
        daysUntilDue
        milesUntilDue
      }
      errors
    }
  }
`;

export const UPDATE_REMINDER = gql`
  mutation UpdateReminder(
    $id: ID!
    $serviceTypeId: ID
    $reminderType: String
    $dueDate: ISO8601Date
    $dueOdometer: Int
    $isCompleted: Boolean
    $notes: String
  ) {
    updateReminder(
      id: $id
      serviceTypeId: $serviceTypeId
      reminderType: $reminderType
      dueDate: $dueDate
      dueOdometer: $dueOdometer
      isCompleted: $isCompleted
      notes: $notes
    ) {
      reminder {
        id
        reminderType
        dueDate
        dueOdometer
        isCompleted
        notes
        overdue
        daysUntilDue
        milesUntilDue
      }
      errors
    }
  }
`;

export const DELETE_REMINDER = gql`
  mutation DeleteReminder($id: ID!) {
    deleteReminder(id: $id) {
      reminder {
        id
      }
      errors
    }
  }
`;

export const CREATE_DIRECT_UPLOAD = gql`
  mutation CreateDirectUpload($input: CreateDirectUploadInput!) {
    createDirectUpload(input: $input) {
      directUpload {
        directUploadUrl
        signedBlobId
        uploadHeaders
      }
      errors
    }
  }
`;


