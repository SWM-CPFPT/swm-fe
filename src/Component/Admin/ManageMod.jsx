import { useEffect, useState } from 'react';

import { DatePicker, Breadcrumb, Layout, Table, Input, Modal, Form, notification, Button, theme, Select } from 'antd';
import { SearchOutlined, EditOutlined, PoweroffOutlined } from '@ant-design/icons';
import SiderAdmin from '../../Layout/Admin/SiderAdmin';
import HeaderAdmin from '../../Layout/Admin/HeaderAdmin';
import hanldeValidationEditUser, { hanldeValidationCreateMod } from '../../assets/js/handleValidation';
import dayjs from 'dayjs';
import axios from 'axios';
import { GetAllModService } from '../../services/modService';
import { AddModService } from '../../services/modService';
import { ChangeStatusService } from '../../services/modService';
import { UpdateModService } from '../../services/modService';
import { GetPhoneWithoutThisPhonedService } from '../../services/userService';
import { GetAllEmail } from '../../services/SuperAdminService';
import { hanldeValidationEditMod } from '../../assets/js/handleValidation';
import { GetAllPhoneService } from '../../services/userService';

const { Content } = Layout;

const formatDate = (dateString) => {
    const date = new Date(dateString);

    const year = date.getFullYear().toString().padStart(4, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
};

export default function ManageMod() {
    //#region - Declare - tên cột trong table
    const columns = [
        {
            title: 'ID',
            dataIndex: 'accountId',
            key: 1,
            fixed: 'left',
        },
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            fixed: 'left',
            render: (record) => {
                return (
                    <>
                        {record && record.avatar != null ? (
                            <img
                                src={record}
                                alt='Pic'
                                width={70}
                                height={70}
                                style={{ borderRadius: '50%' }}
                                className='borederRadius50'
                            />
                        ) : (
                            <img
                                src='../Image/Avatar_Null.png'
                                alt='Pic'
                                width={70}
                                height={70}
                                style={{ borderRadius: '50%' }}
                                className='borederRadius50'
                            />
                        )}
                    </>
                );
            },
        },
        {
            title: 'Tên mod',
            dataIndex: 'fullName',
            key: 3,
            fixed: 'left',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
                return (
                    <Input
                        autoFocus
                        placeholder='Nhập tên'
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
                if (record.fullName != null) {
                    return record.fullName.toLowerCase().includes(value.toLowerCase());
                }
            },
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 4,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
                return (
                    <Input
                        autoFocus
                        placeholder='Nhập email'
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
                return record.email.toLowerCase().includes(value.toLowerCase());
            },
        },
        {
            title: 'Số điện thoại',
            // width: 100,
            dataIndex: 'phone',
            key: 1,
            fixed: 'left',
        },
        {
            title: 'Mật khẩu',
            dataIndex: 'password',
            key: 'password',
            fixed: 'left',  
        },
        {
            title: 'Trạng thái',
            // width: 100,
            dataIndex: 'status',
            key: 1,
            fixed: 'left',
        },
        {
            title: 'Điều hướng',
            // width: 100,
            key: 1,
            fixed: 'left',
            render: (record) => {
                return (
                    <>
                        <Button
                            onClick={() => handleEdit(record)}
                            type='primary'
                            icon={<EditOutlined />}
                        ></Button>{' '}
                        &nbsp;
                        {record.status == 'Đang hoạt động' ? (
                            <Button
                                onClick={() => handleChangeStatusDeActivate(record)}
                                style={{ color: 'white', backgroundColor: 'red' }}
                                icon={<PoweroffOutlined />}
                            ></Button>
                        ) : (
                            <></>
                        )}
                        {record.status == 'Đang khóa' ? (
                            <Button
                                onClick={() => handleChangeStatusActivate(record)}
                                style={{ color: 'white', backgroundColor: 'green' }}
                                icon={<PoweroffOutlined />}
                            ></Button>
                        ) : (
                            <></>
                        )}
                    </>
                );
            },
        },
    ];
    //#endregion

    //#region - Declare - các biến dùng
    const dayFormat = 'YYYY-MM-DD';
    const [originPhone, setOriginPhone] = useState('');
    const [dataSource, setDataSource] = useState('');
    const [show, setShow] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [emailList, setEmailList] = useState('');
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const pagination = {
        pageSize: 5,
        total: dataSource.length,
    };
    //#endregion

    //#region - Declare - input và lỗi của mỗi input
    const [errors, setErrors] = useState({
        editFullName: '',
        editPhoneNumber: '',
        editBirthDay: '',
        createFullName: '',
        createEmail: '',
        createPhoneNumber: '',
        createBirthDay: '',
        createGender: '',
    });

    const [editData, setEditData] = useState({
        editUserId: '',
        editAvatar: '',
        editEmail: '',
        editPhoneNumber: '',
        editGender: '',
        editBirthDay: '',
    });

    const [createData, setCreateData] = useState({
        createFullName: '',
        createEmail: '',
        createPhoneNumber: '',
        createGender: '',
        createBirthDay: '',
    });

    //#endregion

    //#region - Function - Hien thi thong bao khi update/changestatus/create
    const [api, contextHolder] = notification.useNotification();
    const openNotificationCreate = (placement) => {
        api.success({
            message: `Thông báo`,
            description: 'Tạo thành công',
            placement,
        });
    };
    const openNotificationUpdate = (placement) => {
        api.success({
            message: `Thông báo`,
            description: 'Chỉnh sửa thành công',
            placement,
        });
    };
    const openNotificationEnable = (placement) => {
        api.success({
            message: `Thông báo`,
            description: 'Thay đổi trạng thái thành công',
            placement,
        });
    };
    //#endregion

    //#region - Function - lấy danh sách mod, email
    const handleGetData = async () => {
        try {
            const result = await GetAllModService();
            if (result.status === 200) {
                setDataSource(result.data);
            }
        } catch (error) {
            console.error('Error fetching mod service:', error);
        }
    };

    useEffect(() => {
        handleGetData();
    }, []);

    //#endregion

    //#region - Function - Deactivate/Activate tài khoản của mod
    const handleChangeStatusDeActivate = (record) => {
        Modal.confirm({
            title: 'Bạn có muốn khóa tài khoản: ' + record.email + ' ?',
            okText: 'Khóa',
            okType: 'danger',
            onOk: async () => {
                const result = await ChangeStatusService(record.accountId, 'Đang khóa');
                if (result.status === 200) {
                    handleGetData();
                    openNotificationEnable('topRight');
                }
            },
            cancelText: 'Hủy',
            onCancel: () => { },
        });
    };

    const handleChangeStatusActivate = (record) => {
        Modal.confirm({
            title: 'Bạn có muốn mở khóa tài khoản này: ' + record.email + ' ?',
            okText: 'Mở',
            okType: 'default',
            onOk: async () => {
                const result = await ChangeStatusService(record.accountId, 'Đang hoạt động');
                if (result) {
                    handleGetData();
                    openNotificationEnable('topRight');
                }
            },
            cancelText: 'Hủy',
            onCancel: () => { },
        });
    };
    //#endregion

    //#region - Function - nhận giá trị trong ô input
    const handleInputChange = (event) => {
        const field = event.target.name;
        const value = event.target.value;

        setEditData((editData) => ({ ...editData, [field]: value }));
    };

    const handleInputChangeDate = (date, name) => {
        setEditData({
            ...editData,
            [name]: formatDate(date),
        });
    };

    const handleInputChangeGender = (value) => {
        setEditData({
            editUserId: editData.editUserId,
            editAvatar: editData.editAvatar,
            editFullName: editData.editFullName,
            editEmail: editData.editEmail,
            editPhoneNumber: editData.editPhoneNumber,
            editBirthDay: editData.editBirthDay,
            editGender: value,
        });
    };

    const handleInputChangeCreate = (event) => {
        const field = event.target.name;
        const value = event.target.value;

        setCreateData((createData) => ({ ...createData, [field]: value }));
    };

    const handleInputChangeDateCreate = (date, name) => {
        setCreateData({
            ...createData,
            [name]: formatDate(date),
        });
    };

    const handleInputChangeCreateGender = (value) => {
        setCreateData({
            createFullName: createData.createFullName,
            createEmail: createData.createEmail,
            createPhoneNumber: createData.createPhoneNumber,
            createBirthDay: createData.createBirthDay,
            createGender: value,
        });
    };

    //#endregion

    //#region - Function - hiển thị và edit user
    const handleEdit = (record) => {
        setEditData({
            editUserId: record.accountId,
            editAvatar: record.avatar,
            editFullName: record.fullName,
            editEmail: record.email,
            editPhoneNumber: record.phone,
            editBirthDay: record.birthDay,
            editGender: record.gender,
        });
        setOriginPhone(record.phone);
        setShow(true);
    };

    const handleFunctionEdit = async () => {
        let errors = {};
        var data = {
            accountId: editData.editUserId,
            fullName: editData.editFullName,
            phone: editData.editPhoneNumber,
            gender: editData.editGender,
            birthDay: editData.editBirthDay,
        };
        const resultcheckPhone = await GetPhoneWithoutThisPhonedService(originPhone);
        hanldeValidationEditMod(editData, errors, resultcheckPhone.data);
        if (Object.keys(errors).length === 0) {
            const result = await UpdateModService(data.accountId, data);
            if (result.status === 200) {
                handleGetData();
                openNotificationUpdate('topRight');
                setErrors([]);
                setShow(false);
                setEditData({
                    createFullName: '',
                    createEmail: '',
                    createPhoneNumber: '',
                    createGender: '',
                    createBirthDay: '',
                });
            }
        } else {
            setErrors(errors);
        }

    };
    //#endregion

    //#region - Function - Thêm mod
    const handleSubmitCreate = async () => {
        let errors = {};
        const data = {
            email: createData.createEmail,
            fullName: createData.createFullName,
            birthDay: createData.createBirthDay,
            phone: createData.createPhoneNumber,
            gender: createData.createGender,
        };
        const resultcheckPhone = await GetAllPhoneService();
        const resultcheckEmail = await GetAllEmail();
        hanldeValidationCreateMod(createData, errors, resultcheckEmail.data, resultcheckPhone);
        if (Object.keys(errors).length === 0) {
            const result = await AddModService(data);
            if (result.status === 200) {
                handleGetData();
                setErrors([]);
                openNotificationCreate('topRight');
                setShowCreate(false);
                setCreateData('');
            }
        } else {
            setErrors(errors);
        }
    };
    //#endregion

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <SiderAdmin />
            <Layout className='site-layout'>
                <HeaderAdmin />
                {contextHolder}

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
                        <Breadcrumb.Item>Mod</Breadcrumb.Item>
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
                                    textAlign: 'center',
                                    fontSize: '30px',
                                    marginBottom: '20px',
                                }}
                            >
                                Danh sách Mod
                            </h1>
                        </div>
                        <Button
                            type='primary'
                            onClick={() => {
                                setShowCreate(true);
                            }}
                            style={{ marginBottom: '20px', marginRight: '10px' }}
                        >
                            Tạo mới mod
                        </Button>
                        <Table
                            columns={columns}
                            dataSource={dataSource}
                            pagination={pagination}
                        />
                        {/* Form Edit */}
                        <Modal
                            title='Chỉnh sửa thông tin mod'
                            visible={show}
                            okText='Lưu'
                            cancelText='Đóng'
                            onCancel={() => {
                                setShow(false);
                                setErrors([]);
                                setEditData('');
                            }}
                            onOk={() => handleFunctionEdit()}
                        >
                            <div
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    marginBottom: '20px',
                                }}
                            >
                                <div>
                                    <p
                                        style={{
                                            textAlign: 'center',
                                            marginBottom: '10px',
                                            fontSize: '15px',
                                            fontWeight: '600',
                                        }}
                                    >
                                        Avatar
                                    </p>
                                    {editData.editAvatar != null ? (
                                        <img
                                            src={editData.editAvatar}
                                            alt='Pic'
                                            width={70}
                                            height={70}
                                            className='borederRadius50'
                                        />
                                    ) : (
                                        <img
                                            src='../Image/Avatar_Null.png'
                                            alt='Pic'
                                            width={70}
                                            height={70}
                                            className='borederRadius50'
                                        />
                                    )}
                                </div>
                            </div>

                            <Form>
                                <Form.Item>
                                    <label>Tên</label>
                                    <Input
                                        type='text'
                                        placeholder='Nhập tên'
                                        className='form-control'
                                        value={editData.editFullName}
                                        name='editFullName'
                                        onChange={handleInputChange}
                                    />
                                    {errors.editFullName && (
                                        <div
                                            className='invalid-feedback'
                                            style={{ display: 'block', color: 'red' }}
                                        >
                                            {errors.editFullName}
                                        </div>
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    <label>Email</label>
                                    <Input
                                        type='email'
                                        placeholder='Nhập email'
                                        className='form-control'
                                        value={editData.editEmail}
                                        name='editEmail'
                                        onChange={handleInputChange}
                                        disabled
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <label>Số điện thoại</label>
                                    <Input
                                        type='phonenumber'
                                        placeholder='Nhập số điện thoại'
                                        className='form-control'
                                        value={editData.editPhoneNumber}
                                        name='editPhoneNumber'
                                        onChange={handleInputChange}
                                    />
                                    {errors.editPhoneNumber && (
                                        <div
                                            className='invalid-feedback'
                                            style={{ display: 'block', color: 'red' }}
                                        >
                                            {errors.editPhoneNumber}
                                        </div>
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    <label style={{ display: 'block' }}>Giới tính</label>
                                    <Select
                                        value={editData.editGender}
                                        name='editGender'
                                        style={{ width: '100%' }}
                                        onChange={handleInputChangeGender}
                                        options={[
                                            { value: 'Nam', label: 'Nam' },
                                            { value: 'Nữ', label: 'Nữ' },
                                            { value: 'Khác', label: 'Khác' },
                                        ]}
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <label>Ngày sinh:</label>
                                    <DatePicker
                                        className='form-control'
                                        style={{ width: '100%' }}
                                        name='editBirthDay'
                                        value={editData.editBirthDay ? dayjs(editData.editBirthDay, dayFormat) : null}
                                        onChange={(date) => handleInputChangeDate(date, 'editBirthDay')}
                                    />
                                    {errors.editBirthDay && (
                                        <div
                                            className='invalid-feedback'
                                            style={{ display: 'block', color: 'red' }}
                                        >
                                            {errors.editBirthDay}
                                        </div>
                                    )}
                                </Form.Item>
                            </Form>
                        </Modal>

                        {/* Create form */}
                        <Modal
                            title='Thêm mới mod'
                            visible={showCreate}
                            okText='Thêm mới'
                            cancelText='Đóng'
                            onCancel={() => {
                                setShowCreate(false);
                                setErrors([]);
                                setCreateData('');
                            }}
                            onOk={() => handleSubmitCreate()}
                        >
                            <Form>
                                <Form.Item>
                                    <label>Tên</label>
                                    <Input
                                        type='text'
                                        placeholder='Nhập tên'
                                        className='form-control'
                                        value={createData.createFullName}
                                        name='createFullName'
                                        onChange={handleInputChangeCreate}
                                    />
                                    {errors.createFullName && (
                                        <div
                                            className='invalid-feedback'
                                            style={{ display: 'block', color: 'red' }}
                                        >
                                            {errors.createFullName}
                                        </div>
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    <label>Email</label>
                                    <Input
                                        type='email'
                                        placeholder='Nhập email'
                                        className='form-control'
                                        value={createData.createEmail}
                                        name='createEmail'
                                        onChange={handleInputChangeCreate}
                                    />
                                    {errors.createEmail && (
                                        <div
                                            className='invalid-feedback'
                                            style={{ display: 'block', color: 'red' }}
                                        >
                                            {errors.createEmail}
                                        </div>
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    <label>Số điện thoại</label>
                                    <Input
                                        type='phonenumber'
                                        placeholder='Nhập số điện thoại'
                                        className='form-control'
                                        value={createData.createPhoneNumber}
                                        name='createPhoneNumber'
                                        onChange={handleInputChangeCreate}
                                    />
                                    {errors.createPhoneNumber && (
                                        <div
                                            className='invalid-feedback'
                                            style={{ display: 'block', color: 'red' }}
                                        >
                                            {errors.createPhoneNumber}
                                        </div>
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    <label style={{ display: 'block' }}>Giới tính</label>
                                    <Select
                                        placeholder='Chọn giới tính'
                                        name='createGender'
                                        style={{ width: '100%' }}
                                        onChange={handleInputChangeCreateGender}
                                        options={[
                                            { value: 'Nam', label: 'Nam' },
                                            { value: 'Nữ', label: 'Nữ' },
                                            { value: 'Khác', label: 'Khác' },
                                        ]}
                                    />
                                    {errors.createGender && (
                                        <div
                                            className='invalid-feedback'
                                            style={{ display: 'block', color: 'red' }}
                                        >
                                            {errors.createGender}
                                        </div>
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    <label>Ngày sinh:</label>

                                    <DatePicker
                                        className='form-control'
                                        style={{ width: '100%' }}
                                        name='createBirthDay'
                                        placeholder='Chọn ngày'
                                        onChange={(date) => handleInputChangeDateCreate(date, 'createBirthDay')}
                                    />
                                    {errors.createBirthDay && (
                                        <div
                                            className='invalid-feedback'
                                            style={{ display: 'block', color: 'red' }}
                                        >
                                            {errors.createBirthDay}
                                        </div>
                                    )}
                                </Form.Item>
                            </Form>
                        </Modal>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}
