// Corrected findAddressSuggestion.ts

import { handleApiError } from '../../../utils/apiErrorHandler';
import fetchAddressSuggestions from './fetchAddressSuggestion';
import fetchSuggestionsFromORS from './fetchSuggestionFromORS';
import { AddressItem } from '../../../types/Address/AddressType';

const findAddressSuggestion = async (
  text: string, // Explicitly type the input query
): Promise<AddressItem[]> => {
  // Type the return promise

  try {
    // 1. Check Backend Results
    // Type checking the result as the expected array type OR undefined
    const resultsBackend: AddressItem[] | undefined =
      await fetchAddressSuggestions(text);

    if (resultsBackend && resultsBackend.length > 0) {
      return resultsBackend;
    }

    // 2. Fallback to ORS
    // CORRECTED: The ORS function must return an ARRAY (FinalSuggestionsResponse)
    // CORRECTED: Return the array of ORS results
    return await fetchSuggestionsFromORS(
      text,
    );
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export default findAddressSuggestion;
