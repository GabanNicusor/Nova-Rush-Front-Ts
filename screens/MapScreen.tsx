import React, { useState, useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Alert,
  ViewStyle,
} from 'react-native';
import MapView, { Region, LongPressEvent } from 'react-native-maps';

// External
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useNavigation } from '@react-navigation/native';

import { DrawerNavigationProp } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAppDispatch, useAppSelector } from '../state/store';


// Redux
import {
  selectAddressList,
  selectAddressListId,
  selectAddressListOrder,
  selectDestination,
  selectIsAddressPressedForDetails,
  selectIsNavigatePressed,
  selectPolylineCoordsList,
  selectRouteList,
  selectUserLocation,
  setDestination,
  setIsAddressPressesForDetails,
  setIsNavigatePressed,
  setMapHeading,
} from '../state/navSlice';

// Components
import RoutePolyline from '../components/Map/RoutePolyline';
import MapAddressModal from '../components/Map/MapAddressModal';
import UserLocationCircle from '../components/Map/UserLocationCircle';
import SearchedAddressMarker from '../components/Map/SearchedAddressMarker';
import ButtonOptimizeRoute from '../components/Buttons/ButtonOptimizeRoute';
import NavigateButton from '../components/Buttons/NavigateButton';

// Service
import addAddressToList from '../service/RouteAddressList/Add/addAddressToList';
import getShortestRoute from '../service/Map/Get/getShortestRoute';
import setIsOptimizeTrue from '../service/RouteAddressList/Set/setIsOptimizeTrue';
import getAddressFromCoordinates from '../service/Address/Get/getAddressFromCoordinates';

// Hooks
import useGeolocationListener from '../hooks/useGeolocationListener';
import useFetchOptimizeStatus from '../hooks/useFetchOptimizeStatus';
import updateStopOrder from '../service/StopOrder/Update/updateStopOrder';
import getUserId from '../service/User/Get/getUserId';
import AddressDetailsBottomSheet from '../components/Sheets/AddressDetailsBottomSheet';
import { AddressSearchBottomSheet } from '../components/Sheets/AddressSearchBottomSheet';
import AddressNavigationBottomSheet from '../components/Sheets/AddressNavigationBottomSheet';

const MapScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  // Explicitly type the MapView ref
  const mapRef = useRef<MapView | null>(null);

  // Redux Selectors
  const location = useAppSelector(selectUserLocation);
  const addressListId = useAppSelector(selectAddressListId);
  const routeList = useAppSelector(selectRouteList);
  const address = useAppSelector(selectAddressList);
  const allCoords = useAppSelector(selectPolylineCoordsList);
  const oldOrderedList = useAppSelector(selectAddressListOrder);
  const destination = useAppSelector(selectDestination);
  const isAddressPressed = useAppSelector(selectIsAddressPressedForDetails);
  const isNavigatePressed = useAppSelector(selectIsNavigatePressed);

  // Local State
  const [userLocationAccuracy, setUserLocationAccuracy] = useState<
    boolean | null
  >(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [addressInput, setAddressInput] = useState<string>('');

  // Custom Hooks
  const { isFirstOptimize, loading, setIsFirstOptimize } = useFetchOptimizeStatus(addressListId);
  useGeolocationListener();

  // Update user location accuracy
  useEffect(() => {
    if (location?.accuracy) {
      setUserLocationAccuracy(location.accuracy);
    }
  }, [location]);

  // Animate camera to destination
  useEffect(() => {
    if (destination && mapRef.current) {
      mapRef.current.animateCamera(
        {
          center: {
            latitude: destination.latitude,
            longitude: destination.longitude,
          },
          zoom: 15,
        },
        { duration: 1000 },
      );
    }
  }, [destination]);

  const openDrawer = (): void => {
    navigation.openDrawer();
  };

  const handleRegionChange = (region: Region): void => {
    // Track map heading for navigation components
    if (region !== undefined) {
      dispatch(setMapHeading(region));
    }
  };

  const handleCloseModal = (): void => {
    setModalVisible(false);
    setAddressInput('');
    dispatch(setDestination({ latitude: 0.0, longitude: 0.0, accuracy: false }));
  };

  const handleRouteOptimizePress = async (): Promise<void> => {
    const user_id = await getUserId();
    if (!user_id || !addressListId) return;

    try {
      await getShortestRoute(addressListId, dispatch);
      await updateStopOrder(
        oldOrderedList,
        allCoords,
        user_id,
        addressListId,
        address,
        dispatch,
      );

      if (!isFirstOptimize && address.length >= 3) {
        await setIsOptimizeTrue(addressListId);
        setIsFirstOptimize(true);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Alert.alert(
        'Optimization Error',
        'Could not calculate the shortest route.',
      );
    }
  };

  const handleSaveAddress = async (): Promise<void> => {
    if (!addressInput.trim() || !destination || !addressListId) {
      Alert.alert('Error', 'Please enter a valid address.');
      return;
    }
    await addAddressToList(
      addressInput,
      destination.latitude,
      destination.longitude,
      addressListId,
    );
    setModalVisible(false);
  };

  const handleLongPress = async (event: LongPressEvent): Promise<void> => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const newDestination: {accuracy: boolean , latitude: number; longitude: number } = {
      latitude,
      longitude,
      accuracy: false,
    };

    const fetchedAddress = await getAddressFromCoordinates(latitude, longitude);
    setAddressInput(fetchedAddress);
    dispatch(setDestination(newDestination));
    setModalVisible(true);
  };

  const handleNavigatePressed = (): void => {
    dispatch(setIsAddressPressesForDetails(false));
    dispatch(setIsNavigatePressed(true));
  };

  return (
    <GestureHandlerRootView style={styles.size}>
      <MapView
        ref={mapRef}
        style={styles.size}
        onLongPress={handleLongPress}
        onRegionChangeComplete={handleRegionChange}
      >
        {userLocationAccuracy && location && (
          <UserLocationCircle
            userLocation={location}
            accuracy={userLocationAccuracy}
          />
        )}

        {destination && (
          <SearchedAddressMarker
            destination={destination}
            address={addressInput}
          />
        )}

        <RoutePolyline address={address} />
      </MapView>

      <MapAddressModal
        visible={modalVisible}
        addressInput={addressInput}
        setAddressInput={setAddressInput}
        handleSaveAddress={handleSaveAddress}
        handleCloseModal={handleCloseModal}
      />

      <TouchableOpacity style={styles.menuButton} onPress={openDrawer}>
        <Ionicons name="menu-outline" size={30} color="black" />
      </TouchableOpacity>

      {!loading &&
        !isFirstOptimize &&
        routeList.length > 0 &&
        address.length >= 3 && (
          <View style={styles.buttonContainer}>
            <ButtonOptimizeRoute
              onPress={handleRouteOptimizePress}
              title={'Optimize'}
              disabled={false}
              style={styles.bgColour}
            />
          </View>
        )}

      {!loading &&
        isFirstOptimize &&
        !isNavigatePressed &&
        !isAddressPressed && (
          <View style={styles.navigationButtonContainer}>
            <NavigateButton onPress={handleNavigatePressed} />
          </View>
        )}

      {isNavigatePressed ? (
        <AddressNavigationBottomSheet />
      ) : !isAddressPressed ? (
        <AddressSearchBottomSheet />
      ) : (
        <AddressDetailsBottomSheet />
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  bgColour: {
    backgroundColor: '#4A90E2',
  },
  size: {
    flex: 1,
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 110,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  navigationButtonContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
});

export default MapScreen;
