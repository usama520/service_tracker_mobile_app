import { useState, useCallback } from 'react';
import { serviceApi } from '../api/serviceApi';
import { accidentApi } from '../api/accidentApi';
import { reminderApi } from '../api/reminderApi';
import { useServiceStore } from '../store/serviceStore';

type CreateServiceInput = {
  vehicleId: string;
  serviceTypeId?: string;
  accidentId?: string;
  serviceDate: string;
  odometer: number;
  cost?: number;
  notes?: string;
  location?: string;
  isMajorRepair?: boolean;
  warrantyUntil?: string;
  technicianName?: string;
  warrantyProvided?: boolean;
  warrantyDurationMonths?: number;
  photos?: string[];
};

type UpdateServiceInput = Partial<Omit<CreateServiceInput, 'vehicleId'>> & {
  id: string;
  removePhotoIds?: string[];
};

export const useServices = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    services,
    accidents,
    reminders,
    serviceTypes,
    filters,
    setFilters,
    resetFilters,
    getTimelineItems,
  } = useServiceStore();

  const fetchServices = useCallback(async (vehicleId?: string) => {
    setIsLoading(true);
    setError(null);
    
    const response = await serviceApi.getServices(vehicleId);
    
    setIsLoading(false);
    
    if (!response.success) {
      const errorMessage = response.errors?.join(', ') || 'Failed to fetch services';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
    
    return { success: true, data: response.data };
  }, []);

  const fetchService = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    const response = await serviceApi.getService(id);
    
    setIsLoading(false);
    
    if (!response.success) {
      const errorMessage = response.errors?.join(', ') || 'Failed to fetch service';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
    
    return { success: true, data: response.data };
  };

  const fetchServiceTypes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    const response = await serviceApi.getServiceTypes();
    
    setIsLoading(false);
    
    if (!response.success) {
      const errorMessage = response.errors?.join(', ') || 'Failed to fetch service types';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
    
    return { success: true, data: response.data };
  }, []);

  const createService = async (input: CreateServiceInput) => {
    setIsLoading(true);
    setError(null);
    
    const response = await serviceApi.createService(input);
    
    setIsLoading(false);
    
    if (!response.success) {
      const errorMessage = response.errors?.join(', ') || 'Failed to create service';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
    
    return { success: true, data: response.data };
  };

  const updateService = async (input: UpdateServiceInput) => {
    setIsLoading(true);
    setError(null);
    
    const response = await serviceApi.updateService(input);
    
    setIsLoading(false);
    
    if (!response.success) {
      const errorMessage = response.errors?.join(', ') || 'Failed to update service';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
    
    return { success: true, data: response.data };
  };

  const deleteService = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    const response = await serviceApi.deleteService(id);
    
    setIsLoading(false);
    
    if (!response.success) {
      const errorMessage = response.errors?.join(', ') || 'Failed to delete service';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
    
    return { success: true };
  };

  const fetchAccidents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    const response = await accidentApi.getAccidents();
    
    setIsLoading(false);
    
    if (!response.success) {
      const errorMessage = response.errors?.join(', ') || 'Failed to fetch accidents';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
    
    return { success: true, data: response.data };
  }, []);

  const fetchReminders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    const response = await reminderApi.getReminders();
    
    setIsLoading(false);
    
    if (!response.success) {
      const errorMessage = response.errors?.join(', ') || 'Failed to fetch reminders';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
    
    return { success: true, data: response.data };
  }, []);

  const timelineItems = getTimelineItems();

  return {
    services,
    accidents,
    reminders,
    serviceTypes,
    timelineItems,
    filters,
    isLoading,
    error,
    fetchServices,
    fetchService,
    fetchServiceTypes,
    createService,
    updateService,
    deleteService,
    fetchAccidents,
    fetchReminders,
    setFilters,
    resetFilters,
  };
};


