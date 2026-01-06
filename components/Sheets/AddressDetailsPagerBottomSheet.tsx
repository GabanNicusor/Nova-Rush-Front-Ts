import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useAppDispatch } from '../../state/store';
import { setAddressDetailsList } from '../../state/navSlice';
import { CustomAddressDetailsItem } from '../../types/AddressDetails/CustomAddressDetails';
import { AddressItemComplete } from '../../types/Address/AddressType';
import useCountDownTimer from '../../hooks/useCountDownTimer';
import getUserId from '../../service/User/Get/getUserId';
import fetchAddressDetails from '../../service/AddressDetails/Fetch/fetchAddressDetails';
import createOrUpdateAddressDetails from '../../service/AddressDetails/Create/createOrUpdateAddressDetails';
import updateExpressField from '../../service/StopDetails/Create/updateExpressField';
import updateOrderType from '../../service/StopDetails/Create/updateOrderType';
import updatePackagesField from '../../service/StopOrder/Update/updatePackagesField';
import { ExpressType } from '../../types/enums/ExpressType';
import {OrderType, OrderTypeDisplay} from '../../types/enums/OrderType';
import { ReviewType } from '../../types/enums/ReviewType';
import { CalculationType } from '../../types/enums/CalculationType';
import createOrUpdateRatingAddress from '../../service/RatingAddress/Create/createOrUpdateRatingAddress';
import updateSelectedVote from '../../service/AddressDetails/Create/updateSelectedVote';

const { width } = Dimensions.get('window');

interface LocalEditData {
  user_id: string;
  name: string;
  number: string;
  notes: string;
  expressType?: ExpressType;
  orderType?: OrderType;
}

interface PagerProps {
  AddressItem: React.FC<any>;
  addressList: AddressItemComplete[];
  addressListId: string;
  addressDetails: CustomAddressDetailsItem[];
  flatListRef: React.RefObject<FlatList<CustomAddressDetailsItem>>;
}

const timeToExpressType: Record<number, ExpressType> = {
  1: ExpressType.STANDARD,
  8: ExpressType.EIGHT,
  9: ExpressType.NINE,
  10: ExpressType.TEN,
  12: ExpressType.TWELVE,
};

const displayToEnum: Record<OrderTypeDisplay, OrderType> = {
  'Delivery': OrderType.DELIVERY,
  'Pickup': OrderType.PICKUP,
  'Both': OrderType.BOTH,
};

const AddressDetailsPagerBottomSheet: React.FC<PagerProps> = ({
                                                                AddressItem,
                                                                addressList,
                                                                addressListId,
                                                                addressDetails,
                                                                flatListRef,
                                                              }) => {
  const dispatch = useAppDispatch();
  const { timeLeft, startTimer } = useCountDownTimer(10);
  const [localEdits, setLocalEdits] = useState<Record<string, LocalEditData>>({});

  // --- Auto-save name/number/notes ---
  useEffect(() => {
    if (timeLeft === 1 && Object.keys(localEdits).length > 0) {
      const saveAll = async () => {
        try {
          const user_id = Object.values(localEdits)[0]?.user_id;
          await Promise.all(
              Object.entries(localEdits).map(([addressId, data]) =>
                  createOrUpdateAddressDetails(
                      data.user_id,
                      addressId,
                      data.name,
                      data.number,
                      data.notes
                  )
              )
          );
          const refreshed = await fetchAddressDetails(addressList, user_id, addressListId);
          dispatch(setAddressDetailsList(refreshed));
          setLocalEdits({});
        } catch (err) {
          console.error('Save failed:', err);
        }
      };
      saveAll().then();
    }
  }, [timeLeft, localEdits, addressList, addressListId, dispatch]);

  // --- Local input changes ---
  const handleChange = (
      address_id: string,
      field: keyof LocalEditData,
      value: string,
      user_id: string,
      currentData: LocalEditData
  ) => {
    setLocalEdits(prev => ({
      ...prev,
      [address_id]: {
        ...currentData,
        user_id,
        [field]: value,
      },
    }));
    startTimer();
  };

  // --- Vote logic ---
  const handleVote = async (addressId: string, reviewType: ReviewType) => {
    const user_id = await getUserId();
    const selected = addressDetails.find(item => item.address_id === addressId);
    if (!selected) return;

    if (selected.selectedVote && selected.selectedVote !== reviewType) {
      await createOrUpdateRatingAddress(addressId, selected.selectedVote, CalculationType.DECREMENT);
    }
    if (reviewType !== selected.selectedVote) {
      await createOrUpdateRatingAddress(addressId, reviewType, CalculationType.INCREMENT);
      await updateSelectedVote(addressId, reviewType, user_id);
    }

    const refreshed = await fetchAddressDetails(addressList, user_id, addressListId);
    dispatch(setAddressDetailsList(refreshed));
  };

  // --- Express & Order type updates ---
  const handleExpressTime = async (address_id: string, user_id: string, list_id: string, selectedTime: number) => {
    const expressType = timeToExpressType[selectedTime];
    await updateExpressField(user_id, address_id, list_id, expressType);
    const refreshed = await fetchAddressDetails(addressList, user_id, list_id);
    dispatch(setAddressDetailsList(refreshed));
  };

  const handleOrderType = async (address_id: string, user_id: string, list_id: string, type: OrderType) => {
    type = displayToEnum[type];
    await updateOrderType(user_id, address_id, list_id, type);
    const refreshed = await fetchAddressDetails(addressList, user_id, list_id);
    dispatch(setAddressDetailsList(refreshed));
  };

  const getItemLayout = (_: any, index: number) => ({
    length: width,
    offset: width * index,
    index,
  });

  const renderItem = ({ item }: ListRenderItemInfo<CustomAddressDetailsItem>) => {
    const currentData = {
      ...item,
      ...localEdits[item.address_id],
    };

    return (
        <View style={{ width }}>
          <AddressItem
              item={item}
              addressListId={addressListId}
              address={item.address_complete}
              name={currentData.name || ''}
              number={currentData.number || ''}
              notes={currentData.notes || ''}
              setName={(text: string) => handleChange(item.address_id, 'name', text, item.user_id, currentData)}
              setNumber={(text: string) => handleChange(item.address_id, 'number', text, item.user_id, currentData)}
              setNotes={(text: string) => handleChange(item.address_id, 'notes', text, item.user_id, currentData)}
              handleVote={(vote: ReviewType) => handleVote(item.address_id, vote)}
              setSelectedExpress={(time: number) => handleExpressTime(item.address_id, item.user_id, item.address_list_id, time)}
              setSelectedOrderType={(type: OrderType) => handleOrderType(item.address_id, item.user_id, item.address_list_id, type)}
              setPackages={(count: number) => updatePackagesField(item.user_id, item.address_id, item.address_list_id, count)}
          />
        </View>
    );
  };

  return (
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false} showsVerticalScrollIndicator={false}>
        <FlatList
            ref={flatListRef}
            data={addressDetails}
            keyExtractor={item => item.address_id}
            renderItem={renderItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            getItemLayout={getItemLayout}
        />
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
});

export default AddressDetailsPagerBottomSheet;
