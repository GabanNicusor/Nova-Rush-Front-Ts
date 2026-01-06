import axios, { AxiosResponse } from 'axios';
import { handleApiError } from '../../../utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// --- Type Definitions (Imported or Defined Here) ---
type ListId = string;
type IsOptimized = boolean;
// ---

const getIsFirstOptimize = async (
    list_id: ListId | '' | undefined,
): Promise<IsOptimized> => {

  // 1. Extra safety check for the "bytecode" bug
  if (!list_id || typeof list_id !== 'string' || list_id.includes('function')) {
    console.warn('getIsFirstOptimize blocked invalid ID:', list_id);
    return false;
  }

  try {
    const response: AxiosResponse<IsOptimized> = await axios.get(
        `${API_BASE_URL}/api/v1/route-address-list/getIsOptimize?list_id=${list_id}`,
        {
          headers: { 'Content-Type': 'application/json' },
        },
    );

    if (response.status === 200) {
      return !!response.data; // Ensure it's a boolean
    }
    return false;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export default getIsFirstOptimize;
