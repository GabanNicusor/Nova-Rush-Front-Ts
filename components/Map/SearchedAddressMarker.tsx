import React from 'react';
import {Marker} from 'react-native-maps';

interface Coordinate {
    latitude: number;
    longitude: number;
}

interface SearchedAddressMarkerProps {
    destination: Coordinate;
    address: string;
}

export default function SearchedAddressMarker({
                                                  destination,
                                                  address,
                                              }: SearchedAddressMarkerProps) {
    return (
        <Marker
            coordinate={{
                latitude: destination.latitude,
                longitude: destination.longitude,
            }}
            title={address}
        />
    );
};
