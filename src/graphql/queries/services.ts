import { gql } from '@apollo/client';

export const GET_SERVICES = gql`
  query GetServices($vehicleId: ID) {
    services(vehicleId: $vehicleId) {
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
      repairType
      shopVerificationStatus
      underWarranty
      photosUrls
      serviceType {
        id
        name
        description
      }
      vehicle {
        id
        make
        model
      }
    }
  }
`;

export const GET_SERVICE = gql`
  query GetService($id: ID!) {
    service(id: $id) {
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
      repairType
      shopVerificationStatus
      underWarranty
      photosUrls
      shopNotes
      serviceType {
        id
        name
        description
        recommendedIntervalKm
        recommendedIntervalMonths
      }
      vehicle {
        id
        make
        model
        year
      }
    }
  }
`;

export const GET_SERVICE_TYPES = gql`
  query GetServiceTypes {
    serviceTypes {
      id
      name
      description
      recommendedIntervalKm
      recommendedIntervalMonths
    }
  }
`;

export const GET_ACCIDENTS = gql`
  query GetAccidents {
    accidents {
      id
      accidentDate
      severity
      atFaultStatus
      description
      location
      otherDriversInfo
      policeReportFiled
      policeReportNumber
      estimatedDamageCost
      insuranceClaimNumber
      damageDescription
      totalRepairCost
      photosUrls
      vehicle {
        id
        make
        model
      }
    }
  }
`;

export const GET_ACCIDENT = gql`
  query GetAccident($id: ID!) {
    accident(id: $id) {
      id
      accidentDate
      severity
      atFaultStatus
      description
      location
      otherDriversInfo
      policeReportFiled
      policeReportNumber
      estimatedDamageCost
      insuranceClaimNumber
      damageDescription
      totalRepairCost
      photosUrls
      vehicle {
        id
        make
        model
        year
      }
      services {
        id
        serviceDate
        cost
        notes
      }
    }
  }
`;

export const GET_REMINDERS = gql`
  query GetReminders {
    reminders {
      id
      reminderType
      dueDate
      dueOdometer
      isCompleted
      notes
      overdue
      daysUntilDue
      milesUntilDue
      vehicle {
        id
        make
        model
        currentOdometer
      }
      serviceType {
        id
        name
        recommendedIntervalKm
        recommendedIntervalMonths
      }
    }
  }
`;

export const GET_REMINDER = gql`
  query GetReminder($id: ID!) {
    reminder(id: $id) {
      id
      reminderType
      dueDate
      dueOdometer
      isCompleted
      notes
      overdue
      daysUntilDue
      milesUntilDue
      vehicle {
        id
        make
        model
        currentOdometer
      }
      serviceType {
        id
        name
        description
        recommendedIntervalKm
        recommendedIntervalMonths
      }
    }
  }
`;


