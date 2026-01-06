// --- Type Definitions ---

// Basic coordinate structure for user location and nodes
interface Coordinate {
  latitude: number;
  longitude: number;
}

// Structure for a node (stop/address)
interface Node extends Coordinate {
  // Nodes likely have other properties, but these are the ones used
  // id: string;
  [key: string]: any; // Allow any other properties
}

// Structure for the calculated distance result
interface DistanceResult {
  index: number; // Original index in the 'nodes' array
  distance: number; // Haversine distance in kilometers (or chosen unit)
}

// ---

import haversineDistanceBetweenTwoCoordinates from './haversineDistanceBetweenTwoCoordinates';

const GetDistanceBetweenTwoAddresses = (
  userLocation: Coordinate,
  nodes: Node[],
  speed: number,
): DistanceResult[] => {
  if (nodes.length === 0) {
    return [];
  }

  // 1. Calculate and Sort Distances
  // @ts-ignore
  const distances: DistanceResult[] = nodes.map((node, index) => ({
    index,
    distance: haversineDistanceBetweenTwoCoordinates(
      userLocation.latitude,
      userLocation.longitude,
      node.latitude,
      node.longitude,
    ),
  }));

  // Sort nodes by distance (ascending)
  distances.sort((a, b) => a.distance - b.distance);

  const nearestDistance = distances[0].distance; // Distance to the closest node

  // 2. Apply Lookahead Logic (Corrected)

  // Scenario 1: Close to the end of the route
  if (nodes.length <= 5 && nearestDistance <= 30) {
    // Fewer than 5 nodes remaining AND nearest node is within 30 units: Calculate to next node
    return distances.slice(0, 1); // Return only the next (closest) node
  }

  // Scenario 2: Speed-based lookahead
  else if (speed <= 50 && nearestDistance <= 50) {
    // City speed (<= 50) AND nearest node is within 50 units: Calculate to next node
    return distances.slice(0, 1); // Changed from slice(1) to slice(0, 1) as slice(1) skips the closest node
  } else if (speed > 50 && speed <= 100 && nearestDistance <= 100) {
    // Moderate speed: Calculate to 2nd closest node
    return distances.slice(0, 2); // Return 1st and 2nd closest nodes (to calculate to 2nd)
  } else if (speed > 100 && nearestDistance <= 150) {
    // High speed: Calculate to 3rd closest node
    return distances.slice(0, 3); // Return 1st, 2nd, and 3rd closest nodes (to calculate to 3rd)
  } else {
    // Default: If conditions are not met, return the closest node (or all distances if you truly need them)
    // Returning only the closest node is usually safer for routing algorithms.
    return distances.slice(0, 1);
  }
};

export default GetDistanceBetweenTwoAddresses;
