import {Polyline} from 'react-native-maps';

import {AddressItemComplete} from '@/types/Address/AddressType';
import useRoutePolyline from "@/hooks/useRoutePolyline";

interface AddressItemProp {
    address: AddressItemComplete[];
}

export default function RoutePolyline({address}: AddressItemProp) {
    const {routeCoordinates} = useRoutePolyline(address);

    if (routeCoordinates.length === 0)  return null;

    return (
        <>
            {routeCoordinates?.length > 0 && (
                <Polyline
                    coordinates={routeCoordinates}
                    strokeColor="#0050FF" // Red
                    strokeWidth={6}
                    tappable={false}
                />
            )}
        </>
    );
}
