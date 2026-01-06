import React, {useMemo, useState, useEffect, useRef} from 'react';

import DraggableFlatList, {
    RenderItemParams,
} from 'react-native-draggable-flatlist';

import {FontAwesome} from '@react-native-vector-icons/fontawesome';

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Keyboard,
    TouchableWithoutFeedback,
    Modal,
    Alert,
    ViewStyle,
    TextStyle,
} from 'react-native';

// External
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';

// Redux
import {
    selectAddressListId,
    selectAddressList,
    selectPolylineCoordsList,
    selectRouteList,
    selectAddressListOrder,
    selectBottomSheetIndex,
    setAddressList,
    setBottomSheetIndex,
    setAddressListOrder,
    setAddressDetailsList,
} from '../../state/navSlice';
import {useAppDispatch, useAppSelector} from '../../state/store';

// Services & Types
import handlePlaceSelected from '../../service/RouteAddressList/handlePlaceSelected';
import findAddressSuggestion from '../../service/Address/Fetch/findAddressSuggestion';
import getShortestRoute from '../../service/Map/Get/getShortestRoute';
import getUserId from '../../service/User/Get/getUserId';
import updateStopOrder from '../../service/StopOrder/Update/updateStopOrder';
import updateNewStop from '../../service/StopOrder/Update/updateNewStop';
import getStopOrder from '../../service/StopOrder/Get/getStopOrder';
import updateAllNewStops from '../../service/StopOrder/Update/updateAllNewStops';
import fetchAddressDetails from '../../service/AddressDetails/Fetch/fetchAddressDetails';
import fetchAddressesForSelectedList from '../../service/Address/Fetch/fetchAddressesForSelectedList';

// Hooks
import useCountDownTimer from '../../hooks/useCountDownTimer';

// Components
import ButtonOptimizeRoute from '../Buttons/ButtonOptimizeRoute';
import RenderRouteAddressList from './RenderRouteAddressList';
import {AddressItemComplete} from '../../types/Address/AddressType';

// --- Interfaces ---

interface AddressSuggestion {
    id: string;
    latitude?: number;
    longitude?: number;
    coordinates?: [number, number]; // [lon, lat]
    address_complete?: string;
    address?: string;
}

// --- Component ---

