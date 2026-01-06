import React from 'react';
import { setDestination } from '../../state/navSlice';
import RecenterButton from './RecenterButton';
// NOTE: Renamed to reflect the required custom hook fix
import { useAppDispatch } from '../../state/store';
import { Animated } from 'react-native';
import useConvertPercentageToNumber from '../../utils/convertPersentageToNumber';

// --- Type Definitions ---

// Define the type for the location object (coordinates)
interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: boolean;
  // Allow other properties commonly found in location objects
  [key: string]: any;
}

// Define the props interface for the container
interface RecenterButtonContainerProps {
  bottomSheetIndex: number; // Index of the bottom sheet (0, 1, or 2)
  location: UserLocation | null; // User's current location, can be null
}
// ---

/**
 * Container component that manages the visibility, position, and action
 * of the RecenterButton based on the current bottom sheet index.
 * * @param bottomSheetIndex The index of the bottom sheet (used to determine button position/visibility).
 * @param bottomSheetIndex
 * @param location The user's current geographic location.
 * @returns The RecenterButton component or null.
 */
const RecenterButtonContainer: React.FC<RecenterButtonContainerProps> = ({
                                                                           bottomSheetIndex,
                                                                           location
                                                                         }) => {
  // Get the typed dispatch function
  const dispatch = useAppDispatch();

  // 1. Call the corrected custom hook to get the position value.
  // The hook returns number | undefined, so we check the result.
  const position = useConvertPercentageToNumber(bottomSheetIndex);

  const recenterMapViewLocation = (): void => {
    // Only dispatch the location if it is available (not null)
    if (location) {
      dispatch(setDestination(location));
    }
  };

  // 2. Logic to check visibility (bottomSheetIndex <= 2) and ensure position is calculated.
  if (bottomSheetIndex <= 2 && position !== undefined) {
    return (
      <RecenterButton
        onPress={recenterMapViewLocation}
        position={position as unknown as Animated.Value}
      />
    );
  }

  // If bottomSheetIndex is greater than 2 or position is undefined, the button is hidden
  return null;
};

export default RecenterButtonContainer;
