import {setAddressListId} from '@/state/navSlice';
import {AppDispatch} from '@/state/store';

export default async function dispatchFirstListId  (
    id: string | '',
    dispatch: AppDispatch,
): Promise<void>  {
    try {
        dispatch(setAddressListId(id));
    } catch (error) {
        throw error;
    }
};
