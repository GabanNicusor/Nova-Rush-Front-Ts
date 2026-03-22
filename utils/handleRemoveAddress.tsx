import {setAddressDetailsList, setAddressList, setAddressListOrder,} from '@/state/navSlice';

import {AppDispatch} from "@/state/store"
import {AddressItemComplete} from '@/types/Address/AddressType';
import {CustomAddressDetailsItem} from '@/types/AddressDetails/CustomAddressDetails';
import {StopOrderItem} from "@/types/StopOrder/StopOrder";

import deleteAddressFromList from '../service/RouteAddressList/Delete/deleteAddressFromList';
import deleteAddressFromRouteStop from '../service/StopOrder/Delete/deleteAddressFromRouteStop';
import getAddressesByListId from '../service/RouteAddressList/Get/getAddressesByListId';
import getStopOrder from '../service/StopOrder/Get/getStopOrder';

import fetchAddressDetails from '../service/AddressDetails/Fetch/fetchAddressDetails';
import getUserId from '../service/User/Get/getUserId';
import deleteStopDetails from '../service/StopDetails/Delete/deleteStopDetails';


type AddressId = string;
type ListId = string;
type UserId = string;

type GetAddressesByListIdResult = AddressItemComplete[];
type FetchAddressDetailsResult = CustomAddressDetailsItem[];

export default async function handleRemoveAddress(
    address_id: AddressId,
    list_id: ListId,
    userStartAddress: AddressItemComplete | undefined,
    dispatch: AppDispatch,
): Promise<void> {

    const user_id: UserId = await getUserId();

    try {
        await deleteStopDetails(address_id, list_id);
        await deleteAddressFromList(list_id, address_id);
        await deleteAddressFromRouteStop(list_id, address_id);

        const addressList: GetAddressesByListIdResult = await getAddressesByListId(
            list_id,
        );
        const stopOrder: StopOrderItem[] | undefined = await getStopOrder(list_id);
        dispatch(setAddressList(addressList ?? []));
        dispatch(setAddressListOrder(stopOrder ?? []));

        const addressDetailsList: FetchAddressDetailsResult =
            await fetchAddressDetails(addressList, userStartAddress, user_id, list_id);

        dispatch(setAddressDetailsList(addressDetailsList ?? []));

    } catch (error) {
        console.error("Failed to update address list:", error);
    }
};
