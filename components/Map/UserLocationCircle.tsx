import React from 'react';
import { Circle, LatLng } from 'react-native-maps'; // LatLng is the standard type for coordinates in react-native-maps

// --- Type Definitions ---

// LatLng interface (often imported directly from 'react-native-maps', but defining it here for clarity)
interface Coordinate extends LatLng {
  latitude: number;
  longitude: number;
}

// Props for the UserLocationCircle component
interface UserLocationCircleProps {
  userLocation: Coordinate; // The center of the circle (user's location)
  accuracy: boolean; // The radius of the circle (location accuracy in meters)
}

// ---

const UserLocationCircle: React.FC<UserLocationCircleProps> = ({
  userLocation,
  accuracy,
}) => {
  return (
    <Circle
      center={userLocation} // center expects LatLng/Coordinate
      radius={50} // radius expects a number (in meters)
      strokeColor="rgba(0, 0, 255, 0.2)" // Light blue stroke
      fillColor="rgba(0, 0, 255, 0.4)" // Blue fill
    />
  );
};

export default UserLocationCircle;
