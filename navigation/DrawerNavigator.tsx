import React from 'react';

// External
import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';

// Screens
import MapScreen from "../screens/MapScreen";


// Components
import DrawerContent from '../components/Sheets/DrawerContent';

// --- Types ---

/**
 * Define the routes available in this drawer.
 * If a screen takes parameters, replace 'undefined' with the parameter object.
 */
export type DrawerParamList = {
  MapScreen: undefined;
  // Add other drawer screens here as your app grows
};

const Drawer = createDrawerNavigator<DrawerParamList>();


const renderDrawerContent = (props: DrawerContentComponentProps) => (
  <DrawerContent {...props} />
);
// --- Component ---

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      // Explicitly typing the props for the custom drawer content
      drawerContent={renderDrawerContent}
      screenOptions={{
        headerShown: false,
        drawerType: 'front', // Standard drawer behavior
      }}
    >
      <Drawer.Screen
        name="MapScreen"
        component={MapScreen}
      />
    </Drawer.Navigator>
  );
}
