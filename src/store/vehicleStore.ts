import { create } from 'zustand';

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

type VehicleState = {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  isLoading: boolean;
  
  // Actions
  setVehicles: (vehicles: Vehicle[]) => void;
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  removeVehicle: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  clearVehicles: () => void;
};

export const useVehicleStore = create<VehicleState>((set) => ({
  vehicles: [],
  selectedVehicle: null,
  isLoading: false,

  setVehicles: (vehicles: Vehicle[]) => {
    set({ vehicles });
  },

  setSelectedVehicle: (vehicle: Vehicle | null) => {
    set({ selectedVehicle: vehicle });
  },

  addVehicle: (vehicle: Vehicle) => {
    set((state) => ({
      vehicles: [...state.vehicles, vehicle],
    }));
  },

  updateVehicle: (id: string, updatedVehicle: Partial<Vehicle>) => {
    set((state) => ({
      vehicles: state.vehicles.map((v) =>
        v.id === id ? { ...v, ...updatedVehicle } : v
      ),
      selectedVehicle:
        state.selectedVehicle?.id === id
          ? { ...state.selectedVehicle, ...updatedVehicle }
          : state.selectedVehicle,
    }));
  },

  removeVehicle: (id: string) => {
    set((state) => ({
      vehicles: state.vehicles.filter((v) => v.id !== id),
      selectedVehicle: state.selectedVehicle?.id === id ? null : state.selectedVehicle,
    }));
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  clearVehicles: () => {
    set({ vehicles: [], selectedVehicle: null });
  },
}));


