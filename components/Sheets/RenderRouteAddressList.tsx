import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
    TextStyle,
} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../state/store';


// External
import Icon from 'react-native-vector-icons/FontAwesome';
import {ScaleDecorator} from 'react-native-draggable-flatlist';

// Redux
import {
    selectAddressListId,
    setAddressDetailsIndexSelected,
    setIsAddressPressesForDetails,
    setAddressList,
} from '../../state/navSlice';


// Utils
import handleRemoveAddress from '../../utils/handleRemoveAddress';

//hook
import {useIsNewStop} from "../../hooks/useIsNewStop"
import {AddressItemComplete} from '../../types/Address/AddressType'
import fetchAddressesForSelectedList from "../../service/Address/Fetch/fetchAddressesForSelectedList";

// --- Interfaces ---
interface RenderRouteAddressListProps {
    item: AddressItemComplete;
    index: number;
    drag: () => void;
    isActive: boolean;
}

// --- Component ---

const RenderRouteAddressList: React.FC<RenderRouteAddressListProps> = ({
                                                                           item,
                                                                           index,
                                                                           drag,
                                                                           isActive,
                                                                       }) => {

    const dispatch = useAppDispatch();
    const addressListId = useAppSelector(selectAddressListId); // Top-level

    const isNewStop = useIsNewStop(item.id);

    const handleAddressDetails = async (): Promise<void> => {
        if (!addressListId) return; // Safety check

        // Fetch the latest addresses for this list
        await fetchAddressesForSelectedList(addressListId, dispatch);

        // Show BottomSheet and select index
        dispatch(setIsAddressPressesForDetails(true));
        dispatch(setAddressDetailsIndexSelected(index));
    };

    return (
        <ScaleDecorator>
            <TouchableOpacity
                onLongPress={drag}
                onPress={handleAddressDetails}
                disabled={isActive}
                style={[
                    styles.routeItemCard,
                    // Replaced inline background logic with StyleSheet references
                    isActive ? styles.routeItemActiveBg : styles.routeItemInactiveBg,
                    isNewStop && styles.routeItemNewStopBorder,
                ]}
            >
                <View style={styles.routeItemLeftSection}>
                    <View style={styles.routeItemIndexCircle}>
                        <Text style={styles.routeItemIndexText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.routeItemAddressText} numberOfLines={2}>
                        {item.address_complete}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={() =>
                        handleRemoveAddress(item.id, addressListId || '', dispatch)
                    }
                    style={styles.routeItemDeleteButton}
                >
                    <Icon name="trash" size={20} color="#d9534f"/>
                </TouchableOpacity>
            </TouchableOpacity>
        </ScaleDecorator>
    );
};

// --- Styles ---

const styles = StyleSheet.create({
    routeItemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 19,
        marginVertical: 8,
        marginHorizontal: 18,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    } as ViewStyle,
    // Added these to solve the ESLint "no-inline-styles" error
    routeItemActiveBg: {
        backgroundColor: '#23c9cf',
    } as ViewStyle,
    routeItemInactiveBg: {
        backgroundColor: '#caeaeb',
    } as ViewStyle,
    routeItemLeftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    } as ViewStyle,
    routeItemIndexCircle: {
        width: 30,
        height: 30,
        borderRadius: 10,
        backgroundColor: '#007bff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    } as ViewStyle,
    routeItemIndexText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    } as TextStyle,
    routeItemAddressText: {
        fontSize: 16,
        color: '#333',
        flexShrink: 1,
    } as TextStyle,
    routeItemDeleteButton: {
        padding: 8,
    } as ViewStyle,
    routeItemNewStopBorder: {
        borderWidth: 2,
        borderColor: 'red',
        borderStyle: 'dashed',
    } as ViewStyle,
});

export default RenderRouteAddressList;
