import request from '../utils/request';

export const StatictisUserService = async () => {
    try {
        const respone = await request({
            method: 'get',
            url: `statictis/statictissUser`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return respone;
    } catch (e) {
        return e;
    }
};

export const StatictisUserByMonthService = async (year) => {
    try {
        const response = await request({
            method: 'get',
            url: `statictis/staticsUserByChartMonth`,
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                year: year 
            }
        });
        return response; 
    } catch (e) {
        return e;
    }
};


export const StatictisUserByDayService = async (month) => {
    try {
        const response = await request({
            method: 'get',
            url: `statictis/staticsUserByChartDay`,
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                month: month 
            }
        });
        return response; 
    } catch (e) {
        return e;
    }
};

export const StatictisTopicService = async () => {
    try {
        const respone = await request({
            method: 'get',
            url: `statictis/statictissTopic`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return respone;
    } catch (e) {
        return e;
    }
};

export const StatictisTopicByMonthService = async (year) => {
    try {
        const response = await request({
            method: 'get',
            url: `statictis/staticsTopicByChartMonth`,
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                year: year 
            }
        });
        return response; 
    } catch (e) {
        return e;
    }
};

export const StatictisQuestionService = async () => {
    try {
        const respone = await request({
            method: 'get',
            url: `statictis/statictissQuestion`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return respone;
    } catch (e) {
        return e;
    }
};

export const StatictisQuestionBySubjectId = async (subjectId) => {
    try {
        const response = await request({
            method: 'get',
            url: `statictis/statictissQuestionBySubjectId`,
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                subjectId: subjectId 
            }
        });
        return response; 
    } catch (e) {
        return e;
    }
};

export const ActivityOfUserService = async (accountId) => {
    try {
        const response = await request({
            method: 'get',
            url: `statictis/statictisProcessingLearning?userId=${accountId}`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response; 
    } catch (e) {
        return e;
    }
};

