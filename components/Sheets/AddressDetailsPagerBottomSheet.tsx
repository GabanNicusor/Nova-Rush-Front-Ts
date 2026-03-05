import React, {useEffect, useMemo, useState} from 'react';
import {Dimensions, FlatList, ListRenderItemInfo, ScrollView, StyleSheet, View} from 'react-native';

import {ExpressType} from '@/types/enums/ExpressType';
import {OrderType, OrderTypeDisplay} from '@/types/enums/OrderType';
import {ReviewType} from '@/types/enums/ReviewType';
import {CalculationType} from '@/types/enums/CalculationType';

import {setAddressDetailsList} from '@/state/navSlice';
import {CustomAddressDetailsItem} from '@/types/AddressDetails/CustomAddressDetails';
import {AddressItemComplete} from '@/types/Address/AddressType';
import {useAppDispatch} from '@/state/store';

import getUserId from '../../service/User/Get/getUserId';
import fetchAddressDetails from '../../service/AddressDetails/Fetch/fetchAddressDetails';
import updateExpressField from '../../service/StopDetails/Create/updateExpressField';
import updateOrderType from '../../service/StopDetails/Create/updateOrderType';
import updatePackagesField from '../../service/StopOrder/Update/updatePackagesField';
import createOrUpdateRatingAddress from '../../service/RatingAddress/Create/createOrUpdateRatingAddress';
import updateSelectedVote from '../../service/AddressDetails/Create/updateSelectedVote';
import useLocalEditsWithAutoSave from "@/hooks/useLocalEditsWithAutoSave";

const {width} = Dimensions.get('window');

interface PagerProps {
    AddressDetailsComponent: React.FC<any>;
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

export default function AddressDetailsPagerBottomSheet({
                                                                  AddressDetailsComponent,
                                                                  addressList,
                                                                  addressListId,
                                                                  addressDetails,
                                                                  flatListRef,
                                                              }:PagerProps) {
    const dispatch = useAppDispatch();

    const {localEdits, updateLocal} = useLocalEditsWithAutoSave(addressList,addressListId, dispatch);

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

    const handleExpressTime = async (address_id: string, user_id: string, list_id: string, selectedTime: number) => {
        const expressType = timeToExpressType[selectedTime];
        await updateExpressField(user_id, address_id, list_id, expressType);
        const refreshed = await fetchAddressDetails(addressList, user_id, list_id);
        dispatch(setAddressDetailsList(refreshed));
    };

    const handleOrderType = async (address_id: string, user_id: string, list_id: string, type: OrderTypeDisplay) => {
        const typeSelected = displayToEnum[type];
        await updateOrderType(user_id, address_id, list_id, typeSelected);
        const refreshed = await fetchAddressDetails(addressList, user_id, list_id);
        dispatch(setAddressDetailsList(refreshed));
    };


    const details = useMemo(() => {
        return addressDetails.slice(0);
    }, [addressDetails]);

    const renderItem = ({item}: ListRenderItemInfo<CustomAddressDetailsItem>) => {
        const currentData = {
            ...item,
            ...localEdits[item.address_id],
        };

        return (
            <View style={{width}}>
                <AddressDetailsComponent
                    item={item}
                    addressListId={addressListId}
                    address={item.address_complete}
                    name={currentData.name || ''}
                    number={currentData.number || ''}
                    notes={currentData.notes || ''}
                    setName={(text: string) => updateLocal(item.address_id, 'name', text, item.user_id, currentData)}
                    setNumber={(text: string) => updateLocal(item.address_id, 'number', text, item.user_id, currentData)}
                    setNotes={(text: string) => updateLocal(item.address_id, 'notes', text, item.user_id, currentData)}
                    handleVote={(vote: ReviewType) => handleVote(item.address_id, vote)}
                    setSelectedExpress={(time: number) => handleExpressTime(item.address_id, item.user_id, item.address_list_id, time)}
                    setSelectedOrderType={(type: OrderTypeDisplay) => handleOrderType(item.address_id, item.user_id, item.address_list_id, type)}
                    setPackages={(count: number) => updatePackagesField(item.user_id, item.address_id, item.address_list_id, count)}
                />
            </View>
        );
    };
    const getItemLayout = (_: any, index: number) => ({
        length: width,
        offset: width * index,
        index,
    });
    return (
        <ScrollView contentContainerStyle={styles.scrollContent} bounces={false} showsVerticalScrollIndicator={false}>
            <FlatList
                ref={flatListRef}
                data={details}
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
