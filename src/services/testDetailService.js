import request from '../utils/request';

export const AddTestDetailService = async (accountId) => {
    try {
        const respone = await request({
            method: 'post',
            url: `TestDetail/addTestDetail?accountId=${accountId}`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return respone;
    } catch (e) {
        return e;
    }
};

export const UpdateTestDetailService = async (testDetailId) => {
    try {
        const respone = await request({
            method: 'put',
            url: `TestDetail/updateTestDetail?testdetailId=${testDetailId}`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return respone;
    } catch (e) {
        return e;
    }
};

export const GetTestDetailByTestDetailId = async (testDetailId) => {
    try {
        const respone = await request({
            method: 'get',
            url: `TestDetail/getTestDetailByTestDetailId?testdetailId=${testDetailId}`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return respone;
    } catch (e) {
        return e;
    }
};

export const GetQuestionTestByTestDetailId = async (testDetailId) => {
    try {
        const respone = await request({
            method: 'get',
            url: `TestDetail/getQuestionTestByTestDetailId?testdetailId=${testDetailId}`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return respone;
    } catch (e) {
        return e;
    }
};

export const GetUserDoTest = async () => {
    try {
        const respone = await request({
            method: 'get',
            url: `TestDetail/getUserDoTest`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return respone;
    } catch (e) {
        return e;
    }
};