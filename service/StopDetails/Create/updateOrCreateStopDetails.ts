import {handleApiError} from '@/utils/apiErrorHandler';
import {OrderType} from '@/types/enums/OrderType';
import {ExpressType} from '@/types/enums/ExpressType';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

type UserId = string;
type AddressId = string;
type ListId = string;
type PackagesType = number;

interface StopDetailsPayload {
    user_id: UserId;
    address_id: AddressId;
    address_list_id: ListId;
    packages: PackagesType;
    orderType: OrderType;
    expressType: ExpressType;
}

interface StopDetailsResponse {
    success: boolean;
    message: string;
    stop_details_id: string;
}

export default async function UpdateOrCreateStopDetails(
    userId: UserId,
    addressId: AddressId,
    addressListId: string | '',
    packages: PackagesType,
    orderType: OrderType,
    expressType: ExpressType,
): Promise<StopDetailsResponse | undefined> {

    const payload: StopDetailsPayload = {
        user_id: userId,
        address_id: addressId,
        address_list_id: addressListId,
        packages: packages,
        orderType: Number(orderType),
        expressType: Number(expressType)
    };


    try {
        const response = await fetch(
            `${API_BASE_URL}/api/v1/stop-details/updateOrCreateStopDetails`,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload),
            },
        );

        if (response.ok) {
            return await response.json();
        }

        console.error(
            `Failed to update/create stop details. Status: ${response.status}`,
        );
        return undefined;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
