import { useState, useEffect, useCallback } from 'react';
import { vehicleApi } from '../api/vehicleApi';
import { useVehicleStore, Vehicle } from '../store/vehicleStore';

type CreateVehicleInput = {
  make: string;
  model: string;
  year: number;
  vin?: string;
  licensePlate?: string;
  color?: string;
  notes?: string;
};

type UpdateVehicleInput = Partial<CreateVehicleInput> & { id: string };

export const useVehicles = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { vehicles, selectedVehicle, setSelectedVehicle } = useVehicleStore();

  const fetchVehicles = useCallback(async (ids?: string[]) => {
    setIsLoading(true);
    setError(null);
    
    const response = await vehicleApi.getVehicles(ids);
    
    setIsLoading(false);
    
    if (!response.success) {
      const errorMessage = response.errors?.join(', ') || 'Failed to fetch vehicles';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
    
    return { success: true, data: response.data };
  }, []);

  const fetchVehicle = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    const response = await vehicleApi.getVehicle(id);
    
    setIsLoading(false);
    
    if (!response.success) {
      const errorMessage = response.errors?.join(', ') || 'Failed to fetch vehicle';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
    
    return { success: true, data: response.data };
  };

  const createVehicle = async (input: CreateVehicleInput) => {
    setIsLoading(true);
    setError(null);
    
    const response = await vehicleApi.createVehicle(input);
    
    setIsLoading(false);
    
    if (!response.success) {
      const errorMessage = response.errors?.join(', ') || 'Failed to create vehicle';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
    
    return { success: true, data: response.data };
  };

  const updateVehicle = async (input: UpdateVehicleInput) => {
    setIsLoading(true);
    setError(null);
    
    const response = await vehicleApi.updateVehicle(input);
    
    setIsLoading(false);
    
    if (!response.success) {
      const errorMessage = response.errors?.join(', ') || 'Failed to update vehicle';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
    
    return { success: true, data: response.data };
  };

  const deleteVehicle = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    const response = await vehicleApi.deleteVehicle(id);
    
    setIsLoading(false);
    
    if (!response.success) {
      const errorMessage = response.errors?.join(', ') || 'Failed to delete vehicle';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
    
    return { success: true };
  };

  const selectVehicle = (vehicle: Vehicle | null) => {
    setSelectedVehicle(vehicle);
  };

  return {
    vehicles,
    selectedVehicle,
    isLoading,
    error,
    fetchVehicles,
    fetchVehicle,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    selectVehicle,
  };
};


