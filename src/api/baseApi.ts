import { apolloClient } from '../graphql/client';

export type ApiResponse<T> = {
  data?: T;
  errors?: string[];
  success: boolean;
};

export class BaseApi {
  protected handleError(error: unknown): ApiResponse<never> {
    console.error('API Error:', error);

    if (error && typeof error === 'object' && 'graphQLErrors' in error) {
      const apolloError = error as { graphQLErrors: Array<{ message: string }> };
      const errors = apolloError.graphQLErrors.map((e) => e.message);
      return {
        errors: errors.length > 0 ? errors : ['An error occurred'],
        success: false,
      };
    }

    return {
      errors: ['An unexpected error occurred'],
      success: false,
    };
  }

  protected async executeQuery<T>(
    query: any,
    variables?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    try {
      const response = await apolloClient.query({
        query,
        variables,
        fetchPolicy: 'network-only',
      });

      return {
        data: response.data as T,
        success: true,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected async executeMutation<T>(
    mutation: any,
    variables?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    try {
      const response = await apolloClient.mutate({
        mutation,
        variables,
      });

      // Check for errors in the mutation response
      const mutationResult = response.data
        ? Object.values(response.data)[0] as any
        : null;

      if (mutationResult?.errors && mutationResult.errors.length > 0) {
        return {
          data: response.data as T,
          errors: mutationResult.errors,
          success: false,
        };
      }

      return {
        data: response.data as T,
        success: true,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

