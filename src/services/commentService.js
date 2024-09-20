import request from '../utils/request';

const END_POINTS = {
    ADD_COMMENT: 'comment/AddComment',
    GET_BY_POST: 'comment/getCommentByPost',
    EDIT_COMMENT: 'comment/EditComment',
    DELETE_COMMENT: 'comment/DeleteComment'
};

export const addCommentService = async (data) => await request.post(END_POINTS.ADD_COMMENT, data);

export const getCommentsByPostService = async (postId) =>
    await request.get(`${END_POINTS.GET_BY_POST}?postId=${postId}`);

export const editCommentService = async (data) => await request.post(END_POINTS.EDIT_COMMENT, data);

export const deleteCommentService = async (commentId) => await request.post(`${END_POINTS.DELETE_COMMENT}?commentId=${commentId}`);
