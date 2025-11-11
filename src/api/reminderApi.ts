import { BaseApi, ApiResponse } from './baseApi';
import { GET_REMINDERS, GET_REMINDER } from '../graphql/queries/services';
import {
  CREATE_REMINDER,
  UPDATE_REMINDER,
  DELETE_REMINDER,
} from '../graphql/mutations/services';
import { Reminder, useServiceStore } from '../store/serviceStore';

type CreateReminderInput = {
  vehicleId: string;
  serviceTypeId?: string;
  reminderType: string;
  dueDate?: string;
  dueOdometer?: number;
  isCompleted?: boolean;
  notes?: string;
};

type UpdateReminderInput = Partial<Omit<CreateReminderInput, 'vehicleId'>> & { id: string };

class ReminderApi extends BaseApi {
  async getReminders(): Promise<ApiResponse<Reminder[]>> {
    const response = await this.executeQuery<{ reminders: Reminder[] }>(GET_REMINDERS);

    if (response.success && response.data?.reminders) {
      useServiceStore.getState().setReminders(response.data.reminders);
      return {
        data: response.data.reminders,
        success: true,
      };
    }

    return {
      errors: response.errors || ['Failed to fetch reminders'],
      success: false,
    };
  }

  async getReminder(id: string): Promise<ApiResponse<Reminder>> {
    const response = await this.executeQuery<{ reminder: Reminder }>(GET_REMINDER, { id });

    if (response.success && response.data?.reminder) {
      return {
        data: response.data.reminder,
        success: true,
      };
    }

    return {
      errors: response.errors || ['Failed to fetch reminder'],
      success: false,
    };
  }

  async createReminder(input: CreateReminderInput): Promise<ApiResponse<Reminder>> {
    const response = await this.executeMutation<{
      createReminder: { reminder: Reminder; errors: string[] };
    }>(CREATE_REMINDER, input);

    if (response.success && response.data?.createReminder.reminder) {
      const reminder = response.data.createReminder.reminder;
      useServiceStore.getState().setReminders([
        ...useServiceStore.getState().reminders,
        reminder,
      ]);
      return {
        data: reminder,
        success: true,
      };
    }

    return {
      errors: response.errors || ['Failed to create reminder'],
      success: false,
    };
  }

  async updateReminder(input: UpdateReminderInput): Promise<ApiResponse<Reminder>> {
    const response = await this.executeMutation<{
      updateReminder: { reminder: Reminder; errors: string[] };
    }>(UPDATE_REMINDER, input);

    if (response.success && response.data?.updateReminder.reminder) {
      const reminder = response.data.updateReminder.reminder;
      const reminders = useServiceStore.getState().reminders.map((r) =>
        r.id === input.id ? reminder : r
      );
      useServiceStore.getState().setReminders(reminders);
      return {
        data: reminder,
        success: true,
      };
    }

    return {
      errors: response.errors || ['Failed to update reminder'],
      success: false,
    };
  }

  async deleteReminder(id: string): Promise<ApiResponse<boolean>> {
    const response = await this.executeMutation<{
      deleteReminder: { reminder: { id: string }; errors: string[] };
    }>(DELETE_REMINDER, { id });

    if (response.success && response.data?.deleteReminder.reminder) {
      const reminders = useServiceStore.getState().reminders.filter((r) => r.id !== id);
      useServiceStore.getState().setReminders(reminders);
      return {
        data: true,
        success: true,
      };
    }

    return {
      errors: response.errors || ['Failed to delete reminder'],
      success: false,
    };
  }
}

export const reminderApi = new ReminderApi();


