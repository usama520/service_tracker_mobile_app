import { create } from 'zustand';

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
};

export type TimelineItem = {
  id: string;
  type: 'service' | 'accident' | 'reminder';
  date: string;
  data: ServiceEntry | Accident | Reminder;
};

export type ServiceFilters = {
  dateFrom?: string | null;
  dateTo?: string | null;
  serviceTypeIds?: string[];
  minCost?: number | null;
  maxCost?: number | null;
  searchQuery?: string | null;
  sortBy: 'date_desc' | 'date_asc' | 'cost_desc' | 'cost_asc';
};

type ServiceState = {
  services: ServiceEntry[];
  accidents: Accident[];
  reminders: Reminder[];
  serviceTypes: ServiceType[];
  filters: ServiceFilters;
  isLoading: boolean;
  
  // Actions
  setServices: (services: ServiceEntry[]) => void;
  setAccidents: (accidents: Accident[]) => void;
  setReminders: (reminders: Reminder[]) => void;
  setServiceTypes: (serviceTypes: ServiceType[]) => void;
  addService: (service: ServiceEntry) => void;
  updateService: (id: string, service: Partial<ServiceEntry>) => void;
  removeService: (id: string) => void;
  setFilters: (filters: Partial<ServiceFilters>) => void;
  resetFilters: () => void;
  setLoading: (isLoading: boolean) => void;
  clearServices: () => void;
  
  // Computed
  getTimelineItems: () => TimelineItem[];
};

const defaultFilters: ServiceFilters = {
  dateFrom: null,
  dateTo: null,
  serviceTypeIds: [],
  minCost: null,
  maxCost: null,
  searchQuery: null,
  sortBy: 'date_desc',
};

export const useServiceStore = create<ServiceState>((set, get) => ({
  services: [],
  accidents: [],
  reminders: [],
  serviceTypes: [],
  filters: defaultFilters,
  isLoading: false,

  setServices: (services: ServiceEntry[]) => {
    set({ services });
  },

  setAccidents: (accidents: Accident[]) => {
    set({ accidents });
  },

  setReminders: (reminders: Reminder[]) => {
    set({ reminders });
  },

  setServiceTypes: (serviceTypes: ServiceType[]) => {
    set({ serviceTypes });
  },

  addService: (service: ServiceEntry) => {
    set((state) => ({
      services: [...state.services, service],
    }));
  },

  updateService: (id: string, updatedService: Partial<ServiceEntry>) => {
    set((state) => ({
      services: state.services.map((s) =>
        s.id === id ? { ...s, ...updatedService } : s
      ),
    }));
  },

  removeService: (id: string) => {
    set((state) => ({
      services: state.services.filter((s) => s.id !== id),
    }));
  },

  setFilters: (filters: Partial<ServiceFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  clearServices: () => {
    set({
      services: [],
      accidents: [],
      reminders: [],
      filters: defaultFilters,
    });
  },

  getTimelineItems: () => {
    const state = get();
    const items: TimelineItem[] = [];

    // Add services
    state.services.forEach((service) => {
      items.push({
        id: service.id,
        type: 'service',
        date: service.serviceDate,
        data: service,
      });
    });

    // Add accidents
    state.accidents.forEach((accident) => {
      items.push({
        id: accident.id,
        type: 'accident',
        date: accident.accidentDate,
        data: accident,
      });
    });

    // Add reminders
    state.reminders.forEach((reminder) => {
      items.push({
        id: reminder.id,
        type: 'reminder',
        date: reminder.dueDate || '',
        data: reminder,
      });
    });

    // Sort by date
    return items.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return state.filters.sortBy.includes('desc') ? dateB - dateA : dateA - dateB;
    });
  },
}));


