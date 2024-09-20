import request from '../utils/request';

const END_POINTS = {
    GET_ALL_SUBJECT: 'Subject/getAllSubject'
}

export const getAllSubjectService = async () => await request.get(END_POINTS.GET_ALL_SUBJECT)

export const GetAllSubjectService = async () => {
    try {
        const respone = await request({
            method: 'get',
            url: `Subject/getAllSubject`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return respone;
    } catch (e) {
        return e;
    }
};

export const GetSubjectByTopicType = async (topicType) => {
    try {
        const respone = await request({
            method: 'get',
            url: `Subject/getSubjectByTopicType?topicType=${topicType}`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return respone;
    } catch (e) {
        return e;
    }
};


