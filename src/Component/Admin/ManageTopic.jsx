import { useEffect, useState, useContext } from "react";

import { DatePicker, Dropdown, Breadcrumb, Layout, Table, Input, Modal, Form, notification, Button, theme, Card, Timeline, Tooltip, Select } from 'antd';
import {
    SearchOutlined, CheckCircleOutlined, FolderOpenOutlined,
    EditOutlined, PoweroffOutlined, StopOutlined, PlusCircleOutlined
} from '@ant-design/icons'
import SiderAdmin from "../../Layout/Admin/SiderAdmin";
import HeaderAdmin from "../../Layout/Admin/HeaderAdmin";
import { UserContext } from "../../contexts/UserContext";
import { Navigate, useNavigate } from 'react-router-dom';
import dayjs from "dayjs";


import { GetAllTopicService } from "../../services/topicService";
import { ChangeStatusTopicService } from "../../services/topicService";
import { GetAllSubjectService } from "../../services/subjectService";
import { AddTopicService } from "../../services/topicService";
import { handleValidationCreateTopic } from "../../assets/js/handleValidation";
import { UpdateTopicService } from "../../services/topicService";
import { handleValidationUpdateTopic } from "../../assets/js/handleValidation";

const { Content } = Layout;
const { RangePicker } = DatePicker;


export default function ManageTopic() {
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
                    placeholder="VD: khối 10"
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
                    return record.topicTypeName.toLowerCase().includes(value.toLowerCase());
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
                        {record.status == "Đã duyệt" && (
                            <Button
                                onClick={() => handleChangeStatusClose(record)}
                                style={{ color: "white", backgroundColor: "red" }}
                                icon={<StopOutlined />}
                            ></Button>
                        )}
                        {record.status == "Chờ duyệt" && (
                            <Button
                                onClick={() => handleChangeStatusApprove(record)}
                                style={{ color: "white", backgroundColor: "grey" }}
                                icon={<PlusCircleOutlined />}
                            ></Button>
                        )}
                        {record.status == "Khóa" && (
                            <Button
                                onClick={() => handleChangeStatusOpen(record)}
                                style={{ color: "white", backgroundColor: "green" }}
                                icon={<CheckCircleOutlined />}
                            ></Button>
                        )}
                        &nbsp;
                        <Button
                            icon={<FolderOpenOutlined />}
                            style={{ background: '#ffa000', color: 'white' }}
                            onClick={() => handleViewListQuestion(record)}
                        >
                        </Button>
                    </>
                );
            },
        },
    ]
    const navigate = useNavigate();
    const { render, onSetRender } = useContext(UserContext);
    const [dataSource, setDataSource] = useState("");
    const [subjectList, setSubjectList] = useState([]);
    const [showEditForm, setShowEditForm] = useState(false);


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
        editSubjectId: "",
        editTopicType: "",
        editGrade: "",
        editTopicName: "",
        editDuration: "",
        editStartDate: "",
        editEndDate: "",
    })
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
    }

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
    }

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
                        handleGetAllTopic();
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
            onCancel: () => { },
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
            onCancel: () => { },
        });
    };
    //#endregion

    //#region - Function - nhận giá trị input
    const handleEditInputChange = (event) => {
        const field = event.target.name;
        const value = event.target.value;

        setEditData((editData) => ({ ...editData, [field]: value }));
    }
    const onEditInputStartDateAndEndDate = (value, dateString) => {
        setEditData((editData) => ({ ...editData, editStartDate: dateString[0] }));
        setEditData((editData) => ({ ...editData, editEndDate: dateString[1] }));
    };

    function convertToUTCDate(inputTimeString) {
        const originalDate = new Date(inputTimeString);
        return originalDate;
    }
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
    }

    const onClickCancelEditForm = () => {
        console.log(editData);
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
    }

    const handleSubmitEdit = async () => {
        let errors = {};
        handleValidationUpdateTopic(editData, errors);
        if (Object.keys(errors).length === 0) {
            console.log(editData);
            const data = {
                topicId: editData.editTopicId,
                topicName: editData.editTopicName,
                duration: editData.editDuration != "Chọn thời gian" ? editData.editDuration : null,
                subjectId: editData.editSubjectId,
                topicType: editData.editTopicType,
                grade: editData.editGrade != null ? editData.editGrade : null,
                startTestDate: convertToUTCDate(editData.editStartDate) != null ? convertToUTCDate(editData.editStartDate) : null,
                finishTestDate: convertToUTCDate(editData.editEndDate) != null ? convertToUTCDate(editData.editEndDate) : null,
            };
            console.log(data);
            const result = await UpdateTopicService(data);
            if (result.status === 200) {
                handleGetAllTopic();
                setErrors([]);
                setShowEditForm(false);
                setEditData('');
                openNotificationUpdate200("topRight");
            } else {
                openNotificationChangeStatus400("topRight");
            }
        } else {
            setErrors(errors);
        }
    }
    //#endregion

    //#region - Function - hiển thị danh sách question theo topic
    const handleViewListQuestion = (record) => {
        const id = record.topicId;
        navigate(`/admin/manageQuestion/${id}`);
    }
    //#endregion


    return (
        <>
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
                                <h1
                                    style={{
                                        textAlign: "center",
                                        fontSize: "30px",
                                        marginBottom: "20px",
                                    }}
                                >
                                    Danh sách topic
                                </h1>
                                <Table
                                    columns={columns}
                                    dataSource={dataSource}
                                />
                            </div>
                        </div>

                        {/* Edit form */}
                        <Modal
                            title='Chỉnh sửa topic'
                            visible={showEditForm}
                            okText='Lưu'
                            cancelText='Đóng'
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
                                            <option
                                                value={item.subjectId}
                                            >
                                                {item.subjectName}
                                            </option>
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
{/*                                         <option value="1">Học</option> */}
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
                                {editData.editTopicType != 5 && editData.editTopicType != 6 &&
                                    <Form.Item>
                                        <label>Lớp</label>
                                        <select
                                            name="editGrade"
                                            value={editData.editGrade}
                                            allowclear
                                            className="form-control"
                                            onChange={handleEditInputChange}
                                        >
                                            <option value="Chọn lớp">Chọn lớp</option>
                                            <option value="10">10</option>
                                            <option value="11">11</option>
                                            <option value="12">12</option>
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
                                }
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
                                {editData.editTopicType != "1" && editData.editTopicType != "Chọn loại topic" && (
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
                                                        format: 'HH:mm',
                                                    }}
                                                    placeholder=""
                                                    format="YYYY-MM-DD HH:mm"
                                                    value={(editData.editStartDate && editData.editEndDate) ? [dayjs(editData.editStartDate, dayFormat), dayjs(editData.editEndDate, dayFormat)] : [null, null]}
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
    )
}
