import axios, {AxiosResponse} from 'axios';
import {handleApiError} from '@/utils/apiErrorHandler';

import dispatchFirstListId from '../../../utils/User/dispatchFirstListId';

import {AppDispatch} from '@/state/store';
import {setAddressList} from '@/state/navSlice';

import getUserAddressStart from '../../Address/Get/getUserAddressStart';
import getUserId from '../../User/Get/getUserId';
import fetchFirstListId from '../../User/Fetch/fetchFirstListId';
import {AddressItemComplete} from '@/types/Address/AddressType';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

type UserId = string;
type ListId = string;

interface ShortestRouteResponse {
    route: AddressItemComplete[];
}

export default async function getShortestRoute(
    addressListId: ListId | null,
    isOptimizeAgainPressed: boolean,
    dispatch: AppDispatch,
): Promise<AddressItemComplete[] | undefined> {

    try {
        const first_list_id: string = await fetchFirstListId();
        const user_id: UserId = await getUserId();
        const startAddress = await getUserAddressStart(user_id);
        if (addressListId === null) {
            await dispatchFirstListId(first_list_id, dispatch);
        }

        const listIdToUse: string | null =
            addressListId === null ? first_list_id : addressListId;
        const response: AxiosResponse<ShortestRouteResponse> = await axios.get(
            `${API_BASE_URL}/api/v1/route/shortest?list_id=${listIdToUse}&start_address_id=${startAddress?.id}&user_id=${user_id}&isOptimizeAgainPressed=${isOptimizeAgainPressed}`,
            {
                headers: {'Content-Type': 'application/json'},
            },
        );

        return response.data.route.filter((item: AddressItemComplete) => item.id !== startAddress?.id);
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
