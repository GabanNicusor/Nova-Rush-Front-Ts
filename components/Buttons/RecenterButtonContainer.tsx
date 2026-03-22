import React from 'react';
import {Animated, useWindowDimensions} from 'react-native';

import RecenterButton from './RecenterButton';
import MapView from "react-native-maps";

interface UserLocation {
    latitude: number;
    longitude: number
    speed?: number;
    heading?: number;
    accuracy?: number;
}

interface RecenterButtonContainerProps {
    mapRef: React.RefObject<MapView | null>;
    //** Represents the index of each value from snapPoints, that display bottom sheet at selected position*/
    bottomSheetIndex: number;
    location: UserLocation | null;
}

export default function RecenterButtonContainer({
                                                    mapRef,
                                                    bottomSheetIndex,
                                                    location
                                                }: RecenterButtonContainerProps) {
    const {height} = useWindowDimensions();

    const position = 0.05 * height;

    const recenterMapViewLocation = (): void => {
        if (!location || !mapRef?.current) return;

        mapRef.current.animateToRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.010,
            longitudeDelta: 0.010,
        }, 1000);
    };

    if (bottomSheetIndex < 3 && position !== undefined) {
        return (
            <RecenterButton
                onPress={recenterMapViewLocation}
                position={position as unknown as Animated.Value}
            />
        );
    }

    return null;
};
