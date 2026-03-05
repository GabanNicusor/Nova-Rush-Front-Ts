import {handleApiError} from '@/utils/apiErrorHandler';
import {OrderType} from '@/types/enums/OrderType';
import {ExpressType} from '@/types/enums/ExpressType';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

type UserId = string;
type AddressId = string;
type ListId = string;
type Packages = number

interface OrderTypePayload {
    user_id: UserId;
    address_id: AddressId;
    packages: Packages;
    address_list_id: ListId;
    orderType: OrderType;
    expressType: ExpressType;
}

interface UpdateSuccessResponse {
    success: boolean;
    message: string;
    updated_address_id: AddressId;
}

export default async function updateOrderType(
    userId: UserId,
    addressId: AddressId,
    addressListId: ListId,
    orderType: OrderType,
): Promise<UpdateSuccessResponse | undefined> {

    const payload: OrderTypePayload = {
        user_id: userId,
        address_id: addressId,
        address_list_id: addressListId,
        packages: 1,
        expressType: 5,
        orderType: Number(orderType),
    };

    try {
        const response: Response = await fetch(
            `${API_BASE_URL}/api/v1/stop-details/updateOrderType`,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload),
            },
        );

        if (response.ok) {
            return {
                success: true,
                message: "Updated successfully",
                updated_address_id: addressId
            };
        }

    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
