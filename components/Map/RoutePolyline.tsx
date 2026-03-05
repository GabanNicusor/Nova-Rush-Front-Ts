import React, {useEffect, useState} from 'react';
import {Polyline} from 'react-native-maps';
import {useAppDispatch, useAppSelector} from "@/state/store"

import {
    selectAddressListId,
    selectPolylineCoordsList,
    selectUserLocation,
    setPolylineCoordsList,
} from '@/state/navSlice';

import getShorterPolyline from '../../service/Map/Get/getShorterPolyline';

import postCalculateAndDisplayRoute from '../../service/Map/Post/postCalculateAndDisplayRoute';

import getDistanceBetweenTwoAddresses from '../../utils/Map/getDistanceBetweenTwoAddresses';


import {AddressItemComplete} from '@/types/Address/AddressType';
import useRoutePolyline from "@/hooks/useRoutePolyline";

interface AddressItemProp {
    address: AddressItemComplete[];
}

export default function RoutePolyline({address}: AddressItemProp) {

    const {routeCoordinates} = useRoutePolyline(address);

    if (routeCoordinates.length === 0)  return null;

    return (
        <>
            {routeCoordinates?.length > 0 && (
                <Polyline
                    coordinates={routeCoordinates}
                    strokeColor="#0050FF" // Red
                    strokeWidth={6}
                />
            )}
        </>
    );
};
