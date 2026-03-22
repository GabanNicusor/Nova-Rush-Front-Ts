import React from 'react';
import {Marker} from 'react-native-maps';
import ExpandableMarker from "@/components/Map/ExpandableMarker";
import {AddressItemComplete} from "@/types/Address/AddressType";
import {OrderType} from "@/types/enums/OrderType";

interface SearchedAddressMarkerProps {
    index: number;
    address: AddressItemComplete;
    selectedMarkerId: string | null;
    isAnimating?: boolean;
    onPress: () => void;
}

export default function SearchedAddressMarker({
                                                  index,
                                                  address,
                                                  selectedMarkerId,
                                                  isAnimating,
                                                  onPress,
                                              }: SearchedAddressMarkerProps) {
    return (
        <Marker
            key={address?.id}
            coordinate={{latitude: address.latitude, longitude: address.longitude}}
            onPress={onPress}
            anchor={{x: 0.5, y: 1}}
            tracksViewChanges={selectedMarkerId === address.id || isAnimating}
        >
            <ExpandableMarker
                is_selected={selectedMarkerId === address.id}
                stop_number={index}
                delivery_state={OrderType.DELIVERY}
            />
        </Marker>
    );
};
