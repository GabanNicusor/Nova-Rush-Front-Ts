import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {StopOrderItem} from '@/types/StopOrder/StopOrder';
import {AddressItemComplete,} from '@/types/Address/AddressType';
import {RouteItem} from '@/types/Route/RouteType';
import {MarkerItem} from '@/types/Marker/MarkerType';
import {RouteStep} from '@/types/OpenRouteService/ORSManeuversType';
import {CustomAddressDetailsItem} from '@/types/AddressDetails/CustomAddressDetails';

type UserLocation = {
    latitude: number;
    longitude: number
    speed?: number;
    heading?: number;
    accuracy?: number;
};

type Coordinate = {
    latitude: number;
    longitude: number;
}


interface NavState {
    destination: AddressItemComplete | undefined;
    userLocation: UserLocation | null;

    addressListId: string;
    addressList: AddressItemComplete[];
    routeList: RouteItem[];
    polylineCoordsList: Coordinate[];
    markers: MarkerItem[];
    directionSteps: RouteStep[];
    addressListOrder: StopOrderItem[];
    addressDetailsList: CustomAddressDetailsItem[];
    userStartAddress: AddressItemComplete | undefined;

    bottomSheetIndex: number;
    addressDetailsIndexSelected: number;
    isAddressPressesForDetails: boolean;
    isNavigatePressed: boolean;
    codeExpirationTimestamp: number;
}

const initialState: NavState = {
    destination: undefined,

    addressListId: '',
    userLocation: {
        latitude: 0,
        longitude: 0,
        accuracy: 20,
        speed: 0.00,
        heading: 90
    },
    addressList: [],
    routeList: [],
    polylineCoordsList: [],
    markers: [],
    directionSteps: [],
    addressListOrder: [],
    bottomSheetIndex: 1,
    addressDetailsIndexSelected: 0,

    addressDetailsList: [],
    userStartAddress: undefined,
    isAddressPressesForDetails: false,
    isNavigatePressed: false,
    codeExpirationTimestamp: 0,
};


export const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
        setDestination: (state, action: PayloadAction<AddressItemComplete>) => {
            state.destination = action.payload;
        },
        setUserLocation: (state, action: PayloadAction<UserLocation>) => {
            state.userLocation = action.payload;
        },

        setPolylineCoordsList: (state, action: PayloadAction<Coordinate[]>) => {
            state.polylineCoordsList = action.payload;
        },
        setDirectionSteps: (state, action: PayloadAction<RouteStep[]>) => {
            state.directionSteps = action.payload;
        },
        setIsNavigatePressed: (state, action: PayloadAction<boolean>) => {
            state.isNavigatePressed = action.payload;
        },
        setRouteList: (state, action: PayloadAction<any[]>) => {
            state.routeList = action.payload;
        },

        setAddressListId: (state, action: PayloadAction<string | ''>) => {
            state.addressListId = action.payload;
        },
        setAddressList: (state, action: PayloadAction<AddressItemComplete[]>) => {
            state.addressList = action.payload;
        },
        setUserStartAddress: (state, action : PayloadAction<AddressItemComplete | undefined>) => {
            state.userStartAddress = action.payload;
        },
        setBottomSheetIndex: (state, action: PayloadAction<number>) => {
            state.bottomSheetIndex = action.payload;
        },
        setAddressListOrder: (state, action: PayloadAction<StopOrderItem[] | undefined>) => {
            state.addressListOrder = action.payload ?? [];
        },

        setAddressDetailsList: (state, action: PayloadAction<CustomAddressDetailsItem[] | []>) => {
            state.addressDetailsList = action.payload;
        },
        setIsAddressPressesForDetails: (state, action: PayloadAction<boolean>) => {
            state.isAddressPressesForDetails = action.payload;
        },
        setAddressDetailsIndexSelected: (state, action: PayloadAction<number>) => {
            state.addressDetailsIndexSelected = action.payload;
        },
        setCodeExpirationTimestamp: (state, action: PayloadAction<number>) => {
            state.codeExpirationTimestamp = action.payload;
        },
        clearCodeExpiration: (state) => {
            state.codeExpirationTimestamp = 0;
        }
    },
});

export const {
    setDestination,
    setAddressList,
    setAddressListId,
    setRouteList,
    setUserLocation,
    setPolylineCoordsList,
    setDirectionSteps,
    setBottomSheetIndex,
    setAddressListOrder,
    setAddressDetailsList,
    setUserStartAddress,
    setIsAddressPressesForDetails,
    setAddressDetailsIndexSelected,
    setIsNavigatePressed,
    setCodeExpirationTimestamp,
    clearCodeExpiration,
} = navSlice.actions;

export const selectDestination = (state: { nav: NavState }) =>
    state.nav.destination;
export const selectUserLocation = (state: { nav: NavState }) =>
    state.nav.userLocation;

export const selectPolylineCoordsList = (state: { nav: NavState }) =>
    state.nav.polylineCoordsList;

export const selectDirectionSteps = (state: { nav: NavState }) =>
    state.nav.directionSteps;
export const selectIsNavigatePressed = (state: { nav: NavState }) =>
    state.nav.isNavigatePressed;

export const selectRouteList = (state: { nav: NavState }) =>
    state.nav.routeList;

export const selectAddressList = (state: { nav: NavState }) =>
    state.nav.addressList;
export const selectAddressListId = (state: { nav: NavState }) =>
    state.nav.addressListId;
export const selectBottomSheetIndex = (state: { nav: NavState }) =>
    state.nav.bottomSheetIndex;
export const selectAddressListOrder = (state: { nav: NavState }) =>
    state.nav.addressListOrder;
export const selectUserStartAddress = (state: { nav: NavState }) =>
    state.nav.userStartAddress;

export const selectAddressDetailsList = (state: { nav: NavState }) =>
    state.nav.addressDetailsList;
export const selectIsAddressPressedForDetails = (state: { nav: NavState }) =>
    state.nav.isAddressPressesForDetails;
export const selectAddressDetailsIndexSelected = (state: { nav: NavState }) =>
    state.nav.addressDetailsIndexSelected;

export const selectCodeExpirationTimestamp = (state: { nav: NavState }) =>
    state.nav.codeExpirationTimestamp;

export default navSlice.reducer;
