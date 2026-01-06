import React, { useEffect } from 'react';
import { Polyline, Marker } from 'react-native-maps';
import {useAppDispatch, useAppSelector} from "../../state/store"

import {
  selectAddressListId,
  selectMarkers,
  selectPolylineCoordsList,
  selectUserLocation,
  setPolylineCoordsList,
} from '../../state/navSlice';

//Service
import getShorterPolyline from '../../service/Map/Get/getShorterPolyline';
import postCalculateAndDisplayRoute from '../../service/Map/Post/postCalculateAndDisplayRoute';

//Utils
import getDistanceBetweenTwoAddresses from '../../utils/Map/getDistanceBetweenTwoAddresses';

//Components
import ArrowIndicator from '../SvgImages/ArrowIndicator';

import { AddressItemComplete } from '../../types/Address/AddressType';

// --- Type Definitions ---

// Basic structure for any geographical coordinate
interface Coordinate {
  latitude: number;
  longitude: number;
  accuracy: boolean;
}

// Structure for the map markers (used by the selector)
interface MarkerItem {
  title: string;
  longitude: number;
  latitude: number;
}

interface  AddressItemProp {
  address: AddressItemComplete[];
}

const RoutePolyline: React.FC<AddressItemProp>  = ({address}) => {
  // Type the dispatcher
  const dispatch = useAppDispatch();

  // Type the selectors based on defined interfaces and Redux state structure
  const markers: MarkerItem[] = useAppSelector(selectMarkers);
  // Polyline coordinates are an array of Coordinate objects
  const routeCoordinates: Coordinate[] = useAppSelector(selectPolylineCoordsList);
  // User location is also a Coordinate object
  const userLocation: Coordinate | null = useAppSelector(selectUserLocation);
  // addressListId is assumed to be a string
  const addressListId: string | '' = useAppSelector(selectAddressListId);

  // --- 1. Dynamic Route Clipping/Shortening Effect (Runs every 4 seconds) ---
  useEffect(() => {
    // Ensure userLocation is available before running the logic
    if (!userLocation || !addressListId) return;

    const updatePolyline = async () => {
      // Only clip the polyline if coordinates exist
      if (routeCoordinates.length === 0) return;

      const speed = 51; // Current speed in km/h (assumed constant for this logic)

      // This utility finds the next few nodes in the polyline relevant to the user's current position
      // We assume getDistanceBetweenTwoAddresses returns an array of objects like {index: number, distance: number}
      const relevantNodes = getDistanceBetweenTwoAddresses(
        userLocation,
        routeCoordinates,
        speed,
      );

      // relevantNodes structure is assumed to be [{index: number, ...}, ...]
      if (relevantNodes.length === 0) return;

      try {
        // Determine the starting index for clipping (the nearest unvisited node)
        const startIndex = relevantNodes[0]?.index || 0;

        const clippedNodes = await getShorterPolyline(
          routeCoordinates,
          startIndex, // index where clipping should start
          addressListId,
        );

        dispatch(setPolylineCoordsList(clippedNodes));
      } catch (error) {
        console.error('Error in GetShorterPolyline:', error);
      }
    };

    const intervalId = setInterval(() => {
      updatePolyline().catch(error => console.error('Interval error:', error));
    }, 4000); // Runs every 4 seconds

    // Cleanup function for the interval
    return () => clearInterval(intervalId);
  }, [userLocation, routeCoordinates, addressListId, dispatch]);
  // Dependencies are explicitly listed and correctly typed

  // --- 2. Initial Route Calculation Effect (Runs when address list changes) ---
  useEffect(() => {
    const fetchAndCalculateRoute = async () => {

      // Only calculate if there is at least one address
      if (address.length >= 1) {
        try {
          // postCalculateAndDisplayRoute takes the address list and dispatch function
          await postCalculateAndDisplayRoute(address, dispatch);
        } catch (error) {
          console.error('Error fetching or calculating route:', error);
        }
      }
    };

    fetchAndCalculateRoute().then(); // Execute the async function
  }, [address, dispatch]); // Dependencies: address list (props) and dispatch

  // --- Render ---

  // Ensure we have at least two coordinates to determine the current position and the next node for the arrow
  const hasEnoughCoords = routeCoordinates?.length >= 2;

  return (
    <>
      {/* Render the main route polyline */}
      {routeCoordinates?.length > 0 && (
        <Polyline
          coordinates={routeCoordinates}
          strokeColor="#FF0000" // Red
          strokeWidth={10}
        />
      )}

      {/* Render all destination markers */}
      {markers.map((marker, index) => (
        <Marker
          key={index}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          title={marker.title}
        />
      ))}

      {/* Render the Arrow Indicator at the current user position (the first point in the clipped route) */}
      {hasEnoughCoords && (
        <Marker
          coordinate={routeCoordinates[0]}
          flat={true} // Ensures the marker rotates correctly with the map
        >
          <ArrowIndicator
            currentNode={routeCoordinates[0]}
            nextNode={routeCoordinates[1]}
          />
        </Marker>
      )}
    </>
  );
};

export default RoutePolyline;
