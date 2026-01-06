import React, { useMemo, useRef } from 'react';
import { Dimensions, StyleSheet, View, ViewStyle } from 'react-native';
import { AppDispatch ,useAppDispatch, useAppSelector } from "../../state/store";

import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

// Components
import AddressDetailsPagerBottomSheet from './AddressDetailsPagerBottomSheet';
import AddressNameCard from '../Cards/AddressNameCard';
import AddressDetailsCard from '../Cards/AddressDetailsCard';
import AddressRatingCard from '../Cards/AddressRatingCard';
import NavigationCard from '../Cards/NavigationCard';
import FailedDeliveryCard from '../Cards/FailedDeliveryCard';
import SuccessDeliveryCard from '../Cards/SuccessDeliveryCard';
import XButton from '../Buttons/XButton';
import ExpressTimeCard from '../Cards/ExpressTimeCard';
import PickupOrDeliverySelectorCard from '../Cards/PickupOrDeliverySelectorCard';
import PackageSelectorCard from '../Cards/PackageSelectorCard';

// State & Types
import {
  selectAddressDetailsList,
  selectAddressList,
  selectAddressListId,
  setIsNavigatePressed,
} from '../../state/navSlice';

import { CustomAddressDetailsItem } from '../../types/AddressDetails/CustomAddressDetails';
import { ReviewType } from '../../types/enums/ReviewType';

const { width } = Dimensions.get('window');
const screenHeight = Dimensions.get('window').height;

// --- Interfaces ---

interface InnerAddressItemProps {
  item: CustomAddressDetailsItem;
  addressListId: string;
  address: string;
  name: string;
  number: string;
  notes: string;
  setName: (text: string) => void;
  setNumber: (text: string) => void;
  setNotes: (text: string) => void;
  handleVote: (vote: ReviewType) => void;
  setSelectedExpress: (time: number) => void;
  setSelectedOrderType: (type: string) => void;
  setPackages: (count: number) => void;
}

// --- Address Item Component ---

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
    <View style={styles.actionHeader}>
      <NavigationCard onPress={() => setName('')}/>

      <FailedDeliveryCard onPress={() => setName('')} />

      <SuccessDeliveryCard onPress={() => setNumber('')}/>
    </View>

    <AddressNameCard address={address} />

    <ExpressTimeCard
      item={{ expressType: item.ExpressType }}
      setSelectedExpress={setSelectedExpress}
    />

    <PickupOrDeliverySelectorCard
      item={{ orderType: item.OrderType }}
      setSelectedOrderType={setSelectedOrderType}
    />

    <PackageSelectorCard
      item={{ packages: item.packages }}
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
      item={item}
      addressListId={addressListId}
    />
  </View>
);

// --- Main Navigation Bottom Sheet ---

const AddressNavigationBottomSheet: React.FC = () => {
  const flatListRef = useRef<any>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['25%', '45%', '55%', '75%', '95%'], []);

  const addressList = useAppSelector(selectAddressList);
  const addressListId = useAppSelector(selectAddressListId) || '';
  const addressDetails = useAppSelector(selectAddressDetailsList);

  const dispatch = useAppDispatch();

  const closeBottomSheet = () => {
    dispatch(setIsNavigatePressed(false));
  };

  return (
    <BottomSheet ref={bottomSheetRef} index={2} snapPoints={snapPoints}>
      <BottomSheetView style={{ maxHeight: screenHeight * 0.9 }}>
        <XButton onPress={closeBottomSheet} />

        <AddressDetailsPagerBottomSheet
          AddressItem={AddressItem}
          addressList={addressList}
          addressListId={addressListId}
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
  } as ViewStyle,
  actionHeader: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  } as ViewStyle,
});

export default AddressNavigationBottomSheet;
