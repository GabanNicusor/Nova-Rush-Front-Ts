import polyline from '@mapbox/polyline';
import {AppDispatch} from '@/state/store';

import convertAddressListToRouteStopList from '../../../utils/Map/convertAddressListToRouteStopList';
import convertCurrentAddressesToStopList from '../../../utils/Map/convertCurrentAddressesToStopList';

import {createOrUpdateRoutePath} from '../../Map/Create/createOrUpdateRoutePath';
import fetchAddressesForSelectedList from '../../Address/Fetch/fetchAddressesForSelectedList';
import updateRouteAddressList from '../../RouteAddressList/Update/updateRouteAddressList';
import {AddressItemComplete} from '@/types/Address/AddressType';
import {StopOrderItem} from '@/types/StopOrder/StopOrder';

interface Coordinate {
    latitude: number;
    longitude: number;
}

type RouteId = string;
type UserId = string;


export default async function updateStopOrder(
    oldOrderedList: StopOrderItem[] | [],
    userStartAddress: AddressItemComplete | undefined,
    allCoords: Coordinate[],
    userId: UserId,
    listId: RouteId,
    newOrderedList: AddressItemComplete[] | undefined,
    isAddressListManuallySet: boolean,
    dispatch: AppDispatch,
): Promise<void> {

    if (
        !newOrderedList ||
        newOrderedList.length === 0
    ) {
        console.log('Skipping updateStopOrder due to missing data');
        return;
    }

    let encodedPolyline: string = '';

    if (allCoords && allCoords.length > 0) {
        encodedPolyline = polyline.encode(
            allCoords.map(({ latitude, longitude }) => [latitude, longitude])
        );
    }

    let addressIdsInOrder: StopOrderItem[];

    if (oldOrderedList && oldOrderedList.length > 0) {
        addressIdsInOrder = convertAddressListToRouteStopList(
            oldOrderedList,
            newOrderedList,
        );
    } else {
        addressIdsInOrder = convertCurrentAddressesToStopList(newOrderedList);
    }

    try {
        await updateRouteAddressList(addressIdsInOrder, listId);

        await fetchAddressesForSelectedList(listId, userStartAddress, isAddressListManuallySet,  dispatch);

        if (encodedPolyline.length > 0 && addressIdsInOrder.length > 0) {
            await createOrUpdateRoutePath(
                encodedPolyline,
                addressIdsInOrder,
                userId,
                listId,
            );
        }
    } catch (error) {
        console.error('Error during route stop order update:', error);
    }
};
