import { useEffect, useState, useContext } from "react";

import {
  DatePicker,
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
import { Navigate, useNavigate } from "react-router-dom";
import moment from "moment";

import { GetAllTopicService } from "../../services/topicService";
import { ChangeStatusTopicService } from "../../services/topicService";
import { GetAllSubjectService } from "../../services/subjectService";
import { AddTopicService } from "../../services/topicService";
import { handleValidationCreateTopic } from "../../assets/js/handleValidation";
import { handleValidationUpdateTopic } from "../../assets/js/handleValidation";
import { UpdateTopicService } from "../../services/topicService";
import FormItem from "antd/es/form/FormItem";
import dayjs from "dayjs";
import "../../assets/Admin.css";
import { toast } from "react-toastify";
const { Content } = Layout;
const { RangePicker } = DatePicker;

export default function ManageTopicByMod() {
  const dayFormat = "YYYY-MM-DD HH:mm";
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  //#region - Declare - Khai bao cac bien
  const columns = [
    {
      title: "ID",
      dataIndex: "topicId",
      key: 1,
      fixed: "left",
    },
    {
      title: "Môn học",
      dataIndex: "subjectName",
      key: 2,
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
      title: "Tên topic",
      dataIndex: "topicName",
      key: 3,
      width: 500,
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
      title: "Thời lượng",
      dataIndex: "duration",
      key: 4,
      fixed: "left",
    },
    {
      title: "Tổng câu hỏi",
      dataIndex: "totalQuestion",
      key: 4,
      fixed: "left",
    },
    {
      title: "Lớp",
      dataIndex: "grade",
      key: 5,
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
        if (record.grade !== null) {
          return record.grade.toLowerCase().includes(value.toLowerCase());
        }
      },
    },
    {
      title: "Loại Topic",
      dataIndex: "topicTypeName",
      key: 6,
      fixed: "left",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <Input
            autoFocus
            placeholder="Nhập loại topic"
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
          />
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        if (record.topicTypeName != null) {
          return record.topicTypeName
            .toLowerCase()
            .includes(value.toLowerCase());
        }
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: 7,
      fixed: "left",
    },
    {
      title: "Điều hướng",
      key: 8,
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
  const { render, onSetRender } = useContext(UserContext);
  const [dataSource, setDataSource] = useState("");
  const [subjectList, setSubjectList] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [createData, setCreateData] = useState({
    createSubjectId: "Chọn môn học",
    createTopicType: "Chọn loại topic",
    createGrade: "Chọn lớp",
    createTopicName: "",
    createDuration: "Chọn thời gian",
    createStartDate: "",
    createEndDate: "",
  });

  const [editData, setEditData] = useState({
    editSubjectId: "",
    editTopicType: "",
    editGrade: "",
    editTopicName: "",
    editDuration: "",
    editStartDate: "",
    editEndDate: "",
  });

  const [errors, setErrors] = useState({
    createSubjectId: "",
    createTopicType: "",
    createGrade: "",
    createTopicName: "",
    createDuration: "",
    createStartDate: "",
    createEndDate: "",
    editSubjectId: "",
    editTopicType: "",
    editGrade: "",
    editTopicName: "",
    editDuration: "",
    editStartDate: "",
    editEndDate: "",
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
      description: "Thêm topic thành công",
      placement,
    });
  };
  const openNotificationCreate400 = (placement) => {
    api.error({
      message: `Thông báo`,
      description: "Thêm topic thất bại",
      placement,
    });
  };
  //#endregion

  //#region - Function - Lay danh sach topics, môn học
  const handleGetAllTopic = async () => {
    try {
      const result = await GetAllTopicService();
      if (result.status === 200) {
        setDataSource(result.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    handleGetAllTopic();
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
         
            handleGetAllTopic();
          } else {
           
          }
        } catch {
        
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
            handleGetAllTopic();
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
            handleGetAllTopic();
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

 
  // Hàm kiểm tra ngày bị disable
  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().startOf('day');
  };
  const currentHour = dayjs().hour();
  const currentMinute = dayjs().minute();

  const disabledRangeTime = (date, type) => {
    if (type === 'start') {
      return {
        disabledHours: () => {
          const hours = [];
          for (let i = 0; i < currentHour; i++) {
            hours.push(i);
          }
          return hours;
        },
        disabledMinutes: (selectedHour) => {
          if (selectedHour === currentHour) {
            const minutes = [];
            for (let i = 0; i < currentMinute; i++) {
              minutes.push(i);
            }
            return minutes;
          }
          return [];
        }
      };
    }
    return {};
  };
  const onCreateInputStartDateAndEndDate = (value, dateString) => {
    if (value) {
      const startDate = value[0];
      const endDate = value[1];
      // Kiểm tra nếu ngày kết thúc nhỏ hơn ngày bắt đầu 2 ngày
      if (endDate && endDate.diff(startDate, 'days') < 2) {
        toast.error("Ngày kết thúc phải ít nhất là 2 ngày sau ngày bắt đầu!");
        setCreateData((prevCreateData) => ({
          ...prevCreateData,
          createStartDate: dateString[0],
          createEndDate: null,
        }));
      } else {
        // Cập nhật state với createStartDate và createEndDate
        setCreateData((prevCreateData) => ({
          ...prevCreateData,
          createStartDate: dateString[0],
          createEndDate: dateString[1],
        }));
      }
    }
  };
  
  const onEditInputStartDateAndEndDate = (value, dateString) => {
    if (value) {
      const startDate = value[0];
      const endDate = value[1];
      // Kiểm tra nếu ngày kết thúc nhỏ hơn ngày bắt đầu 2 ngày
      if (endDate && endDate.diff(startDate, 'days') < 2) {
        toast.error("Ngày kết thúc phải ít nhất là 2 ngày sau ngày bắt đầu!");
        setEditData((editData) => ({
          ...editData,
          editStartDate: dateString[0],
          editEndDate: null,
        }));
      } else {
        // Cập nhật state với createStartDate và createEndDate
        setEditData((editData) => ({
          ...editData,
          editStartDate: dateString[0],
          editEndDate: dateString[1],
        }));
      }
    }
    // setEditData((editData) => ({ ...editData, editStartDate: dateString[0] }));
    // setEditData((editData) => ({ ...editData, editEndDate: dateString[1] }));
  };

  function convertToUTCDate(inputTimeString) {
    const originalDate = new Date(inputTimeString);
    return originalDate;
  }

  
  //#endregion

  //#region - Function - Thêm mới topic
  const handleSubmitCreate = async () => {
    let errors = {};
    handleValidationCreateTopic(createData, errors);
    if (Object.keys(errors).length === 0) {
      const data = {
        topicName: createData.createTopicName,
        duration:
          createData.createDuration !== "Chọn thời gian"
          ? createData.createDuration : null,
        subjectId: createData.createSubjectId,
        topicType: createData.createTopicType,
        grade:
        createData.createTopicType === "6"
        ? null
        : createData.createGrade !== "Chọn lớp"
          ? createData.createGrade
          : null,
        startTestDate:
          convertToUTCDate(createData.createStartDate) !== null
            ? convertToUTCDate(createData.createStartDate)
            : null,
        finishTestDate:
          convertToUTCDate(createData.createEndDate) != null
            ? convertToUTCDate(createData.createEndDate)
            : null,
      };
      console.log(data);
      const result = await AddTopicService(data);
      if (result.status === 200) {
        handleGetAllTopic();
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
      createTopicName: "",
      createDuration: "Chọn thời gian",
    });
  };
  //#endregion

  //#region - Function - chỉnh sửa topic
  const handleViewEdit = (record) => {
    setEditData({
      editTopicId: record.topicId,
      editSubjectId: record.subjectId,
      editTopicType: record.topicType,
      editGrade: record.grade,
      editTopicName: record.topicName,
      editDuration: record.duration,
      editStartDate: record.beginTestDate,
      editEndDate: record.endTestDate,
    });

    setShowEditForm(true);
  };

  const onClickCancelEditForm = () => {
    setShowEditForm(false);
    setErrors([]);
    setEditData({
      editTopicId: "",
      editSubjectId: "",
      editTopicType: "",
      editGrade: "",
      editTopicName: "",
      editDuration: "",
      editStartDate: "",
      editEndDate: "",
    });
  };

  const handleSubmitEdit = async () => {
    let errors = {};
    if (Object.keys(errors).length === 0) {
      const data = {
        topicId: editData.editTopicId,
        topicName: editData.editTopicName,
        duration:
          editData.editDuration != "Chọn thời gian"
            ? editData.editDuration
            : null,
        subjectId: editData.editSubjectId,
        topicType: editData.editTopicType,
        grade:  editData.editTopicType === "6"
        ? null
        : editData.editGrade !== null
          ? editData.editGrade
          : null,
        startTestDate:
          convertToUTCDate(editData.editStartDate) != null
            ? convertToUTCDate(editData.editStartDate)
            : null,
        finishTestDate:
          convertToUTCDate(editData.editEndDate) != null
            ? convertToUTCDate(editData.editEndDate)
            : null,
      };
      const result = await UpdateTopicService(data);
      console.log(result);
      if (result.status === 200) {
        handleGetAllTopic();
        setErrors([]);
        setShowEditForm(false);
        setEditData("");
        toast.success("Chỉnh sửa thành công")
      } else {
        toast.error("Chỉnh sửa thất bại")
      }
    } else {
      setErrors(errors);
      toast.error("Chỉnh sửa thất bại")
    }
  };
  //#endregion

  //#region - Function - hiển thị danh sách question theo topic
  const handleViewListQuestion = (record) => {
    const id = record.topicId;
    navigate(`/mod/manageQuestion/${id}`);
  };
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
              <Breadcrumb.Item>Topic</Breadcrumb.Item>
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
                  <h1 className="custom-title-exam">Danh sách topic</h1>
                </div>

                <Button
                  type="primary"
                  style={{ marginBottom: "20px", marginRight: "10px" }}
                  onClick={() => setShowCreateForm(true)}
                >
                  Thêm mới topic
                </Button>
                <Table columns={columns} dataSource={dataSource} />
              </div>
            </div>

            {/* Create form */}
            <Modal
              title="Thêm mới topic"
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
                    name="createSubjectId"
                    allowclear
                    value={createData.createSubjectId}
                    className="form-control"
                    onChange={handleCreateInputChange}
                  >
                    <option value="Chọn môn học">Chọn môn học</option>
                    {subjectList?.map((item) => (
                      <option value={item.subjectId}>{item.subjectName}</option>
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
                <Form.Item>
                  <label>Loại Topic</label>
                  <select
                    name="createTopicType"
                    value={createData.createTopicType}
                    allowclear
                    className="form-control"
                    onChange={handleCreateInputChange}
                  >
                    <option value="Chọn loại topic">Chọn loại topic</option>
                    <option value="1">Học</option>
                    <option value="2">Thi 15p</option>
                    <option value="3">Thi 1 tiết</option>
                    <option value="4">Thi học kì</option>
                    <option value="5">Thi THPT Quốc gia</option>
                    <option value="6">Cuộc thi chung</option>
                  </select>
                  {errors.createTopicType && (
                    <div
                      className="invalid-feedback"
                      style={{ display: "block", color: "red" }}
                    >
                      {errors.createTopicType}
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
                  <label>Tên Topic</label>
                  <Input
                    type="text"
                    placeholder="Nhập tên topic"
                    className="form-control"
                    value={createData.createTopicName}
                    name="createTopicName"
                    onChange={handleCreateInputChange}
                  />
                  {errors.createTopicName && (
                    <div
                      className="invalid-feedback"
                      style={{ display: "block", color: "red" }}
                    >
                      {errors.createTopicName}
                    </div>
                  )}
                </Form.Item>
                {createData.createTopicType != "1" &&
                  createData.createTopicType != "Chọn loại topic" && (
                    <Form.Item>
                      <label>Thời gian làm bài</label>
                      <select
                        name="createDuration"
                        value={createData.createDuration}
                        allowclear
                        className="form-control"
                        onChange={handleCreateInputChange}
                      >
                        <option value="Chọn thời gian">Chọn thời gian </option>
                        <option value="15">15p</option>
                        <option value="45">45p</option>
                        <option value="60">60p</option>
                        <option value="120">120p</option>
                      </select>
                      {errors.createDuration && (
                        <div
                          className="invalid-feedback"
                          style={{ display: "block", color: "red" }}
                        >
                          {errors.createDuration}
                        </div>
                      )}
                    </Form.Item>
                  )}
                {createData.createTopicType == 6 && (
                  <Form.Item>
                    <label>Thời gian bắt đầu và kết thúc</label>
                    <RangePicker
                      showTime={{
                        format: "HH:mm",
                      }}
                      placeholder=""
                      format="YYYY-MM-DD HH:mm"
                      onChange={onCreateInputStartDateAndEndDate}
                      disabledDate={disabledDate}
                      disabledTime={disabledRangeTime}
                    />
                    {errors.createStartDate && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block", color: "red" }}
                      >
                        {errors.createStartDate}
                      </div>
                    )}
                  </Form.Item>
                )}
              </Form>
            </Modal>

            {/* Edit form */}
            <Modal
              title="Chỉnh sửa sửa topic"
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
                  <label>Loại Topic</label>
                  <select
                    name="editTopicType"
                    value={editData.editTopicType}
                    allowclear
                    className="form-control"
                    onChange={handleEditInputChange}
                  >
                    <option value="Chọn loại topic">Chọn loại topic</option>
                    <option value="1">Học</option>
                    <option value="2">Thi 15p</option>
                    <option value="3">Thi 1 tiết</option>
                    <option value="4">Thi học kì</option>
                    <option value="5">Thi THPT Quốc gia</option>
                    <option value="6">Cuộc thi chung</option>
                  </select>
                  {errors.editTopicType && (
                    <div
                      className="invalid-feedback"
                      style={{ display: "block", color: "red" }}
                    >
                      {errors.editTopicType}
                    </div>
                  )}
                </Form.Item>
                {editData.editTopicType != 5 && editData.editTopicType != 6 && (
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
                )}
                <Form.Item>
                  <label>Tên Topic</label>
                  <Input
                    type="text"
                    placeholder="Nhập tên topic"
                    className="form-control"
                    value={editData.editTopicName}
                    name="editTopicName"
                    onChange={handleEditInputChange}
                  />
                  {errors.editTopicName && (
                    <div
                      className="invalid-feedback"
                      style={{ display: "block", color: "red" }}
                    >
                      {errors.editTopicName}
                    </div>
                  )}
                </Form.Item>
                {editData.editTopicType != "1" && (
                  <Form.Item>
                    <label>Thời gian làm bài</label>
                    <select
                      name="editDuration"
                      value={editData.editDuration}
                      allowclear
                      className="form-control"
                      onChange={handleEditInputChange}
                    >
                      <option value="Chọn lớp">Chọn thời gian </option>
                      <option value="15">15p</option>
                      <option value="45">45p</option>
                      <option value="60">60p</option>
                      <option value="120">120p</option>
                    </select>
                    {errors.editDuration && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block", color: "red" }}
                      >
                        {errors.editDuration}
                      </div>
                    )}
                  </Form.Item>
                )}
                {editData.editTopicType == "6" && (
                  <Form.Item>
                    <div className="row">
                      <Form.Item>
                        <label>Thời gian bắt đầu và kết thúc</label>
                        <RangePicker
                          showTime={{
                            format: "HH:mm",
                          }}
                          disabledDate={disabledDate}
                          disabledTime={disabledRangeTime}
                          placeholder=""
                          format="YYYY-MM-DD HH:mm"
                          value={
                            editData.editStartDate && editData.editEndDate
                              ? [
                                  dayjs(editData.editStartDate, dayFormat),
                                  dayjs(editData.editEndDate, dayFormat),
                                ]
                              : [null, null]
                          }
                          onChange={onEditInputStartDateAndEndDate}
                        />
                        {errors.editStartDate && (
                          <div
                            className="invalid-feedback"
                            style={{ display: "block", color: "red" }}
                          >
                            {errors.editStartDate}
                          </div>
                        )}
                      </Form.Item>
                    </div>
                  </Form.Item>
                )}
              </Form>
            </Modal>
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
