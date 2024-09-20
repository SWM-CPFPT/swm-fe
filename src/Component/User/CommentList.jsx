import { useState, useContext } from 'react';
import { notification } from 'antd';
import Comment from './ForumComponent/Comment';
import { CommentContext } from '../../contexts/CommentContext';

const CommentList = ({ comments }) => {
    const { editComment } = useContext(CommentContext);
    const [editingCommentId, setEditingCommentId] = useState(null);

    //Display notification
    const [api, contextHolder] = notification.useNotification();
    const openNotificationEditCommentSuccess = (placement) => {
        api.success({
            message: 'Thông báo',
            description: 'Bình luận đã được chỉnh sửa !',
            placement,
        });
    };

    const handleEditComment = (comment) => {
        setEditingCommentId(comment.postCommentId);
    };

    const handleCancelEditMode = () => {
        setEditingCommentId(null);
    };

    const handleSaveComment = (comment, updatedContent) => {
        editComment({ postCommentId: comment.postCommentId, content: updatedContent });
        openNotificationEditCommentSuccess('topRight');
        setEditingCommentId(null);
    };

    return (
        <>
            {contextHolder}
            <div className='comment-list'>
                {comments?.map((comment) => (
                    <Comment
                        key={comment.postCommentId}
                        comment={comment}
                        isEditing={editingCommentId === comment.postCommentId}
                        onEditComment={handleEditComment}
                        onCancelEditMode={handleCancelEditMode}
                        onSaveComment={handleSaveComment}
                    />
                ))}
            </div>
        </>
    );
};

export default CommentList;
