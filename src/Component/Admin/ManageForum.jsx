import { Breadcrumb, Layout } from 'antd';
import SiderAdmin from '../../Layout/Admin/SiderAdmin';
import HeaderAdmin from '../../Layout/Admin/HeaderAdmin';
import PostStatusTab from '../User/ForumComponent/PostStatusTab';
import FilterPost from '../User/ForumComponent/FilterPost';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { PostContext } from '../../contexts/PostContext';
import Spinner from '../common/Spinner/Spinner';
import PostList from '../User/PostList';
import { useSearchParams } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';

const { Content } = Layout;
const ManageForum = () => {
    const navigate = useNavigate();
    const { loading, posts, getAllPost, getPostByStatus } = useContext(PostContext);
    const { user } = useContext(UserContext);
    const [searchParams] = useSearchParams();
    const statusQueryParam = searchParams.get('status');

    const statusList = [
        {
            id: 1,
            name: 'Pending',
            title: 'Chờ phê duyệt',
        },
        {
            id: 2,
            name: 'Approved',
            title: 'Đã phê duyệt',
        },
        {
            id: 3,
            name: 'Rejected',
            title: 'Bị từ chối',
        },
    ];

    useEffect(() => {
        navigate('?status=Pending');
    }, []);

    useEffect(() => {
        if (statusQueryParam) getPostByStatus(statusQueryParam, user.accountId);
        else getAllPost();
    }, [statusQueryParam]);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <SiderAdmin />
            <Layout className='site-layout'>
                <HeaderAdmin />
                {/* {contextHolder} */}

                <Content
                    style={{
                        margin: '0 16px',
                    }}
                >
                    <Breadcrumb
                        style={{
                            margin: '16px 0',
                        }}
                    >
                        <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                        <Breadcrumb.Item>Quản lý</Breadcrumb.Item>
                        <Breadcrumb.Item>Diễn đàn</Breadcrumb.Item>
                    </Breadcrumb>
                    <div>
                        <div>
                            <h1
                                style={{
                                    textAlign: 'center',
                                    fontSize: '30px',
                                    marginBottom: '20px',
                                }}
                            >
                                Danh sách Bài viết
                            </h1>
                            <div className='post-filter-container'>
                                <PostStatusTab statusList={statusList} />
                                <FilterPost />
                            </div>
                            <div className='post-container'>{loading ? <Spinner /> : <PostList posts={posts} />}</div>
                        </div>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default ManageForum;
