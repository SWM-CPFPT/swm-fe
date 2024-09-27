import { useEffect, useState, useContext } from "react";
import { useParams, useLocation  } from "react-router-dom";

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
  PoweroffOutlined,
    CloseSquareFilled,
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
import { GetAllQuestionByTopicIdService } from "../../services/questionService";
import { GetTopicByIdService } from "../../services/topicService";
import { AddQuestionService } from "../../services/questionService";
import axios from "axios";
import Sider from "antd/es/layout/Sider";
import { AddExcelQuestionInTopicID } from "../../services/questionService";
import "../../assets/Admin.css";
import {
  AddQuestionInCourseChapterByTopic,
  GetAllChapterService,
  GetAllChapterByToPicIdService,
  GetQuestionByCourseChaptersInUser,
  GetQuestionByCourseChaptersInMod,
  DeleteQuestionInQuestionFromTopic
} from "../../services/chapterService";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

const { Content } = Layout;

export default function ManageQuestionByMod() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  //#region - Declare - khai báo biến
  const { id } = useParams();
  const customTooltip = (data) => {
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
                <span dangerouslySetInnerHTML={{ __html: data.answer }} />
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
  const [dataSource, setdataSource] = useState("");

  const pagination = {
    pageSize: 8,
    total: dataSource != null ? dataSource.length : "",
  };
  const { user, render, onSetRender } = useContext(UserContext);
  const columns = [
    {
      title: "ID",
      width: 70,
      dataIndex: "questionId",
      key: 1,
      fixed: "left",
    },
    // {
    //   title: "Môn học",
    //   width: 170,
    //   dataIndex: "subjectName",
    //   key: 2,
    //   fixed: "left",
    // },
    {
      title: "Nội dung",
      width: 350,
      dataIndex: "questionContent",
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
      dataIndex: "level",
      key: 4,
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
      dataIndex: "accountName",
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
               style={{ background: "red", color: "white" }}
               icon={<CloseSquareFilled />}
              onClick={() => handleViewDelete(record)}
            ></Button>
          </>
        );
      },
    },
  ];
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [topic, setTopic] = useState("");
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
  const handleGetAllQuestionByTopic = async () => {
    try {
      const result = await GetAllQuestionByTopicIdService(id);
      const result2 = await GetTopicByIdService(id);
      if (result.status === 200) {
        setdataSource(result.data);
      } else {
        openNotificationGetData400("topRight");
      }
      if (result2.status === 200) {
        setTopic(result2.data);
      } else {
        openNotificationGetData400("topRight");
      }
    } catch (error) {
      openNotificationGetData400("topRight");
    }
  };

  useEffect(() => {
    handleGetAllQuestionByTopic();
  }, []);

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
  const showModalChapter = () => {
    setIsModalChapterOpen(true);
    console.log(topic.topicId)
    handleGetAllQuestionByChapter(topic.topicId);
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
      var result = await AddExcelQuestionInTopicID(
        user.accountId,
        topic.topicId,
        formData,
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
      handleGetAllQuestionByChapter(topic.topicId);
      window.location.reload();
    } catch (error) {
      CommonNotification("Thông báo", "Lỗi khi thêm file!", "warning");
    }
  };
  //#endregion

  //#region - Function - Thêm câu hỏi
  const handleSubmitCreate = async () => {
    let errors = {};
    console.log(createData);
    handleValidationCreateQuestion(createData, errors);
    if (Object.keys(errors).length === 0) {
      const data = {
        subjectId: topic.subjectId,
        accountId: user.accountId,
        answerId: createData.createAnswerId,
        topicId: topic.topicId,
        levelId: createData.createLevelId,
        image: imageUpload,
        questionContent: createData.createQuestionContent,
        optionA: createData.createOptionA,
        optionB: createData.createOptionB,
        optionC: createData.createOptionC,
        optionD: createData.createOptionD,
        solution: createData.createSolution,
      };
      const result = await AddQuestionService(data);
      if (result.status === 200) {
        handleGetAllQuestionByTopic();
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
    setEditData({
      editQuestionId: record.questionId,
      editLevelId: record.levelId,
      editQuestionContent: convertValueHTML(record.questionContent),
      editOptionA: convertValueHTML(record.optionA),
      editOptionB: convertValueHTML(record.optionB),
      editOptionC: convertValueHTML(record.optionC),
      editOptionD: convertValueHTML(record.optionD),
      editAnswerId: record.answerId,
      editSolution: convertValueHTML(record.solution),
    });
    setShowEditForm(true);
  };
  const handleViewDelete  = async (record) => {
    const isConfirmed = window.confirm("Bạn có chắc muốn xóa câu hỏi này không?");
  
    if (isConfirmed) {
      try {
        const resultDelete = await DeleteQuestionInQuestionFromTopic(record.questionId);
  
        if (resultDelete) {
          // Xóa thành công, tải lại trang
          window.location.reload();
        } else {
          console.log("Error: Unable to delete question.");
        }
      } catch (error) {
        console.error("Error during deletion:", error);
      }
    } else {
      
      return;
    }
   
  }
  const convertValueHTML = (value) => {
    const isHTMLContent = /<[a-z][\s\S]*>/i.test(value);
    const formattedContent = isHTMLContent ? value : `<p>${value}</p>`;
    return formattedContent;
  };

  const handleCheckImageNull = (value) => {
    console.log(value);
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
        handleGetAllQuestionByTopic();
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

  //#region - Xử lý thêm câu hỏi theo chương
  const [isModalChapterOpen, setIsModalChapterOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  // Câu hỏi trong chương
  const [dataSourceChapter, setDataSourceChapter] = useState([]);
  // tất cả chương
  const [chapter, setChapter] = useState([]);
  // temp
  //  const [dataTemp, setDataTemp] = useState([])
  const handleGetAllQuestionByChapter = async (topicId1) => {
    try {
      console.log(topicId1)
      const result = await GetAllChapterByToPicIdService(topicId1);
      if (result && result.data) {
        setChapter(result.data);
      } else {
        openNotificationGetData400("topRight");
      }
    } catch (error) {
      openNotificationGetData400("topRight");
    }
  };

  const handleGetData = async (chapterId) => {
    try {
      const result = await GetQuestionByCourseChaptersInMod(chapterId);
      if (result && result.data) {
        setDataSourceChapter(result.data);
      }
    } catch (error) {
      console.error("Error fetching mod service:", error);
    }
  };

  const [selectedQuestions, setSelectedQuestions] = useState([]);
  // Hàm xử lý khi chọn chương
  const handleChapterChange = (value, option) => {
    const chapterId = option.key;
    setSelectedChapterId(option.key);
    handleGetData(chapterId);
  };

// Hàm xử lý khi chọn câu hỏi
const handleQuestionChange = (checkedQuestionIds) => {
  // Tìm các câu hỏi mới được chọn
const newSelectedQuestions = dataSourceChapter.filter((q) =>
 checkedQuestionIds.includes(q.questionId)
);

// Tìm các câu hỏi đã bị bỏ chọn
const deselectedQuestions = selectedQuestions.filter((q) =>
 !checkedQuestionIds.includes(q.questionId)
);

// Cập nhật danh sách câu hỏi đã chọn bằng cách:
// - Thêm các câu hỏi mới được chọn
// - Loại bỏ các câu hỏi đã bị bỏ chọn
const updatedSelectedQuestions = new Set([
 ...newSelectedQuestions,
 ...selectedQuestions.filter((q) => !deselectedQuestions.includes(q)),
]);
setSelectedQuestions([...new Set([...selectedQuestions, ...updatedSelectedQuestions])]);
};

const handleOkModalChapter = async () => {
  console.log(selectedQuestions)
  const newQuestions = selectedQuestions.map((question, index) => ({
    accountId: user.accountId,
    topicId: topic.topicId,
    lstQuestionId:question.questionId
  }));
  // console.log(newQuestions);
  const dataResult = newQuestions.reduce((acc, current) => {
    // Nếu lstQuestionId chưa được tạo, thì khởi tạo nó là một mảng
    if (!acc.lstQuestionId) {
      acc = { ...current, lstQuestionId: [current.lstQuestionId] };
    } else {
      acc.lstQuestionId.push(current.lstQuestionId);
    }
    return acc;
  }, {});
  const result = await AddQuestionInCourseChapterByTopic(dataResult);
  console.log(result);
  if (result && result.count >=1) {
    toast.success("Thêm thành công");
    handleGetAllQuestionByTopic();
  }else{
    toast.error("Thêm thất bại");
    setChapter([])
  setDataSourceChapter([]);
  }
 
  // Đóng modal và reset lại các câu hỏi đã chọn
  setIsModalChapterOpen(false);
  setChapter([])
  setDataSourceChapter([]);
};

const handleCancelModalChapter = () => {
  setChapter([])
  setDataSourceChapter([]);
  setIsModalChapterOpen(false);
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
              <Breadcrumb.Item>Câu hỏi</Breadcrumb.Item>
              <Breadcrumb.Item>{topic.topicName}</Breadcrumb.Item>
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
              <Button type="primary"
              style={{ marginBottom: "20px", marginLeft: "10px" }}
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/template_import/File_Upload_Excel_In_CourceChapter.xlsx';  // Thay '/path/to/' bằng đường dẫn thực tế đến tệp Excel
                link.setAttribute('download', 'File_Upload_Excel_In_CourceChapter.xlsx');  // Thiết lập tên tệp khi tải về
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}>
                Tải mẫu import
            </Button>

              <Button
                type="primary"
                onClick={showModalChapter}
                style={{ marginLeft: "10px" }}
              >
                Chọn câu hỏi theo chương
              </Button>
              {/* Chon chuong */}
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

              <Modal
                title="Chọn chương"
                open={isModalChapterOpen}
                okText="Thêm"
                cancelText="Thoát"
                onCancel={handleCancelModalChapter}
                onOk={handleOkModalChapter} // Xử lý khi nhấn "Thêm"
              >
                <Select
                  style={{ width: "100%" }}
                  placeholder="Chọn chương"
                  onChange={handleChapterChange}
                >
                  {chapter.map((chapter) => (
                    <Select.Option
                      key={chapter.chapterId}
                      value={chapter.chapterTitle}
                    >
                      {chapter.chapterTitle}
                    </Select.Option>
                  ))}
                </Select>

                {dataSourceChapter && (
                  <div style={{ marginTop: 20 }}>
                    <p>Chọn câu hỏi:</p>
                    <Checkbox.Group
                    options={dataSourceChapter.map((q) => {
                      const tempDiv = document.createElement("div");
                      tempDiv.innerHTML = q.questionContext;
                      return {
                        label: tempDiv.textContent || tempDiv.innerText || "", // Chuyển HTML thành text
                        value: q.questionId,
                      };
                    })}
                      onChange={handleQuestionChange}
                      style={{ display: "flex", flexDirection: "column" }}
                    />
                  </div>
                )}
                <div style={{ marginTop: 20 }}>
                <p>Các câu hỏi đã chọn:</p>
                <ul>
                  {selectedQuestions.map((question) => {
                  // Tạo một div tạm thời để gán HTML và lấy text
                  const tempDiv = document.createElement("div");
                  tempDiv.innerHTML = question.questionContext; // Gán HTML vào innerHTML

                  return (
                    <li key={question.questionId}>
                      {tempDiv.textContent || tempDiv.innerText || ""} {/* Hiển thị text */}
                    </li>
                  );
                })}
              </ul>
                </div>
              </Modal>
              <Table
                columns={columns}
                dataSource={dataSource}
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
