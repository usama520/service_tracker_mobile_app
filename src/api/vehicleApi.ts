import { BaseApi, ApiResponse } from './baseApi';
import { GET_VEHICLES, GET_VEHICLE } from '../graphql/queries/vehicles';
import {
  CREATE_VEHICLE,
  UPDATE_VEHICLE,
  DELETE_VEHICLE,
} from '../graphql/mutations/vehicles';
import { Vehicle } from '../store/vehicleStore';
import { useVehicleStore } from '../store/vehicleStore';

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

class VehicleApi extends BaseApi {
  async getVehicles(ids?: string[]): Promise<ApiResponse<Vehicle[]>> {
    const response = await this.executeQuery<{ vehicles: Vehicle[] }>(GET_VEHICLES, { ids });

    if (response.success && response.data?.vehicles) {
      useVehicleStore.getState().setVehicles(response.data.vehicles);
      return {
        data: response.data.vehicles,
        success: true,
      };
    }

    return {
      errors: response.errors || ['Failed to fetch vehicles'],
      success: false,
    };
  }

  async getVehicle(id: string): Promise<ApiResponse<Vehicle>> {
    const response = await this.executeQuery<{ vehicle: Vehicle }>(GET_VEHICLE, { id });

    if (response.success && response.data?.vehicle) {
      return {
        data: response.data.vehicle,
        success: true,
      };
    }

    return {
      errors: response.errors || ['Failed to fetch vehicle'],
      success: false,
    };
  }

  async createVehicle(input: CreateVehicleInput): Promise<ApiResponse<Vehicle>> {
    const response = await this.executeMutation<{ createVehicle: { vehicle: Vehicle; errors: string[] } }>(
      CREATE_VEHICLE,
      input
    );

    if (response.success && response.data?.createVehicle.vehicle) {
      const vehicle = response.data.createVehicle.vehicle;
      useVehicleStore.getState().addVehicle(vehicle);
      return {
        data: vehicle,
        success: true,
      };
    }

    return {
      errors: response.errors || ['Failed to create vehicle'],
      success: false,
    };
  }

  async updateVehicle(input: UpdateVehicleInput): Promise<ApiResponse<Vehicle>> {
    const response = await this.executeMutation<{ updateVehicle: { vehicle: Vehicle; errors: string[] } }>(
      UPDATE_VEHICLE,
      input
    );

    if (response.success && response.data?.updateVehicle.vehicle) {
      const vehicle = response.data.updateVehicle.vehicle;
      useVehicleStore.getState().updateVehicle(input.id, vehicle);
      return {
        data: vehicle,
        success: true,
      };
    }

    return {
      errors: response.errors || ['Failed to update vehicle'],
      success: false,
    };
  }

  async deleteVehicle(id: string): Promise<ApiResponse<boolean>> {
    const response = await this.executeMutation<{ deleteVehicle: { vehicle: { id: string }; errors: string[] } }>(
      DELETE_VEHICLE,
      { id }
    );

    if (response.success && response.data?.deleteVehicle.vehicle) {
      useVehicleStore.getState().removeVehicle(id);
      return {
        data: true,
        success: true,
      };
    }

    return {
      errors: response.errors || ['Failed to delete vehicle'],
      success: false,
    };
  }
}

export const vehicleApi = new VehicleApi();


