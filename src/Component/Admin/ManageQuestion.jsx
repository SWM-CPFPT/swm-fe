import { useEffect, useState, useContext } from "react";
import { useParams } from 'react-router-dom';
import { UserContext } from "../../contexts/UserContext";
import { DatePicker, Dropdown, Breadcrumb, Layout, Table, Input, Modal, Form, notification, Button, theme, Card, Timeline, Tooltip, Select } from 'antd';
import {
    SearchOutlined, CheckCircleOutlined, FileTextOutlined, StopOutlined,
    EditOutlined, PoweroffOutlined, PlusCircleOutlined,CloseSquareFilled
} from '@ant-design/icons'
import SiderAdmin from "../../Layout/Admin/SiderAdmin";
import HeaderAdmin from "../../Layout/Admin/HeaderAdmin";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";
import { v4 } from "uuid";

import { handleValidationEditQuestion } from "../../assets/js/handleValidation";
import { ChangeStatusQuestionService, GetAllQuestionByTopicIdService} from "../../services/questionService";
import {
    DeleteQuestionInQuestionFromTopic
  } from "../../services/chapterService";
import { GetTopicByIdService } from "../../services/topicService";
import { ChangeStatusTopicService } from "../../services/topicService";
import { EditQuestionService } from "../../services/questionService";
import { ApproveAllQuestionService } from "../../services/questionService";

const { Content } = Layout;

