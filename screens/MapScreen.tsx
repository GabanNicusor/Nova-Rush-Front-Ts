import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View, ViewStyle,} from 'react-native';
import MapView, {LongPressEvent, Marker} from 'react-native-maps';

import Ionicons from 'react-native-vector-icons/Ionicons';

import {useNavigation} from '@react-navigation/native';

import {DrawerNavigationProp} from '@react-navigation/drawer';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useAppDispatch, useAppSelector} from '@/state/store'


import {
    selectAddressDetailsList,
    selectAddressList,
    selectAddressListId,
    selectAddressListOrder,
    selectDestination,
    selectIsAddressPressedForDetails,
    selectIsNavigatePressed,
    selectPolylineCoordsList,
    selectRouteList,
    selectUserLocation,
    selectUserStartAddress,
    setAddressDetailsIndexSelected,
    setAddressList,
    setAddressListOrder,
    setDestination,
    setIsAddressPressesForDetails,
    setIsNavigatePressed,
} from '@/state/navSlice';

import RoutePolyline from '../components/Map/RoutePolyline';
import MapAddressModal from '../components/Map/MapAddressModal';
import UserLocationCircle from '../components/Map/UserLocationCircle';
import SearchedAddressMarker from '../components/Map/SearchedAddressMarker';
import ButtonOptimizeRoute from '../components/Buttons/ButtonOptimizeRoute';
import NavigateButton from '../components/Buttons/NavigateButton';
import ExpandableMarker from '../components/Map/ExpandableMarker'

import getShortestRoute from '../service/Map/Get/getShortestRoute';
import setIsOptimizeTrue from '../service/RouteAddressList/Set/setIsOptimizeTrue';
import getAddressFromCoordinates from '../service/Address/Get/getAddressFromCoordinates';

import useBackgroundGeolocation from '../hooks/useBackgroundGeolocation'
import useFetchOptimizeStatus from '../hooks/useFetchOptimizeStatus';
import updateStopOrder from '../service/StopOrder/Update/updateStopOrder';
import getUserId from '../service/User/Get/getUserId';
import AddressDetailsBottomSheet from '../components/Sheets/AddressDetailsBottomSheet';
import {AddressSearchBottomSheet} from '@/components/Sheets/AddressSearchBottomSheet';
import AddressNavigationBottomSheet from '../components/Sheets/AddressNavigationBottomSheet';
import fetchAddressesForSelectedList from "../service/Address/Fetch/fetchAddressesForSelectedList";
import handlePlaceSelected from "@/service/RouteAddressList/handlePlaceSelected";
import getStopOrder from "@/service/StopOrder/Get/getStopOrder";
import {AddressItemComplete} from "@/types/Address/AddressType";

interface IStyles {
    bgColour: ViewStyle;
    size: ViewStyle;
    menuButton: ViewStyle;
    recenterButton: ViewStyle;
    buttonContainer: ViewStyle;
    navigationButtonContainer: ViewStyle;
}

