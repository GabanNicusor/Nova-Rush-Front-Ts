import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import DrawerNavigator from './DrawerNavigator';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import EmailVerificationScreen from '../screens/EmailVerificationScreen';
import StartAddressScreen from '../screens/StartAddressScreen';
import RouteListDrawerScreen from '../screens/RouteListDrawerScreen';
import AddressDetailsScreen from '../screens/AddressDetailsScreen';

export type RootStackParamList = {
    LoginScreen: undefined;
    RegisterScreen: undefined;
    EmailVerificationScreen: { email: string };
    StartAddressScreen: undefined;
    AddressDetailsScreen: undefined;
    ListScreen: undefined;
    MainApp: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="LoginScreen"
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                gestureEnabled: true,
            }}
        >
            <Stack.Group>
                <Stack.Screen name="LoginScreen" component={LoginScreen}/>
                <Stack.Screen name="RegisterScreen" component={RegisterScreen}/>
                <Stack.Screen
                    name="EmailVerificationScreen"
                    component={EmailVerificationScreen}
                />
            </Stack.Group>

            <Stack.Group>
                <Stack.Screen
                    name="StartAddressScreen"
                    component={StartAddressScreen}
                />
                <Stack.Screen
                    name="AddressDetailsScreen"
                    component={AddressDetailsScreen}
                />
                <Stack.Screen name="ListScreen" component={RouteListDrawerScreen}/>
                <Stack.Screen name="MainApp" component={DrawerNavigator}/>
            </Stack.Group>
        </Stack.Navigator>
    );
}
