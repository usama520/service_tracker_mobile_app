import { BaseApi, ApiResponse } from './baseApi';
import { GET_SERVICES, GET_SERVICE, GET_SERVICE_TYPES } from '../graphql/queries/services';
import {
  CREATE_SERVICE,
  UPDATE_SERVICE,
  DELETE_SERVICE,
} from '../graphql/mutations/services';
import { ServiceEntry, ServiceType, useServiceStore } from '../store/serviceStore';

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
};

type UpdateServiceInput = Partial<Omit<CreateServiceInput, 'vehicleId'>> & { id: string };

class ServiceApi extends BaseApi {
  async getServices(vehicleId?: string): Promise<ApiResponse<ServiceEntry[]>> {
    const response = await this.executeQuery<{ services: ServiceEntry[] }>(GET_SERVICES, {
      vehicleId,
    });

    if (response.success && response.data?.services) {
      useServiceStore.getState().setServices(response.data.services);
      return {
        data: response.data.services,
        success: true,
      };
    }

    return {
      errors: response.errors || ['Failed to fetch services'],
      success: false,
    };
  }

  async getService(id: string): Promise<ApiResponse<ServiceEntry>> {
    const response = await this.executeQuery<{ service: ServiceEntry }>(GET_SERVICE, { id });

    if (response.success && response.data?.service) {
      return {
        data: response.data.service,
        success: true,
      };
    }

    return {
      errors: response.errors || ['Failed to fetch service'],
      success: false,
    };
  }

  async getServiceTypes(): Promise<ApiResponse<ServiceType[]>> {
    const response = await this.executeQuery<{ serviceTypes: ServiceType[] }>(GET_SERVICE_TYPES);

    if (response.success && response.data?.serviceTypes) {
      useServiceStore.getState().setServiceTypes(response.data.serviceTypes);
      return {
        data: response.data.serviceTypes,
        success: true,
      };
    }

    return {
      errors: response.errors || ['Failed to fetch service types'],
      success: false,
    };
  }

  async createService(input: CreateServiceInput): Promise<ApiResponse<ServiceEntry>> {
    const response = await this.executeMutation<{
      createService: { service: ServiceEntry; errors: string[] };
    }>(CREATE_SERVICE, input);

    if (response.success && response.data?.createService.service) {
      const service = response.data.createService.service;
      useServiceStore.getState().addService(service);
      return {
        data: service,
        success: true,
      };
    }

    return {
      errors: response.errors || ['Failed to create service'],
      success: false,
    };
  }

  async updateService(input: UpdateServiceInput): Promise<ApiResponse<ServiceEntry>> {
    const response = await this.executeMutation<{
      updateService: { service: ServiceEntry; errors: string[] };
    }>(UPDATE_SERVICE, input);

    if (response.success && response.data?.updateService.service) {
      const service = response.data.updateService.service;
      useServiceStore.getState().updateService(input.id, service);
      return {
        data: service,
        success: true,
      };
    }

    return {
      errors: response.errors || ['Failed to update service'],
      success: false,
    };
  }

  async deleteService(id: string): Promise<ApiResponse<boolean>> {
    const response = await this.executeMutation<{
      deleteService: { service: { id: string }; errors: string[] };
    }>(DELETE_SERVICE, { id });

    if (response.success && response.data?.deleteService.service) {
      useServiceStore.getState().removeService(id);
      return {
        data: true,
        success: true,
      };
    }

    return {
      errors: response.errors || ['Failed to delete service'],
      success: false,
    };
  }
}

export const serviceApi = new ServiceApi();