export const AddressSearchBottomSheet: React.FC = () => {
    const dispatch = useAppDispatch();

    // Selectors with RootState typing
    const addressListId = useAppSelector(selectAddressListId);
    const oldOrderedList = useAppSelector(selectAddressListOrder);
    const addressList = useAppSelector(selectAddressList);
    const routeList = useAppSelector(selectRouteList);
    const allCoords = useAppSelector(selectPolylineCoordsList);
    const bottomSheetIndex = useAppSelector(selectBottomSheetIndex);

    const bottomSheetRef = useRef<BottomSheet>(null);

    const snapPoints = useMemo(() => ['15%', '40%', '60%', '90%'], []);

    const safeIndex =
        Math.max(0, Math.min(bottomSheetIndex, snapPoints.length - 1));

    const [query, setQuery] = useState<string>('');
    const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
    const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
    const [isTappingSuggestion, setIsTappingSuggestion] =
        useState<boolean>(false);
    const [isOptionsVisible, setIsOptionsVisible] = useState<boolean>(false);

    const {timeLeft, startTimer} = useCountDownTimer(10);
    const [addressListLocal, setAddressListLocal] =
        useState<AddressItemComplete[]>(addressList);

    useEffect(() => {
        if (bottomSheetRef.current) {
            bottomSheetRef.current.snapToIndex(safeIndex);
        }
    }, [bottomSheetIndex, safeIndex]);

    useEffect(() => {
        setAddressListLocal(addressList);
    }, [addressList]);

    const handleInputChange = async (text: string) => {
        setQuery(text);
        if (text === '') {
            setIsSearchActive(false);
            setSuggestions([]);
        } else {
            setIsSearchActive(true);
            const results = await findAddressSuggestion(text);
            setSuggestions(results);
        }
    };

    const safeAddressList = useMemo(
        () => addressListLocal.filter(item => item?.id),
        [addressListLocal]
    );


    const handlePlaceSelectedAction = async (item: AddressSuggestion) => {
        if (routeList.length === 0) {
            Alert.alert('In order to add Addresses please create a Route');
            return;
        }

        const userId = await getUserId();

        const { listId, addresses } = await handlePlaceSelected(
            {
                latitude: item.latitude ?? item.coordinates?.[1] ?? 0,
                longitude: item.longitude ?? item.coordinates?.[0] ?? 0,
                address_complete: item.address_complete || item.address || '',
            },
            addressListId,
        );

        await updateStopOrder(
            oldOrderedList,
            allCoords,
            userId,
            listId,
            addresses,
            dispatch,
        );

        dispatch(setAddressList(addresses));

        const newOrder = await getStopOrder(listId);
        dispatch(setAddressListOrder(newOrder ?? []));

        setSuggestions([]);
        setQuery('');
        setIsSearchActive(false);
    };


    const dismissKeyboard = () => {
        if (isTappingSuggestion) return;
        Keyboard.dismiss();
        setIsSearchActive(false);
        setSuggestions([]);
    };

    const handleRouteOptimizePress = async () => {
        const user_id = await getUserId();
        if (timeLeft === 0 && addressListId) {
            startTimer();
            try {
                await getShortestRoute(addressListId, dispatch);
                await updateStopOrder(
                    oldOrderedList,
                    allCoords,
                    user_id,
                    addressListId,
                    addressList,
                    dispatch,
                );
                await updateAllNewStops(addressListId);
                const newOrder = await getStopOrder(addressListId);
                dispatch(setAddressListOrder(newOrder));
            } catch (error) {
                console.error('Route optimization failed:', error);
            }
        }
    };

    const renderItem = ({
                            item,
                            drag,
                            isActive,
                            getIndex,
                        }: RenderItemParams<AddressItemComplete>) => (
        <RenderRouteAddressList
            item={item}
            index={getIndex() ?? 0}
            drag={drag}
            isActive={isActive}
        />
    );

    return (
        <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            index={safeIndex}
            enableContentPanningGesture={false}
            onChange={index => dispatch(setBottomSheetIndex(index))}
        >

            <BottomSheetView style={styles.container}>
                <TouchableWithoutFeedback onPress={dismissKeyboard}>
                    <View style={styles.flexOne}>
                        <View style={styles.searchContainer}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search"
                                value={query}
                                onChangeText={handleInputChange}
                                onFocus={() => setIsSearchActive(true)}
                            />
                            <TouchableOpacity
                                style={styles.menuButton}
                                onPress={() => setIsOptionsVisible(true)}
                            >
                                <FontAwesome name="ellipsis-v" size={20} color="#333"/>
                            </TouchableOpacity>
                        </View>

                        {isSearchActive && suggestions.length > 0 && (
                            <View style={styles.suggestionsContainer}>
                                {suggestions.map(item => (
                                    <TouchableOpacity
                                        key={item.id}
                                        onPressIn={() => setIsTappingSuggestion(true)}
                                        onPressOut={() => setIsTappingSuggestion(false)}
                                        onPress={() => handlePlaceSelectedAction(item)}
                                        style={styles.suggestionItem}
                                    >
                                        <Text>{item.address_complete || item.address}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        <View style={styles.listContainer}>
                            {safeAddressList.length === 0 ? (
                                <View style={styles.emptyContainerFull}>
                                    <Text style={styles.emptyText}>No addresses added yet.</Text>
                                </View>
                            ) : (
                                <DraggableFlatList
                                    data={safeAddressList}
                                    renderItem={renderItem}
                                    keyExtractor={(item) => item.id}
                                    onDragEnd={async ({data, to}) => {
                                        try {
                                            const user_id = await getUserId();
                                            if (addressListId) {
                                                await updateStopOrder(
                                                    oldOrderedList,
                                                    allCoords,
                                                    user_id,
                                                    addressListId,
                                                    data,
                                                    dispatch,
                                                );
                                                await updateNewStop(addressListId, data[to].id);
                                                const details = await fetchAddressDetails(
                                                    data,
                                                    user_id,
                                                    addressListId,
                                                );

                                                dispatch(setAddressDetailsList(details));
                                                dispatch(setAddressList(data));
                                                const newOrder = await getStopOrder(addressListId);
                                                dispatch(setAddressListOrder(newOrder ?? []));
                                            }
                                        } catch (err) {
                                            console.error('UpdateStopOrder error:', err);
                                        }
                                    }}
                                    contentContainerStyle={styles.flatListContent}
                                />
                            )}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </BottomSheetView>

            <Modal
                transparent={true}
                visible={isOptionsVisible}
                animationType={'fade'}
                onRequestClose={() => setIsOptionsVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setIsOptionsVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.optionsContainer}>
                            {routeList.length === 0 ? (
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>Create or select a route</Text>
                                </View>
                            ) : (
                                <ButtonOptimizeRoute
                                    onPress={handleRouteOptimizePress}
                                    title={timeLeft > 0 ? `Wait ${timeLeft}s` : 'Optimise Again'}
                                    disabled={timeLeft > 0}
                                    style={{
                                        backgroundColor: timeLeft === 0 ? 'black' : 'gray',
                                        paddingVertical: 10,
                                        alignItems: 'center',
                                        width: '100%',
                                        borderRadius: 8,
                                    }}
                                />
                            )}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1, padding: 20},
    flexOne: {flex: 1},
    searchContainer: {
        marginBottom: 12,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
    } as ViewStyle,
    searchInput: {
        flex: 1,
        borderBottomWidth: 1,
        padding: 8,
    } as TextStyle,
    menuButton: {
        marginLeft: 10,
        padding: 10,
        borderRadius: 9,
        borderWidth: 2,
    } as ViewStyle,
    suggestionsContainer: {
        flexDirection: 'column',
        width: '100%',
    } as ViewStyle,
    suggestionItem: {
        padding: 15,
        borderRadius: 15,
        borderWidth: 1,
        marginHorizontal: 18,
        borderColor: 'black',
        backgroundColor: '#f9f9f9',
        marginVertical: 4,
        elevation: 3,
    } as ViewStyle,
    emptyContainerFull: {
        flex: 1,
        justifyContent: 'flex-start',
        minHeight: 500,
        paddingTop: 50,
    } as ViewStyle,
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    } as ViewStyle,
    emptyText: {
        fontSize: 18,
        color: 'black',
        textAlign: 'center',
    } as TextStyle,
    listContainer: {
        flex: 1,
        paddingTop: 10,
    } as ViewStyle,
    flatListContent: {
        paddingBottom: 100,
    } as ViewStyle,
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    } as ViewStyle,
    optionsContainer: {
        backgroundColor: 'white',
        width: 200,
        height: 100,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 5,
        justifyContent: 'center',
    } as ViewStyle,
});
