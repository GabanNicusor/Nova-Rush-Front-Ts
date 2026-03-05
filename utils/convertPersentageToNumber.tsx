import {useWindowDimensions} from 'react-native';

export default function useConvertPercentageToNumber(index: number): number | null {
    const {height} = useWindowDimensions();

    if (index === 0) {
        return 0.15 * height;
    } else if (index === 1) {
        return 0.4 * height;
    } else if (index === 2) {
        return 0.6 * height;
    }
    return null;
};
