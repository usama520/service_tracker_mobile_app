import { BaseApi, ApiResponse } from './baseApi';
import {
  LOGIN_MUTATION,
  REGISTER_MUTATION,
  LoginVariables,
  RegisterVariables,
  LoginResponse,
  RegisterResponse,
  User,
} from '../graphql/mutations/auth';
import { useAuthStore } from '../store/authStore';

class AuthApi extends BaseApi {
  async login(variables: LoginVariables): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.executeMutation<LoginResponse>(LOGIN_MUTATION, variables);

    if (response.success && response.data?.login) {
      const { user, token } = response.data.login;
      await useAuthStore.getState().setAuth(user, token);
      return {
        data: { user, token },
        success: true,
      };
    }

    return {
      errors: response.errors || ['Login failed'],
      success: false,
    };
  }

  async register(
    variables: RegisterVariables
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.executeMutation<RegisterResponse>(REGISTER_MUTATION, variables);

    if (response.success && response.data?.register) {
      const { user, token } = response.data.register;
      await useAuthStore.getState().setAuth(user, token);
      return {
        data: { user, token },
        success: true,
      };
    }

    return {
      errors: response.errors || ['Registration failed'],
      success: false,
    };
  }

  async logout(): Promise<void> {
    await useAuthStore.getState().clearAuth();
  }
}

export const authApi = new AuthApi();


