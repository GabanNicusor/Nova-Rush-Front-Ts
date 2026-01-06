import getAddressesByListId from '../../RouteAddressList/Get/getAddressesByListId';
import getStopOrder from '../../StopOrder/Get/getStopOrder';
import {
    setAddressDetailsList,
    setAddressList,
    setAddressListId,
    setAddressListOrder,
    setMarkers,
    setPolylineCoordsList,
} from '../../../state/navSlice';
import convertCurrentAddressesToStopList from '../../../utils/Map/convertCurrentAddressesToStopList';
import fetchAddressDetails from '../../AddressDetails/Fetch/fetchAddressDetails';
import getUserId from '../../User/Get/getUserId';
import {handleApiError} from '../../../utils/apiErrorHandler';

import {AppDispatch} from '../../../state/store';
import {AddressItemComplete} from '../../../types/Address/AddressType'
import {StopOrderItem} from '../../../types/StopOrder/StopOrder';

const fetchAddressesForSelectedList = async (
    ListId: string, // Explicitly type the input object
    dispatch: AppDispatch, // Explicitly type the dispatch function
): Promise<void> => {
    // The function is async and doesn't return data on success
    try {
        // 1. Fetch initial data
        const addressFromListAddress: AddressItemComplete[] = await getAddressesByListId(ListId);
        const stop: StopOrderItem[] | undefined = await getStopOrder(
            ListId,
        );

        const user_id: string | null = await getUserId();

        // Type check before using `user_id`
        if (user_id === null) {
            console.error('User ID is required but was not found.');
        }
        // 2. Determine Stop Order (Handle empty/missing stop order gracefully)
        if (Array.isArray(stop) && stop.length > 0) {
            dispatch(setAddressListOrder(stop));
        } else {
            const generateOrder: StopOrderItem[] = convertCurrentAddressesToStopList(addressFromListAddress);
            dispatch(setAddressListOrder(generateOrder));
        }

        // 3. Fetch Details and Dispatch State Updates
        // Fetch details requires the address list, user_id (if not null), and list ID
        dispatch(
            setAddressDetailsList(
                await fetchAddressDetails(
                    addressFromListAddress,
                    user_id as string,
                    ListId,
                ),
            ),
        );
        dispatch(setAddressList(addressFromListAddress));
        // Reset route/map state for the new list
        dispatch(setPolylineCoordsList([])); // Assuming [] is the correct type for reset
        dispatch(setMarkers([])); // Assuming [] is the correct type for reset
        dispatch(setAddressListId(ListId));
    } catch (error) {
        // The error handler from your utilities
        handleApiError(error);
        throw error;
    }
};

export default fetchAddressesForSelectedList;
