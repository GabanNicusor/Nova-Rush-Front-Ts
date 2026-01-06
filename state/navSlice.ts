import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {StopOrderItem} from '../types/StopOrder/StopOrder';
import {
    AddressItemComplete,
} from '../types/Address/AddressType';
import {RouteItem} from '../types/Route/RouteType';
import {MarkerItem} from '../types/Marker/MarkerType';
import {RouteStep} from '../types/OpenRouteService/ORSManeuversType';
import {CustomAddressDetailsItem} from '../types/AddressDetails/CustomAddressDetails';
import {RegionItem} from '../types/Maps/RegionType';

// --- 1. DEFINE STATE INTERFACES ---

// Define types for complex objects like coordinates, location, and route steps.
// Replace `any` with specific interfaces if your coordinates are structured objects (e.g., {latitude: number, longitude: number})
type Coordinate = {
    accuracy: boolean;
    latitude: number;
    longitude: number
};


// The main interface for the entire slice state
interface NavState {
    // Coordinates/Locations
    origin: Coordinate;
    destination: Coordinate | null;
    userLocation: Coordinate | null;

    // Lists/Route Data
    addressListId: string;
    addressList: AddressItemComplete[]; // Use the defined interface
    routeList: RouteItem[]; // Use a more specific type if known
    polylineCoordsList: Coordinate[];
    markers: MarkerItem[]; // Use a specific Marker interface if available
    directionSteps: RouteStep[]; // Use a specific Step interface
    addressListOrder: StopOrderItem[] ; // Assuming a list of IDs or indices
    addressDetailsList: CustomAddressDetailsItem[]; // Use a specific AddressDetail interface

    // UI/Control Variables
    bottomSheetIndex: number;
    addressDetailsIndexSelected: number;
    mapHeading: RegionItem; // Use a specific Heading interface
    isAddressPressesForDetails: boolean;
    isNavigatePressed: boolean;
    codeExpirationTimestamp: number;
}

// --- 2. INITIAL STATE (Typed) ---

// Ensure the initial state strictly conforms to the NavState interface

const initialState: NavState = {
    origin: {
        latitude: 0,
        longitude: 0,
        accuracy: false,
    }, // Note: The original JS was missing 'origin: null', added here for completeness
    destination: {
        latitude: 0,
        longitude: 0,
        accuracy: false,
    },
    addressListId: '',
    userLocation: {
        latitude: 0,
        longitude: 0,
        accuracy: false,
    },
    addressList: [],
    routeList: [],
    polylineCoordsList: [],
    markers: [],
    directionSteps: [],
    addressListOrder: [],
    bottomSheetIndex: 1,
    addressDetailsIndexSelected: 0,
    mapHeading: {
        latitude: 0.50,
        latitudeDelta: 0.50,
        longitude: 0.50,
        longitudeDelta: 0.05,
    },
    addressDetailsList: [],
    isAddressPressesForDetails: false,
    isNavigatePressed: false,
    codeExpirationTimestamp: 0,
};

// --- 3. CREATE SLICE (Typed Reducers) ---

