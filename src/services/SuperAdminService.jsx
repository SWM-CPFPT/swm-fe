import request from '../utils/request';

export const GetAllSAdmin = async () => {
    try {
        const respone = await request({
            method: 'get',
            url: 'superAdmin/getAllAdmin',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return respone;
    } catch (e) {
        return e;
    }
};


export const GetAllEmail = async () => {
    try {
        const respone = await request({
            method: 'get',
            url: 'superAdmin/getAllEmail',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return respone;
    } catch (e) {
        return e;
    }
};

export const ChangeStatusAdminService = async (accountId, status) => {
    try {
        const respone = await request({
            method: 'post',
            url: `superAdmin/changeStatus?accountId=${accountId}&status=${status}`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return respone;
    } catch (e) {
        return e;
    }
};

export const UpdateAdminService = async (data) => {
    try {
        const respone = await request({
            method: 'post',
            url: `superAdmin/updateAdmin`,
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

export const AddAdminService = async (data) => {
    try {
        const respone = await request({
            method: 'post',
            url: `superAdmin/addAdmin`,
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

