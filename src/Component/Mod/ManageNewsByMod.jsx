import { useEffect, useState, useContext } from "react";
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
} from "antd";
import { Option } from "antd/es/mentions";
import {
  SearchOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  EditOutlined,
  PoweroffOutlined,
  ManOutlined,
  WomanOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import SiderAdmin from "../../Layout/Admin/SiderAdmin";
import HeaderAdmin from "../../Layout/Admin/HeaderAdmin";
import "bootstrap/dist/css/bootstrap.css";
import { Editor } from "@tinymce/tinymce-react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  connectStorageEmulator,
} from "firebase/storage";
import { storage } from "../../firebase";
import { v4 } from "uuid";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../assets/Admin.css";

import { handleValidationEditNew } from "../../assets/js/handleValidation";
import { handleValidationCreateNew } from "../../assets/js/handleValidation";
import { GetAllNewsService } from "../../services/NewsService";
import { GetAllNewsCategoryService } from "../../services/NewsService";
import { UserContext } from "../../contexts/UserContext";
import { AddNewsService } from "../../services/NewsService";
import { EditNewsService } from "../../services/NewsService";

const { Content } = Layout;

export default function ManageNewsByMod() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  //#region - Decleare - Khai báo các biến
  const { user, render, onSetRender } = useContext(UserContext);
  const [imageUpload, setImageUpload] = useState(null);
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
          return record.categoryName
            .toLowerCase()
            .includes(value.toLowerCase());
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
          </>
        );
      },
    },
  ];
  const [newList, setNewList] = useState([]);
  const [newCategoryList, setNewCategoryList] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [createData, setCreateDate] = useState({
    createCategory: "Chọn loại",
    createImage: "",
    createTitle: "",
    createSubTitle: "",
    createContent: "",
  });

  const [editData, setEditData] = useState({
    editNewsId: "",
    editCategory: "",
    editImage: "",
    editTitle: "",
    editSubTitle: "",
    editContent: "",
  });

  const [errors, setErrors] = useState({
    createCategory: "",
    createImage: "",
    createTitle: "",
    createSubTitle: "",
    createContent: "",
    editCategory: "",
    editImage: "",
    editTitle: "",
    editSubTitle: "",
    editContent: "",
  });
  //#endregion

  //#region - Function - Hiển thị thông báo
  const [api, contextHolder] = notification.useNotification();
  const openNotificationSuccess = (placement) => {
    api.success({
      message: `Thông báo`,
      description: "Thêm thành công",
      placement,
    });
  };
  const openNotificationFail = (placement) => {
    api.error({
      message: `Thông báo`,
      description: "Thêm thất bại",
      placement,
    });
  };
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
  //#endregion

  //#region - Function - Hiển thị danh sách tin tức/ loại tin tức
  const handleGetAllNew = async () => {
    try {
      const result = await GetAllNewsService();
      if (result.status === 200) {
        setNewList(result.data);
      }
    } catch (error) {
      console.error("Error fetching account user service:", error);
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
      console.error("Error fetching account user service:", error);
    }
  };

  useEffect(() => {
    handleGetAllCategory();
  }, [render]);
  //#endregion

  //#region - Function - Nhận giá trị input
  const handleCreateInputChange = (event) => {
    const field = event.target.name;
    const value = event.target.value;

    setCreateDate((createData) => ({ ...createData, [field]: value }));
  };

  const handleEditInputChange = (event) => {
    const field = event.target.name;
    const value = event.target.value;

    setEditData((editData) => ({ ...editData, [field]: value }));
  };

  const handleCreateInputFile = async (event) => {
    if (event == null) {
      return;
    }
    const file = event.target.files[0];

    const imgRef = ref(
      storage,
      `images/news_images/${createData.createTitle + v4()}`
    );
    try {
      const snapshoot = await uploadBytes(imgRef, file);
      const url = await getDownloadURL(snapshoot.ref);
      setImageUpload(url);
    } catch (error) {
      console.error("Error uploading file", error);
    }
  };

  //#endregion

  //#region - Function - Thêm mới tin tức
  const handleAddNews = async () => {
    try {
      let errors = {};
      handleValidationCreateNew(createData, errors, imageUpload);
      if (Object.keys(errors).length === 0) {
        const data = {
          categoryName: createData.createCategory,
          title: createData.createTitle,
          image: imageUpload,
          subTitle: createData.createSubTitle,
          content: createData.createContent,
          accountId: user.accountId,
        };
        const result = await AddNewsService(data);
        if (result.status === 200) {
          handleGetAllNew();
          setCreateDate({
            createCategory: "",
            createImage: "",
            createTitle: "",
            createSubTitle: "",
            createContent: "",
          });
          setImageUpload(null);
          openNotificationSuccess("topRight");
          setShowCreateForm(false);
          onSetRender();
        } else {
          openNotificationFail("topRight");
        }
      } else {
        setErrors(errors);
      }
    } catch {
      openNotificationFail("topRight");
    }
  };
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
  };

  const handleEditNews = async () => {
    try {
      let errors = {};
      handleValidationEditNew(editData, errors, imageUpload);
      if (Object.keys(errors).length === 0) {
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
        };
        const result = await EditNewsService(data);
        if (result.status === 200) {
          handleGetAllNew();
          openNotificationUpdateSuccess("topRight");
        }
      } else {
        setErrors(errors);
      }
    } catch {
      console.log("errors");
    }
  };

  //#endregion

  return (
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
            <Breadcrumb.Item>Tin tức</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            <div className="pb-5">
              <h1 className="custom-title-exam">Danh sách tin tức</h1>
            </div>
            <Button
              type="primary"
              onClick={() => {
                setShowCreateForm(true);
              }}
              style={{ marginBottom: "20px", marginRight: "10px" }}
            >
              Tạo tin tức
            </Button>
            <Table
              columns={columns}
              dataSource={newList}
              // pagination={pagination}
            />

            <Modal
              title="Tạo tin tức"
              visible={showCreateForm}
              okText="Thêm"
              cancelText="Đóng"
              onCancel={() => {
                setShowCreateForm(false);
                setErrors([]);
                setCreateDate("");
                setImageUpload(null);
              }}
              onOk={() => handleAddNews()}
            >
              <Form>
                <Form.Item>
                  <label>Loại tin tức</label>
                  <select
                    name="createCategory"
                    defaultValue="Chọn loại"
                    value={createData.createCategory}
                    allowClear
                    onChange={handleCreateInputChange}
                    className="form-control"
                  >
                    <option value="Chọn loại">Chọn loại</option>
                    {newCategoryList?.map((item) => (
                      <option value={item.categoryName}>
                        {item.categoryName}
                      </option>
                    ))}
                  </select>
                  {errors.createCategory && (
                    <div
                      className="invalid-feedback"
                      style={{ display: "block", color: "red" }}
                    >
                      {errors.createCategory}
                    </div>
                  )}
                </Form.Item>
                <Form.Item>
                  <label className="w-100">Ảnh bìa</label>
                  <div className="w-100">
                    {imageUpload == null || imageUpload == "" ? (
                      <img src="../Image/Image_Null.png" alt="" />
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
                  {errors.createImage && (
                    <div
                      className="invalid-feedback"
                      style={{ display: "block", color: "red" }}
                    >
                      {errors.createImage}
                    </div>
                  )}
                </Form.Item>
                <Form.Item>
                  <label>Tiêu đề</label>
                  <Input
                    type="text"
                    placeholder="Nhập tên tiêu đề"
                    className="form-control"
                    value={createData.createTitle}
                    name="createTitle"
                    onChange={handleCreateInputChange}
                  />
                  {errors.createTitle && (
                    <div
                      className="invalid-feedback"
                      style={{ display: "block", color: "red" }}
                    >
                      {errors.createTitle}
                    </div>
                  )}
                </Form.Item>
                <Form.Item>
                  <label>Phụ đề</label>
                  <Input
                    type="text"
                    placeholder="Nhập phụ đề"
                    className="form-control"
                    value={createData.createSubTitle}
                    name="createSubTitle"
                    onChange={handleCreateInputChange}
                  />
                  {errors.createSubTitle && (
                    <div
                      className="invalid-feedback"
                      style={{ display: "block", color: "red" }}
                    >
                      {errors.createSubTitle}
                    </div>
                  )}
                </Form.Item>
                <Form.Item>
                  <label>Nội dung</label>
                  <ReactQuill
                    className="quill-editor"
                    value={createData?.createContent}
                    onChange={(value) =>
                      setCreateDate({ ...createData, createContent: value })
                    }
                  />
                  {errors.createContent && (
                    <div
                      className="invalid-feedback"
                      style={{ display: "block", color: "red" }}
                    >
                      {errors.createContent}
                    </div>
                  )}
                </Form.Item>
              </Form>
            </Modal>

            <Modal
              title="Chỉnh sửa tin tức"
              visible={showEditForm}
              okText="Lưu"
              cancelText="Đóng"
              onCancel={() => {
                setShowEditForm(false);
                // setErrors([]);
                setEditData("");
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
                    <option value="Chọn loại"></option>
                    {newCategoryList?.map((item) => (
                      <option value={item.categoryName}>
                        {item.categoryName}
                      </option>
                    ))}
                  </select>
                  {errors.editCategory && (
                    <div
                      className="invalid-feedback"
                      style={{ display: "block", color: "red" }}
                    >
                      {errors.editCategory}
                    </div>
                  )}
                </Form.Item>
                <Form.Item>
                  <label className="w-100">Ảnh bìa</label>
                  <div className="w-100">
                    {imageUpload == null || imageUpload == "" ? (
                      <img src="../Image/Image_Null.png" alt="" />
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
                  <label>Tiêu đề</label>
                  <Input
                    type="text"
                    placeholder="Nhập tên tiêu đề"
                    className="form-control"
                    value={editData.editTitle}
                    name="editTitle"
                    onChange={handleEditInputChange}
                  />
                  {errors.editTitle && (
                    <div
                      className="invalid-feedback"
                      style={{ display: "block", color: "red" }}
                    >
                      {errors.editTitle}
                    </div>
                  )}
                </Form.Item>
                <Form.Item>
                  <label>Phụ đề</label>
                  <Input
                    type="text"
                    placeholder="Nhập phụ đề"
                    className="form-control"
                    value={editData.editSubTitle}
                    name="editSubTitle"
                    onChange={handleEditInputChange}
                  />
                  {errors.editSubTitle && (
                    <div
                      className="invalid-feedback"
                      style={{ display: "block", color: "red" }}
                    >
                      {errors.editSubTitle}
                    </div>
                  )}
                </Form.Item>
                <Form.Item>
                  <label>Nội dung</label>
                  <ReactQuill
                    className="quill-editor"
                    value={editData?.editContent}
                    onChange={(value) =>
                      setEditData({ ...editData, editContent: value })
                    }
                  />
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
