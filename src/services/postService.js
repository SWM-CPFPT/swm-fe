import request from '../utils/request';

const END_POINTS = {
    GET_ALL_POST: 'post/getAllPost',
    GET_BY_ID: 'post/getPostDetail',
    ADD_POST: 'post/AddPost',
    GET_APPROVE_BY_SUBJECT: 'post/GetApprovedPostBySubject',
    GET_BY_SUBJECT: 'post/GetPostBySubject',
    GET_BY_STATUS: 'post/GetPostByStatus',
    GET_BY_SUBJECT_STATUS: 'post/GetPostBySubjectAndStatus',
    CHANGE_POST_STATUS: 'post/ChangeStatusPost',
    LIKE_POST: '/post/LikePost',
    UNLIKE_POST: '/post/UnlikePost',
    DELETE_POST: '/post/DeletePost',
    SAVE_POST: '/post/SavePost',
    UNSAVE_POST: '/post/UnSavePost',
    GET_SAVED_POST: '/post/GetSavedPostByAccount'
};

export const getAllPostService = async () => await request.get(END_POINTS.GET_ALL_POST);

export const getPostByIdService = async (postId) => await request.get(`${END_POINTS.GET_BY_ID}?postId=${postId}`);

export const addPostService = async (data) => await request.post(END_POINTS.ADD_POST, data);

export const getApprovedPostBySubjectService = async (subjectId) => await request.get(`${END_POINTS.GET_APPROVE_BY_SUBJECT}?subjectId=${subjectId}`);

export const getPostBySubjectService = async (subjectId, accountId) =>
    await request.get(`${END_POINTS.GET_BY_SUBJECT}?subjectId=${subjectId}&accountId=${accountId}`);

export const getPostByStatusService = async (status, accountId) =>
    await request.get(`${END_POINTS.GET_BY_STATUS}?status=${status}&accountId=${accountId}`);

export const getPostBySubjectAndStatusService = async (subjectId, status, accountId) =>
    await request.get(`${END_POINTS.GET_BY_SUBJECT_STATUS}?subjectId=${subjectId}&status=${status}&accountId=${accountId}`);

export const deletePostService = async (postId) => await request.post(`${END_POINTS.DELETE_POST}?postId=${postId}`);

export const changePostStatusService = async (postId, status) => await request.post(`${END_POINTS.CHANGE_POST_STATUS}?postId=${postId}&status=${status}`);

export const likePostService = async (postId, accountId) => await request.post(`${END_POINTS.LIKE_POST}?postId=${postId}&accountId=${accountId}`);

export const unlikePostService = async (postId, accountId) => await request.delete(`${END_POINTS.UNLIKE_POST}?postId=${postId}&accountId=${accountId}`);

export const savePostService = async (postId, accountId) => await request.post(`${END_POINTS.SAVE_POST}?postId=${postId}&accountId=${accountId}`);

export const unSavePostService = async (postId, accountId) => await request.delete(`${END_POINTS.UNSAVE_POST}?postId=${postId}&accountId=${accountId}`);

export const getSavedPostService = async (accountId) => await request.get(`${END_POINTS.GET_SAVED_POST}?accountId=${accountId}`);
