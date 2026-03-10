import React from 'react';
import {StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle} from 'react-native';
import {useAppDispatch, useAppSelector} from '@/state/store';

import Icon from 'react-native-vector-icons/FontAwesome';
import {ScaleDecorator} from 'react-native-draggable-flatlist';

import {
    selectAddressListId,
    selectUserStartAddress,
    setAddressDetailsIndexSelected,
    setIsAddressPressesForDetails
} from '@/state/navSlice';

import handleRemoveAddress from '../../utils/handleRemoveAddress';

import {useIsNewStop} from "@/hooks/useIsNewStop"
import {AddressItemComplete} from '@/types/Address/AddressType'
import fetchAddressesForSelectedList from "../../service/Address/Fetch/fetchAddressesForSelectedList";

interface IStyles {
    routeItemCard: ViewStyle;
    routeItemActiveBg: ViewStyle;
    routeItemInactiveBg: ViewStyle;
    routeItemLeftSection: ViewStyle;
    routeItemIndexCircle: ViewStyle;
    routeItemIndexText: TextStyle;
    routeItemAddressText: TextStyle;
    routeItemDeleteButton: ViewStyle;
    routeItemNewStopBorder: ViewStyle;
}

interface RenderRouteAddressListProps {
    item: AddressItemComplete;
    index: number;
    drag?: () => void;

    isActive: boolean;
}


export default function RenderRouteAddressList({item, index, drag, isActive}: RenderRouteAddressListProps) {
    const dispatch = useAppDispatch();
    const addressListId = useAppSelector(selectAddressListId);
    const userStartAddress = useAppSelector(selectUserStartAddress);

    const isNewStop = useIsNewStop(item.id);

    const handleAddressDetails = async (): Promise<void> => {
        if (!addressListId) return;
        await fetchAddressesForSelectedList(addressListId, userStartAddress, dispatch);
        dispatch(setIsAddressPressesForDetails(true));
        dispatch(setAddressDetailsIndexSelected(index));
    };

    const content = (
        <TouchableOpacity
            onLongPress={drag}
            onPress={handleAddressDetails}
            disabled={isActive}
            style={[
                styles.routeItemCard,
                isActive ? styles.routeItemActiveBg : styles.routeItemInactiveBg,
                isNewStop && styles.routeItemNewStopBorder,
            ]}
        >
            <View style={styles.routeItemLeftSection}>
                <View style={[
                    styles.routeItemIndexCircle,
                    index === 0 && {backgroundColor: '#28a745'} // Green for Home/Start
                ]}>
                    <Text style={styles.routeItemIndexText}>
                        {index === 0 ? 'H' : index}
                    </Text>
                </View>
                <Text style={styles.routeItemAddressText} numberOfLines={2}>
                    {item.address_complete}
                </Text>
            </View>

            {index !== 0 && (
                <TouchableOpacity
                    onPress={() =>
                        handleRemoveAddress(item.id, addressListId || '', userStartAddress, dispatch)
                    }
                    style={styles.routeItemDeleteButton}
                >
                    <Icon name="trash" size={20} color="#d9534f"/>
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );

    if (!drag) {
        return content;
    }

    return <ScaleDecorator>{content}</ScaleDecorator>;
};

const styles = StyleSheet.create<IStyles>({
    routeItemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginVertical: 8,
        marginHorizontal: 18,

        borderRadius: 19,

        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 2,

        elevation: 3,
    },

    routeItemActiveBg: {
        backgroundColor: '#23c9cf',
    },

    routeItemInactiveBg: {
        backgroundColor: '#caeaeb',
    },

    routeItemLeftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    routeItemIndexCircle: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,

        borderRadius: 10,
        backgroundColor: '#007bff',
    },

    routeItemIndexText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

    routeItemAddressText: {
        flexShrink: 1,

        fontSize: 16,
        color: '#333',
    },

    routeItemDeleteButton: {
        padding: 8,
    },

    routeItemNewStopBorder: {
        borderWidth: 2,
        borderColor: 'red',
        borderStyle: 'dashed',
    },
});
