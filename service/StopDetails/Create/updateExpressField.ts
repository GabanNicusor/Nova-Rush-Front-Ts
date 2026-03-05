import {handleApiError} from '@/utils/apiErrorHandler';
import {ExpressType} from '@/types/enums/ExpressType';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

type UserId = string;
type AddressId = string;
type ListId = string;

interface ExpressPayload {
    user_id: UserId;
    address_id: AddressId;
    address_list_id: ListId;
    expressType: ExpressType;
}

interface UpdateSuccessResponse {
    success: boolean;
    message: string;
}

export default async function updateExpressField(
    userId: UserId,
    addressId: AddressId,
    addressListId: ListId,
    expressType: ExpressType,
): Promise<UpdateSuccessResponse | undefined> {

    const payload: ExpressPayload = {
        user_id: userId,
        address_id: addressId,
        address_list_id: addressListId,
        expressType: Number(expressType),
    };

    try {
        const response: Response = await fetch(
            `${API_BASE_URL}/api/v1/stop-details/updateExpressType`,
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
            };
        }

        console.error(`Failed to update express type. Status: ${response.status}`);
        return undefined;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
