import React, { useContext, useEffect, useRef, useState } from 'react';
import { Avatar, Modal, notification } from 'antd';
import { getPointerContentEditable, setEndOfContentEditable } from '../../../utils/focusEditable';
import { UserContext } from '../../../contexts/UserContext';
import { CommentContext } from '../../../contexts/CommentContext';

const defaultAvatar = '../Image/Avatar_null.png';

export default function Comment({ comment, isEditing, onEditComment, onCancelEditMode, onSaveComment }) {
    const { fullName, avatar, content } = comment;
    const contentRef = useRef();
    const caretPos = useRef();
    const [originalContent, setOriginalContent] = useState(content);
    const [open, setOpen] = useState(false);
    const [selectedComment, setSelectedComment] = useState(null);
    const { user } = useContext(UserContext);
    const { getCommentsByPost, deleteComment } = useContext(CommentContext);
    const originalContentRef = useRef(originalContent);
    const [isEmptyContent, setIsEmptyContent] = useState(false);

    const showModal = (comment) => {
        setOpen(true);
        setSelectedComment(comment);
    };

    const cancelModal = () => {
        setOpen(false);
    };

    //Display notification
    const [api, contextHolder] = notification.useNotification();
    const openNotificationDeletedComment = (placement) => {
        api.success({
            message: 'Thông báo',
            description: 'Bình luận đã được xóa !',
            placement,
        });
    };

    const handleEditComment = () => {
        onSaveComment(comment, contentRef.current.textContent);
        contentRef.current.focus();
        if (contentRef.current.textContent.trim() === '') {
            // Set the cursor to the end of the contentEditable
            setEndOfContentEditable(contentRef.current);
        }
    };

    const handleDeleteComment = async (comment) => {
        await deleteComment(comment.postCommentId);
        await getCommentsByPost(comment.postId);
        cancelModal();
        openNotificationDeletedComment('topRight');
    };

    const handleCancelEditMode = () => {
        originalContentRef.current = originalContent;
        contentRef.current.textContent = originalContent; // Manually update the content in the DOM
        onCancelEditMode();
    };

    useEffect(() => {
        if (isEditing) {
            setEndOfContentEditable(contentRef.current);
            setOriginalContent(contentRef.current.textContent); // Store the original content when editing begins
        }
    }, [isEditing]);

    return (
        <div className='comment-wrapper'>
            {contextHolder}
            <div className='comment-left'>
                <Avatar
                    src={
                        <img
                            src={!avatar ? defaultAvatar : avatar}
                            alt='avatar'
                        />
                    }
                />
            </div>
            <div className='comment-right'>
                <div className='comment-content'>
                    <span>{fullName}</span>

                    <p
                        ref={contentRef}
                        contentEditable={isEditing}
                        suppressContentEditableWarning={true}
                        onInput={(e) => {
                            originalContentRef.current = e.target.textContent;
                            caretPos.current = getPointerContentEditable(contentRef.current);
                            if (!e.target.textContent) {
                                setIsEmptyContent(true);
                            } else {
                                setIsEmptyContent(false);
                            }
                        }}
                    >
                        {originalContentRef.current}
                    </p>
                </div>
                {!isEditing && comment.accountId === user.accountId && (
                    <div className='comment-action'>
                        <button
                            className='comment-action-btn'
                            onClick={() => onEditComment(comment)}
                        >
                            Chỉnh sửa
                        </button>
                        <button
                            className='comment-action-btn'
                            onClick={() => showModal(comment)}
                        >
                            Xóa
                        </button>
                    </div>
                )}
                {isEditing && (
                    <div className='comment-action'>
                        <button
                            className='comment-action-btn'
                            onClick={handleEditComment}
                            style={isEmptyContent ? { cursor: 'not-allowed' } : { cursor: 'pointer' }}
                            disabled={isEmptyContent}
                        >
                            Lưu
                        </button>
                        <button
                            className='comment-action-btn'
                            onClick={handleCancelEditMode}
                        >
                            Hủy
                        </button>
                    </div>
                )}
                <Modal
                    title='Xác nhận'
                    open={open}
                    okText='Đồng ý'
                    cancelText='Hủy bỏ'
                    onOk={() => {
                        handleDeleteComment(selectedComment);
                    }}
                    onCancel={cancelModal}
                    className='confirm-delete-modal'
                >
                    <h3>Bạn có đồng ý xóa bình luận này?</h3>
                </Modal>
            </div>
        </div>
    );
}
