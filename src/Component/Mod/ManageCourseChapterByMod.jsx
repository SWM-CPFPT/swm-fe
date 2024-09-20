import { useEffect, useState, useContext } from "react";

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
  FolderOpenOutlined,
  EditOutlined,
} from "@ant-design/icons";
import SiderAdmin from "../../Layout/Admin/SiderAdmin";
import HeaderAdmin from "../../Layout/Admin/HeaderAdmin";
import { UserContext } from "../../contexts/UserContext";
import {useNavigate } from "react-router-dom";
import { ChangeStatusTopicService } from "../../services/topicService";
import { GetAllSubjectService } from "../../services/subjectService";
import "../../assets/Admin.css";
import {
  AddChapterService,
  GetAllChapterService,
  GetAllChapterByToPicIdService,
  UpdateChapterService,
} from "../../services/chapterService";

const { Content } = Layout;

export default function ManageTopicByMod() {
  // const dayFormat = "YYYY-MM-DD HH:mm";
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  //#region - Declare - Khai bao cac bien
  const columns = [
    {
      title: "ID",
      dataIndex: "chapterId",
      dataIndex: "chapterId",
      fixed: "left",
    },

    {
      title: "Môn học",
      dataIndex: ["subject", "subjectName"],
      key: "subjectName",
      fixed: "left",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <Input
            autoFocus
            placeholder="Nhập môn học"
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
        if (record.subjectName != null) {
          return record.subjectName.toLowerCase().includes(value.toLowerCase());
        }
      },
    },

    {
      title: "Tên Chương",
      dataIndex: "chapterTitle",
      key: "chapterTitle",
      width: 600,
      fixed: "left",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <Input
            autoFocus
            placeholder="Nhập tên đề"
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
        if (record.topicName != null) {
          return record.topicName.toLowerCase().includes(value.toLowerCase());
        }
      },
    },

    {
      title: "Lớp",
      dataIndex: ["grade", "nameGrade"],
      key: "nameGrade",
      fixed: "left",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <Input
            autoFocus
            placeholder="Nhập lớp"
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
        if (record.grade != null) {
          const gradeNumber = Number(record.grade);
          return !isNaN(gradeNumber) && gradeNumber === Number(value);
        }
      },
    },

    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      fixed: "left",
      render: (status) => (status ? "Đã duyệt" : "Chưa duyệt"),
    },
    {
      title: "Điều hướng",
      key: 6,
      fixed: "left",
      render: (record) => {
        return (
          <>
            <Button
              onClick={() => handleViewEdit(record)}
              type="primary"
              icon={<EditOutlined />}
            ></Button>{" "}
            &nbsp;
            <Button
              icon={<FolderOpenOutlined />}
              style={{ background: "#ffa000", color: "white" }}
              onClick={() => handleViewListQuestion(record)}
            ></Button>
          </>
        );
      },
    },
  ];
  const navigate = useNavigate();
  const { user, render, onSetRender } = useContext(UserContext);
  const [dataSource, setDataSource] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [createData, setCreateData] = useState({
    mainContent: "",
  });
