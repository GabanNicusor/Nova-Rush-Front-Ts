import React from 'react';

import {createDrawerNavigator, DrawerContentComponentProps} from '@react-navigation/drawer';

import MapScreen from "../screens/MapScreen";

import DrawerContent from '../components/Sheets/DrawerContent';

export type DrawerParamList = {
    MapScreen: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();


const renderDrawerContent = (props: DrawerContentComponentProps) => (
    <DrawerContent {...props} />
);

export default function DrawerNavigator() {
    return (
        <Drawer.Navigator
            drawerContent={renderDrawerContent}
            screenOptions={{
                headerShown: false,
                drawerType: 'front',
            }}
        >
            <Drawer.Screen
                name="MapScreen"
                component={MapScreen}
            />
        </Drawer.Navigator>
    );
}
