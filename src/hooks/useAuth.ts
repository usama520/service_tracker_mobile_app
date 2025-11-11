import { useState } from 'react';
import { authApi } from '../api/authApi';
import { LoginVariables, RegisterVariables } from '../graphql/mutations/auth';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, token, isAuthenticated } = useAuthStore();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    const variables: LoginVariables = { email, password };
    const response = await authApi.login(variables);
    
    setIsLoading(false);
    
    if (!response.success) {
      const errorMessage = response.errors?.join(', ') || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
    
    return { success: true };
  };

  const register = async (data: RegisterVariables) => {
    setIsLoading(true);
    setError(null);
    
    const response = await authApi.register(data);
    
    setIsLoading(false);
    
    if (!response.success) {
      const errorMessage = response.errors?.join(', ') || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
    
    return { success: true };
  };

  const logout = async () => {
    setIsLoading(true);
    await authApi.logout();
    setIsLoading(false);
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
  };
};


