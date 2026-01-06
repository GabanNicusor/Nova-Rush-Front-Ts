import addAddressToList from './Add/addAddressToList';
import fetchFirstListId from '../User/Fetch/fetchFirstListId';
import getAddressesByListId from './Get/getAddressesByListId';
import {AddressItemComplete} from '../../types/Address/AddressType';


 interface PlaceSelectionData {
     address_complete: string;
     latitude: number;
     longitude: number; }


interface HandlePlaceSelectedResult {
    listId: string;
    addresses: AddressItemComplete[];
}

const handlePlaceSelected = async (
    data: PlaceSelectionData,
    addressListId: string,
): Promise<HandlePlaceSelectedResult> => {
    let listIdToUse = addressListId ?? await fetchFirstListId();

    await addAddressToList(
        data.address_complete,
        data.latitude,
        data.longitude,
        listIdToUse,
    );

    const addresses = await getAddressesByListId(listIdToUse);

    return {
        listId: listIdToUse,
        addresses,
    };
};

export default handlePlaceSelected;
