import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle,} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import {DrawerContentComponentProps} from '@react-navigation/drawer';

import {
    selectRouteList, selectUserStartAddress,
    setAddressDetailsList,
    setAddressList,
    setAddressListId,
    setRouteList,
} from '@/state/navSlice';

import {useAppDispatch, useAppSelector} from '@/state/store';
import getUserAddressList from '../../service/RouteAddressList/Get/getUserAddressList';
import deleteRouteListByListId from '../../service/RouteAddressList/Delete/deleteRouteListByListId';
import getUserId from '../../service/User/Get/getUserId';
import fetchAddressesForSelectedList from '../../service/Address/Fetch/fetchAddressesForSelectedList';
import deleteAllStopDetails from '../../service/StopDetails/Delete/deleteAllStopDetails';

interface IStyles {
    drawerMainContainer: ViewStyle;
    routeItemButton: ViewStyle;
    routeItemIconBox: ViewStyle;
    routeItemTextSection: ViewStyle;
    routeItemTitle: TextStyle;
    routeItemDate: TextStyle;
    listSeparator: ViewStyle;
    scrollableListArea: ViewStyle;
    emptyStateContainer: ViewStyle;
    emptyStateText: TextStyle;
    createRouteFloatingButton: ViewStyle;
    createRouteButtonText: TextStyle;
    routeItemDeleteAction: ViewStyle;
}

interface FormattedRoute {
    id: string;
    label: string;
    createDate: string | number | Date;
}

/** parameter navigation is named in this way because we use method .closeDrawer(),
 * this is the only way to use that by parse data in param
 * navigation come from DrawerContentComponentProps by @react-navigation/drawer */
export default function DrawerContent({navigation}: DrawerContentComponentProps) {
    const dispatch = useAppDispatch()
    const routeList = useAppSelector(selectRouteList);
    const userStartAddress = useAppSelector(selectUserStartAddress);
    const [routeListDataConvertor, setAddressListDataConvertor] = useState<
        FormattedRoute[]
    >([]);

    const handleRoutePress = useCallback(
        async (listId: string) => {

            try {
                await fetchAddressesForSelectedList(listId, userStartAddress, dispatch);
                navigation.closeDrawer();
            } catch (error) {
                console.error('Error fetching addresses:', error);
            }
        },
        [dispatch, navigation, userStartAddress],
    );

    const handleRemoveList = useCallback(
        async (list_id: string) => {
            const user_id = await getUserId();
            try {
                await deleteAllStopDetails(list_id);
                await deleteRouteListByListId(list_id, user_id);
                const updatedList = await getUserAddressList(user_id);

                dispatch(setAddressList([]));
                dispatch(setAddressDetailsList([]));
                dispatch(setAddressListId(''));
                dispatch(setRouteList(updatedList));
            } catch (error) {
                console.error('Failed to refresh list:', error);
            }
        },
        [dispatch],
    );

    const renderItem = useCallback(
        ({item}: { item: FormattedRoute }) => (
            <TouchableOpacity
                style={styles.routeItemButton}
                onPress={() => handleRoutePress(item.id)}
                activeOpacity={0.8}
            >
                <View style={styles.routeItemIconBox}>
                    <Icon name="map-marker" size={24} color="white"/>
                </View>
                <View style={styles.routeItemTextSection}>
                    <Text style={styles.routeItemTitle}>{item.label}</Text>
                    <Text style={styles.routeItemDate}>
                        <Icon name="calendar" size={14} color="gray"/>
                        {` ${new Date(item.createDate).toLocaleDateString()}`}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => handleRemoveList(item.id)}
                    style={styles.routeItemDeleteAction}
                >
                    <Icon name="trash" size={20} color="#d9534f"/>
                </TouchableOpacity>
                <Icon name="chevron-right" size={18} color="green"/>
            </TouchableOpacity>
        ),
        [handleRoutePress, handleRemoveList],
    );

    const renderSeparator = useCallback(
        () => <View style={styles.listSeparator}/>,
        [],
    );

    useEffect(() => {
        if (Array.isArray(routeList)) {
            const formattedList: FormattedRoute[] = routeList.map(item => ({
                id: item.id,
                label: item.list_name,
                createDate: item.createdAt || new Date(),
            }));
            setAddressListDataConvertor(formattedList);
        }
        if (routeList.length === 0) {
            dispatch(setAddressList([]));
        }
    }, [dispatch, routeList]);

    return (
        <SafeAreaView style={styles.drawerMainContainer}>
            {routeListDataConvertor.length >= 1 ? (
                <FlatList
                    data={routeListDataConvertor}
                    keyExtractor={item => item.id}
                    ItemSeparatorComponent={renderSeparator}
                    renderItem={renderItem}
                    contentContainerStyle={styles.scrollableListArea}
                />
            ) : (
                <View style={styles.emptyStateContainer}>
                    <Icon name="inbox" size={60} color="#e0e0e0"/>
                    <Text style={styles.emptyStateText}>No routes available</Text>
                    <Text style={styles.emptyStateText}>Create a Route</Text>
                </View>
            )}

            <TouchableOpacity
                onPress={() => navigation.navigate('ListScreen')}
                style={styles.createRouteFloatingButton}
            >
                <Icon name="plus" size={24} color="white"/>
                <Text style={styles.createRouteButtonText}>Create Route</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create<IStyles>({
    drawerMainContainer: {
        flex: 1,

        backgroundColor: '#f8f9fa',
    },

    routeItemButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginHorizontal: 15,
        marginBottom: 8,

        backgroundColor: '#caeaeb',
        borderRadius: 12,

        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 4,

        elevation: 2,
    },

    routeItemIconBox: {

        padding: 12,
        marginRight: 16,

        backgroundColor: '#007bff',
        borderRadius: 12,
    },

    routeItemTextSection: {
        flex: 1,
        paddingRight: 16,
    },

    routeItemTitle: {
        marginBottom: 4,

        fontSize: 16,
        fontWeight: '600',
        color: '#2c3e50',
    },

    routeItemDate: {
        fontSize: 14,
        color: 'black',
    },

    listSeparator: {
        height: 8,

        backgroundColor: 'transparent',
    },

    scrollableListArea: {
        paddingBottom: 120,
        paddingTop: 70,
    },

    emptyStateContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },

    emptyStateText: {
        marginTop: 16,
        textAlign: 'center',

        fontSize: 18,
        color: '#95a5a6',
    },

    createRouteFloatingButton: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,

        backgroundColor: '#4CAF50',
        borderRadius: 30,

        elevation: 4,
    },

    createRouteButtonText: {
        marginLeft: 12,

        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },

    routeItemDeleteAction: {
        marginRight: 8,
    },
});
