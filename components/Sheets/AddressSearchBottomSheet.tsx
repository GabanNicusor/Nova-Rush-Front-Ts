import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

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

import BottomSheet from '@gorhom/bottom-sheet';

import {
    selectAddressList,
    selectAddressListId,
    selectAddressListOrder,
    selectBottomSheetIndex,
    selectPolylineCoordsList,
    selectRouteList,
    selectUserLocation,
    selectUserStartAddress,
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
import getStopOrder from '../../service/StopOrder/Get/getStopOrder';
import updateAllNewStops from '../../service/StopOrder/Update/updateAllNewStops';

import useCountDownTimer from '../../hooks/useCountDownTimer';

import ButtonOptimizeRoute from '../Buttons/ButtonOptimizeRoute';
import RenderRouteAddressList from './RenderRouteAddressList';
import {AddressItemComplete} from '@/types/Address/AddressType';
import RecenterButtonContainer from "@/components/Buttons/RecenterButtonContainer";
import MapView from "react-native-maps";
import updateNewStop from "@/service/StopOrder/Update/updateNewStop";

interface IStyles {
    handleWrapper: ViewStyle;
    indicator: ViewStyle;
    container: ViewStyle;
    flexOne: ViewStyle;
    searchContainer: ViewStyle;
    searchInput: TextStyle;
    menuButton: ViewStyle;
    suggestionsContainer: ViewStyle;
    resultCard: ViewStyle;
    iconWrapper: ViewStyle;
    resultText: TextStyle;
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

interface Props {
    mapRef: React.RefObject<MapView | null>;
}

export function AddressSearchBottomSheet({mapRef}: Props) {
    const dispatch = useAppDispatch();

    const addressListId = useAppSelector(selectAddressListId);
    const addressList = useAppSelector(selectAddressList);
    const userStartAddress = useAppSelector(selectUserStartAddress);
    const oldOrderedList = useAppSelector(selectAddressListOrder);
    const routeList = useAppSelector(selectRouteList);
    const allCords = useAppSelector(selectPolylineCoordsList);
    const bottomSheetIndex = useAppSelector(selectBottomSheetIndex);
    const userLocation = useAppSelector(selectUserLocation);

    const bottomSheetRef = useRef<BottomSheet>(null);
    const [addressListLocal, setAddressListLocal] = useState(addressList);

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
            userStartAddress,
            allCords,
            userId,
            listId,
            addresses,
            true,
            dispatch
        );

        const newOrder = await getStopOrder(listId);
        dispatch(setAddressListOrder(newOrder ?? []));

        dispatch(setAddressList(addresses));
        dispatch(setDestination(
            {
                id: item.id, createdAt: "now",
                latitude: item.latitude ?? item.coordinates?.[1] ?? 0,
                longitude: item.longitude ?? item.coordinates?.[0] ?? 0,
                address_complete: item.address_complete || item.address || ''
            }
        ));

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
                const updatedAddressOrder = await getShortestRoute(addressListId, true, dispatch);
                await updateStopOrder(
                    oldOrderedList,
                    userStartAddress,
                    allCords,
                    user_id,
                    addressListId,
                    updatedAddressOrder,
                    false,
                    dispatch,
                );
                await updateAllNewStops(addressListId);
                const newOrder = await getStopOrder(addressListId);

                dispatch(setAddressListOrder(newOrder ?? []));

            } catch (error) {
                console.error('Route optimization failed:', error);
            }
        }
    };

    const renderItem = useCallback(({
                                        item,
                                        drag,
                                        isActive,
                                        getIndex,
                                    }: RenderItemParams<AddressItemComplete>) => {
        return (
            <RenderRouteAddressList
                item={item}
                index={(getIndex() ?? 0) + 1}
                drag={drag}
                isActive={isActive}
            />
        );
    }, []); // Empty dependency array ensures the function reference never changes

    const customTopBottomSheet = () => {
        return (
            <View style={styles.handleWrapper}>
                <View style={styles.indicator}/>
                <RecenterButtonContainer mapRef={mapRef} bottomSheetIndex={bottomSheetIndex} location={userLocation}/>
            </View>
        );
    };

    useEffect(() => {
        if (bottomSheetRef.current) {
            bottomSheetRef.current.snapToIndex(safeIndex);
        }
    }, [bottomSheetIndex, safeIndex]);

    useEffect(() => {
        setAddressListLocal(addressList);
    }, [addressList]);

    return (
        <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            index={safeIndex}
            handleComponent={customTopBottomSheet}
            enableDynamicSizing={false}
            enableContentPanningGesture={false}
            onChange={index => dispatch(setBottomSheetIndex(index))}
            backgroundStyle={{backgroundColor: '#F7F9FC'}}
        >
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={dismissKeyboard}>
                    <View style={styles.flexOne}>
                        <View style={styles.searchContainer}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: '#FFF',
                                borderRadius: 15,
                                paddingHorizontal: 12,
                                elevation: 3,
                                shadowColor: '#000',
                                shadowOffset: {width: 0, height: 2},
                                shadowOpacity: 0.05,
                                shadowRadius: 10
                            }}>
                                <FontAwesome name="search" size={16} color="#999"/>
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Search address..."
                                    placeholderTextColor="#999"
                                    value={query}
                                    onChangeText={handleInputChange}
                                    onFocus={() => setIsSearchActive(true)}
                                />
                            </View>
                            <TouchableOpacity
                                style={styles.menuButton}
                                onPress={() => setIsOptionsVisible(true)}
                            >
                                <FontAwesome name="ellipsis-v" size={18} color="#007AFF"/>
                            </TouchableOpacity>
                        </View>

                        {isSearchActive && suggestions.length > 0 && (
                            <View style={styles.suggestionsContainer}>
                                {suggestions.map(item => (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={styles.resultCard}
                                        onPressIn={() => setIsTappingSuggestion(true)}
                                        onPressOut={() => setIsTappingSuggestion(false)}
                                        onPress={() => handlePlaceSelectedAction(item)}
                                    >
                                        <View style={styles.iconWrapper}>
                                            <Text style={{fontSize: 14}}>📍</Text>
                                        </View>
                                        <Text style={styles.resultText} numberOfLines={2}>
                                            {item.address_complete || item.address}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        <View style={styles.listContainer}>
                            {addressListLocal.length === 0 ? (
                                <View style={styles.emptyContainerFull}>
                                    <Text style={styles.emptyText}>No addresses added yet.</Text>
                                </View>
                            ) : (
                                <DraggableFlatList
                                    data={addressListLocal}
                                    keyExtractor={(item) => item.id}
                                    renderItem={renderItem}
                                    ListHeaderComponent={() => (
                                        userStartAddress ? (
                                            <RenderRouteAddressList
                                                item={userStartAddress}
                                                index={0}
                                                drag={undefined}
                                                isActive={false}
                                            />
                                        ) : null
                                    )}
                                    onDragEnd={async ({data, to}) => {
                                        // 1. Update local UI INSTANTLY (No await)
                                        setAddressListLocal(data);

                                        // 2. Wrap heavy sync logic to avoid blocking the UI thread
                                        requestAnimationFrame(async () => {
                                            try {
                                                const user_id = await getUserId();
                                                if (!addressListId) return;

                                                // 3. Perform the heavy lifting
                                                await updateStopOrder(
                                                    oldOrderedList,
                                                    userStartAddress,
                                                    allCords,
                                                    user_id,
                                                    addressListId,
                                                    data,
                                                    true,
                                                    dispatch,
                                                );

                                                await updateNewStop(addressListId, data[to].id);

                                                const newOrder = await getStopOrder(addressListId);
                                                dispatch(setAddressListOrder(newOrder ?? []));
                                                // 4. Update Redux only after the heavy logic is done
                                                dispatch(setAddressList(data));

                                            } catch (err) {
                                                console.error('Sync failed:', err);
                                                // Revert if something goes wrong
                                                setAddressListLocal(addressList);
                                            }
                                        });
                                    }}
                                    containerStyle={{flex: 1}}
                                    contentContainerStyle={{paddingBottom: 550}}
                                />
                            )}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>

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
    handleWrapper: {
        width: '100%',
        paddingBottom: 10,
        backgroundColor: '#F7F9FC',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    indicator: {
        width: 36,
        height: 5,
        backgroundColor: '#E5E5EA',
        borderRadius: 3,
        alignSelf: 'center',
        marginTop: 8,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    flexOne: {
        flex: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 15,
    },
    searchInput: {
        flex: 1,
        height: 50,
        paddingLeft: 8,
        fontSize: 16,
        color: '#333',
    },
    menuButton: {
        marginLeft: 12,
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    suggestionsContainer: {
        width: '100%',
        marginBottom: 10,
    },
    resultCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#EDF1F7',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    iconWrapper: {
        width: 35,
        height: 35,
        borderRadius: 10,
        backgroundColor: '#F0F4FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    resultText: {
        flex: 1,
        fontSize: 15,
        color: '#444',
        lineHeight: 20,
    },
    emptyContainerFull: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 50,
    },
    emptyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#6C757D',
    },
    listContainer: {
        flex: 1,
    },
    flatListContent: {
        paddingBottom: 100,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
