import request from '../utils/request';

export const GetTestDetailService = async (accountId) => {
    try {
        const respone = await request({
            method: 'get',
            url: `history/getHistory?accountId=${accountId}`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return respone;
    } catch (e) {
        return e;
    }
};

export const GetAllSubject = async () => {
    try {
        const response = await request({
            method: 'get',
            url: 'history/getAllSubject',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (e) {
        return e;
    }
};

export const StatictisService = async (accountId, subjectName) => {
    try {
        const response = await request({
            method: 'get',
            url: `history/statistic?accountId=${accountId}&subjectName=${subjectName}`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (e) {
        return e;
    }
};
