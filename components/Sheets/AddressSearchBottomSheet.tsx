import React, {useEffect, useMemo, useRef, useState} from 'react';

import DraggableFlatList, {RenderItemParams,} from 'react-native-draggable-flatlist';

import {FontAwesome} from '@react-native-vector-icons/fontawesome';

import {
    Alert,
    Keyboard,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TextStyle,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    ViewStyle,
} from 'react-native';

import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';

import {
    selectAddressList,
    selectAddressListId,
    selectAddressListOrder,
    selectBottomSheetIndex,
    selectPolylineCoordsList,
    selectRouteList, selectUserStartAddress,
    setAddressDetailsList,
    setAddressList,
    setAddressListOrder,
    setBottomSheetIndex,
    setDestination
} from '@/state/navSlice';
import {useAppDispatch, useAppSelector} from '@/state/store';

import handlePlaceSelected from '../../service/RouteAddressList/handlePlaceSelected';
import findAddressSuggestion from '../../service/Address/Fetch/findAddressSuggestion';
import getShortestRoute from '../../service/Map/Get/getShortestRoute';
import getUserId from '../../service/User/Get/getUserId';
import updateStopOrder from '../../service/StopOrder/Update/updateStopOrder';
import updateNewStop from '../../service/StopOrder/Update/updateNewStop';
import getStopOrder from '../../service/StopOrder/Get/getStopOrder';
import updateAllNewStops from '../../service/StopOrder/Update/updateAllNewStops';
import fetchAddressDetails from '../../service/AddressDetails/Fetch/fetchAddressDetails';

import useCountDownTimer from '../../hooks/useCountDownTimer';

import ButtonOptimizeRoute from '../Buttons/ButtonOptimizeRoute';
import RenderRouteAddressList from './RenderRouteAddressList';
import {AddressItemComplete} from '@/types/Address/AddressType';

interface IStyles {
    container: ViewStyle;
    flexOne: ViewStyle;
    searchContainer: ViewStyle;
    searchInput: TextStyle;
    menuButton: ViewStyle;
    suggestionsContainer: ViewStyle;
    suggestionItem: ViewStyle;
    emptyContainerFull: ViewStyle;
    emptyContainer: ViewStyle;
    emptyText: TextStyle;
    listContainer: ViewStyle;
    flatListContent: ViewStyle;
    modalOverlay: ViewStyle;
    optionsContainer: ViewStyle;
}

interface AddressSuggestion {
    id: string;
    latitude?: number;
    longitude?: number;
    coordinates?: [number, number];
    address_complete?: string;
    address?: string;
}

export function AddressSearchBottomSheet() {
    const dispatch = useAppDispatch();

    const addressListId = useAppSelector(selectAddressListId);
    const startItem = useAppSelector(selectUserStartAddress);
    const oldOrderedList = useAppSelector(selectAddressListOrder);
    const addressList = useAppSelector(selectAddressList);
    const routeList = useAppSelector(selectRouteList);
    const allCords = useAppSelector(selectPolylineCoordsList);
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

    const handlePlaceSelectedAction = async (item: AddressSuggestion) => {
        if (routeList.length === 0) {
            Alert.alert('In order to add Addresses please create a Route');
            return;
        }

        const userId = await getUserId();

        const {listId, addresses} = await handlePlaceSelected(
            {
                latitude: item.latitude ?? item.coordinates?.[1] ?? 0,
                longitude: item.longitude ?? item.coordinates?.[0] ?? 0,
                address_complete: item.address_complete || item.address || '',
            },
            addressListId,
        );

        await updateStopOrder(
            oldOrderedList,
            allCords,
            userId,
            listId,
            addresses,
            dispatch,
        );

        dispatch(setAddressList(addresses));
        dispatch(setDestination({latitude: item.latitude ?? 0.50, longitude: item.longitude ?? 0.50}));
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
                    allCords,
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
                        }: RenderItemParams<AddressItemComplete>) => {
        const listIndex = (getIndex() ?? 0) + 1;

        return (
            <RenderRouteAddressList
                item={item}
                index={listIndex}
                drag={drag}
                isActive={isActive}
            />
        );
    };

    useEffect(() => {
        if (bottomSheetRef.current) {
            bottomSheetRef.current.snapToIndex(safeIndex);
        }
    }, [bottomSheetIndex, safeIndex]);

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
                            {addressList.length === 0 ? (
                                <View style={styles.emptyContainerFull}>
                                    <Text style={styles.emptyText}>No addresses added yet.</Text>
                                </View>
                            ) : (
                                <DraggableFlatList
                                    data={addressList}
                                    keyExtractor={(item) => item.id}
                                    renderItem={renderItem}

                                    // This renders the first address at the top, but makes it "untouchable" by drag logic
                                    ListHeaderComponent={() => (
                                        startItem ? (
                                            <RenderRouteAddressList
                                                item={startItem}
                                                index={0}
                                                drag={undefined}
                                                isActive={false}
                                            />
                                        ) : null
                                    )}

                                    onDragEnd={async ({data, to}) => {
                                        if(startItem == null) return;

                                        const updatedFullList = [startItem, ...data];

                                        try {
                                            const user_id = await getUserId();
                                            if (addressListId) {
                                                await updateStopOrder(
                                                    oldOrderedList,
                                                    allCords,
                                                    user_id,
                                                    addressListId,
                                                    updatedFullList,
                                                    dispatch,
                                                );

                                                await updateNewStop(addressListId, data[to].id);

                                                const details = await fetchAddressDetails(updatedFullList, user_id, addressListId);

                                                dispatch(setAddressDetailsList(details));
                                                dispatch(setAddressList(updatedFullList));

                                                const newOrder = await getStopOrder(addressListId);
                                                dispatch(setAddressListOrder(newOrder ?? []));
                                            }
                                        } catch (err) {
                                            console.error('UpdateStopOrder error:', err);
                                        }
                                    }}
                                    containerStyle={{flex: 1}}
                                    contentContainerStyle={{paddingBottom: 150}}
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
}

const styles = StyleSheet.create<IStyles>({
    container: {
        flex: 1,
        padding: 20,
    },

    flexOne: {
        flex: 1,
    },

    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingHorizontal: 10,
    },

    searchInput: {
        flex: 1,
        padding: 8,

        borderBottomWidth: 1,
    },

    menuButton: {
        marginLeft: 10,
        padding: 10,

        borderRadius: 9,
        borderWidth: 2,
    },

    suggestionsContainer: {
        flexDirection: 'column',
        width: '100%',
    },

    suggestionItem: {
        padding: 15,
        marginHorizontal: 18,
        marginVertical: 4,

        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: '#f9f9f9',

        elevation: 3,
    },

    emptyContainerFull: {
        flex: 1,
        minHeight: 500,
        paddingTop: 50,
        justifyContent: 'flex-start',
    },

    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    emptyText: {
        textAlign: 'center',

        fontSize: 18,
        color: 'black',
    },

    listContainer: {
        flex: 1,
        minHeight: 500,
        paddingTop: 10,
    },

    flatListContent: {
        paddingBottom: 100,
    },

    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    optionsContainer: {
        width: 200,
        height: 100,
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: 'white',
        borderRadius: 10,

        elevation: 5,
    },
});
