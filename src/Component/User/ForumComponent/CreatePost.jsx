import { PlusOutlined } from '@ant-design/icons';
import { Avatar, Button, Form, Input, Select, Upload, Modal, Space, notification } from 'antd';
import 'bootstrap/dist/css/bootstrap.css';
import { useEffect, useState, useContext, useRef } from 'react';
import '../../../assets/Forum.css';
import '../../../assets/Style.css';
import TextArea from 'antd/es/input/TextArea';
import { SubjectContext } from '../../../contexts/SubjectContext';
import { PostContext } from '../../../contexts/PostContext';
import { storage } from '../../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../contexts/UserContext';
import Spinner from './../../common/Spinner/Spinner';
const defaultAvatar = '../Image/Avatar_null.png';
const anh = '../Image/Forum/icon-anh-video.png';
const monhoc = '../Image/Forum/icon-sach.png';
const tag = '../Image/Forum/icon-tag.png';

export default function CreatePost() {
    const [open, setOpen] = useState(false);
    const [openLogin, setOpenLogin] = useState(false);
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [formValue, setFormValue] = useState({ subjectId: null, postText: '', postFile: '' });
    const [imageUpload, setImageUpload] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const { subjects } = useContext(SubjectContext);
    const { addPost, getPostByStatus } = useContext(PostContext);
    const { user } = useContext(UserContext);
    const { accountId } = user;
    const imageUrlRef = useRef('');

    let imageUrlUpload = '';
    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const showModal = () => {
        if (!user) {
            setOpenLogin(true);
        } else {
            setOpen(true);
        }
    };

    const cancelModal = () => {
        if (!user) {
            setOpenLogin(false);
        } else {
            setOpen(false);
        }
        form.resetFields();
    };
    const uploadImage = async () => {
        if (imageUpload == null) return;
        setUploadingImage(true);
        const imageRef = ref(storage, `forum_images/${imageUpload.name + v4()}`);
        try {
            const snapshot = await uploadBytes(imageRef, imageUpload);
            const url = await getDownloadURL(snapshot.ref);
            imageUrlRef.current = url;
            imageUrlUpload = imageUrlRef.current;
            setUploadingImage(false);
            return imageUrlUpload;
        } catch (error) {
            console.log(error);
            setUploadingImage(false);
        }
    };

    //Display notification
    const [api, contextHolder] = notification.useNotification();
    const openNotificationAddPostSuccess = (placement) => {
        api.success({
            message: 'Thông báo',
            description: 'Bài viết của bạn đang chờ được phê duyệt !',
            placement,
        });
    };

    const handleSubmitAddPostForm = async () => {
        const postFile = await uploadImage();
        await addPost({ ...formValue, accountId, postFile });
        openNotificationAddPostSuccess('topRight');
        await getPostByStatus('Pending', accountId);
        cancelModal();
        navigate('/forum?status=Pending');
    };

    return (
        <>
            {contextHolder}
            <div
                className='createPost'
                type='primary'
            >
                <div className='form'>
                    <Input
                        onClick={showModal}
                        size='large'
                        placeholder='Bạn đang nghĩ gì thế?'
                        prefix={user && <Avatar src={user.avatar ? user.avatar : defaultAvatar} />}
                    />
                    <hr></hr>
                    <div className='bottom-form'>
                        <div className='item-bottom-form'>
                            <img src={anh}></img>
                            <label>Ảnh/Video</label>
                        </div>
                        <div className='item-bottom-form'>
                            <img src={tag}></img>
                            <label>Tag</label>
                        </div>
                        <div className='item-bottom-form'>
                            <img src={monhoc}></img>
                            <label>Môn học</label>
                        </div>
                    </div>
                </div>

                <Modal
                    title='Tạo bài viết'
                    open={open}
                    okText={uploadingImage ? <Spinner /> : 'Đăng bài'}
                    cancelText='Đóng'
                    onCancel={cancelModal}
                    onOk={form.submit}
                    okButtonProps={uploadingImage && { style: { pointerEvents: 'none' } }}
                >
                    <Form
                        form={form}
                        layout='horizontal'
                        initialValues={formValue}
                        onFinish={handleSubmitAddPostForm}
                    >
                        <Form.Item
                            label='Môn học'
                            className='input-form'
                            name='subject'
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn môn học!',
                                },
                            ]}
                        >
                            <Select
                                label='Môn học'
                                onChange={(subjectValue) => setFormValue({ ...formValue, subjectId: subjectValue })}
                                defaultValue={0}
                            >
                                <Select.Option value={0}>-- Vui lòng chọn môn học --</Select.Option>
                                {subjects?.map((subject) => (
                                    <Select.Option
                                        key={subject.subjectId}
                                        value={subject.subjectId}
                                    >
                                        {subject.subjectName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name='content'
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập nội dung!',
                                },
                            ]}
                        >
                            <TextArea
                                rows={6}
                                placeholder='Bạn đang nghĩ gì thế?'
                                onChange={(e) => setFormValue({ ...formValue, postText: e.target.value })}
                            />
                        </Form.Item>
                        <Form.Item
                            label='Ảnh/Video'
                            valuePropName='fileList'
                            getValueFromEvent={normFile}
                            style={{
                                marginTop: 10,
                            }}
                            className='form-item upload-image'
                        >
                            <input
                                type='file'
                                accept='image/*'
                                onChange={(event) => setImageUpload(event.target.files[0])}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title='Tạo bài viết'
                    open={openLogin}
                    okText='Đồng ý'
                    cancelText='Hủy bỏ'
                    onCancel={cancelModal}
                    onOk={() => navigate('/login')}
                >
                    <h5>Vui lòng đăng nhập để đăng bài viết !</h5>
                </Modal>
            </div>
        </>
    );
}
