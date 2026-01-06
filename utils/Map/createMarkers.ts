// --- Type Definitions (Imported or Defined Here) ---

import { MarkerItem } from '../../types/Marker/MarkerType';

interface InputAddress {
  latitude: number;
  longitude: number;
}

const createMarkers = (
  addresses: InputAddress[], // Explicitly type the input array
): MarkerItem[] => {
  // Explicitly type the return array

  // Check for null/undefined or empty array
  if (!addresses || addresses.length === 0) {
    return [];
  }

  const markers: MarkerItem[] = [];

  // --- Start point ---
  markers.push({
    latitude: addresses[0].latitude,
    longitude: addresses[0].longitude,
    title: 'Start',
  });

  // --- Intermediate stops ---
  // Loop from the second address (index 1) up to, but NOT including, the last address
  for (let i = 1; i < addresses.length - 1; i++) {
    markers.push({
      latitude: addresses[i].latitude,
      longitude: addresses[i].longitude,
      title: `Stop ${i + 1}`,
    });
  }

  // --- End point (only if more than one address) ---
  if (addresses.length > 1) {
    const last = addresses[addresses.length - 1];
    markers.push({
      latitude: last.latitude,
      longitude: last.longitude,
      title: 'End',
    });
  }

  return markers;
};

export default createMarkers;
