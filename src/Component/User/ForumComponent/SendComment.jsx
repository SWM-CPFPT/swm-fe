import { Input, Avatar, Modal, notification } from 'antd';
import 'bootstrap/dist/css/bootstrap.css';

import { useContext, useState } from 'react';
import { CommentContext } from '../../../contexts/CommentContext';
import CommentList from '../CommentList';
import { PostContext } from '../../../contexts/PostContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserContext } from '../../../contexts/UserContext';

const defaultAvatar = '../Image/Avatar_null.png';
const upload = '../Image/Forum/upload.png';
const send = '../Image/Forum/send.png';
const { TextArea } = Input;
export default function SendComment({ post }) {
    const { comments, addComment, getCommentsByPost } = useContext(CommentContext);
    const { getAllPost, getPostByStatus, getSavedPost } = useContext(PostContext);
    const { user } = useContext(UserContext);
    const [content, setContent] = useState('');
    const [searchParams] = useSearchParams();
    const statusQueryParams = searchParams.get('status');
    const navigate = useNavigate();
    const handleSendComment = async () => {
        if (content) {
            await addComment({ postId: post.postId, accountId: user.accountId, content });
            setContent('');
            openNotificationSendCommentSuccess('topRight');
            showModal(post.postId);
            if (statusQueryParams) {
                if (statusQueryParams === 'Saved') {
                    await getSavedPost(user.accountId);
                } else {
                    await getPostByStatus(statusQueryParams, user.accountId);
                }
            } else {
                await getAllPost();
            }
        }
    };

    //Display notification
    const [api, contextHolder] = notification.useNotification();
    const openNotificationSendCommentSuccess = (placement) => {
        api.success({
            message: 'Thông báo',
            description: 'Bình luận đã được gửi !',
            placement,
        });
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);

    const showModal = (postId) => {
        setIsModalOpen(true);
        getCommentsByPost(postId);
    };

    const cancelModal = () => {
        setIsModalOpen(false);
        setIsOpenLoginModal(false);
    };

    const handleCommentClick = () => {
        if (!user) {
            setIsOpenLoginModal(true);
        }
    };

    return (
        <>
            {contextHolder}
            <div className='form-bottom'>
                <div className='form-comment'>
                    <div className='form-comment-left'>
                        <Avatar
                            src={
                                <img
                                    src={!user.avatar ? defaultAvatar : user.avatar}
                                    alt='avatar'
                                    className='avatar'
                                />
                            }
                        />
                    </div>
                    <div className='form-comment-midle'>
                        <TextArea
                            onClick={handleCommentClick}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder='Viết bình luận...'
                            autoSize
                        ></TextArea>
                    </div>
                    <div className='form-comment-right'>
                        <img
                            src={upload}
                            alt='upload'
                        ></img>
                        <img
                            src={send}
                            alt='send'
                            onClick={handleSendComment}
                            style={content ? { cursor: 'pointer' } : { cursor: 'not-allowed' }}
                        ></img>
                    </div>
                </div>
            </div>

            <Modal
                title='Bình luận'
                cancelText='Đóng'
                okButtonProps={{ style: { display: 'none' } }}
                open={isModalOpen}
                onCancel={cancelModal}
                className='comment-modal'
            >
                <CommentList comments={comments} />
            </Modal>
            <Modal
                title='Bình luận'
                open={isOpenLoginModal}
                okText='Đồng ý'
                cancelText='Hủy bỏ'
                onCancel={cancelModal}
                onOk={() => navigate('/login')}
            >
                <h5>Vui lòng đăng nhập để bình luận về bài viết !</h5>
            </Modal>
        </>
    );
}
