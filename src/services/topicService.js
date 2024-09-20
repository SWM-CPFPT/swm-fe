import Request from '../utils/request';

export const GetTopicByGrade = async (grade, subjectId, topicType, accountId) => {
    try {
        const respone = await Request({
            method: 'get',
            url: `Topics/getTopicByGrade?grade=${grade}&subjectId=${subjectId}&topicType=${topicType}&accountId=${accountId}`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return respone;
    } catch (e) {
        return e;
    }
};

export const GetAllTopicService = async () => {
    try {
        const respone = await Request({
            method: 'get',
            url: `Topics/getAllTopic`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return respone;
    } catch (e) {
        return e;
    }
};


export const ChangeStatusTopicService = async (topicId, status) => {
    try {
        const respone = await Request({
            method: 'post',
            url: `Topics/changeStatusTopic?topicId=${topicId}&status=${status}`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return respone;
    } catch (e) {
        return e;
    }
};
export const ConfirmCourceCharter = async (idCourseChapter, AccountId) => {
    try {
        const respone = await Request({
            method: 'post',
            url: `Coursechapter/ConfirmCourceCharter?IdCourceChapter=${idCourseChapter}&AccountId=${AccountId}`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return respone;
    } catch (e) {
        return e;
    }
};

export const AddTopicService = async (data) => {
    try {
        const respone = await Request({
            method: 'post',
            url: `Topics/addTopic`,
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

export const GetTopicByIdService = async (topicId) => {
    try {
        const respone = await Request({
            method: 'get',
            url: `Topics/getTopicById?topicId=${topicId}`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return respone;
    } catch (e) {
        return e;
    }
}

export const UpdateTopicService = async (data) => {
    try {
        const respone = await Request({
            method: 'post',
            url: `Topics/editTopic`,
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

export const GetRankingOfTopic = async (topicId, topicType) => {
    try {
        const respone = await Request({
            method: 'get',
            url: `Topics/getRankingOfTopic?topicId=${topicId}&topicType=${topicType}`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return respone;
    } catch (e) {
        return e;
    }
};

export const GetTopicByTopicType = async (topicType) => {
    try {
        const respone = await Request({
            method: 'get',
            url: `Topics/getTopicByTopicType?topicType=${topicType}`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return respone;
    } catch (e) {
        return e;
    }
};