export const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
        // Reducers automatically infer state type, but we must type the action payload
        setDestination: (state, action: PayloadAction<Coordinate>) => {
            state.destination = action.payload;
        },
        setAddressList: (state, action: PayloadAction<AddressItemComplete[]>) => {
            state.addressList = action.payload;
        },
        setAddressListId: (state, action: PayloadAction<string | ''>) => {
            state.addressListId = action.payload;
        },
        setRouteList: (state, action: PayloadAction<any[]>) => {
            // Use specific type
            state.routeList = action.payload;
        },
        setUserLocation: (state, action: PayloadAction<Coordinate>) => {
            state.userLocation = action.payload;
        },
        setPolylineCoordsList: (state, action: PayloadAction<Coordinate[]>) => {
            state.polylineCoordsList = action.payload;
        },
        setMarkers: (state, action: PayloadAction<MarkerItem[]>) => {
            // Use specific type
            state.markers = action.payload;
        },
        setDirectionSteps: (state, action: PayloadAction<RouteStep[]>) => {
            // Use specific type
            state.directionSteps = action.payload;
        },
        setBottomSheetIndex: (state, action: PayloadAction<number>) => {
            state.bottomSheetIndex = action.payload;
        },
        setAddressListOrder: (state, action: PayloadAction<StopOrderItem[] | undefined>) => {
            state.addressListOrder = action.payload ?? [];
        },
        setMapHeading: (state, action: PayloadAction<RegionItem>) => {
            // Use specific type
            state.mapHeading = action.payload;
        },
        setAddressDetailsList: (state, action: PayloadAction<CustomAddressDetailsItem[] | []>) => {
            // Use specific type
            state.addressDetailsList = action.payload;
        },
        setIsAddressPressesForDetails: (state, action: PayloadAction<boolean>) => {
            state.isAddressPressesForDetails = action.payload;
        },
        setAddressDetailsIndexSelected: (state, action: PayloadAction<number>) => {
            state.addressDetailsIndexSelected = action.payload;
        },
        setIsNavigatePressed: (state, action: PayloadAction<boolean>) => {
            state.isNavigatePressed = action.payload;
        },
        setCodeExpirationTimestamp: (state, action: PayloadAction<number>) => {
            state.codeExpirationTimestamp = action.payload;
        },
        clearCodeExpiration: (state) => {
            state.codeExpirationTimestamp = 0;
        }
    },
});

// --- 4. EXPORTS ---

// Actions are exported as normal, but now they are fully typed functions
export const {
    setDestination,
    setAddressList,
    setAddressListId,
    setRouteList,
    setUserLocation,
    setPolylineCoordsList,
    setMarkers,
    setDirectionSteps,
    setBottomSheetIndex,
    setAddressListOrder,
    setMapHeading,
    setAddressDetailsList,
    setIsAddressPressesForDetails,
    setAddressDetailsIndexSelected,
    setIsNavigatePressed,
    setCodeExpirationTimestamp,
    clearCodeExpiration,
} = navSlice.actions;

// Selectors use the inferred RootState type (requires RootState definition in store config)
// The state parameter needs to be typed for full safety.
// See next step for how to export RootState and use it here.

// For now, use the old export pattern:
// NOTE: For full type safety, you should create a typed useSelector hook (see point 5)

export const selectDestination = (state: { nav: NavState }) =>
    state.nav.destination;
export const selectAddressList = (state: { nav: NavState }) =>
    state.nav.addressList;
// ... (Apply the same type annotation to all selectors)
export const selectAddressListId = (state: { nav: NavState }) =>
    state.nav.addressListId;
export const selectRouteList = (state: { nav: NavState }) =>
    state.nav.routeList;
export const selectUserLocation = (state: { nav: NavState }) =>
    state.nav.userLocation;
export const selectPolylineCoordsList = (state: { nav: NavState }) =>
    state.nav.polylineCoordsList;
export const selectMarkers = (state: { nav: NavState }) => state.nav.markers;
export const selectDirectionSteps = (state: { nav: NavState }) =>
    state.nav.directionSteps;
export const selectBottomSheetIndex = (state: { nav: NavState }) =>
    state.nav.bottomSheetIndex;
export const selectAddressListOrder = (state: { nav: NavState }) =>
    state.nav.addressListOrder;
export const selectMapHeading = (state: { nav: NavState }) =>
    state.nav.mapHeading;
export const selectAddressDetailsList = (state: { nav: NavState }) =>
    state.nav.addressDetailsList;
export const selectIsAddressPressedForDetails = (state: { nav: NavState }) =>
    state.nav.isAddressPressesForDetails;
export const selectAddressDetailsIndexSelected = (state: { nav: NavState }) =>
    state.nav.addressDetailsIndexSelected;
export const selectIsNavigatePressed = (state: { nav: NavState }) =>
    state.nav.isNavigatePressed;
export const selectCodeExpirationTimestamp = (state: { nav: NavState }) =>
    state.nav.codeExpirationTimestamp;

// Export the reducer
export default navSlice.reducer;
