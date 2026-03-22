import getAddressesByListId from '../../RouteAddressList/Get/getAddressesByListId';
import getStopOrder from '../../StopOrder/Get/getStopOrder';
import {
    setAddressDetailsList,
    setAddressList,
    setAddressListId,
    setAddressListOrder,
    setPolylineCoordsList,
} from '@/state/navSlice';
import convertCurrentAddressesToStopList from '../../../utils/Map/convertCurrentAddressesToStopList';
import fetchAddressDetails from '../../AddressDetails/Fetch/fetchAddressDetails';
import getUserId from '../../User/Get/getUserId';
import {handleApiError} from '@/utils/apiErrorHandler';

import {AppDispatch} from '@/state/store';
import {AddressItemComplete} from '@/types/Address/AddressType'
import {StopOrderItem} from '@/types/StopOrder/StopOrder';

export default async function fetchAddressesForSelectedList(
    ListId: string,
    userStartAddress: AddressItemComplete | undefined,
    isAddressListManuallySet: boolean,
    dispatch: AppDispatch,
): Promise<void> {
    try {
        const addressFromListAddress: AddressItemComplete[] = await getAddressesByListId(ListId);
        const stop: StopOrderItem[] | undefined = await getStopOrder(
            ListId,
        );

        const user_id: string | null = await getUserId();

        if (user_id === null) {
            console.error('User ID is required but was not found.');
        }
        if (Array.isArray(stop) && stop.length > 0) {
            dispatch(setAddressListOrder(stop));
        } else {
            const generateOrder: StopOrderItem[] = convertCurrentAddressesToStopList(addressFromListAddress);
            dispatch(setAddressListOrder(generateOrder));
        }

        dispatch(
            setAddressDetailsList(
                await fetchAddressDetails(addressFromListAddress, userStartAddress, user_id as string, ListId),
            ),
        );

        if (!isAddressListManuallySet) {
            dispatch(setAddressList(addressFromListAddress));
        }
        dispatch(setPolylineCoordsList([]));
        dispatch(setAddressListId(ListId));
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
