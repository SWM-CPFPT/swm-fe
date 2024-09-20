import request from '../utils/request';

export const AddQuestionTest = async (questionId, testDetailId, answerId) => {
    try {
        const respone = await request({
            method: 'post',
            url: `QuestionTest/addQuestionTest?questionId=${questionId}&testDetailId=${testDetailId}&answerId=${answerId}`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return respone;
    } catch (e) {
        return e;
    }
};