import { setAddressListId } from '../../state/navSlice';
// Assuming your Redux store structure defines AppDispatch
import { AppDispatch } from '../../state/store';

const dispatchFirstListId = async (
  id: string | '',
  dispatch: AppDispatch,
): Promise<void> => {
  // The function returns a Promise that resolves to void (nothing)

  try {
    // The setAddressListId action creator expects the ListId string
    dispatch(setAddressListId(id));
  } catch (error) {
    // Since Redux dispatch is generally synchronous, errors here are rare
    // (e.g., if setAddressListId itself throws).
    throw error;
  }
  // Note: Since this is an async function, it implicitly returns Promise<void>
  // when no value is explicitly returned.
};

export default dispatchFirstListId;
