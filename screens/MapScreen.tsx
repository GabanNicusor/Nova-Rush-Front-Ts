import React, {useEffect, useRef, useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View, ViewStyle,} from 'react-native';
import MapViewClustering from 'react-native-map-clustering';
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
    setAddressDetailsIndexSelected,
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

import addAddressToList from '../service/RouteAddressList/Add/addAddressToList';
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
    const address = useAppSelector(selectAddressList);
    const addressDetails = useAppSelector(selectAddressDetailsList)
    const allCoords = useAppSelector(selectPolylineCoordsList);
    const oldOrderedList = useAppSelector(selectAddressListOrder);
    const destination = useAppSelector(selectDestination);
    const isAddressPressed = useAppSelector(selectIsAddressPressedForDetails);
    const isNavigatePressed = useAppSelector(selectIsNavigatePressed);

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [addressInput, setAddressInput] = useState<string>('');
    const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const {isFirstOptimize, loading, setIsFirstOptimize} = useFetchOptimizeStatus(addressListId);
    const [isFollowingUser, setIsFollowingUser] = useState(true);

    useBackgroundGeolocation();

    const handleUserInteraction = () => {
        if (isFollowingUser) {
            setIsFollowingUser(false);
        }
    };

    const openDrawer = (): void => {
        navigation.openDrawer();
    };

    const handleCloseModal = (): void => {
        setModalVisible(false);
        setAddressInput('');
        dispatch(setDestination({latitude: 0.0, longitude: 0.0}));
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
        const {latitude, longitude} = event.nativeEvent.coordinate;
        const newDestination: { accuracy: boolean, latitude: number; longitude: number } = {
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

    const handleMarkerPress = async (id: string, index: number): Promise<void> => {
        setSelectedMarkerId(id);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 600);

        if (!addressListId) return;
        await fetchAddressesForSelectedList(addressListId, dispatch);
        dispatch(setIsAddressPressesForDetails(true));
        dispatch(setAddressDetailsIndexSelected(index));
    };

    useEffect(() => {
        if (isFollowingUser && location !== null && mapRef.current) {
            mapRef.current?.animateToRegion({
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            }, 1000);
        }
    }, [location, isFollowingUser]);

    useEffect(() => {

        if (!destination || !mapRef.current) return;

        mapRef.current.animateCamera(
            {
                center: {
                    latitude: destination.latitude,
                    longitude: destination.longitude,
                },
                zoom: 15,
            },
            {duration: 1000},
        );

    }, [destination]);

    if (!location) {
        return (
            <View style={[styles.size, {justifyContent: 'center', alignItems: 'center'}]}>
                <Text>Map is loading...</Text>
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={styles.size}>
            <MapViewClustering
                ref={mapRef}
                style={styles.size}
                initialRegion={{
                    latitude: 44.4268,
                    longitude: 26.1025,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                }}
                onLongPress={handleLongPress}
                onPanDrag={handleUserInteraction}
                radius={50}
                clusterColor="#E63946"
                clusterTextColor="#FFF"
                onPress={() => setSelectedMarkerId(null)}
                moveOnMarkerPress={false}
            >
                {addressDetails.map((item, index) => (
                    <Marker
                        key={item.address_id}
                        coordinate={{latitude: item.latitude, longitude: item.longitude}}
                        onPress={(e) => {
                            e.stopPropagation();
                            handleMarkerPress(item.address_id, index - 1).then(r => {
                            });
                        }}
                        anchor={{x: 0.5, y: 1}}
                        tracksViewChanges={selectedMarkerId === item.address_id || isAnimating}
                    >
                        <ExpandableMarker
                            is_selected={selectedMarkerId === item.address_id}
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
                        destination={destination}
                        address={addressInput}
                    />
                )}

                <RoutePolyline address={address}/>
            </MapViewClustering>

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
                        <NavigateButton onPress={handleNavigatePressed}/>
                    </View>
                )}
            {!isFollowingUser && (
                <TouchableOpacity
                    onPress={() => setIsFollowingUser(true)}
                    style={styles.recenterButton}
                >
                    <Text>Recenter</Text>
                </TouchableOpacity>
            )}

            {isNavigatePressed ? (
                <AddressNavigationBottomSheet/>
            ) : !isAddressPressed ? (
                <AddressSearchBottomSheet/>
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
        position: 'absolute',
        bottom: 50,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
