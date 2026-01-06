import React from 'react';
import ArrowIcon from './ArrowIcon';

// --- Interfaces ---

/** * Represents a geographical point.
 * Using a partial or flexible interface depending on your API structure.
 */
interface CoordinateNode {
  latitude: number;
  longitude: number;
}

interface ArrowIndicatorProps {
  currentNode: CoordinateNode | null | undefined;
  nextNode: CoordinateNode | null | undefined;
}

// --- Component ---

const ArrowIndicator: React.FC<ArrowIndicatorProps> = ({
  currentNode,
  nextNode,
}) => {
  /**
   * Calculates the initial bearing (forward azimuth) between two points.
   * @param user - The starting coordinate
   * @param target - The destination coordinate
   * @returns Bearing in degrees (0-360)
   */
  const calculateBearing = (
    user: CoordinateNode,
    target: CoordinateNode,
  ): number => {
    // Convert degrees to radians
    const lat1 = (user.latitude * Math.PI) / 180;
    const lat2 = (target.latitude * Math.PI) / 180;
    const deltaLon = ((target.longitude - user.longitude) * Math.PI) / 180;

    const y = Math.sin(deltaLon) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);

    let bearing = (Math.atan2(y, x) * 180) / Math.PI;

    // Normalize to 0-360
    return (bearing + 360) % 360;
  };

  // Determine the angle, defaulting to 0 if nodes are missing
  const angle =
    currentNode && nextNode ? calculateBearing(currentNode, nextNode) : 0;

  return <ArrowIcon yaw={angle} width={40} height={40} />;
};

export default ArrowIndicator;
