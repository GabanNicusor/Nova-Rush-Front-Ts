import {useAppSelector} from '@/state/store';
import {selectAddressListOrder} from '@/state/navSlice';
import {StopOrderItem} from '@/types/StopOrder/StopOrder';

type AddressId = string;

export function useIsNewStop(addressId: AddressId): boolean {
    const stops = useAppSelector(
        selectAddressListOrder
    ) as StopOrderItem[] | undefined;

    return !!stops?.find(
        stop => stop.address_id === addressId && stop.new_stop,
    );
};
