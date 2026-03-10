import useCountDownTimer from "@/hooks/useCountDownTimer";
import {useEffect, useState} from "react";
import createOrUpdateAddressDetails from "@/service/AddressDetails/Create/createOrUpdateAddressDetails";
import fetchAddressDetails from "@/service/AddressDetails/Fetch/fetchAddressDetails";
import {selectUserStartAddress, setAddressDetailsList} from "@/state/navSlice";
import {ExpressType} from "@/types/enums/ExpressType";
import {OrderType} from "@/types/enums/OrderType";
import {AddressItemComplete} from "@/types/Address/AddressType";
import {AppDispatch, useAppSelector} from '@/state/store';

interface LocalEditData {
    user_id: string;
    name: string;
    number: string;
    notes: string;
    expressType?: ExpressType;
    orderType?: OrderType;
}

export default function useLocalEditsWithAutoSave(addressList: AddressItemComplete[], addressListId: string, dispatch:
    AppDispatch) {
    const userStartAddress = useAppSelector(selectUserStartAddress);

    const {timeLeft, startTimer} = useCountDownTimer(10);
    const [localEdits, setLocalEdits] = useState<Record<string, LocalEditData>>({});

    useEffect(() => {
        if (timeLeft === 1 && Object.keys(localEdits).length > 0) {
            const saveAll = async () => {
                try {
                    const user_id = Object.values(localEdits)[0]?.user_id;
                    await Promise.all(
                        Object.entries(localEdits).map(([addressId, data]) =>
                            createOrUpdateAddressDetails(
                                data.user_id,
                                addressId,
                                data.name,
                                data.number,
                                data.notes
                            )
                        )
                    );
                    const refreshed = await fetchAddressDetails(addressList, userStartAddress, user_id, addressListId);
                    dispatch(setAddressDetailsList(refreshed));
                    setLocalEdits({});
                } catch (err) {
                    console.error('Save failed:', err);
                }
            };
            saveAll().then();
        }
    }, [timeLeft, localEdits, addressList, addressListId, dispatch, userStartAddress]);

    const updateLocal = (
        address_id: string,
        field: keyof LocalEditData,
        value: string,
        user_id: string,
        currentData: LocalEditData
    ) => {
        setLocalEdits(prev => ({
            ...prev,
            [address_id]: {
                ...currentData,
                user_id,
                [field]: value,
            },
        }));
        startTimer();
    };

    return {localEdits, updateLocal};
}