export default function MapScreen() {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<DrawerNavigationProp<any>>();

    const mapRef = useRef<MapView | null>(null);

    const location = useAppSelector(selectUserLocation);
    const addressListId = useAppSelector(selectAddressListId);
    const routeList = useAppSelector(selectRouteList);
    const addressList = useAppSelector(selectAddressList);
    const userStartAddress = useAppSelector(selectUserStartAddress);
    const addressDetails = useAppSelector(selectAddressDetailsList)
    const allCoords = useAppSelector(selectPolylineCoordsList);
    const oldOrderedList = useAppSelector(selectAddressListOrder);
    const destination = useAppSelector(selectDestination);
    const isAddressPressed = useAppSelector(selectIsAddressPressedForDetails);
    const isNavigatePressed = useAppSelector(selectIsNavigatePressed);

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [addressInput, setAddressInput] = useState<string>('');
    const [completeListAddress, setCompleteListAddress] = useState<AddressItemComplete[]>([]);
    const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [shouldTrack, setShouldTrack] = useState(true);

    const {isFirstOptimize, loading, setIsFirstOptimize} = useFetchOptimizeStatus(addressListId);
    useBackgroundGeolocation();


    const openDrawer = (): void => {
        navigation.openDrawer();
    };

    const handleCloseModal = (): void => {
        setModalVisible(false);
        setAddressInput('');
        dispatch(setDestination(addressList[addressList.length]));
    };

    const handleRouteOptimizePress = async (): Promise<void> => {
        const user_id = await getUserId();
        if (!user_id || !addressListId) return;

        try {
            const updatedAddressOrder = await getShortestRoute(addressListId, false, dispatch);
            await updateStopOrder(
                oldOrderedList,
                userStartAddress,
                allCoords,
                user_id,
                addressListId,
                updatedAddressOrder,
                true,
                dispatch,
            );

            const newOrder = await getStopOrder(addressInput);
            dispatch(setAddressListOrder(newOrder ?? []));

            dispatch(setAddressList(updatedAddressOrder ?? []));

            if (!isFirstOptimize && updatedAddressOrder !== undefined && updatedAddressOrder.length >= 3) {
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
        const userId = await getUserId();

        const {listId, addresses} = await handlePlaceSelected(
            {
                latitude: destination.latitude ?? 0,
                longitude: destination.longitude ?? 0,
                address_complete: addressInput || '',
            },
            addressListId,
        );

        await updateStopOrder(
            oldOrderedList,
            userStartAddress,
            allCoords,
            userId,
            listId,
            addresses,
            true,
            dispatch,
        );

        const newOrder = await getStopOrder(listId);
        dispatch(setAddressListOrder(newOrder ?? []));
        dispatch(setAddressList(addresses));
        setModalVisible(false);
    };

    const handleLongPress = async (event: LongPressEvent): Promise<void> => {
        const {latitude, longitude} = event.nativeEvent.coordinate;

        const fetchedAddress = await getAddressFromCoordinates(latitude, longitude);
        setAddressInput(fetchedAddress);
        dispatch(setDestination(
            {
                id: "",
                createdAt: "",
                latitude: latitude,
                longitude: longitude,
                address_complete: ''
            }
        ));
        setModalVisible(true);
    };

    const handleNavigatePressed = (): void => {
        dispatch(setIsAddressPressesForDetails(false));
        dispatch(setIsNavigatePressed(true));
    };

    const handleMarkerPress = useCallback(async (id: string, index: number): Promise<void> => {
        setSelectedMarkerId(id);
        dispatch(setAddressDetailsIndexSelected(index));
        dispatch(setIsAddressPressesForDetails(true));

        setIsAnimating(true);

        if (addressListId) {
            try {
                await fetchAddressesForSelectedList(addressListId, userStartAddress, false, dispatch);

            } catch (e) {
                console.error(e);
            }
        }

        // 4. Oprim animația după ce tranzitia vizuală e gata
        setTimeout(() => setIsAnimating(false), 600);
    }, [addressListId, dispatch, userStartAddress]);

    const onMarkerPress = useCallback((item_id: string, index: number) => (e: { stopPropagation: () => void; }) => {
        e.stopPropagation();
        handleMarkerPress(item_id, index).then();
    }, [handleMarkerPress]);

    useEffect(() => {
        const add: AddressItemComplete[] = userStartAddress
            ? [userStartAddress, ...(addressList ?? [])]
            : (addressList ?? []);
        setCompleteListAddress(add);
    }, [addressList, userStartAddress]);

    useEffect(() => {
        if (!destination || !mapRef.current) return;

        mapRef.current.animateToRegion({
            latitude: destination.latitude,
            longitude: destination.longitude,
            latitudeDelta: 0.08,
            longitudeDelta: 0.08,
        }, 1000);

    }, [destination]);

    useEffect(() => {
        if (shouldTrack) {
            const timer = setTimeout(() => setShouldTrack(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [shouldTrack]);

    const memoizedMarkers = useMemo(() => {
        return addressDetails
            .filter(item => item && item.address_id && item.latitude && item.longitude)
            .map((item, index) => ({
                ...item,
                displayIndex: index === 0 ? "H" : index
            }));
    }, [addressDetails]);

    if (!location) {
        return (
            <View style={[styles.size, {justifyContent: 'center', alignItems: 'center'}]}>
                <Text>Map is loading...</Text>
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={styles.size}>
            <MapView
                ref={mapRef}
                style={styles.size}
                initialRegion={{
                    latitude: addressList[addressList.length]?.latitude ?? userStartAddress?.latitude ?? 0.50,
                    longitude: addressList[addressList.length]?.longitude ?? userStartAddress?.longitude ?? 0.50,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                }}
                onLongPress={handleLongPress}

                onPress={() => setSelectedMarkerId(null)}
                moveOnMarkerPress={false}
            >

                {memoizedMarkers.map((item, index) => (
                    <Marker
                        key={item.address_id}
                        coordinate={{latitude: item.latitude, longitude: item.longitude}}
                        onPress={onMarkerPress(item.address_id, index)}
                        anchor={{x: 0.5, y: 1}}
                        tracksViewChanges={shouldTrack || selectedMarkerId === item.address_id}
                    >
                        <ExpandableMarker
                            is_selected={selectedMarkerId === item?.address_id}
                            stop_number={index === 0 ? "H" : index}
                            delivery_state={item.OrderType}
                        />
                    </Marker>
                ))}

                {location && (
                    <UserLocationCircle
                        userLocation={location}
                    />
                )}

                {destination && (
                    <SearchedAddressMarker
                        index={addressDetails.length | 0}
                        address={destination}
                        selectedMarkerId={selectedMarkerId}
                        isAnimating={isAnimating}
                        onPress={() => {
                            handleMarkerPress(destination.id, addressDetails.length + 1 | 0).then()
                        }}
                    />
                )}

                <RoutePolyline address={completeListAddress}/>
            </MapView>

            <MapAddressModal
                visible={modalVisible}
                addressInput={addressInput}
                setAddressInput={setAddressInput}
                handleSaveAddress={handleSaveAddress}
                handleCloseModal={handleCloseModal}
            />

            <TouchableOpacity style={styles.menuButton} onPress={openDrawer}>
                <Ionicons name="menu-outline" size={30} color="black"/>
            </TouchableOpacity>

            {!loading &&
                !isFirstOptimize &&
                routeList.length > 0 &&
                addressList.length >= 3 && (
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
                        <NavigateButton onPress={handleNavigatePressed}/>
                    </View>
                )
            }

            {isNavigatePressed ? (
                <AddressNavigationBottomSheet/>
            ) : !isAddressPressed ? (
                <AddressSearchBottomSheet mapRef={mapRef}/>
            ) : (
                <AddressDetailsBottomSheet/>
            )}
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create<IStyles>({
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
        padding: 10,

        backgroundColor: 'white',
        borderRadius: 50,

        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },

    recenterButton: {
        position: 'absolute',
        bottom: 180,
        right: 20,
        padding: 12,

        backgroundColor: 'white',
        borderRadius: 30,

        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 3,

        elevation: 4,
    },

    buttonContainer: {
        position: 'absolute',
        bottom: 110,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    navigationButtonContainer: {
        backgroundColor: 'black',
        position: 'absolute',
        bottom: 20,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
