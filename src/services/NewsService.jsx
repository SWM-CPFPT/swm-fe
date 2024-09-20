import request from '../utils/request';

export const GetAllNewsService = async () => {
    try {
        const respone = await request({
            method: 'get',
            url: `news/getAllNews`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return respone;
    } catch (e) {
        return e;
    }
};

export const GetAllNewsCategoryService = async () => {
    try {
        const respone = await request({
            method: 'get',
            url: `news/getAllNewsCategory`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return respone;
    } catch (e) {
        return e;
    }
};

export const AddNewsService = async (data) => {
    try {
        const respone = await request({
            method: 'post',
            url: `news/addnews`,
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

export const EditNewsService = async (data) => {
    try {
        const respone = await request({
            method: 'post',
            url: `news/editNews`,
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

export const ChangeStatusNewsService = async (newsId, status) => {
    try {
        const respone = await request({
            method: 'post',
            url: `news/changeStatusNews?newsId=${newsId}&status=${status}`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return respone;
    } catch (e) {
        return e;
    }
}

export const GetNewsInUserPageService = async () => {
    try {
        const respone = await request({
            method: 'get',
            url: `news/displayNewsInUserPage`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return respone;
    } catch (e) {
        return e;
    }
};

export const GetNewsDetailService = async (id) => {
    try {
        const respone = await request({
            method: 'get',
            url: `news/displayNewDetail?newsId=${id}`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return respone;
    } catch (e) {
        return e;
    }
};

export const GetNewsInPageService = async (currentPage, pageSize) => {
    console.log(currentPage + " " + pageSize);
    try {
        const respone = await request({
            method: 'get',
            url: `news/getNewsInPage?page=${currentPage}&pageSize=${pageSize}`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log("123 " + respone);
        return respone;
    } catch (e) {
        return e;
    }
}