export default function ManageQuestion() {

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
                            
                            children: <span dangerouslySetInnerHTML={{ __html: data.optionA }} />,
                            dot: <PlusCircleOutlined />,
                            color: "black",
                        },
                        {
                            label: "Option B",
                            children: <span dangerouslySetInnerHTML={{ __html: data.optionB }} />,
                            dot: <PlusCircleOutlined />,
                            color: "black",
                        },
                        {
                            label: "Option C",
                            children: <span dangerouslySetInnerHTML={{ __html: data.optionC }} />,
                            dot: <PlusCircleOutlined />,
                            color: "black",
                        },
                        {
                            label: "Option D",
                            children: <span dangerouslySetInnerHTML={{ __html: data.optionD }} />,
                            dot: <PlusCircleOutlined />,
                            color: "black",
                        },
                        {
                            label: "Đáp án",
                            children: <span dangerouslySetInnerHTML={{ __html: data.answer }} />,
                            dot: <CheckCircleOutlined />,
                            color: "green",
                        },
                        {
                            label: "Lời giải",
                            children: <span dangerouslySetInnerHTML={{ __html: data.solution }} />,
                            dot: <FileTextOutlined />,
                            color: "orange",
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
    const [dataSource, setdataSource]= useState("");

    const pagination = {
        pageSize: 8,
        total: dataSource != null ? dataSource.length : "",
    };
    const { user, render, onSetRender } = useContext(UserContext);
    const [topic, setTopic] = useState("");

    const columns = [
        {
            title: "ID",
            width: 70,
            dataIndex: "questionId",
            key: 1,
            fixed: "left",
        },
        {
            title: "Môn học",
            width: 170,
            dataIndex: "subjectName",
            key: 2,
            fixed: "left",
        },
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
                            width: '450px',
                            maxWidth: '450px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
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
                </td>               );
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
                    return record.questionContent.toLowerCase().includes(value.toLowerCase());
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
            key: 5,
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
                            onClick={() => { handleCheckImageNull(record.image); handleViewEdit(record);} }
                            type="primary"
                            icon={<EditOutlined />}
                        ></Button>{" "}
                                <Button
                            style={{ background: "red", color: "white" }}
                            icon={<CloseSquareFilled />}
                            onClick={() => handleViewDelete(record)}
                            ></Button>
                        &nbsp;
                        {record.status == "1" && (
                            <Button
                                onClick={() => handleChangeStatusClose(record)}
                                style={{ color: "white", backgroundColor: "red" }}
                                icon={<StopOutlined />}
                            ></Button>
                        )}
                        {record.status == "2" && (
                            <Button
                                onClick={() => handleChangeStatusOpen(record)}
                                style={{ color: "white", backgroundColor: "green" }}
                                icon={<CheckCircleOutlined />}
                            ></Button>
                        )}
                    </>
                );
            },
        },
    ]

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
    })
    const [errors, setErrors] = useState({
        editLevelId: "",
        editQuestionContent: "",
        editOptionA: "",
        editOptionB: "",
        editOptionC: "",
        editOptionD: "",
        editAnswerId: "",
        editSolution: "",
    })

    const [imageUpload, setImageUpload] = useState(null);

    //#endregion

    //#region - Function - hiển thị thông báo
    const [api, contextHolder] = notification.useNotification();
    const openNotificationChangeStatus200 = (placement) => {
        api.success({
            message: `Thông báo`,
            description: "Thay đổi trạng thái thành công",
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
    const openNotificationChangeStatus400 = (placement) => {
        api.error({
            message: `Thông báo`,
            description: "Thay đổi trạng thái thất bại",
            placement,
        });
    };
    const openNotificationGetData400 = (placement) => {
        api.error({
            message: `Thông báo`,
            description: 'Lấy dữ liệu thất bại',
            placement,
        });
    };
    const openNotificationApprove400 = (placement) => {
        api.error({
            message: `Thông báo`,
            description: 'Duyệt thất bại',
            placement,
        });
    };
    const openNotificationApprove200 = (placement) => {
        api.success({
            message: `Thông báo`,
            description: 'Duyệt thành công',
            placement,
        });
    };
    //#endregion

    //#region - Function - lấy danh sách câu hỏi/ topic detail
    const handleGetAllQuestionByTopic = async () =>{
        try {
            const result = await GetAllQuestionByTopicIdService(id);
            const result2 = await GetTopicByIdService(id);
            if(result.status === 200){
                setdataSource(result.data);
            } else {
                openNotificationGetData400("topRight")
            } 
            if(result2.status === 200){
                setTopic(result2.data);
            } else {
                openNotificationGetData400("topRight")
            }
        } catch (error) {
            openNotificationGetData400("topRight");
        }
    }

    useEffect(() => {
        handleGetAllQuestionByTopic();
    }, []);
    //#endregion

    //#region - Funtion - thay đổi trạng thái câu hỏi
    const handleChangeStatusClose = async (record) => {
        Modal.confirm({
            title: "Bạn muốn khóa câu hỏi này",
            okText: "Khóa",
            cancelText: "Thoát",
            okType: "danger",
            onOk: async () => {
                const status = "2";
                try{
                    const result = await ChangeStatusQuestionService(record.questionId, status);
                    if(result.status === 200){
                        openNotificationChangeStatus200("topRight");
                        handleGetAllQuestionByTopic();
                    } else {
                        openNotificationChangeStatus400("topRight");
                    }
                } catch {
                    openNotificationChangeStatus400("topRight");
                }
                
            },
            cancelText: "Cancel",
            onCancel: () => { },
        });
    };

    const handleChangeStatusOpen = async (record) => {
        Modal.confirm({
            title: "Bạn muốn mở khóa câu hỏi này",
            okText: "Mở",
            cancelText: "Thoát",
            okType: "default",
            onOk: async () => {
                const status = "1";
                try{
                    const result = await ChangeStatusQuestionService(record.questionId, status);
                    if(result.status === 200){
                        openNotificationChangeStatus200("topRight");
                        handleGetAllQuestionByTopic();
                    } else {
                        openNotificationChangeStatus400("topRight");
                    } 
                } catch{
                    openNotificationChangeStatus400("topRight");    
                }
            },
            cancelText: "Cancel",
            onCancel: () => { },
        });
    };

    const handleChangeStatusApprove = async (record) => {
        Modal.confirm({
            title: "Bạn muốn duyệt câu hỏi này",
            okText: "Duyệt",
            cancelText: "Thoát",
            okType: "default",
            onOk: async () => {
                const status = "1";
                try{
                    const result = await ChangeStatusQuestionService(record.questionId, status);
                    if(result.status === 200){
                        openNotificationChangeStatus200("topRight");
                        handleGetAllQuestionByTopic();
                    } else {
                        openNotificationChangeStatus400("topRight");
                    }
                }catch{
                    openNotificationChangeStatus400("topRight");    
                }
            },
            cancelText: "Cancel",
            onCancel: () => { },
        });
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

    const convertValueHTML = (value) => {
        const isHTMLContent = /<[a-z][\s\S]*>/i.test(value);
        const formattedContent = isHTMLContent ? value : `<p>${value}</p>`;
        return formattedContent;
    }

    const handleCheckImageNull = (value)=> {
        console.log(value);
        if(value != null){
            setImageUpload(value);
        }
    }
    
// Xóa question 
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
//   end
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
    }

    const handleSubmitEdit = async () => {
        let errors = {}
        handleValidationEditQuestion(editData, errors);
        if(Object.keys(errors).length === 0){
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
            }
            const result = await EditQuestionService(data);
            if(result.status === 200){
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
        } else{
            setErrors(errors);
        }
    }
    //#endregion


    //#region - Function - nhận giá trị input
    const handleEditInputChange = (event) => {
        const field = event.target.name;
        const value = event.target.value;

        setEditData((editData) => ({...editData, [field]: value}));
    }

    const handleEditInputFile = async (event) => {
        if(event == null){
            return;
        }
        const file = event.target.files[0]; 
        const imgRef = ref(storage, `images/question_images/${editData.editLevelId + v4()}`);
        try{
            const snapshoot = await uploadBytes(imgRef, file);
            const url = await getDownloadURL(snapshoot.ref);
            setImageUpload(url);
        } catch (error) {
            console.error('Failed to upload', error);
        }
    }
    //#endregion

    //#region - Function Duyệt tất cả câu hỏi
    const handleApproveAllQuestion = async () => {
        Modal.confirm({
            title: "Bạn muốn duyệt tất cả câu hỏi",
            okText: "Duyệt",
            cancelText: "Thoát",
            okType: "default",
            onOk: async () => {
                try{
                    const result = await ApproveAllQuestionService(id);
                         if (result.status === 200){
                            handleGetAllQuestionByTopic();
                            openNotificationApprove200("topRight");
                        } else{
                            openNotificationApprove400("topRight");
                    }
                } catch {
                    openNotificationApprove400("topRight");
                }
                
            },
            cancelText: "Cancel",
            onCancel: () => { },
        });
        
    } 
    //#endregion

    return (
        <>
        <Layout
            style={{ minHeight: '100vh' }}
        >
        {contextHolder} 
            <SiderAdmin />
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
                        <div>
                            <h1
                                style={{
                                    textAlign: "center",
                                    fontSize: "30px",
                                    marginBottom: "20px",
                                }}
                            >
                                Danh sách câu hỏi<i></i>
                            </h1>
                          
                        </div>
                        <Table
                            columns={columns}
                            dataSource={dataSource}
                            pagination ={pagination}
                            components={{
                              body: {
                                row: CustomRow,
                              },
                            }}
                        />

                        {/* Chỉnh sửa câu hỏi */}
                        <Modal
                            title='Chỉnh sửa câu hỏi'
                            visible={showEditForm}
                            okText='Lưu'
                            cancelText='Đóng'
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
                                    <ReactQuill className="quill-editor" value={editData?.editQuestionContent}
                                    onChange={(value) => setEditData({ ...editData, editQuestionContent: value })}
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
                                            <img src="" alt=""/>
                                        ) : (
                                            <>
                                                {imageUpload && (
                                                    <img
                                                        src={imageUpload}
                                                        alt=''
                                                        className="w-100"
                                                        style={{overflow: 'hidden', objectFit: 'cover'}}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <input type="file" onChange={handleEditInputFile}/>
                                </Form.Item>
                                <Form.Item>
                                    <label>Lựa chọn A</label>
                                    <ReactQuill className="quill-editor" value={editData?.editOptionA}
                                    onChange={(value) => setEditData({ ...editData, editOptionA: value })}
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
                                    <ReactQuill className="quill-editor" value={editData?.editOptionB}
                                     onChange={(value) => setEditData({ ...editData, editOptionB: value })}
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
                                    <ReactQuill className="quill-editor" value={editData?.editOptionC} 
                                    onChange={(value) => setEditData({ ...editData, editOptionC: value })}
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
                                    <ReactQuill className="quill-editor" value={editData?.editOptionD}
                                    onChange={(value) => setEditData({ ...editData, editOptionD: value })}
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
                                    <ReactQuill className="quill-editor" value={editData?.editSolution}
                                    onChange={(value) => setEditData({ ...editData, editSolution: value })}
                                    />
                                </Form.Item>
                           </Form>
                        </Modal>
                    </div>
                </Content>
            </Layout>
        </Layout>
    </>
    )
}