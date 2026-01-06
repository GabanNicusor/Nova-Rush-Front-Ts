import 'react-native-gesture-handler';
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from '../state/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import ErrorBoundary from '../components/ErrorsBoundary/ErrorBoundary';
import StackNavigator from '../navigation/StackNavigator';

// --- Global Configuration ---

/**
 * Reanimated configuration.
 * 'strict: false' prevents the logger from throwing errors
 * for shared value access during development.
 */
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

// --- Component ---

/**
 * Root Application Component.
 * Sets up the provider tree for State (Redux), UI (Safe Area),
 * Error Handling, and Navigation.
 */
const index: React.FC = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ErrorBoundary>
            <StackNavigator />
        </ErrorBoundary>
      </SafeAreaProvider>
    </Provider>
  );
};

export default index;
