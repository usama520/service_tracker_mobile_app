/**
 * Car Service Tracker App
 *
 * @format
 */
import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApolloProvider as ApolloProviderType } from '@apollo/client/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import apolloClient from './src/graphql/client';
import AppNavigator from './src/navigation/AppNavigator';

const ApolloProvider = ApolloProviderType as any;

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ApolloProvider client={apolloClient}>
        <SafeAreaProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <AppNavigator />
        </SafeAreaProvider>
      </ApolloProvider>
    </GestureHandlerRootView>
  );
}

export default App;
