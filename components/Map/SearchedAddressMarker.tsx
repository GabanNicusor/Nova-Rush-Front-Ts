import React from 'react';
import { Marker } from 'react-native-maps';

// --- Type Definitions ---

// Basic structure for any geographical coordinate
interface Coordinate {
  latitude: number;
  longitude: number;
}

// Props for the SearchedAddressMarker component
interface SearchedAddressMarkerProps {
  destination: Coordinate; // The coordinates where the marker should be placed
  address: string; // The text displayed as the marker's title
}

// ---

const SearchedAddressMarker: React.FC<SearchedAddressMarkerProps> = ({
  destination,
  address,
}) => {
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

export default SearchedAddressMarker;
