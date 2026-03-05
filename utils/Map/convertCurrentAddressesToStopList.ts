interface CurrentAddressItem {
    id: string;
}

export interface RouteStopListItem {
    address_id: string;
    new_stop: boolean;
}

export default function convertCurrentAddressesToStopList(
    addresses: CurrentAddressItem[] | any
): RouteStopListItem[] {

    if (!Array.isArray(addresses)) {
        console.warn('Input to convertCurrentAddressesToStopList was not an array.');
        return [];
    }

    return addresses.map((address: CurrentAddressItem) => ({
        address_id: address.id,
        new_stop: false,
    }));
}
