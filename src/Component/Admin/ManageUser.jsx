import { useEffect, useState, useContext } from "react";
import { DatePicker, Dropdown, Breadcrumb, Layout, Table, Input, Modal, Form, notification, Button, theme, Card, Timeline, Tooltip, Select } from 'antd';
import {
    SearchOutlined, ClockCircleOutlined, CheckCircleOutlined,
    EditOutlined, PoweroffOutlined, ManOutlined, WomanOutlined, HomeOutlined
} from '@ant-design/icons'
import SiderAdmin from "../../Layout/Admin/SiderAdmin";
import HeaderAdmin from "../../Layout/Admin/HeaderAdmin";
import dayjs from "dayjs";


import { UserContext } from "../../contexts/UserContext";
import hanldeValidationEditUser from "../../assets/js/handleValidation";
import { GetAllAccountUser } from "../../services/AccountUserService";
import { UpdateUserService } from "../../services/AccountUserService";
import { ChangeStatusService } from "../../services/AccountUserService";
import { GetPhoneWithoutThisPhonedService } from "../../services/userService";


const { Content } = Layout;


export default function ManageUser() {

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    //#region - Declare - tên cột trong table
    const columns = [
        {
            title: "ID",
            dataIndex: "accountId",
            key: 1,
            fixed: "left",
        },
        {
            title: "Avatar",
            dataIndex: "avatar",
            key: "avatar",
            fixed: "left",
            render: (record) => {
                if (record != null) {
                    return (
                        <img
                            src={record}
                            alt="Pic"
                            width={70}
                            height={70}
                            style={{ borderRadius: "50%", objectFit: "cover" }}
                            className="borderRadius50"
                        />
                    );
                } else {
                    return (
                        <img
                            src="../Image/Avatar_Null.png"
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
            title: "Tên người dùng",
            dataIndex: "fullName",
            key: 3,
            fixed: "left",
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
                return (
                    <Input
                        autoFocus
                        placeholder="Nhập tên"
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
            title: "Email",
            dataIndex: "email",
            key: 4,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
                return (
                    <Input
                        autoFocus
                        placeholder="Nhập email"
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
            title: "Số điện thoại",
            dataIndex: "phone",
            key: 1,
            fixed: "left",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: 1,
            fixed: "left",
        },
        {
            title: "Điều hướng",
            key: 1,
            fixed: "left",
            render: (record) => {
                return (
                    <>
                        <Button
                            onClick={() => handleEdit(record)}
                            type="primary"
                            icon={<EditOutlined />}
                        ></Button>{" "}
                        &nbsp;
                        {record.status == "Đang hoạt động" ? (
                            <Button
                                onClick={() => handleChangeStatusDeActivate(record)}
                                style={{ color: "white", backgroundColor: "red" }}
                                icon={<PoweroffOutlined />}
                            ></Button>
                        ) : (
                            <></>
                        )}
                        {record.status == "Đang khóa" ? (
                            <Button
                                onClick={() => handleChangeStatusActivate(record)}
                                style={{ color: "white", backgroundColor: "green" }}
                                icon={<PoweroffOutlined />}
                            ></Button>
                        ) : (
                            <></>
                        )}
                    </>
                );
            },
        },
    ]
    //#endregion

    //#region - Declare - các biến dùng 
    const dayFormat = "YYYY-MM-DD";
    const [dataSource, setDataSource] = useState('');
    const [show, setShow] = useState(false);
    const { render, onSetRender } = useContext(UserContext);
    const [originPhone, setOriginPhone] = useState("");
    const pagination = {
        pageSize: 5,
        total: dataSource != null ? dataSource.length : "",
    };
    //#endregion

    //#region - Declare - input và lỗi của mỗi input  

    const [errors, setErrors] = useState({
        editFullName: "",
        editPhoneNumber: "",
        editBirthDay: "",
    });

    const [editData, setEditData] = useState({
        editUserId: "",
        editAvatar: "",
        editEmail: "",
        editFullName: "",
        editPhoneNumber: "",
        editGender: "",
        editBirthDay: "",
        editSchoolName: "",
    });
    //#endregion

    //#region - Function - hiển thị thông báo create/update/changeStatus
    const [api, contextHolder] = notification.useNotification();
    const openNotificationUpdate = (placement) => {
        api.success({
            message: `Thông báo`,
            description: "Chỉnh sửa thành công",
            placement,
        });
    };
    const openNotificationEnable = (placement) => {
        api.success({
            message: `Thông báo`,
            description: "Thay đổi trạng thái thành công",
            placement,
        });
    };

    //#endregion

    //#region - Function - hiển thị detail khi hover vào mỗi record
    const customTooltip = (data) => {
        return (
            <Card
                style={{
                    width: "400px",
                }}
                title="User Details"
            >
                <Timeline
                    mode={"left"}
                    items={[
                        {
                            label: "Gender",
                            children: data.gender ? "Male" : " Female",
                            dot: data.gender == "1" ? <ManOutlined /> : <WomanOutlined />,
                            color: "blue",
                        },
                        {
                            label: "Birth Day",
                            children: data.birthDay,
                            dot: <ClockCircleOutlined />,
                            color: "orange",
                        },
                        {
                            label: "School Name",
                            children: data.schoolName,
                            dot: <HomeOutlined />,
                            color: "purple",
                        },
                        {
                            label: "Create Date",
                            children: data.createDate,
                            dot: <CheckCircleOutlined />,
                            color: "black",
                        }
                    ]}
                />
            </Card>
        );
    };
    const CustomRow = (properties) => {
        if (properties.children[0] != undefined) {
            let rowData = properties.children[0].props.record;
            let tooltip = customTooltip(rowData);
            return (
                <Tooltip
                    title={tooltip}
                    color={"#fff"}
                    key={"#fff"}
                    placement="topLeft"
                >
                    <tr {...properties} />
                </Tooltip>
            );
        }
        return <tr {...properties} />;
    };
    //#endregion

    //#region - Function - nhận giá trị input
    const handleInputChange = (event) => {
        const field = event.target.name;
        const value = event.target.value;

        setEditData((editData) => ({ ...editData, [field]: value }));
    };

    const handleInputChangeDate = (date, name) => {
        setEditData({
            ...editData,
            [name]: formatDate(date, dayFormat),
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        const year = date.getFullYear().toString().padStart(4, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");

        const formattedDate = `${year}-${month}-${day}`;

        return formattedDate;
    };
    //#endregion

    //#region - Function - Deactivate/Activate tài khoản user
    const handleChangeStatusDeActivate = async (record) => {
        Modal.confirm({
            title: "Bạn muốn khóa tài khoản: " + record.email + " ?",
            okText: "Khóa",
            cancelText: "Thoát",
            okType: "danger",
            onOk: async () => {
                const status = "Đang khóa";
                // const result = handleChangeStatus(record.accountId, status);
                const result = await ChangeStatusService(record.accountId, status);
                if (result.status === 200) {
                    openNotificationEnable("topRight");
                }
                onSetRender();
            },
            cancelText: "Cancel",
            onCancel: () => { },
        });
    }

    const handleChangeStatusActivate = (record) => {
        Modal.confirm({
            title: "Bạn muốn mở khóa tài khoản: " + record.email + " ?",
            okText: "Mở",
            okType: "default",
            cancelText: "Thoát",
            onOk: async () => {
                const status = "Đang hoạt động";
                // handleChangeStatus(record.accountId, status);
                const result = await ChangeStatusService(record.accountId, status);
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
            editSchoolName: record.schoolName,
        });
        setOriginPhone(record.phone);
        setShow(true);
    }

    const handleFunctionEdit = async () => {
        let errors = {};
        const data = {
            accountId: editData.editUserId,
            email: editData.editEmail,
            fullName: editData.editFullName,
            birthDay: editData.editBirthDay,
            phone: editData.editPhoneNumber,
            schoolName: editData.editSchoolName,
            gender: editData.editGender,
        }
        console.log(data);
        var result = await GetPhoneWithoutThisPhonedService(originPhone)
        hanldeValidationEditUser(editData, errors, result.data);
        if (Object.keys(errors).length === 0) {
            setErrors([]);
            const result = await UpdateUserService(data);
            if (result.status === 200) {
                openNotificationUpdate("topRight");
            }
            onSetRender();
        } else {
            setErrors(errors);
        }
    }

    //#endregion


    //#region - Function - lấy list User/Phone
    const handleGetAllAccountUser = async () => {
        try {
            const result = await GetAllAccountUser();
            if (result.status === 200) {
                setDataSource(result.userList);
            }
        } catch (error) {
            console.error('Error fetching account user service:', error);
        }
    }

    useEffect(() => {
        handleGetAllAccountUser();
    }, [render]);

    //#endregion


    return (
        <Layout
            style={{ minHeight: '100vh' }}
        >
            <SiderAdmin />
            <Layout className="site-layout">
                <HeaderAdmin />
                {contextHolder}

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
                        <Breadcrumb.Item>Người dùng</Breadcrumb.Item>
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
                                Danh sách người dùng
                            </h1>
                        </div>
                        <Table
                            columns={columns}
                            dataSource={dataSource}
                            components={{
                                body: {
                                    row: CustomRow,
                                },
                            }}
                            pagination={pagination}
                        />

                        {/* Form Edit */}
                        <Modal
                            title="Chỉnh sửa thôi tin người dùng"
                            visible={show}
                            okText="Save Change"
                            onCancel={() => { setShow(false); setErrors([]); setEditData("") }}
                            onOk={() => handleFunctionEdit()}
                        >
                            <div
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    marginBottom: "20px",
                                }}
                            >
                                <div>
                                    <p
                                        style={{
                                            textAlign: "center",
                                            marginBottom: "10px",
                                            fontSize: "15px",
                                            fontWeight: "600",
                                        }}
                                    >
                                        Avatar
                                    </p>
                                    {editData.editAvatar != null ? (
                                        <img
                                            src={editData.editAvatar}
                                            alt="Pic"
                                            width={70}
                                            height={70}
                                            className="borederRadius50"
                                            style={{ objectFit: 'cover', borderRadius: '50%' }}
                                        />)
                                        : (
                                            <img
                                                src='../Image/Avatar_Null.png'
                                                alt="Pic"
                                                width={70}
                                                height={70}
                                                className="borederRadius50"
                                                style={{ objectFit: 'cover', borderRadius: '50%' }} />
                                        )
                                    }

                                </div>
                            </div>

                            <Form>
                                <Form.Item>
                                    <label>Tên</label>
                                    <Input
                                        type="text"
                                        placeholder="Nhập tên"
                                        className="form-control"
                                        value={editData.editFullName}
                                        name="editFullName"
                                        onChange={handleInputChange}
                                    />
                                    {errors.editFullName && (
                                        <div
                                            className="invalid-feedback"
                                            style={{ display: "block", color: "red" }}
                                        >
                                            {errors.editFullName}
                                        </div>
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    <label>Email</label>
                                    <Input
                                        type="email"
                                        placeholder="Nhập email"
                                        className="form-control"
                                        value={editData.editEmail}
                                        disabled
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <label>Số điện thoại</label>
                                    <Input
                                        type="phonenumber"
                                        placeholder="Nhập số điện thoại"
                                        className="form-control"
                                        value={editData.editPhoneNumber}
                                        name="editPhoneNumber"
                                        onChange={handleInputChange}
                                    />
                                    {errors.editPhoneNumber && (
                                        <div
                                            className="invalid-feedback"
                                            style={{ display: "block", color: "red" }}
                                        >
                                            {errors.editPhoneNumber}
                                        </div>
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    <label style={{ display: 'block' }}>Giới tính</label>
                                    <select
                                        id='cars'
                                        className='form-control w-100'
                                        value={editData.editGender}
                                        name='editGender'
                                        onChange={handleInputChange}
                                    >
                                        <option value='Nam'>Nam</option>
                                        <option value='Nữ'>Nữ</option>
                                        <option value='Khác'>Khác</option>
                                    </select>
                                </Form.Item>
                                <Form.Item>
                                    <label>Ngày sinh:</label>

                                    <DatePicker
                                        className="form-control"
                                        style={{ width: "100%" }}
                                        format="YYYY-MM-DD"
                                        name="editBirthDay"
                                        value={editData.editBirthDay ? dayjs(editData.editBirthDay, dayFormat) : null}
                                        onChange={(date) => handleInputChangeDate(date, "editBirthDay")}
                                    />
                                    {errors.editBirthDay && (
                                        <div
                                            className="invalid-feedback"
                                            style={{ display: "block", color: "red" }}
                                        >
                                            {errors.editBirthDay}
                                        </div>
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    <label style={{ display: 'block' }}>Trường học</label>
                                    <Input
                                        type="phonenumber"
                                        placeholder="Nhập tên trường học"
                                        className="form-control"
                                        value={editData.editSchoolName}
                                        name="editSchoolName"
                                        onChange={handleInputChange}
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