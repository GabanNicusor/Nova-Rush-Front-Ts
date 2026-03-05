import {AppDispatch} from '@/state/store';
import {setRouteList} from '@/state/navSlice';
import {handleApiError} from '@/utils/apiErrorHandler';

import getUserId from '../../User/Get/getUserId';
import fetchUserAddressList from '../../User/Fetch/fetchUserAddressList';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

interface NewListPayload {
    user_id: string;
    list_name: string;
    createdAt: string;
}


interface RouteListItem {
    id: string;
    list_name: string;
}

export default async function createNewRouteList(
    listName: string,
    chosenDate: string,
    dispatch: AppDispatch,
): Promise<any> {

    const user_id: string = await getUserId();

    const payload: NewListPayload = {
        user_id: user_id,
        list_name: listName,
        createdAt: chosenDate,
    };

    try {
        const response: Response = await fetch(
            `${API_BASE_URL}/api/v1/route-address-list/createNewAddressList`,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload),
            },
        );

        if (!response.ok) {
            // Throw an error if the server responded with a non-2xx status
            const errorBody = await response.text();
            throw new Error(
                `Failed to create list: ${response.status} - ${errorBody}`,
            );
        }

        // 3. Fetch updated route list after creation
        const routeList: RouteListItem[] = await fetchUserAddressList();
        // 4. Dispatch the updated route list to Redux
        dispatch(setRouteList(routeList));
        // 5. Return the parsed response from the creation endpoint
        return await response.json();

    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
