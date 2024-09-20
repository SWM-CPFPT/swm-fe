import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import {
  DatePicker,
  Dropdown,
  Breadcrumb,
  Layout,
  Table,
  Input,
  Modal,
  Form,
  notification,
  Button,
  theme,
  Card,
  Timeline,
  Tooltip,
  Select,
  Upload,
  Checkbox,
} from "antd";
import {
  SearchOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  UploadOutlined,
  EditOutlined,
  CloseSquareFilled,
  PoweroffOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import SiderAdmin from "../../Layout/Admin/SiderAdmin";
import HeaderAdmin from "../../Layout/Admin/HeaderAdmin";
import { UserContext } from "../../contexts/UserContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "bootstrap/dist/css/bootstrap.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";
import { v4 } from "uuid";
import { CommonNotification } from "../../utils/CommonNotification";
import readXlsxFile from "read-excel-file";

import { EditQuestionService } from "../../services/questionService";
import { handleValidationEditQuestion } from "../../assets/js/handleValidation";
import { handleValidationCreateQuestion } from "../../assets/js/handleValidation";
import {
  AddChapterQuestionService,
  AddExcelQuestionInCourseChapterID,
  DeleteQuestionInCourseChapterID,
  GetChapterByIdService,
} from "../../services/chapterService";
import { AddQuestionService } from "../../services/questionService";
import { AddQuestionByExcelService } from "../../services/questionService";
import "../../assets/Admin.css";

const { Content } = Layout;

export default function ManageQuestionByMod() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  //#region - Declare - khai báo biến
  const { id } = useParams();
  const customTooltip = (data) => {
    const { answer } = data;
    return (
      <Card
        style={{
          width: "400px",
        }}
        title="Question Details"
      >
        <Timeline
          mode={"left"}
          items={[
            {
              label: "Option A",

              children: (
                <span dangerouslySetInnerHTML={{ __html: data.optionA }} />
              ),
              dot: <PlusCircleOutlined />,
              color: "black",
            },
            {
              label: "Option B",
              children: (
                <span dangerouslySetInnerHTML={{ __html: data.optionB }} />
              ),
              dot: <PlusCircleOutlined />,
              color: "black",
            },
            {
              label: "Option C",
              children: (
                <span dangerouslySetInnerHTML={{ __html: data.optionC }} />
              ),
              dot: <PlusCircleOutlined />,
              color: "black",
            },
            {
              label: "Option D",
              children: (
                <span dangerouslySetInnerHTML={{ __html: data.optionD }} />
              ),
              dot: <PlusCircleOutlined />,
              color: "black",
            },
            {
              label: "Đáp án",
              children: (
                <span
                  dangerouslySetInnerHTML={{ __html: answer?.answerName }}
                />
              ),
              dot: <CheckCircleOutlined />,
              color: "green",
            },
            {
              label: "Lời giải",
              children: (
                <span dangerouslySetInnerHTML={{ __html: data.solution }} />
              ),
              dot: <FileTextOutlined />,
              color: "orange",
            },
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
  const [dataSource, setDataSource] = useState("");
  // console.log({ id });

  const { user, render, onSetRender } = useContext(UserContext);
  const columns = [
    {
      title: "ID",
      width: 70,
      dataIndex: "questionId",
      key: 1,
      fixed: "left",
    },
    {
      title: "Tên chương",
      width: 170,
      dataIndex: ["courseChapter", "chapterTitle"],
      key: "chapterTitle",
      fixed: "left",
    },
    {
      title: "Nội dung",
      width: 350,
      dataIndex: "questionContext",
      key: 3,
      fixed: "left",
      render: (record) => {
        return (
          <td
            style={{
              width: "450px",
              maxWidth: "450px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <style>
              {`
                                td p:not([class]):not([id]) {
                                margin: 0;
                                }
                            `}
            </style>
            <div dangerouslySetInnerHTML={{ __html: record }} />
          </td>
        );
      },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <Input
            autoFocus
            placeholder="Nhập nội dung câu hỏi"
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
        if (record.questionContent != null) {
          return record.questionContent
            .toLowerCase()
            .includes(value.toLowerCase());
        }
      },
    },
    {
      title: "Cấp độ",
      dataIndex: ["level", "levelName"],
      key: "levelName",
      width: 100,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <Input
            autoFocus
            placeholder="Nhập cấp độ"
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
        if (record.level != null) {
          return record.level.toLowerCase().includes(value.toLowerCase());
        }
      },
    },
    {
      title: "Người tạo",
      width: 100,
      dataIndex: "userCreated",
      key: 1,
      fixed: "left",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <Input
            autoFocus
            placeholder="Nhập người tạo"
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
      title: "Điều hướng",
      width: 100,
      key: 1,
      fixed: "left",
      render: (record) => {
        return (
          <>
            <Button
              onClick={() => {
                handleCheckImageNull(record.image);
                handleViewEdit(record);
              }}
              type="primary"
              icon={<EditOutlined />}
            ></Button>{" "}
            <Button
              onClick={() => {
                handleCheckImageNull(record.image);
                handleDeleteQuestion(record);
              }}
              style={{ background: "red", color: "white" }}
              icon={<CloseSquareFilled />}
            ></Button>{" "}
          </>
        );
      },
    },
  ];
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [topic, setTopic] = useState("");
  const [chapter, setChapter] = useState("");
  const pagination = {
    pageSize: 8,
    total: dataSource != null ? dataSource.length : "",
  };
  const [createData, setCreateData] = useState({
    createLevelId: "Chọn cấp độ",
    createQuestionContent: "",
    createOptionA: "",
    createOptionB: "",
    createOptionC: "",
    createOptionD: "",
    createAnswerId: "Chọn đáp án",
    createSolution: "",
  });

  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState({
    editQuestionId: "",
    editLevelId: "",
    editImage: "",
    editQuestionContent: "",
    editOptionA: "",
    editOptionB: "",
    editOptionC: "",
    editOptionD: "",
    editAnswerId: "",
    editSolution: "",
  });

  const [errors, setErrors] = useState({
    createQuestionContent: "",
    createOptionA: "",
    createOptionB: "",
    createOptionC: "",
    createOptionD: "",
    createAnswerId: "",
    createSolution: "",
    createLevelId: "",
    editLevelId: "",
    editQuestionContent: "",
    editOptionA: "",
    editOptionB: "",
    editOptionC: "",
    editOptionD: "",
    editAnswerId: "",
    editSolution: "",
  });

  const [imageUpload, setImageUpload] = useState(null);
  //#endregion

  //#region - Function - hiển thị thông báo
  const [api, contextHolder] = notification.useNotification();
  const openNotificationEnable = (placement) => {
    api.success({
      message: `Thông báo`,
      description: "Lấy dữ liệu thành công",
      placement,
    });
  };
  const openNotificationGetData400 = (placement) => {
    api.error({
      message: `Thông báo`,
      description: "Lấy dữ liệu",
      placement,
    });
  };
  const openNotificationAdd200 = (placement) => {
    api.success({
      message: `Thông báo`,
      description: "Thêm câu hỏi thành công",
      placement,
    });
  };
  const openNotificationAdd400 = (placement) => {
    api.error({
      message: `Thông báo`,
      description: "Thêm câu hỏi thất bại",
      placement,
    });
  };
  const openNotificationEdit200 = (placement) => {
    api.success({
      message: `Thông báo`,
      description: "Chỉnh sửa thành công",
      placement,
    });
  };
  const openNotificationEdit400 = (placement) => {
    api.success({
      message: `Thông báo`,
      description: "Chỉnh sửa thành công",
      placement,
    });
  };
  //#endregion

  //#region - Function - lấy danh sách câu hỏi, chi tiết của một topic
  const handleGetAllQuestionByChapter = async () => {
    try {
      const result = await GetChapterByIdService(id);
      if (result && result.data) {
        setChapter(result.data);
      } else {
        openNotificationGetData400("topRight");
      }
    } catch (error) {
      openNotificationGetData400("topRight");
    }
  };

  useEffect(() => {
    handleGetAllQuestionByChapter();
  }, []);
  const renderChapterTitle = () => {
    if (chapter.length > 0) {
      const { courseChapter } = chapter[0];
      return courseChapter.chapterTitle;
    }
    return null;
  };
  //#endregion

  //#region - Function - xoá câu hỏi
  const handleDeleteQuestion = async (record) => {
    try {
      const resultDelete = await DeleteQuestionInCourseChapterID(
        record.questionId,
        record.userDelete
      );
      if (!resultDelete) {
        console.log("error");
      }
      handleGetAllQuestionByChapter();
    } catch (error) {
      console.log(error);
    }
  };
  //#endregion

  //#region - Function - thêm mới câu hỏi

  //#region - Function - Thêm câu hỏi bằng Excel
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileList, setFileList] = useState(null);
  const props = {
    beforeUpload: (file) => {
      setFileList([file]); // Giới hạn 1 file
      return false; // Ngăn mặc định tự upload
    },
    fileList,
    onRemove: () => {
      setFileList();
    },
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setFileList();
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("file", file);
      });
      var result = await AddExcelQuestionInCourseChapterID(
        user.accountId,
        Number(id),
        formData
      );
      console.log(result);
      if (!result) {
        CommonNotification("Thông báo", "Lỗi khi thêm file!", "warning");
      }
      setIsModalOpen(!isModalOpen);
      setFileList();
      CommonNotification(
        "Thông báo",
        "Thêm questions bằng file excel thành công!",
        "success"
      );
      handleGetAllQuestionByChapter();
      onSetRender();
    } catch (error) {
      CommonNotification("Thông báo", "Lỗi khi thêm file!", "warning");
    }
  };
  //#endregion

  //#region - Function - Thêm câu hỏi
  const handleSubmitCreate = async () => {
    let errors = {};
    console.log(createData);
    console.log(user);
    // handleValidationCreateQuestion(createData, errors);
    if (Object.keys(errors).length === 0) {
      const data = {
        idCourceChapter: Number(id),
        accountId: user.accountId,
        courseChapterId: Number(id),
        optionA: createData.createOptionA,
        optionB: createData.createOptionB,
        optionC: createData.createOptionC,
        optionD: createData.createOptionD,
        solution: createData.createSolution,
        answerId: Number(createData.createAnswerId),
        levelId: Number(createData.createLevelId),
        image: imageUpload,
        questionContext: createData.createQuestionContent,
      };
      const result = await AddChapterQuestionService(data);
      // console.log({ result });

      if (result && result.count >= 1) {
        handleGetAllQuestionByChapter();
        setErrors([]);
        setCreateData({
          createLevelId: "Chọn cấp độ",
          createQuestionContent: null,
          createOptionA: null,
          createOptionB: null,
          createOptionC: null,
          createOptionD: null,
          createAnswerId: "Chọn đáp án",
          createSolution: null,
          createLevelId: null,
        });
        setShowCreateForm(false);
        setImageUpload(null);
        openNotificationAdd200("topRight");
      } else {
        openNotificationAdd400("topRight");
      }
    } else {
      setErrors(errors);
    }
  };

  const onClickCancelCreateForm = () => {
    setShowCreateForm(false);
    setErrors([]);
    setCreateData({
      createLevelId: "Chọn cấp độ",
      createQuestionContent: "",
      createOptionA: "",
      createOptionB: "",
      createOptionC: "",
      createOptionD: "",
      createAnswerId: "Chọn đáp án",
      createSolution: "",
      createLevelId: "",
    });
    setImageUpload(null);
  };
  //#endregion

  //#region - Function - nhận giá trị input
  const handleCreateInputFile = async (event) => {
    if (event == null) {
      return;
    }
    const file = event.target.files[0];
    const imgRef = ref(
      storage,
      `images/question_images/${createData.createLevelId + v4()}`
    );
    try {
      const snapshoot = await uploadBytes(imgRef, file);
      const url = await getDownloadURL(snapshoot.ref);
      setImageUpload(url);
    } catch (error) {
      console.error("Failed to upload", error);
    }
  };

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

  const handleEditInputFile = async (event) => {
    if (event == null) {
      return;
    }
    const file = event.target.files[0];
    const imgRef = ref(
      storage,
      `images/question_images/${editData.editLevelId + v4()}`
    );
    try {
      const snapshoot = await uploadBytes(imgRef, file);
      const url = await getDownloadURL(snapshoot.ref);
      setImageUpload(url);
    } catch (error) {
      console.error("Failed to upload", error);
    }
  };
  //#endregion

  //#region - Function - chỉnh sửa question
  const handleViewEdit = (record) => {
    console.log({ record });

    setEditData({
      editQuestionId: record.questionId,
      editLevelId: record.levelId,
      editQuestionContent: convertValueHTML(record.questionContext),
      editOptionA: convertValueHTML(record.optionA),
      editOptionB: convertValueHTML(record.optionB),
      editOptionC: convertValueHTML(record.optionC),
      editOptionD: convertValueHTML(record.optionD),
      editAnswerId: record.answerId,
      editSolution: convertValueHTML(record.solution),
    });
    setShowEditForm(true);
  };

  const convertValueHTML = (value) => {
    const isHTMLContent = /<[a-z][\s\S]*>/i.test(value);
    const formattedContent = isHTMLContent ? value : `<p>${value}</p>`;
    return formattedContent;
  };

  const handleCheckImageNull = (value) => {
    // console.log(value);
    if (value != null) {
      setImageUpload(value);
    }
  };

  const onClickCancelEditForm = () => {
    setEditData({
      editQuestionId: "",
      editLevelId: "",
      editQuestionContent: "",
      editOptionA: "",
      editOptionB: "",
      editOptionC: "",
      editOptionD: "",
      editAnswerId: "",
      editSolution: "",
    });
    setImageUpload(null);
    setShowEditForm(false);
    setErrors([]);
    onSetRender();
  };

  const handleSubmitEdit = async () => {
    let errors = {};
    handleValidationEditQuestion(editData, errors);
    if (Object.keys(errors).length === 0) {
      const data = {
        questionId: editData.editQuestionId,
        answerId: editData.editAnswerId,
        levelId: editData.editLevelId,
        image: imageUpload,
        questionContent: editData.editQuestionContent,
        optionA: editData.editOptionA,
        optionB: editData.editOptionB,
        optionC: editData.editOptionC,
        optionD: editData.editOptionD,
        solution: editData.editSolution,
      };
      const result = await EditQuestionService(data);
      if (result.status === 200) {
        handleGetAllQuestionByChapter();
        setErrors([]);
        setShowEditForm(false);
        setEditData({
          editQuestionId: "",
          editLevelId: "",
          editQuestionContent: "",
          editOptionA: "",
          editOptionB: "",
          editOptionC: "",
          editOptionD: "",
          editAnswerId: "",
          editSolution: "",
        });
        setImageUpload(null);
        openNotificationEdit200("topRight");
      } else {
        openNotificationEdit400("topRight");
      }
    } else {
      setErrors(errors);
    }
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
              {renderChapterTitle() && (
                <Breadcrumb.Item>{renderChapterTitle()}</Breadcrumb.Item>
              )}
              <Breadcrumb.Item>Câu hỏi</Breadcrumb.Item>
            </Breadcrumb>
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
              }}
            >
              <div className="pb-5">
                <h1 className="custom-title-exam">
                  Danh sách câu hỏi<i></i>
                </h1>
              </div>
              <Button
                type="primary"
                style={{ marginBottom: "20px", marginRight: "10px" }}
                onClick={() => setShowCreateForm(true)}
              >
                Thêm mới câu hỏi
              </Button>

              <Button type="primary" onClick={showModal}>
                Thêm Question bằng Excel
              </Button>

              <Modal
                title="Tải bằng file Excel"
                open={isModalOpen}
                onOk={handleUpload}
                okText="Thêm"
                cancelText="Thoát"
                onCancel={handleCancel}
              >
                <Upload {...props}>
                  <Button icon={<UploadOutlined />}>Chọn File</Button>
                </Upload>
              </Modal>

              <Table
                columns={columns}
                dataSource={chapter}
                pagination={pagination}
                components={{
                  body: {
                    row: CustomRow,
                  },
                }}
              />

              {/* Thêm câu hỏi */}
              <Modal
                title="Thêm mới câu hỏi"
                visible={showCreateForm}
                okText="Thêm"
                cancelText="Đóng"
                onCancel={() => onClickCancelCreateForm()}
                onOk={() => handleSubmitCreate()}
              >
                <Form>
                  <Form.Item>
                    <label>Cấp độ</label>
                    <select
                      name="createLevelId"
                      value={createData.createLevelId}
                      allowclear
                      className="form-control"
                      onChange={handleCreateInputChange}
                    >
                      <option value="Chọn cấp độ">Chọn cấp độ</option>
                      <option value="1">Thông hiểu</option>
                      <option value="2">Vận dụng thấp</option>
                      <option value="3">Vận dụng cao</option>
                    </select>
                    {errors.createLevelId && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block", color: "red" }}
                      >
                        {errors.createLevelId}
                      </div>
                    )}
                  </Form.Item>
                  <Form.Item>
                    <label>Nội dung câu hỏi</label>
                    <ReactQuill
                      className="quill-editor"
                      value={createData?.createQuestionContent}
                      onChange={(value) =>
                        setCreateData({
                          ...createData,
                          createQuestionContent: value,
                        })
                      }
                    />
                    {errors.createQuestionContent && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block", color: "red" }}
                      >
                        {errors.createQuestionContent}
                      </div>
                    )}
                  </Form.Item>
                  <Form.Item>
                    <label>Hình ảnh</label>
                    <div className="w-100">
                      {imageUpload == null || imageUpload == "" ? (
                        <img src="" alt="" />
                      ) : (
                        <>
                          {imageUpload && (
                            <img
                              src={imageUpload}
                              alt=""
                              className="w-100"
                              style={{ overflow: "hidden", objectFit: "cover" }}
                            />
                          )}
                        </>
                      )}
                    </div>
                    <input type="file" onChange={handleCreateInputFile} />
                  </Form.Item>
                  <Form.Item>
                    <label>Lựa chọn A</label>
                    <ReactQuill
                      className="quill-editor"
                      value={createData?.createOptionA}
                      onChange={(value) =>
                        setCreateData({ ...createData, createOptionA: value })
                      }
                    />
                    {errors.createOptionA && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block", color: "red" }}
                      >
                        {errors.createOptionA}
                      </div>
                    )}
                  </Form.Item>
                  <Form.Item>
                    <label>Lựa chọn B</label>
                    <ReactQuill
                      className="quill-editor"
                      value={createData?.createOptionB}
                      onChange={(value) =>
                        setCreateData({ ...createData, createOptionB: value })
                      }
                    />
                    {errors.createOptionB && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block", color: "red" }}
                      >
                        {errors.createOptionB}
                      </div>
                    )}
                  </Form.Item>
                  <Form.Item>
                    <label>Lựa chọn C</label>
                    <ReactQuill
                      className="quill-editor"
                      value={createData?.createOptionC}
                      onChange={(value) =>
                        setCreateData({ ...createData, createOptionC: value })
                      }
                    />
                    {errors.createOptionC && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block", color: "red" }}
                      >
                        {errors.createOptionC}
                      </div>
                    )}
                  </Form.Item>
                  <Form.Item>
                    <label>Lựa chọn D</label>
                    <ReactQuill
                      className="quill-editor"
                      value={createData?.createOptionD}
                      onChange={(value) =>
                        setCreateData({ ...createData, createOptionD: value })
                      }
                    />
                    {errors.createOptionD && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block", color: "red" }}
                      >
                        {errors.createOptionD}
                      </div>
                    )}
                  </Form.Item>
                  <Form.Item>
                    <label>Đáp án</label>
                    <select
                      name="createAnswerId"
                      value={createData.createAnswerId}
                      allowclear
                      className="form-control"
                      onChange={handleCreateInputChange}
                    >
                      <option value="Chọn đáp án">Chọn đáp án</option>
                      <option value="1">A</option>
                      <option value="2">B</option>
                      <option value="3">C</option>
                      <option value="4">D</option>
                    </select>
                    {errors.createAnswerId && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block", color: "red" }}
                      >
                        {errors.createAnswerId}
                      </div>
                    )}
                  </Form.Item>
                  <Form.Item>
                    <label>Lời giải</label>
                    <ReactQuill
                      className="quill-editor"
                      value={createData?.createSolution}
                      onChange={(value) =>
                        setCreateData({ ...createData, createSolution: value })
                      }
                    />
                  </Form.Item>
                </Form>
              </Modal>

              {/* Chỉnh sửa câu hỏi */}
              <Modal
                title="Chỉnh sửa câu hỏi"
                visible={showEditForm}
                okText="Lưu"
                cancelText="Đóng"
                onCancel={() => onClickCancelEditForm()}
                onOk={() => handleSubmitEdit()}
              >
                <Form>
                  <Form.Item>
                    <label>Cấp độ</label>
                    <select
                      name="editLevelId"
                      value={editData.editLevelId}
                      allowclear
                      className="form-control"
                      onChange={handleEditInputChange}
                    >
                      <option value="Chọn cấp độ">Chọn cấp độ</option>
                      <option value="1">Thông hiểu</option>
                      <option value="2">Vận dụng thấp</option>
                      <option value="3">Vận dụng cao</option>
                    </select>
                    {errors.editLevelId && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block", color: "red" }}
                      >
                        {errors.editLevelId}
                      </div>
                    )}
                  </Form.Item>
                  <Form.Item>
                    <label>Nội dung câu hỏi</label>
                    <ReactQuill
                      className="quill-editor"
                      value={editData?.editQuestionContent}
                      onChange={(value) =>
                        setEditData({ ...editData, editQuestionContent: value })
                      }
                    />
                  </Form.Item>
                  {errors.editQuestionContent && (
                    <div
                      className="invalid-feedback"
                      style={{ display: "block", color: "red" }}
                    >
                      {errors.editQuestionContent}
                    </div>
                  )}
                  <Form.Item>
                    <label>Hình ảnh</label>
                    <div className="w-100">
                      {imageUpload == null || imageUpload == "" ? (
                        <img src="" alt="" />
                      ) : (
                        <>
                          {imageUpload && (
                            <img
                              src={imageUpload}
                              alt=""
                              className="w-100"
                              style={{ overflow: "hidden", objectFit: "cover" }}
                            />
                          )}
                        </>
                      )}
                    </div>
                    <input type="file" onChange={handleEditInputFile} />
                  </Form.Item>
                  <Form.Item>
                    <label>Lựa chọn A</label>
                    <ReactQuill
                      className="quill-editor"
                      value={editData?.editOptionA}
                      onChange={(value) =>
                        setEditData({ ...editData, editOptionA: value })
                      }
                    />
                    {errors.editOptionA && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block", color: "red" }}
                      >
                        {errors.editOptionA}
                      </div>
                    )}
                  </Form.Item>
                  <Form.Item>
                    <label>Lựa chọn B</label>
                    <ReactQuill
                      className="quill-editor"
                      value={editData?.editOptionB}
                      onChange={(value) =>
                        setEditData({ ...editData, editOptionB: value })
                      }
                    />
                    {errors.editOptionB && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block", color: "red" }}
                      >
                        {errors.editOptionB}
                      </div>
                    )}
                  </Form.Item>
                  <Form.Item>
                    <label>Lựa chọn C</label>
                    <ReactQuill
                      className="quill-editor"
                      value={editData?.editOptionC}
                      onChange={(value) =>
                        setEditData({ ...editData, editOptionC: value })
                      }
                    />
                    {errors.editOptionC && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block", color: "red" }}
                      >
                        {errors.editOptionC}
                      </div>
                    )}
                  </Form.Item>
                  <Form.Item>
                    <label>Lựa chọn D</label>
                    <ReactQuill
                      className="quill-editor"
                      value={editData?.editOptionD}
                      onChange={(value) =>
                        setEditData({ ...editData, editOptionD: value })
                      }
                    />
                    {errors.editOptionD && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block", color: "red" }}
                      >
                        {errors.editOptionD}
                      </div>
                    )}
                  </Form.Item>
                  <Form.Item>
                    <label>Đáp án</label>
                    <select
                      name="editAnswerId"
                      value={editData.editAnswerId}
                      allowclear
                      className="form-control"
                      onChange={handleEditInputChange}
                    >
                      <option value="Chọn đáp án">Chọn đáp án</option>
                      <option value="1">A</option>
                      <option value="2">B</option>
                      <option value="3">C</option>
                      <option value="4">D</option>
                    </select>
                    {errors.editAnswerId && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block", color: "red" }}
                      >
                        {errors.editAnswerId}
                      </div>
                    )}
                  </Form.Item>
                  <Form.Item>
                    <label>Lời giải</label>
                    <ReactQuill
                      className="quill-editor"
                      value={editData?.editSolution}
                      onChange={(value) =>
                        setEditData({ ...editData, editSolution: value })
                      }
                    />
                  </Form.Item>
                </Form>
              </Modal>
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
