import React, {
    useRef,
    useEffect,
    useMemo,
    SetStateAction,
    Dispatch,
} from 'react';
import {
    Dimensions,
    StyleSheet,
    View,

} from 'react-native';

import {
    selectAddressDetailsIndexSelected,
    selectAddressDetailsList,
    selectAddressList,
    selectAddressListId,
    setAddressDetailsList,
    setIsAddressPressesForDetails,
} from '../../state/navSlice';

import AddressDetailsPagerBottomSheet from './AddressDetailsPagerBottomSheet';

import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';

import XButton from '../Buttons/XButton';
import AddressNameCard from '../Cards/AddressNameCard';
import AddressDetailsCard from '../Cards/AddressDetailsCard';
import AddressRatingCard from '../Cards/AddressRatingCard';
import ExpressTimeCard from '../Cards/ExpressTimeCard';
import PickupOrDeliverySelectorCard from '../Cards/PickupOrDeliverySelectorCard';
import PackageSelectorCard from '../Cards/PackageSelectorCard';

import fetchAddressDetails from '../../service/AddressDetails/Fetch/fetchAddressDetails';
import getUserId from '../../service/User/Get/getUserId';

// Redux & Type Imports
import {AppDispatch, useAppDispatch, useAppSelector} from '../../state/store';
import {ReviewType} from '../../types/enums/ReviewType';
import {CustomAddressDetailsItem} from '../../types/AddressDetails/CustomAddressDetails';
import {OrderTypeDisplay} from '../../types/enums/OrderType'; // Import display types

const {width} = Dimensions.get('window');
const screenHeight = Dimensions.get('window').height;

// --- Inner Component Props ---

interface InnerAddressItemProps {
    item: CustomAddressDetailsItem;
    addressListId: string;
    address: string;

    name: string;
    number: string;
    notes: string;

    setName: Dispatch<SetStateAction<string>>;
    setNumber: Dispatch<SetStateAction<string>>;
    setNotes: Dispatch<SetStateAction<string>>;

    handleVote: (vote: ReviewType) => void;
    setSelectedExpress: (time: number) => void;
    setSelectedOrderType: (type: OrderTypeDisplay) => void; // Using Display type for UI
    setPackages: (count: number) => void;

    dispatch: AppDispatch;
}

// --- Address Item (The Card Stack) ---

const AddressItem: React.FC<InnerAddressItemProps> = ({
                                                          item,
                                                          addressListId,
                                                          address,
                                                          name,
                                                          number,
                                                          notes,
                                                          setName,
                                                          setNumber,
                                                          setNotes,
                                                          handleVote,
                                                          setSelectedExpress,
                                                          setSelectedOrderType,
                                                          setPackages,
                                                      }) => (
    <View style={styles.cardContainer}>
        <AddressNameCard address={address}/>

        {/* Use the properties picked in your interface */}
        <ExpressTimeCard
            item={{expressType: item.expressType}}
            setSelectedExpress={setSelectedExpress}
        />

        <PickupOrDeliverySelectorCard
            item={{orderType: item.orderType}}
            setSelectedOrderType={setSelectedOrderType}
        />

        <PackageSelectorCard
            item={{packages: item.packages}}
            setSelectedPackage={setPackages}
        />

        <AddressDetailsCard
            name={name}
            number={number}
            notes={notes}
            setName={setName}
            setNumber={setNumber}
            setNotes={setNotes}
        />

        <AddressRatingCard
            handleVote={handleVote}
            item={item} // Item includes the ReviewType counts
            addressListId={addressListId}
        />
    </View>
);

// --- Main Bottom Sheet Container ---

const AddressDetailsBottomSheet: React.FC = () => {
    const flatListRef = useRef<any>(null);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['25%', '45%', '55%', '75%', '92%'], []);

    const addressList = useAppSelector(selectAddressList);
    const addressListId = useAppSelector(selectAddressListId);
    const addressDetails = useAppSelector(selectAddressDetailsList);
    const index = useAppSelector(selectAddressDetailsIndexSelected);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!addressDetails || addressDetails.length === 0) {
            dispatch(setIsAddressPressesForDetails(false));
        }
    }, [addressDetails, dispatch]);

    useEffect(() => {
        if (index !== null && index !== undefined && flatListRef.current) {
            flatListRef.current.scrollToOffset({
                offset: width * index,
                animated: true,
            });
        }
    }, [index]);

    const closeBottomSheet = async () => {
        const user_id = await getUserId();
        dispatch(setAddressDetailsList(await fetchAddressDetails(addressList, user_id, addressListId,)));
        dispatch(setIsAddressPressesForDetails(false));
    };

    return (
        <BottomSheet ref={bottomSheetRef} index={4} snapPoints={snapPoints}>
            <BottomSheetView style={{maxHeight: screenHeight * 0.9}}>
                <XButton onPress={closeBottomSheet}/>
                <AddressDetailsPagerBottomSheet
                    AddressItem={AddressItem}
                    addressList={addressList}
                    addressListId={addressListId || ''}
                    addressDetails={addressDetails}
                    flatListRef={flatListRef}
                />
            </BottomSheetView>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        width: width - 25,
        alignSelf: 'center',
        marginVertical: 40,
        gap: 15,
    },
});

export default AddressDetailsBottomSheet;
