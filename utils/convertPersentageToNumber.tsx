import { useWindowDimensions } from 'react-native';

/**
 * Custom hook to calculate an animated height value based on a given index,
 * leveraging the device's window dimensions.
 * * This hook must be called within a React Function Component or another custom Hook.
 * @param index The index representing the desired sheet position (0, 1, or 2).
 * @returns The calculated height in pixels, or undefined if the index is invalid.
 */
const useConvertPercentageToNumber = (index: number): number | null => {
  // Rule of Hooks satisfied: Calling useWindowDimensions inside a custom hook (use...)
  const { height } = useWindowDimensions();

  if (index === 0) {
    return 0.15 * height;
  } else if (index === 1) {
    return 0.4 * height;
  } else if (index === 2) {
    return 0.6 * height;
  }
  return null;
};

export default useConvertPercentageToNumber;
