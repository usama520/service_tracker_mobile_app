import { BaseApi, ApiResponse } from './baseApi';
import { GET_ACCIDENTS, GET_ACCIDENT } from '../graphql/queries/services';
import {
  CREATE_ACCIDENT,
  UPDATE_ACCIDENT,
  DELETE_ACCIDENT,
} from '../graphql/mutations/services';
import { Accident, useServiceStore } from '../store/serviceStore';

type CreateAccidentInput = {
  vehicleId: string;
  accidentDate: string;
  severity: string;
  atFaultStatus: string;
  description?: string;
  location?: string;
  otherDriversInfo?: string;
  policeReportFiled?: boolean;
  policeReportNumber?: string;
  estimatedDamageCost?: number;
  insuranceClaimNumber?: string;
  damageDescription?: string;
};

type UpdateAccidentInput = Partial<Omit<CreateAccidentInput, 'vehicleId'>> & { id: string };

class AccidentApi extends BaseApi {
  async getAccidents(): Promise<ApiResponse<Accident[]>> {
    const response = await this.executeQuery<{ accidents: Accident[] }>(GET_ACCIDENTS);

    if (response.success && response.data?.accidents) {
      useServiceStore.getState().setAccidents(response.data.accidents);
      return {
        data: response.data.accidents,
        success: true,
      };
    }

    return {
      errors: response.errors || ['Failed to fetch accidents'],
      success: false,
    };
  }

  async getAccident(id: string): Promise<ApiResponse<Accident>> {
    const response = await this.executeQuery<{ accident: Accident }>(GET_ACCIDENT, { id });

    if (response.success && response.data?.accident) {
      return {
        data: response.data.accident,
        success: true,
      };
    }

    return {
      errors: response.errors || ['Failed to fetch accident'],
      success: false,
    };
  }

  async createAccident(input: CreateAccidentInput): Promise<ApiResponse<Accident>> {
    const response = await this.executeMutation<{
      createAccident: { accident: Accident; errors: string[] };
    }>(CREATE_ACCIDENT, input);

    if (response.success && response.data?.createAccident.accident) {
      const accident = response.data.createAccident.accident;
      useServiceStore.getState().setAccidents([
        ...useServiceStore.getState().accidents,
        accident,
      ]);
      return {
        data: accident,
        success: true,
      };
    }

    return {
      errors: response.errors || ['Failed to create accident'],
      success: false,
    };
  }

  async updateAccident(input: UpdateAccidentInput): Promise<ApiResponse<Accident>> {
    const response = await this.executeMutation<{
      updateAccident: { accident: Accident; errors: string[] };
    }>(UPDATE_ACCIDENT, input);

    if (response.success && response.data?.updateAccident.accident) {
      const accident = response.data.updateAccident.accident;
      const accidents = useServiceStore.getState().accidents.map((a) =>
        a.id === input.id ? accident : a
      );
      useServiceStore.getState().setAccidents(accidents);
      return {
        data: accident,
        success: true,
      };
    }

    return {
      errors: response.errors || ['Failed to update accident'],
      success: false,
    };
  }

  async deleteAccident(id: string): Promise<ApiResponse<boolean>> {
    const response = await this.executeMutation<{
      deleteAccident: { accident: { id: string }; errors: string[] };
    }>(DELETE_ACCIDENT, { id });

    if (response.success && response.data?.deleteAccident.accident) {
      const accidents = useServiceStore.getState().accidents.filter((a) => a.id !== id);
      useServiceStore.getState().setAccidents(accidents);
      return {
        data: true,
        success: true,
      };
    }

    return {
      errors: response.errors || ['Failed to delete accident'],
      success: false,
    };
  }
}

export const accidentApi = new AccidentApi();


