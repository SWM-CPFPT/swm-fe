import { useEffect, useState, useContext } from "react";
import { DatePicker, Dropdown, Breadcrumb, Layout, Table, Input, Modal, Form, notification, Button, theme, Card, Timeline, Tooltip, Select } from 'antd';
import { Option } from "antd/es/mentions";
import {
    SearchOutlined, CheckCircleOutlined,
    EditOutlined, MinusCircleOutlined
} from '@ant-design/icons'
import SiderAdmin from "../../Layout/Admin/SiderAdmin";
import HeaderAdmin from "../../Layout/Admin/HeaderAdmin";
import 'bootstrap/dist/css/bootstrap.css';
import { Editor } from '@tinymce/tinymce-react';
import { ref, uploadBytes, getDownloadURL, connectStorageEmulator } from "firebase/storage";
import { storage } from "../../firebase";
import { v4 } from "uuid";


import { GetAllNewsService } from "../../services/NewsService";
import { GetAllNewsCategoryService } from "../../services/NewsService";
import { UserContext } from "../../contexts/UserContext";
import { EditNewsService } from "../../services/NewsService";
import { ChangeStatusNewsService } from "../../services/NewsService";

const { Content } = Layout;


export default function ManageNews() {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    //#region - Decleare - Khai báo các biến 
    const { user, render, onSetRender } = useContext(UserContext);
    const [imageUpload, setImageUpload] = useState(null)
    const columns = [
        {
            title: "ID",
            dataIndex: "newsId",
            key: 1,
            fixed: "left",
        },
        {
            title: "Ảnh bìa",
            dataIndex: "image",
            key: "image",
            fixed: "left",
            render: (record) => {
                if (record != null) {
                    return (
                        <img
                            src={record}
                            alt="Pic"
                            width={70}
                            height={70}
                            style={{ objectFit: "cover" }}
                            className="borderRadius50"
                        />
                    );
                } else {
                    return (
                        <img
                            src="../Image/Image_Null.png"
                            alt="Pic"
                            width={70}
                            height={70}
                            style={{ borderRadius: "50%", objectFit: "cover" }}
                            className="borderRadius50"
                        />
                    );
                }
            },
        },
        {
            title: "Loại tin tức",
            dataIndex: "categoryName",
            key: "categoryName",
            fixed: "left",
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
                return (
                    <Input
                        autoFocus
                        placeholder="Nhập loại tin tức"
                        value={selectedKeys[0]}
                        onChange={(e) => {
                            setSelectedKeys(e.target.value ? [e.target.value] : []);
                        }}
                        onPressEnter={() => {
                            confirm();
                        }}
                        onBlur={() => {
                            confirm();
                        }}
                    ></Input>
                );
            },
            filterIcon: () => {
                return <SearchOutlined />;
            },
            onFilter: (value, record) => {
                if (record.categoryName != null) {
                    return record.categoryName.toLowerCase().includes(value.toLowerCase());
                }
            },
        },
        {
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title",
            fixed: "left",
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
                return (
                    <Input
                        autoFocus
                        placeholder="Nhập tiêu đề"
                        value={selectedKeys[0]}
                        onChange={(e) => {
                            setSelectedKeys(e.target.value ? [e.target.value] : []);
                        }}
                        onPressEnter={() => {
                            confirm();
                        }}
                        onBlur={() => {
                            confirm();
                        }}
                    ></Input>
                );
            },
            filterIcon: () => {
                return <SearchOutlined />;
            },
            onFilter: (value, record) => {
                if (record.title != null) {
                    return record.title.toLowerCase().includes(value.toLowerCase());
                }
            },
        },
        {
            title: "Người tạo",
            dataIndex: "accountName",
            key: "accountName",
            fixed: "left",
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
                return (
                    <Input
                        autoFocus
                        placeholder="Nhập tên người tạo"
                        value={selectedKeys[0]}
                        onChange={(e) => {
                            setSelectedKeys(e.target.value ? [e.target.value] : []);
                        }}
                        onPressEnter={() => {
                            confirm();
                        }}
                        onBlur={() => {
                            confirm();
                        }}
                    ></Input>
                );
            },
            filterIcon: () => {
                return <SearchOutlined />;
            },
            onFilter: (value, record) => {
                if (record.accountName != null) {
                    return record.accountName.toLowerCase().includes(value.toLowerCase());
                }
            },
        },
        {
            title: "Ngày tạo",
            dataIndex: "createDate",
            key: 1,
            fixed: "left",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: 1,
            fixed: "left",
            render: (record) => {
                if (record == "0") {
                    return "Chờ duyệt";
                } else if (record == "1") {
                    return "Đã duyệt";
                } else {
                    return "";
                }
            },
        },
        {
            title: "Điều hướng",
            key: 1,
            fixed: "center",
            render: (record) => {
                return (
                    <>
                        <Button
                            onClick={() => handleViewEdit(record)}
                            type="primary"
                            icon={<EditOutlined />}
                        ></Button>{" "}
                        &nbsp;
                        {record.status == "1" ? (
                            <Button
                                onClick={() => handleChangeStatusDeActivate(record)}
                                style={{ color: "white", backgroundColor: "red" }}
                                icon={<MinusCircleOutlined />}
                            ></Button>
                        ) : (
                            <></>
                        )}
                        {record.status == "0" ? (
                            <Button
                                onClick={() => handleChangeStatusActivate(record)}
                                style={{ color: "white", backgroundColor: "green" }}
                                icon={<CheckCircleOutlined />}
                            ></Button>
                        ) : (
                            <></>
                        )}
                    </>
                );
            },
        },
    ]
    const [newList, setNewList] = useState([]);
    const [newCategoryList, setNewCategoryList] = useState([]);
    const [showEditForm, setShowEditForm] = useState(false);

    const [editData, setEditData] = useState({
        editNewsId: "",
        editCategory: "",
        editImage: "",
        editTitle: "",
        editSubTitle: "",
        editContent: "",
    })

    const [errors, setErrors] = useState({
        createCategory: "",
        createImage: "",
        createTitle: "",
        createSubTitle: "",
        createContent: "",
    })
    //#endregion


    //#region - Function - Hiển thị thông báo
    const [api, contextHolder] = notification.useNotification();
    const openNotificationUpdateSuccess = (placement) => {
        api.success({
            message: `Thông báo`,
            description: "Chỉnh sửa thành công",
            placement,
        });
    };
    const openNotificationUpdateFail = (placement) => {
        api.error({
            message: `Thông báo`,
            description: "Chỉnh sửa thất bại",
            placement,
        });
    };

    const openNotificationEnable = (placement) => {
        api.success({
            message: `Thông báo`,
            description: "Chỉnh sửa trạng thái thành công",
            placement,
        });
    };
    //#endregion


    //#region - Function - Hiển thị danh sách tin tức/ loại tin tức
    const handleGetAllNew = async () => {
        try {
            const result = await GetAllNewsService();
            if (result.status === 200) {
                setNewList(result.data);
            }
        } catch (error) {
            console.error('Error fetching account user service:', error);
        }
    };

    useEffect(() => {
        handleGetAllNew();
    }, [render]);

    const handleGetAllCategory = async () => {
        try {
            const result = await GetAllNewsCategoryService();
            if (result.status === 200) {
                setNewCategoryList(result.data);
            }
        } catch (error) {
            console.error('Error fetching account user service:', error);
        }
    };

    useEffect(() => {
        handleGetAllCategory();
    }, [render]);
    //#endregion


    //#region - Function - Nhận giá trị input

    const handleEditInputChange = (event) => {
        const field = event.target.name;
        const value = event.target.value;

        setEditData((editData) => ({ ...editData, [field]: value }));
    }

    const handleCreateInputFile = async (event) => {
        if (event == null) {
            return;
        }
        const file = event.target.files[0];

        const imgRef = ref(storage, `images/news_images/${editData.editTitle + v4()}`);
        try {
            const snapshoot = await uploadBytes(imgRef, file);
            const url = await getDownloadURL(snapshoot.ref);
            setImageUpload(url);
        } catch (error) {
            console.error('Error uploading file', error);
        }
    }

    const handleEditTinyValue = (newValue) => {
        setEditData((editData) => ({ ...editData, editContent: newValue }));
    }
    //#endregion 

    //#region - Function -  Chỉnh sửa nội dung tin tức
    const handleViewEdit = (record) => {
        setImageUpload(record.image);
        setEditData({
            editNewsId: record.newsId,
            editCategory: record.categoryName,
            editTitle: record.title,
            editSubTitle: record.subTitle,
            editImage: record.image,
            editContent: record.content,
        });
        setShowEditForm(true);
    }

    const handleEditNews = async () => {
        try {
            const convertedContent = editData.editContent
                .replace(/"/g, "'")
                .replace(/&apos;/g, "'");
            const data = {
                newsId: editData.editNewsId,
                categoryName: editData.editCategory,
                title: editData.editTitle,
                image: imageUpload,
                subTitle: editData.editSubTitle,
                content: convertedContent,
            }
            const result = await EditNewsService(data);
            if (result.status === 200) {
                handleGetAllNew();
                setImageUpload(null);
                openNotificationUpdateSuccess('topRight');
            }
        } catch {
            openNotificationUpdateFail('topRight');
        }

    }

    //#endregion


    //#region - Function - Phê duyệt bài viết
    const handleChangeStatusActivate = async (record) => {
        Modal.confirm({
            title: "Bạn muốn duyệt bài viết này",
            okText: "Đồng ý",
            okType: "default",
            cancelText: "Thoát",
            onOk: async () => {
                const status = "1";
                const result = await ChangeStatusNewsService(record.newsId, status);
                if (result.status === 200) {
                    openNotificationEnable("topRight");
                }
                onSetRender();
            },
            cancelText: "Cancel",
            onCancel: () => { },
        });
    }

    const handleChangeStatusDeActivate = async (record) => {
        Modal.confirm({
            title: "Bạn muốn hủy duyệt bài viết này",
            okText: "Đồng ý",
            okType: "danger",
            cancelText: "Thoát",
            onOk: async () => {
                const status = "0";
                const result = await ChangeStatusNewsService(record.newsId, status);
                console.log(result);
                if (result.status === 200) {
                    openNotificationEnable("topRight");
                }
                onSetRender();
            },
            cancelText: "Cancel",
            onCancel: () => { },
        });
    }
    //#endregion


    return (
        <Layout
            style={{ minHeight: '100vh' }}
        >
            <SiderAdmin />
            {contextHolder}
            <Layout className="site-layout">
                <HeaderAdmin />
                <Content
                    style={{
                        margin: "0 16px",
                    }}
                >
                    <Breadcrumb
                        style={{
                            margin: "16px 0",
                        }}
                    >
                        <Breadcrumb.Item>
                            Trang chủ
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Quản lý</Breadcrumb.Item>
                        <Breadcrumb.Item>Tin tức</Breadcrumb.Item>
                    </Breadcrumb>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                        }}
                    >
                        <div>
                            <h1
                                style={{
                                    textAlign: "center",
                                    fontSize: "30px",
                                    marginBottom: "20px",
                                }}
                            >
                                Danh sách tin tức
                            </h1>
                        </div>

                        <Table
                            columns={columns}
                            dataSource={newList}
                        // pagination={pagination}
                        />

                        <Modal
                            title='Chỉnh sửa tin tức'
                            visible={showEditForm}
                            okText='Lưu'
                            cancelText='Đóng'
                            onCancel={() => {
                                setShowEditForm(false);
                                // setErrors([]);
                                setEditData('');
                            }}
                            onOk={() => handleEditNews()}
                        >
                            <Form>
                                <Form.Item>
                                    <label>Loại tin tức</label>
                                    <select
                                        name="editCategory"
                                        defaultValue="Chọn loại"
                                        value={editData.editCategory}
                                        allowClear
                                        onChange={handleEditInputChange}
                                        className="form-control"
                                    >
                                        <option
                                            value="Chọn loại"
                                        >
                                        </option>
                                        {newCategoryList?.map((item) => (
                                            <option
                                                value={item.categoryName}
                                            >
                                                {item.categoryName}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.editCategory && (
                                        <div
                                            className='invalid-feedback'
                                            style={{ display: 'block', color: 'red' }}
                                        >
                                            {errors.editCategory}
                                        </div>
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    <label className="w-100">Ảnh bìa</label>
                                    <div className="w-100">
                                        {imageUpload == null || imageUpload == "" ? (
                                            <img
                                                src='../Image/Image_Null.png'
                                                alt=''
                                            />
                                        ) : (
                                            <>
                                                {imageUpload && (
                                                    <img
                                                        src={imageUpload}
                                                        alt=''
                                                        className="w-100"
                                                        style={{ overflow: 'hidden', objectFit: 'cover' }}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        onChange={handleCreateInputFile}
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <label>Tiêu đề</label>
                                    <Input
                                        type='text'
                                        placeholder='Nhập tên tiêu đề'
                                        className='form-control'
                                        value={editData.editTitle}
                                        name='editTitle'
                                        onChange={handleEditInputChange}
                                    />
                                    {errors.editTitle && (
                                        <div
                                            className='invalid-feedback'
                                            style={{ display: 'block', color: 'red' }}
                                        >
                                            {errors.editTitle}
                                        </div>
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    <label>Phụ đề</label>
                                    <Input
                                        type='text'
                                        placeholder='Nhập phụ đề'
                                        className='form-control'
                                        value={editData.editSubTitle}
                                        name='editSubTitle'
                                        onChange={handleEditInputChange}
                                    />
                                    {errors.editSubTitle && (
                                        <div
                                            className='invalid-feedback'
                                            style={{ display: 'block', color: 'red' }}
                                        >
                                            {errors.editSubTitle}
                                        </div>
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    <label>Nội dung</label>
                                    <Editor
                                        onEditorChange={(newValue, editor) => {
                                            // setValue(newValue);
                                            // setText(editor.getContent({ format: 'text'}))
                                            // setEditData((editData) => ({ ...editData, editContent: newValue }));
                                            handleEditTinyValue(newValue);
                                        }}
                                        value={editData.editContent}
                                        apiKey="473lgd6gy45zyks1v354pj67gtbc42mmf136ivyozvne7jgh"
                                        // onInit={(evt, editor) => editorRef.current = editor}
                                        initialValue={editData.editContent}
                                        init={{
                                            height: 500,
                                            menubar: false,
                                            plugins: [
                                                'advlist autolink lists link image charmap print preview anchor',
                                                'searchreplace visualblocks code fullscreen',
                                                'insertdatetime media table paste code help wordcount'
                                            ],
                                            toolbar: 'undo redo | formatselect | ' +
                                                'bold italic backcolor | alignleft aligncenter ' +
                                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                                'removeformat | help',
                                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                        }}
                                    />
                                </Form.Item>
                            </Form>
                        </Modal>
                    </div>
                </Content>
            </Layout>
        </Layout>
    )
}