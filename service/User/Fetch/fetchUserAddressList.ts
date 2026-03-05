import getUserId from '../Get/getUserId';
import getUserAddressList from '../../RouteAddressList/Get/getUserAddressList';
import {handleApiError} from '@/utils/apiErrorHandler';

type UserId = string;

interface UserAddressListItem {
    id: string;
    createdAt: string;
    list_name: string;
    user_id: string;
}

export default async function fetchUserAddressList(): Promise<UserAddressListItem[]> {
    try {
        const user_id: UserId | null = await getUserId();

        if (!user_id) {
            console.warn('User ID not found. Returning empty list.');
            return [];
        }

        return await getUserAddressList(user_id);
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
