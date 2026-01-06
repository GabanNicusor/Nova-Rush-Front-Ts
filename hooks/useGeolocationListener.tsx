import { useEffect, useRef, useCallback } from 'react';
import { Alert } from 'react-native';
import { useAppDispatch } from '../state/store';
import { setUserLocation } from '../state/navSlice';
import locationService from '../service/LocationService/locationService';

const useGeolocationListener = (): void => {
  const dispatch = useAppDispatch();
  const intervalRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);

  const fetchLocation = useCallback(async () => {
    try {
      const locationData = await locationService.getCurrentLocation();
      dispatch(setUserLocation(
          locationData?.latitude && locationData?.longitude
              ? { latitude: locationData.latitude, longitude: locationData.longitude, accuracy: true }
              : { latitude: 0.0, longitude: 0.0, accuracy: false }
      ));    } catch (error) {
      console.error('Location error:', error);
      Alert.alert(
          'Location Error',
          'Unable to fetch location. Please ensure GPS is enabled.',
      );
    }
  }, [dispatch]);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    fetchLocation();

    intervalRef.current = setInterval(fetchLocation, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        hasStartedRef.current = false;
      }
    };
  }, [fetchLocation]);
};

export default useGeolocationListener;
