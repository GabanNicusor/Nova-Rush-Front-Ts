import {handleApiError} from '@/utils/apiErrorHandler';
import fetchAddressSuggestions from './fetchAddressSuggestion';
import fetchSuggestionsFromORS from './fetchSuggestionFromORS';
import {AddressItem} from '@/types/Address/AddressType';

export default async function findAddressSuggestion(
    text: string,
): Promise<AddressItem[]> {

    try {
        const resultsBackend: AddressItem[] | undefined =
            await fetchAddressSuggestions(text);

        if (resultsBackend && resultsBackend.length > 0) {
            return resultsBackend;
        }

        return await fetchSuggestionsFromORS(
            text,
        );
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
