import {StopOrderItem} from '@/types/StopOrder/StopOrder';
import {AddressItemComplete} from '@/types/Address/AddressType'

export interface RouteStopListItem {
    address_id: string;
    new_stop: boolean;
}

type NewStopMap = Record<string, boolean>;

export default function convertAddressListToRouteStopList(
    oldOrderedList: StopOrderItem[],
    newOrderedList: AddressItemComplete[],
): StopOrderItem[] {

    try {
        const originalOrderMap: NewStopMap = oldOrderedList.reduce(
            (acc, {address_id, new_stop}) => {
                acc[address_id] = new_stop;
                return acc;
            },
            {} as NewStopMap,
        );

        return newOrderedList.map((address: AddressItemComplete) => ({
            address_id: address.id,
            new_stop: originalOrderMap[address.id] ?? true,
        }));
    } catch (error) {
        console.error(
            'Error creating RouteStop List in convertAddressListToRouteStopList:',
            error,
        );
        return [];
    }
};
