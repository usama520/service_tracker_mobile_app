import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GRAPHQL_ENDPOINT } from '@env';

const httpLink = new HttpLink({ uri: GRAPHQL_ENDPOINT });

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem("authToken");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = onError((errorResponse: any) => {
  const { graphQLErrors, networkError } = errorResponse;
  if (graphQLErrors && graphQLErrors.length > 0) {
    graphQLErrors.forEach((err: any) => {
      // Consider handling UNAUTHENTICATED globally if needed
      console.warn(
        `[GraphQL error]: Message: ${err.message}, Path: ${err.path ?? []}`
      );
    });
  }
  if (networkError) {
    console.warn(`[Network error]: ${networkError}`);
  }
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default apolloClient;


