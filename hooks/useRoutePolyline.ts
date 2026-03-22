import {useAppDispatch, useAppSelector} from "@/state/store";
import {
    selectAddressListId,
    selectPolylineCoordsList,
    selectUserLocation,
    setPolylineCoordsList
} from "@/state/navSlice";
import {useEffect, useState} from "react";
import getDistanceBetweenTwoAddresses from "@/utils/Map/getDistanceBetweenTwoAddresses";
import getShorterPolyline from "@/service/Map/Get/getShorterPolyline";
import postCalculateAndDisplayRoute from "@/service/Map/Post/postCalculateAndDisplayRoute";
import {AddressItemComplete} from "@/types/Address/AddressType";

export default function useRoutePolyline(address: AddressItemComplete[]) {
    const dispatch = useAppDispatch();

    const routeCoordinates = useAppSelector(selectPolylineCoordsList);
    const userLocation = useAppSelector(selectUserLocation);
    const addressListId: string | '' = useAppSelector(selectAddressListId);
    const [lastProcessedIndex, setLastProcessedIndex] = useState(0);

    //Optimize route when address changes
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (address.length >= 1) {
                try {
                    await postCalculateAndDisplayRoute(address, dispatch);
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [address, dispatch]);

    //Optimize / cut polyline when user moves on the right path
    useEffect(() => {
        if (!userLocation || routeCoordinates.length === 0) return;

        const relevantNodes = getDistanceBetweenTwoAddresses(
            userLocation,
            routeCoordinates,
            lastProcessedIndex
        );

        if (relevantNodes.length === 0) return;

        const startIndex = relevantNodes[0].index;

        if (startIndex <= lastProcessedIndex) return;

        const updateRoute = async () => {
            try {
                const clippedNodes = await getShorterPolyline(
                    routeCoordinates,
                    startIndex,
                    addressListId
                );
                dispatch(setPolylineCoordsList(clippedNodes));

                setLastProcessedIndex(startIndex);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        updateRoute().then();
    }, [addressListId, dispatch, lastProcessedIndex, routeCoordinates, userLocation]);

    return {routeCoordinates};
}
