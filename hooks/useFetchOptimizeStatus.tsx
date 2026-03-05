import React, {useEffect, useState} from 'react';
import getIsFirstOptimize from '../service/RouteAddressList/Get/getIsFirstOptimize';

interface OptimizeStatusResult {
    isFirstOptimize: boolean | null;
    loading: boolean;
    setIsFirstOptimize: React.Dispatch<React.SetStateAction<boolean | null>>;
}

export default function useFetchOptimizeStatus(listId: string | ''): OptimizeStatusResult {
    const [isFirstOptimize, setIsFirstOptimize] = useState<boolean | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!listId || listId === '') {
            setIsFirstOptimize(false);
            setLoading(false);
            return;
        }

        let isMounted = true;

        const fetchStatus = async () => {
            try {
                setLoading(true);
                const result = await getIsFirstOptimize(listId);
                if (isMounted) {
                    setIsFirstOptimize(result);
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                if (isMounted) {
                    setIsFirstOptimize(null);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchStatus().then(r => {
        });

        return () => {
            isMounted = false;
        };
    }, [listId]);

    return {isFirstOptimize, loading, setIsFirstOptimize};
};
