import 'react-native-gesture-handler';
import React from 'react';

import {Provider} from 'react-redux';
import {store} from '@/state/store';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {configureReanimatedLogger, ReanimatedLogLevel,} from 'react-native-reanimated';
import ErrorBoundary from '../components/ErrorsBoundary/ErrorBoundary';
import StackNavigator from '../navigation/StackNavigator';
import {Platform, UIManager} from "react-native";

configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false,
});

if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function index () {
    return (
        <Provider store={store}>
            <SafeAreaProvider>
                <ErrorBoundary>
                    <StackNavigator/>
                </ErrorBoundary>
            </SafeAreaProvider>
        </Provider>
    );
};
