import React from 'react';
import ArrowIcon from './ArrowIcon';

interface CoordinateNode {
    latitude: number;
    longitude: number;
}

interface ArrowIndicatorProps {
    currentNode: CoordinateNode | null | undefined;
    nextNode: CoordinateNode | null | undefined;
}

export default function ArrowIndicator({
                                           currentNode,
                                           nextNode,
                                       }: ArrowIndicatorProps) {
    const calculateBearing = (
        user: CoordinateNode,
        target: CoordinateNode,
    ): number => {

        const lat1 = (user.latitude * Math.PI) / 180;
        const lat2 = (target.latitude * Math.PI) / 180;
        const deltaLon = ((target.longitude - user.longitude) * Math.PI) / 180;

        const y = Math.sin(deltaLon) * Math.cos(lat2);
        const x =
            Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);

        let bearing = (Math.atan2(y, x) * 180) / Math.PI;

        return (bearing + 360) % 360;
    };

    const angle =
        currentNode && nextNode ? calculateBearing(currentNode, nextNode) : 0;

    return <ArrowIcon yaw={angle} width={40} height={40}/>;
};
