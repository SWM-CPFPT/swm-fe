import request from '../utils/request';

export const WeeklyActivityService = async (accountId) => {
    try {
        const respone = await request({
            method: 'get',
            url: `home/weeklyActivity?accountId=${accountId}`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return respone;
    } catch (e) {
        return e;
    }
}