const [chapterId,setChapterId] = useState(null)
  const [editData, setEditData] = useState({
    editSubjectId: "",
    editGrade: "",
    editChapterName: "",
  });

  const [errors, setErrors] = useState({
    createSubjectId: "",
    createGrade: "",
    createChapterName: "",
    editSubjectId: "",
    editGrade: "",
    editChapterName: "",
  });

  //#endregion

  //#region - Function - hiển thị thông báo create/update/changeStatus
  const [api, contextHolder] = notification.useNotification();
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
  const openNotificationChangeStatus200 = (placement) => {
    api.success({
      message: `Thông báo`,
      description: "Thay đổi trạng thái thành công",
      placement,
    });
  };
  const openNotificationChangeStatus400 = (placement) => {
    api.error({
      message: `Thông báo`,
      description: "Thay đổi trạng thái thất bại",
      placement,
    });
  };
  const openNotificationCreate200 = (placement) => {
    api.success({
      message: `Thông báo`,
      description: "Thêm chương thành công",
      placement,
    });
  };
  const openNotificationCreate400 = (placement) => {
    api.error({
      message: `Thông báo`,
      description: "Thêm chương thất bại",
      placement,
    });
  };
  //#endregion

  //#region - Function - Lay danh sach Chương, môn học
  const handleGetAllChapter = async () => {
    try {
      const result = await GetAllChapterService();
      if (result && result.data) {
        setDataSource(result.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    handleGetAllChapter();
  }, []);

  const handleGetAllSubject = async () => {
    try {
      const result = await GetAllSubjectService();
      if (result.status === 200) {
        setSubjectList(result.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    handleGetAllSubject();
  }, []);
  //#endregion

  //#region - Function - thay đổi trạng thái topic
  const handleChangeStatusClose = async (record) => {
    Modal.confirm({
      title: "Bạn muốn khóa topic này",
      okText: "Khóa",
      cancelText: "Thoát",
      okType: "danger",
      onOk: async () => {
        const status = "INACTIVE";
        try {
          const result = await ChangeStatusTopicService(record.topicId, status);
          if (result.status === 200) {
            openNotificationChangeStatus200("topRight");
            handleGetAllChapter();
          } else {
            openNotificationChangeStatus400("topRight");
          }
        } catch {
          openNotificationChangeStatus400("topRight");
        }
      },
      cancelText: "Cancel",
      onCancel: () => {},
    });
  };

  const handleChangeStatusOpen = async (record) => {
    Modal.confirm({
      title: "Bạn muốn mở khóa topic này",
      okText: "Mở",
      cancelText: "Thoát",
      okType: "default",
      onOk: async () => {
        const status = "ACTIVE";
        try {
          const result = await ChangeStatusTopicService(record.topicId, status);
          if (result.status === 200) {
            openNotificationChangeStatus200("topRight");
            handleGetAllChapter();
          } else {
            openNotificationChangeStatus400("topRight");
          }
        } catch {
          openNotificationChangeStatus400("topRight");
        }
      },
      cancelText: "Cancel",
      onCancel: () => {},
    });
  };

  const handleChangeStatusApprove = async (record) => {
    Modal.confirm({
      title: "Bạn muốn duyệt topic này",
      okText: "Duyệt",
      cancelText: "Thoát",
      okType: "default",
      onOk: async () => {
        const status = "ACTIVE";
        try {
          const result = await ChangeStatusTopicService(record.topicId, status);
          if (result.status === 200) {
            openNotificationChangeStatus200("topRight");
            handleGetAllChapter();
          } else {
            openNotificationChangeStatus400("topRight");
          }
        } catch {
          openNotificationChangeStatus400("topRight");
        }
      },
      cancelText: "Cancel",
      onCancel: () => {},
    });
  };
  //#endregion

  //#region - Function - nhận giá trị input
  const handleCreateInputChange = (event) => {
    const field = event.target.name;
    const value = event.target.value;

    setCreateData((createData) => ({ ...createData, [field]: value }));
  };

  const handleEditInputChange = (event) => {
    const field = event.target.name;
    const value = event.target.value;

    setEditData((editData) => ({ ...editData, [field]: value }));
  };

  const onCreateInputStartDateAndEndDate = (value, dateString) => {
    // const firstSelectedTime = dateString[0];
    setCreateData((createData) => ({
      ...createData,
      createStartDate: dateString[0],
    }));
    setCreateData((createData) => ({
      ...createData,
      createEndDate: dateString[1],
    }));
  };

  const onEditInputStartDateAndEndDate = (value, dateString) => {
    setEditData((editData) => ({ ...editData, editStartDate: dateString[0] }));
    setEditData((editData) => ({ ...editData, editEndDate: dateString[1] }));
  };

  function convertToUTCDate(inputTimeString) {
    const originalDate = new Date(inputTimeString);
    return originalDate;
  }

  //#endregion

  //#region - Function - Thêm mới Chương
  const handleSubmitCreate = async () => {
    let errors = {};
    console.log(createData);
    // handleValidationCreateTopic(createData, errors);
    if (Object.keys(errors).length === 0) {
      const data = {
        gradeId: Number(createData.createGrade),
        subjecId: Number(createData.createSubjectId),
        accountId: user.accountId,
        chapterTitle: createData.createChapterName,
        mainContent: "",
      };
      const result = await AddChapterService(data);
      if (result && result.count >= 1) {
        handleGetAllChapter();
        setErrors([]);
        setShowCreateForm(false);
        setCreateData("");
        openNotificationCreate200("topRight");
      } else {
        openNotificationCreate400("topRight");
      }
    } else {
      setErrors(errors);
    }
  };

  const onClickCancelCreateForm = () => {
    setShowCreateForm(false);
    setErrors([]);
    setCreateData({
      createSubjectId: "Chọn môn học",
      createTopicType: "Chọn loại topic",
      createGrade: "Chọn lớp",
    });
  };
  //#endregion

  //#region - Function - chỉnh sửa chương
  const handleViewEdit = (record) => {
    const {grade} = record
    setEditData({
      editSubjectId: record.subjecId,
      editGrade:`${grade.gradeId}`,
      editChapterName: record.chapterTitle,
    });
    setChapterId(record.chapterId);
    setShowEditForm(true);
  };

  const onClickCancelEditForm = () => {
    setShowEditForm(false);
    setErrors([]);
    setEditData({
      editSubjectId: "",
      editGrade:"",
      editChapterName: "",
    });
  };

  const handleSubmitEdit = async () => {
    let errors = {};
    if (Object.keys(errors).length === 0) {
      const data = {
        gradeId: Number(editData.editGrade),
        subjecId: Number(editData.editSubjectId),
        accountId: user.accountId,
        chapterTitle: editData.editChapterName,
        mainContent: "",
      };
      const result = await UpdateChapterService(chapterId, data);
      console.log(result);
      if (result && result.count >=1) {
        handleGetAllChapter();
        setErrors([]);
        setShowEditForm(false);
        setEditData("");
        openNotificationUpdate200("topRight");
      } else {
        openNotificationChangeStatus400("topRight");
      }
    } else {
      setErrors(errors);
    }
  };
  //#endregion

  //#region - Function - hiển thị danh sách question theo chương
  const handleViewListQuestion = (record) => {
    const id = record.chapterId;
    navigate(`/mod/manageQuestionChapter/${id}`);
  };
  // Sắp xếp trước khi truyền vào table
  const sortedData = dataSource.sort(
    (a, b) => new Date(b.dateUpdate) - new Date(a.dateUpdate)
  );
  //#endregion
  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
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
              <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
              <Breadcrumb.Item>Quản lý</Breadcrumb.Item>
              <Breadcrumb.Item>Chương</Breadcrumb.Item>
            </Breadcrumb>
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
              }}
            >
              <div>
                <div className="pb-5">
                  <h1 className="custom-title-exam">Danh sách chương</h1>
                </div>

                <Button
                  type="primary"
                  style={{ marginBottom: "20px", marginRight: "10px" }}
                  onClick={() => setShowCreateForm(true)}
                >
                  Thêm chương
                </Button>
                <Table columns={columns} dataSource={sortedData} />
              </div>
            </div>

            {/* Create form */}
            <Modal
              title="Thêm chương"
              visible={showCreateForm}
              okText="Thêm mới"
              cancelText="Đóng"
              onCancel={() => onClickCancelCreateForm()}
              onOk={() => handleSubmitCreate()}
            >
              <Form>
                <Form.Item>
                  <label>Môn học</label>
                  <select
                    defaultValue={editData.editSubjectId}
                    name="createSubjectId"
                    allowclear
                    value={createData.createSubjectId}
                    className="form-control"
                    onChange={handleCreateInputChange}
                  >
                    <option value="Chọn môn học">Chọn môn học</option>
                    {subjectList?.map((item) => (
                      <option key={item.subjectId} value={item.subjectId}>{item.subjectName}</option>
                    ))}
                  </select>
                  {errors.createSubjectId && (
                    <div
                      className="invalid-feedback"
                      style={{ display: "block", color: "red" }}
                    >
                      {errors.createSubjectId}
                    </div>
                  )}
                </Form.Item>

                {createData.createTopicType != 5 &&
                  createData.createTopicType != 6 && (
                    <Form.Item>
                      <label>Lớp</label>
                      <select
                        name="createGrade"
                        value={createData.createGrade}
                        allowclear
                        className="form-control"
                        onChange={handleCreateInputChange}
                      >
                        <option value="Chọn lớp">Chọn lớp</option>
                        <option value="1">10</option>
                        <option value="2">11</option>
                        <option value="3">12</option>
                      </select>
                      {errors.createGrade && (
                        <div
                          className="invalid-feedback"
                          style={{ display: "block", color: "red" }}
                        >
                          {errors.createGrade}
                        </div>
                      )}
                    </Form.Item>
                  )}
                <Form.Item>
                  <label>Tên tên chương</label>
                  <Input
                    type="text"
                    placeholder="Nhập tên chương"
                    className="form-control"
                    value={createData.createChapterName}
                    name="createChapterName"
                    onChange={handleCreateInputChange}
                  />
                  {errors.createChapterName && (
                    <div
                      className="invalid-feedback"
                      style={{ display: "block", color: "red" }}
                    >
                      {errors.createChapterName}
                    </div>
                  )}
                </Form.Item>
              </Form>
            </Modal>

            {/* Edit form */}
            <Modal
              title="Chỉnh sửa chương"
              visible={showEditForm}
              okText="Lưu"
              cancelText="Đóng"
              onCancel={() => onClickCancelEditForm()}
              onOk={() => handleSubmitEdit()}
            >
              <Form>
                <Form.Item>
                  <label>Môn học</label>
                  <select
                    name="editSubjectId"
                    allowclear
                    value={editData.editSubjectId}
                    className="form-control"
                    onChange={handleEditInputChange}
                  >
                    <option value="Chọn môn học">Chọn môn học</option>
                    {subjectList?.map((item) => (
                      <option value={item.subjectId}>{item.subjectName}</option>
                    ))}
                  </select>
                  {errors.editSubjectId && (
                    <div
                      className="invalid-feedback"
                      style={{ display: "block", color: "red" }}
                    >
                      {errors.editSubjectId}
                    </div>
                  )}
                </Form.Item>
                <Form.Item>
                  <label>Lớp</label>
                  <select
                  defaultValue={editData.editGrade}
                    name="editGrade"
                    value={editData.editGrade}
                    allowclear
                    className="form-control"
                    onChange={handleEditInputChange}
                  >
                    <option value="Chọn lớp">Chọn lớp</option>
                    <option value="1">10</option>
                    <option value="2">11</option>
                    <option value="3">12</option>
                  </select>
                  {errors.editGrade && (
                    <div
                      className="invalid-feedback"
                      style={{ display: "block", color: "red" }}
                    >
                      {errors.editGrade}
                    </div>
                  )}
                </Form.Item>
                <Form.Item>
                  <label>Tên chương</label>
                  <Input
                    type="text"
                    placeholder="Nhập tên chương"
                    className="form-control"
                    value={editData.editChapterName}
                    name="editChapterName"
                    onChange={handleEditInputChange}
                  />
                  {errors.editChapterName && (
                    <div
                      className="invalid-feedback"
                      style={{ display: "block", color: "red" }}
                    >
                      {errors.editChapterName}
                    </div>
                  )}
                </Form.Item>
              </Form>
            </Modal>
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
