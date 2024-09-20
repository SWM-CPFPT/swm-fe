import request from '../utils/request';

export const GetAllAccountUser = async () => {
    try {
        const respone = await request({
            method: 'get',
            url: 'account/getAllAccountUser',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return respone;
    } catch (e) {
        return e;
    }
};

export const UpdateUserService = async (data) => {
    try {
        const respone = await request({
            method: 'post',
            url: 'account/UpdateAccountUser',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(data),
        });
        return respone;
    } catch (e) {
        return e;
    }
}

export const GettAllPhoneService = async () => {
    try {
        const respone = await request({
            method: 'get',
            url: 'home/getAllPhone',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return respone;
    } catch (e) {
        return e;
    }
}

export const ChangeStatusService = async (accountId, status) => {
    try {
        const respone = await request({
            method: 'post',
            url: `user/ChangeStatusUser?accountId=${accountId}&newStatus=${status}`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return respone;
    } catch (e) {
        return e;
    }
}