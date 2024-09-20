import request from '../utils/request';

export const GetAllModService = async () => {
    try {
        const respone = await request({
            method: 'get',
            url: `account/getAllMod`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return respone;
    } catch (e) {
        return e;   
    }
};

export const AddModService = async (data) => {
    try {
        const respone = await request({
            method: 'post',
            url: 'account/addMod',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(data),
        });
        return respone;
    } catch (e) {
        return e;
    }
};

export const ChangeStatusService = async (accountId, string) => {
    try {
        const respone = await request({
            method: 'post',
            url: `account/changeStatus?accountId=${accountId}&status=${string}`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return respone;
    } catch (e) {
        return e;
    }
};

export const UpdateModService = async (accountId, data) => {
    try {
        const respone = await request({
            method: 'post',
            url: `account/updateMod?accountId=${accountId}`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(data),
        });
        return respone;
    } catch (e) {
        return e;
    }
};
