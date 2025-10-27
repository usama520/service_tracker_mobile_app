import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Update this to point to your Rails GraphQL endpoint if different
const GRAPHQL_ENDPOINT = "http://localhost:3000/graphql";

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

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors && graphQLErrors.length > 0) {
    graphQLErrors.forEach((err) => {
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


