import getUserId from '../Get/getUserId';
import getUserAddressList from '../../RouteAddressList/Get/getUserAddressList';
import {handleApiError} from '@/utils/apiErrorHandler';

type UserId = string;
type ListId = string;

interface UserAddressListItem {
    id: ListId;
    list_name: string;
}

interface MappedListItem {
    id: ListId;
    label: string;
}

export default async function fetchFirstListId(): Promise<ListId | ''> {
    try {
        const user_id: UserId | null = await getUserId();

        if (!user_id) {
            console.error('No user_id available, skipping fetchAddresses.');
            return '';
        }

        const response: UserAddressListItem[] | unknown = await getUserAddressList(
            user_id,
        );

        if (Array.isArray(response)) {
            const mappedResponse: MappedListItem[] = response.map(
                (item: UserAddressListItem) => ({
                    id: item.id,
                    label: item.list_name,
                }),
            );

            const firstListId: ListId | null =
                mappedResponse.length > 0 ? mappedResponse[0].id : null;

            if (firstListId) {
                return firstListId;
            } else {
                console.error('No Route found.');
                return '';
            }
        }

        console.warn('getUserAddressList did not return an array.');
        return '';
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
