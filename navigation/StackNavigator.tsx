import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import DrawerNavigator from './DrawerNavigator';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import EmailVerificationScreen from '../screens/EmailVerificationScreen';
import StartAddressScreen from '../screens/StartAddressScreen';
import RouteListDrawerScreen from '../screens/RouteListDrawerScreen';
import AddressDetailsScreen from '../screens/AddressDetailsScreen';

/**
 * Root Stack Types
 */
export type RootStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  EmailVerificationScreen: { email: string };
  StartAddressScreen: undefined;
  AddressDetailsScreen: undefined;
  ListScreen: undefined;
  MainApp: undefined;
};

// Use createNativeStackNavigator for better performance on Fabric
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{
        headerShown: false,
        // Native stack handles animations via the OS (iOS/Android)
        animation: 'slide_from_right',
        gestureEnabled: true,
      }}
    >
      {/* Grouping Auth Screens helps with logic flow */}
      <Stack.Group>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen
          name="EmailVerificationScreen"
          component={EmailVerificationScreen}
        />
      </Stack.Group>

      {/* Main Application Flow */}
      <Stack.Group>
        <Stack.Screen
          name="StartAddressScreen"
          component={StartAddressScreen}
        />
        <Stack.Screen
          name="AddressDetailsScreen"
          component={AddressDetailsScreen}
        />
        <Stack.Screen name="ListScreen" component={RouteListDrawerScreen} />
        <Stack.Screen name="MainApp" component={DrawerNavigator} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
