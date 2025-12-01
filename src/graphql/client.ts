import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { ApolloLink } from "@apollo/client/core";
import { Observable } from '@apollo/client/utilities';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GRAPHQL_ENDPOINT } from '@env';

const httpLink = new HttpLink({ uri: GRAPHQL_ENDPOINT });

const authLink = new ApolloLink((operation, forward) => {
  return new Observable(observer => {
    AsyncStorage.getItem("authToken").then(token => {
      operation.setContext({
        headers: {
          ...operation.getContext().headers,
          authorization: token ? `Bearer ${token}` : "",
        }
      });
      forward(operation).subscribe(observer);
    }).catch(error => observer.error(error));
  });
});

const errorLink = new ApolloLink((operation, forward) => {
  return new Observable(observer => {
    const subscription = forward(operation).subscribe({
      next: (result) => {
        const graphQLErrors = result.errors;
        if (graphQLErrors && graphQLErrors.length > 0) {
          graphQLErrors.forEach((err: any) => {
            // Consider handling UNAUTHENTICATED globally if needed
            console.warn(
              `[GraphQL error]: Message: ${err.message}, Path: ${err.path ?? []}`
            );
          });
        }
        observer.next(result);
      },
      error: (networkError) => {
        console.warn(`[Network error]: ${networkError}`);
        observer.error(networkError);
      },
      complete: () => {
        observer.complete();
      }
    });
    return subscription;
  });
});

console.log('YO MAHOL', httpLink, GRAPHQL_ENDPOINT)
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default apolloClient;
