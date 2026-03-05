import getUserInfo from './getUserInfo';
import {handleApiError} from '@/utils/apiErrorHandler';

type UserId = string;

interface UserInfo {
    user_id: UserId;
}

export default async function getUserId(): Promise<UserId> {
    try {
        const userInfo: UserInfo = await getUserInfo();
        return userInfo.user_id;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};

