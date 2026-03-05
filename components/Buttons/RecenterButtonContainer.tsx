import React from 'react';
import {Animated} from 'react-native';

import {setDestination} from '@/state/navSlice';
import {useAppDispatch} from '@/state/store';

import RecenterButton from './RecenterButton';
import useConvertPercentageToNumber from '../../utils/convertPersentageToNumber';

interface UserLocation {
    latitude: number;
    longitude: number;
    accuracy: boolean;

    [key: string]: any;
}

interface RecenterButtonContainerProps {
    //** Represents the index of each value from snapPoints, that display bottom sheet at selected position*/
    bottomSheetIndex: number;
    location: UserLocation | null;
}

export default function RecenterButtonContainer({
                                                    bottomSheetIndex,
                                                    location
                                                }: RecenterButtonContainerProps) {
    const dispatch = useAppDispatch();

    const position = useConvertPercentageToNumber(bottomSheetIndex);

    const recenterMapViewLocation = (): void => {
        if (location) {
            dispatch(setDestination(location));
        }
    };

    if (bottomSheetIndex <= 2 && position !== undefined) {
        return (
            <RecenterButton
                onPress={recenterMapViewLocation}
                position={position as unknown as Animated.Value}
            />
        );
    }

    return null;
};
