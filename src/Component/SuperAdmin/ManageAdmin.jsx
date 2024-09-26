import { useEffect, useState } from "react";

import {
  Breadcrumb,
  Layout,
  Table,
  Input,
  Modal,
  Form,
  notification,
  Button,
  theme,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
import SiderAdmin from "../../Layout/Admin/SiderAdmin";
import HeaderAdmin from "../../Layout/Admin/HeaderAdmin";

import { GetAllSAdmin } from "../../services/SuperAdminService";
import { GetAllEmail } from "../../services/SuperAdminService";
import { ChangeStatusAdminService } from "../../services/SuperAdminService";
import { UpdateAdminService } from "../../services/SuperAdminService";
import { hanldeValidationEditAdmin } from "../../assets/js/handleValidation";
import { hanldeValidationCreateAdmin } from "../../assets/js/handleValidation";
import { AddAdminService } from "../../services/SuperAdminService";
import {
  GetAllPhoneService,
  GetPhoneWithoutThisPhonedService,
} from "../../services/userService";

const { Content } = Layout;

export default function ManageAdmin() {
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
      title: "Tên admin",
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
      // width: 100,
      dataIndex: "phone",
      key: 1,
      fixed: "left",
    },
    {
      title: "Mật khẩu",
      // width: 100,
      dataIndex: "password",
      key: 1,
      fixed: "left",
    },
    {
      title: "Trạng thái",
      // width: 100,
      dataIndex: "status",
      key: 1,
      fixed: "left",
    },
    {
      title: "Điều hướng",
      // width: 100,
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
            {record.status === "ACTIVE" ? (
              <Button
                onClick={() => handleChangeStatusDeActivate(record)}
                style={{ color: "white", backgroundColor: "red" }}
                icon={<PoweroffOutlined />}
              ></Button>
            ) : (
              <></>
            )}
            {record.status === "INACTIVE" ? (
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
  ];
  //#endregion

  //#region - Function - Khai báo các biến cần dùng
  const [dataSource, setDataSource] = useState("");
  const [show, setShow] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [emailList, setEmailList] = useState("");
  const [originPhone, setOriginPhone] = useState("");
  const pagination = {
    pageSize: 5,
    total: dataSource.length,
  };
  const [createData, setCreateData] = useState({
    createFullName: "",
    createEmail: "",
    createPhoneNumber: "",
    createPassword: "",
  });
  const [editData, setEditData] = useState({
    editUserId: "",
    editEmail: "",
    editFullName: "",
    editPhoneNumber: "",
    editPassword: "",
  });

  const [errors, setErrors] = useState({
    editEmail: "",
    editFullName: "",
    editPhoneNumber: "",
    editPasswod: "",
    createFullName: "",
    createEmail: "",
    createPhoneNumber: "",
    createPassword: "",
  });
  //#endregion

  //#region - Function - Hien thi thong bao khi update/changestatus/create
  const [api, contextHolder] = notification.useNotification();
  const openNotificationGetData400 = (placement) => {
    api.error({
      message: `Thông báo`,
      description: "Lấy dữ liệu thất bại",
      placement,
    });
  };
  const openNotificationCreate200 = (placement) => {
    api.success({
      message: `Thông báo`,
      description: "Tạo thành công",
      placement,
    });
  };
  const openNotificationCreate400 = (placement) => {
    api.error({
      message: `Thông báo`,
      description: "Tạo thất bại",
      placement,
    });
  };
  const openNotificationUpdate200 = (placement) => {
    api.success({
      message: `Thông báo`,
      description: "Chỉnh sửa thành công",
      placement,
    });
  };
  const openNotificationUpdate400 = (placement) => {
    api.error({
      message: `Thông báo`,
      description: "Chỉnh sửa thất bại",
      placement,
    });
  };
  const openNotificationEnable200 = (placement) => {
    api.success({
      message: `Thông báo`,
      description: "Thay đổi trạng thái thành công",
      placement,
    });
  };
  const openNotificationEnable400 = (placement) => {
    api.error({
      message: `Thông báo`,
      description: "Thay đổi trạng thái thất bại",
      placement,
    });
  };
  //#endregion

  //#region - Function - lấy danh sách admin, email
  const handleGetData = async () => {
    try {
      const result = await GetAllSAdmin();
      if (result.status === 200) {
        setDataSource(result.data);
      } else {
        openNotificationGetData400("topRight");
      }
      const result2 = await GetAllEmail();
      if (result2.status === 200) {
        setEmailList(result2.data);
      } else {
        openNotificationGetData400("topRight");
      }
    } catch (error) {
      openNotificationGetData400("topRight");
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);

  //#endregion

  //#region - Function - thay đổi trạng thái
  const handleChangeStatusDeActivate = (record) => {
    Modal.confirm({
      title: "Bạn có muốn khóa tài khoản: " + record.email + " ?",
      okText: "Khóa",
      okType: "danger",
      onOk: async () => {
        const result = await ChangeStatusAdminService(
          record.accountId,
          "INACTIVE"
        );
        if (result.status === 200) {
          handleGetData();
          openNotificationEnable200("topRight");
        } else {
          openNotificationEnable400("topRight");
        }
      },
      cancelText: "Đóng",
      onCancel: () => {},
    });
  };

  const handleChangeStatusActivate = (record) => {
    Modal.confirm({
      title: "Bạn có muốn kích hoạt tài khoản này: " + record.email + " ?",
      okText: "Kích hoạt",
      okType: "default",
      onOk: async () => {
        const result = await ChangeStatusAdminService(
          record.accountId,
          "ACTIVE"
        );
        if (result.status === 200) {
          handleGetData();
          openNotificationEnable200("topRight");
        } else {
          openNotificationEnable400("topRight");
        }
      },
      cancelText: "Đóng",
      onCancel: () => {},
    });
  };
  //#endregion

  //#region - Function - nhận giá trị input
  const handleInputChangeCreate = (event) => {
    const field = event.target.name;
    const value = event.target.value;

    setCreateData((createData) => ({ ...createData, [field]: value }));
  };
  const handleInputChange = (event) => {
    const field = event.target.name;
    const value = event.target.value;

    setEditData((editData) => ({ ...editData, [field]: value }));
  };
  //#endregion

  //#region - Function - hiển thị và edit admin
  const handleEdit = (record) => {
    setEditData({
      editUserId: record.accountId,
      editFullName: record.fullName,
      editEmail: record.email,
      editPhoneNumber: record.phone,
      editPassword: record.password,
    });
    setOriginPhone(record.phone);
    setShow(true);
  };

  const handleFunctionEdit = async () => {
    let errors = {};
    var data = {
      accountId: editData.editUserId,
      email: editData.editEmail,
      fullName: editData.editFullName,
      phone: editData.editPhoneNumber,
      password: editData.editPassword,
    };
    const phoneCheck = await GetPhoneWithoutThisPhonedService(originPhone);
    hanldeValidationEditAdmin(editData, errors, phoneCheck.data);
    if (Object.keys(errors).length === 0) {
      const result = await UpdateAdminService(data);
      if (result.status === 200) {
        handleGetData();
        openNotificationUpdate200("topRight");
        setErrors([]);
        setShow(false);
        setEditData("");
      } else {
        openNotificationUpdate400("topRight");
      }
    } else {
      setErrors(errors);
    }
  };
  //#endregion

  //#region - Function - thêm admin
  const handleSubmitCreate = async () => {
    let errors = {};
    const data = {
      email: createData.createEmail,
      fullName: createData.createFullName,
      phone: createData.createPhoneNumber,
      password: createData.createPassword,
    };
    const checkPhone = await GetAllPhoneService();
    hanldeValidationCreateAdmin(createData, errors, emailList, checkPhone);
    if (Object.keys(errors).length === 0) {
      const result = await AddAdminService(data);
      if (result.status === 200) {
        handleGetData();
        setErrors([]);
        openNotificationCreate200("topRight");
        setShowCreate(false);
        setCreateData("");
      } else {
        openNotificationCreate400("topRight");
      }
    } else {
      setErrors(errors);
    }
  };
  //#endregion

  return (
    <Layout style={{ minHeight: "100vh" }}>
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
            <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
            <Breadcrumb.Item>Quản lý</Breadcrumb.Item>
            <Breadcrumb.Item>Admin</Breadcrumb.Item>
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
                Danh sách Admin
              </h1>
            </div>
            <Button
              type="primary"
              onClick={() => {
                setShowCreate(true);
              }}
              style={{ marginBottom: "20px", marginRight: "10px" }}
            >
              Tạo mới Admin
            </Button>
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={pagination}
            />
            {/* Form Edit */}
            <Modal
              title="Chỉnh sửa thông tin admin"
              visible={show}
              okText="Lưu"
              cancelText="Đóng"
              onCancel={() => {
                setShow(false);
                setErrors([]);
                setEditData("");
              }}
              onOk={() => handleFunctionEdit()}
            >
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
                    name="editEmail"
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
                  <label>Mật khẩu</label>
                  <Input
                    type="phonenumber"
                    placeholder="Nhập mật khẩu"
                    className="form-control"
                    value={editData.editPassword}
                    name="editPassword"
                    onChange={handleInputChange}
                  />
                  {errors.editPassword && (
                    <div
                      className="invalid-feedback"
                      style={{ display: "block", color: "red" }}
                    >
                      {errors.editPassword}
                    </div>
                  )}
                </Form.Item>
              </Form>
            </Modal>

            {/* Create form */}
            <Modal
              title="Thêm mới admin"
              visible={showCreate}
              okText="Thêm mới"
              cancelText="Đóng"
              onCancel={() => {
                setShowCreate(false);
                setErrors([]);
                setCreateData("");
              }}
              onOk={() => handleSubmitCreate()}
            >
              <Form>
                <Form.Item>
                  <label>Tên</label>
                  <Input
                    type="text"
                    placeholder="Nhập tên"
                    className="form-control"
                    value={createData.createFullName}
                    name="createFullName"
                    onChange={handleInputChangeCreate}
                  />
                  {errors.createFullName && (
                    <div
                      className="invalid-feedback"
                      style={{ display: "block", color: "red" }}
                    >
                      {errors.createFullName}
                    </div>
                  )}
                </Form.Item>
                <Form.Item>
                  <label>Email</label>
                  <Input
                    type="email"
                    placeholder="Nhập email"
                    className="form-control"
                    value={createData.createEmail}
                    name="createEmail"
                    onChange={handleInputChangeCreate}
                  />
                  {errors.createEmail && (
                    <div
                      className="invalid-feedback"
                      style={{ display: "block", color: "red" }}
                    >
                      {errors.createEmail}
                    </div>
                  )}
                </Form.Item>
                <Form.Item>
                  <label>Số điện thoại</label>
                  <Input
                    type="phonenumber"
                    placeholder="Nhập số điện thoại"
                    className="form-control"
                    value={createData.createPhoneNumber}
                    name="createPhoneNumber"
                    onChange={handleInputChangeCreate}
                  />
                  {errors.createPhoneNumber && (
                    <div
                      className="invalid-feedback"
                      style={{ display: "block", color: "red" }}
                    >
                      {errors.createPhoneNumber}
                    </div>
                  )}
                </Form.Item>
                <Form.Item>
                  <label>Mật khẩu</label>
                  <Input
                    type="phonenumber"
                    placeholder="Nhập mật khẩu"
                    className="form-control"
                    value={createData.createPassword}
                    name="createPassword"
                    onChange={handleInputChangeCreate}
                  />
                  {errors.createPassword && (
                    <div
                      className="invalid-feedback"
                      style={{ display: "block", color: "red" }}
                    >
                      {errors.createPassword}
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
