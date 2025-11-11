// Shared GraphQL types for the application

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
};

export type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  vin?: string | null;
  licensePlate?: string | null;
  color?: string | null;
  notes?: string | null;
  mainPhotoUrl?: string | null;
  healthScore: number;
  totalRepairCost: number;
  currentOdometer: number;
};

export type ServiceType = {
  id: string;
  name: string;
  description?: string | null;
  recommendedIntervalKm?: number | null;
  recommendedIntervalMonths?: number | null;
};

export type ServiceEntry = {
  id: string;
  serviceDate: string;
  odometer: number;
  cost?: number | null;
  notes?: string | null;
  location?: string | null;
  isMajorRepair: boolean;
  warrantyUntil?: string | null;
  technicianName?: string | null;
  warrantyProvided?: boolean | null;
  warrantyDurationMonths?: number | null;
  repairType: string;
  shopVerificationStatus: string;
  underWarranty: boolean;
  photosUrls: string[];
  shopNotes?: string | null;
  serviceType?: ServiceType | null;
  vehicle?: Vehicle;
};

export type Accident = {
  id: string;
  accidentDate: string;
  severity: string;
  atFaultStatus: string;
  description?: string | null;
  location?: string | null;
  otherDriversInfo?: string | null;
  policeReportFiled?: boolean | null;
  policeReportNumber?: string | null;
  estimatedDamageCost?: number | null;
  insuranceClaimNumber?: string | null;
  damageDescription?: string | null;
  totalRepairCost: number;
  photosUrls: string[];
  vehicle?: Vehicle;
};

export type Reminder = {
  id: string;
  reminderType: string;
  dueDate?: string | null;
  dueOdometer?: number | null;
  isCompleted?: boolean | null;
  notes?: string | null;
  overdue: boolean;
  daysUntilDue?: number | null;
  milesUntilDue?: number | null;
  serviceType?: ServiceType | null;
  vehicle?: Vehicle;
};


