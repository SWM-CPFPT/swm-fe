import { useState, useContext, useEffect, useRef } from "react";
import "../../../assets/ProfileStyle.css";
import "../../../assets/InforUserStyle.css";
import { Input, Modal, Form, DatePicker, notification } from "antd";
import { useCookies } from "react-cookie";
import { UserContext } from "../../../contexts/UserContext";
import dayjs from "dayjs";
import axios from "axios";
import { storage } from "../../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";

import { UpdateUserService } from "../../../services/userService";
import { GetInforByEmailService } from "../../../services/userService";
import { handleValidationUpdateUser } from "../../../assets/js/handleValidation";
import { handleValidationChangePassword } from "../../../assets/js/handleValidation";
import { ChangePassowrdService } from "../../../services/userService";
import { GetPhoneWithoutThisPhonedService } from "../../../services/userService";
import ActivityUser from "./ActivityUser";

//format datatime
const formatDate = (dateString) => {
  const date = new Date(dateString);

  const year = date.getFullYear().toString().padStart(4, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
};
const dayFormat = "YYYY-MM-DD";

export default function InformationUser() {
  //#region - Function - Ẩn hiện mật khẩu
  const [enableDisable, setEnableDisable] = useState("password");

  const onClickDisplayPassword = () => {
    if (enableDisable == "password") {
      setEnableDisable("text");
    } else {
      setEnableDisable("password");
    }
  };
  //#endregion

  //#region - Function - Hiển thị thông báo
  const [api, contextHolder] = notification.useNotification();
  const openNotificationUpdate = (placement) => {
    api.success({
      message: `Thông báo`,
      description: "Chỉnh sửa thành công",
      placement,
    });
  };
  const openNotificationChangePassword = (placement) => {
    api.success({
      message: `Thông báo`,
      description: "Thay đổi mật khẩu thành công",
      placement,
    });
  };
  //#endregion

  //#region - Declare - Khai báo các biên sử dụng
  const [imageUpload, setImageUpload] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { token, user, onSetUser, render, onSetRender } =
    useContext(UserContext);
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const [phoneList, setPhoneList] = useState("");
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    password: user.password,
    avatar: user.avatar,
  });

  const [editData, setEditData] = useState({
    editUserId: "",
    editFullName: "",
    editAvatar: "",
    editEmail: "",
    editPhone: "",
    editBirthDay: "",
    editGender: "",
    editSchoolName: "",
  });

  const [errors, setErrors] = useState({
    editFullName: "",
    editPhone: "",
    editBirthDay: "",
    editSchoolName: "",
    inputNewPassword: "",
    inputComfirmPassword: "",
  });

  //#endregion

  //#region - FUnction - log out
  const onLogOut = () => {
    removeCookie("token", { path: "/" });
    onSetUser({
      data: "",
      token: "",
    });
    navigate("/");
  };
  //#endregion

  //#region - Function - Nhận giá trị input
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

  //#endregion

  //#region - Function - Edit user
  const handleViewUser = async () => {
    const result = await GetInforByEmailService(user.email);
    const currentAvatar = result.result.user.avatar;
    setImageUpload(currentAvatar);
    if (result) {
      setEditData({
        editUserId: result.result.user.accountId,
        editFullName: result.result.user.fullName,
        editAvatar: currentAvatar,
        editEmail: result.result.user.email,
        editPhone: result.result.user.phone,
        editBirthDay: result.result.user.birthDay,
        editGender: result.result.user.gender,
        editSchoolName: result.result.user.schoolName,
      });
      setShowUpdate(true);
    }
  };

  const handleUpdate = async () => {
    let errors = {};
    const data = {
      accountId: editData.editUserId,
      fullName: editData.editFullName,
      phone: editData.editPhone,
      birthDay: editData.editBirthDay,
      gender: editData.editGender,
      schoolName: editData.editSchoolName,
      avatar: imageUpload,
    };

    // Lấy năm hiện tại
    const currentYear = new Date().getFullYear();
    // Lấy năm sinh từ editData
    const birthYear = new Date(editData.editBirthDay).getFullYear();

    // Kiểm tra nếu người dùng dưới 16 tuổi
    if (currentYear - birthYear < 16) {
      errors.editBirthDay =
        "Ngày sinh không hợp lệ. Bạn phải từ 16 tuổi trở lên.";
    }

    var result = await GetPhoneWithoutThisPhonedService(user.phone);
    handleValidationUpdateUser(editData, errors, result.data);

    if (Object.keys(errors).length === 0) {
      const result = await UpdateUserService(data);
      if (result) {
        openNotificationUpdate("topRight");
        setErrors([]);
        const response = await GetInforByEmailService(user.email);
        if (response) {
          const updatedImageUpload = response.result.user.avatar;
          setImageUpload(updatedImageUpload);
          setEditData({
            editUserId: response.result.user.accountId,
            editFullName: response.result.user.fullName,
            editAvatar: updatedImageUpload,
            editEmail: response.result.user.email,
            editPhone: response.result.user.phone,
            editBirthDay: response.result.user.birthDay,
            editGender: response.result.user.gender,
            editSchoolName: response.result.user.schoolName,
          });
          setUserInfo({
            fullName: response.result.user.fullName,
            email: response.result.user.email,
            phone: response.result.user.phone,
            password: response.result.user.password,
            avatar: response.result.user.avatar,
          });
          onSetRender();
        }
      }
    } else {
      setErrors(errors);
    }
  };

  //#endregion

  //#region - Function - Đổi mật khẩu
  const [newPassword, setNewPassword] = useState({
    inputNewPassword: "",
    inputComfirmPassword: "",
  });

  const handleInputPassword = (event) => {
    const field = event.target.name;
    const value = event.target.value;

    setNewPassword((newPassword) => ({ ...newPassword, [field]: value }));
  };

  const handleChangePassword = async () => {
    let errors = {};
    handleValidationChangePassword(newPassword, errors);
    if (Object.keys(errors).length === 0) {
      const result = await ChangePassowrdService(
        user.accountId,
        newPassword.inputNewPassword
      );
      if (result) {
        openNotificationChangePassword("topRight");
        setErrors([]);
        const response = await GetInforByEmailService(user.email);
        if (response) {
          setUserInfo({
            fullName: response.result.user.fullName,
            email: response.result.user.email,
            phone: response.result.user.phone,
            password: response.result.user.password,
            avatar: response.result.user.avatar,
          });
        }
        setShowForgotPassword(false);
        setNewPassword("");
        onSetRender();
      }
    } else {
      setErrors(errors);
    }
  };
  //#endregion

  //#region - Function - Change Avatar

  const inputRef = useRef(null);

  const handleSpanClick = () => {
    inputRef.current.click();
  };

  const handleInputFile = async (event) => {
    const file = event.target.files[0];

    const imgRef = ref(
      storage,
      `images/avata_images/${editData.editEmail + v4()}`
    );
    try {
      const snapshot = await uploadBytes(imgRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setImageUpload(url);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const backgroundStyle = {
    backgroundImage:
      user.avatar !== null
        ? `url(${userInfo.avatar})`
        : `url('../Image/Avatar_Null.png')`,
  };
  //#endregion

  return (
    <>
      {contextHolder}
      <div class="profile-page">
        <div className="content">
          <div className="content-cover">
            <div className="content-avatar" style={backgroundStyle}>
              <span class="edit custom-edit" onClick={() => handleViewUser()}>
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                  <g filter="url(#filter0_d)">
                    <circle cx="25" cy="23" r="23" fill="white"></circle>
                  </g>
                  <path
                    d="M34.9459 16.369L31.5926 13.0157C31.4438 12.8665 31.267 12.7481 31.0723 12.6673C30.8777 12.5865 30.669 12.5449 30.4582 12.5449C30.2475 12.5449 30.0388 12.5865 29.8442 12.6673C29.6495 12.7481 29.4727 12.8665 29.3239 13.0157L15.6819 26.7373L14.5774 31.5235C14.5303 31.7555 14.5353 31.995 14.5919 32.2249C14.6485 32.4548 14.7553 32.6692 14.9047 32.8529C15.0541 33.0365 15.2423 33.1847 15.4558 33.2869C15.6693 33.3891 15.9029 33.4427 16.1396 33.4439C16.2619 33.4574 16.3854 33.4574 16.5078 33.4439L21.3337 32.3792L34.9459 18.6377C35.0951 18.4889 35.2135 18.3121 35.2943 18.1174C35.3751 17.9228 35.4167 17.7141 35.4167 17.5033C35.4167 17.2926 35.3751 17.0839 35.2943 16.8893C35.2135 16.6946 35.0951 16.5178 34.9459 16.369ZM20.2989 30.5384L16.657 31.3444L17.5028 27.7324L27.7716 17.3939L30.5777 20.1999L20.2989 30.5384ZM31.702 19.0755L28.896 16.2695L30.4383 14.6973L33.2643 17.5232L31.702 19.0755Z"
                    fill="#86B026"
                  ></path>
                  <defs>
                    <filter
                      id="filter0_d"
                      x="0"
                      y="0"
                      width="50"
                      height="50"
                      filterUnits="userSpaceOnUse"
                      color-interpolation-filters="sRGB"
                    >
                      <feFlood
                        flood-opacity="0"
                        result="BackgroundImageFix"
                      ></feFlood>
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      ></feColorMatrix>
                      <feOffset dy="2"></feOffset>
                      <feGaussianBlur stdDeviation="1"></feGaussianBlur>
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
                      ></feColorMatrix>
                      <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow"
                      ></feBlend>
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow"
                        result="shape"
                      ></feBlend>
                    </filter>
                  </defs>
                </svg>
              </span>
            </div>
            <div className="content-bull">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="content-title">
            <h1>{userInfo.fullName}</h1>
            <div className="d-flex justify-content-center">
              <span class="text pe-4">Mật khẩu: **********</span>
              <span
                className="btn-edit"
                onClick={() => setShowForgotPassword(true)}
              >
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
                  <path
                    d="M24.3919 4.57225L20.3825 0.56288C20.2046 0.384458 19.9932 0.242897 19.7604 0.146308C19.5277 0.0497186 19.2782 0 19.0262 0C18.7742 0 18.5247 0.0497186 18.292 0.146308C18.0593 0.242897 17.8479 0.384458 17.6699 0.56288L1.35881 16.9692L0.0382209 22.6917C-0.0180395 22.9691 -0.0121252 23.2556 0.0555395 23.5304C0.123204 23.8052 0.250937 24.0617 0.42955 24.2812C0.608163 24.5008 0.833218 24.6781 1.08853 24.8002C1.34383 24.9224 1.62305 24.9865 1.90609 24.9879C2.05238 25.004 2.19999 25.004 2.34628 24.9879L8.11645 23.7149L24.3919 7.28482C24.5703 7.10689 24.7119 6.8955 24.8084 6.66276C24.905 6.43003 24.9547 6.18052 24.9547 5.92854C24.9547 5.67655 24.905 5.42705 24.8084 5.19431C24.7119 4.96158 24.5703 4.75019 24.3919 4.57225ZM6.87913 21.5139L2.52474 22.4776L3.53601 18.1589L15.814 5.79767L19.169 9.15269L6.87913 21.5139ZM20.5134 7.8083L17.1583 4.45328L19.0024 2.57351L22.3812 5.95233L20.5134 7.8083Z"
                    fill="black"
                    fill-opacity="0.25"
                  ></path>
                </svg>
              </span>
            </div>
          </div>
          <div className="content-description">
            <p>Email: {userInfo.email}</p>
            <p>Số điện thoại: {userInfo.phone}</p>
          </div>
          <ActivityUser />

          <div className="content-button">
            <div className="button" onClick={() => onLogOut()}>
              <div className="button-border"></div>
              <div className="button-bg"></div>
              <p className="button-text mb-0">Đăng xuất</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* form chỉnh sửa */}
      <Modal
        title={
          <h2
            style={{ color: "#2484ba", fontSize: "20px", fontWeight: "bold" }}
          >
            Chỉnh sửa thông tin
          </h2>
        }
        visible={showUpdate}
        okText="Lưu"
        onOk={() => {
          handleUpdate();
        }}
        onCancel={() => {
          setShowUpdate(false);
          setErrors("");
        }}
      >
        <Form>
          <div className="modal-header">
            <h5 className="modal-title">
              <div className="sc-jcUlvj iXziXU">
                {editData.editAvatar == null ? (
                  <img src="../Image/Avatar_Null.png" alt="" />
                ) : (
                  <>
                    {imageUpload && (
                      <img
                        src={imageUpload}
                        alt=""
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </>
                )}
                <span className="edit" onClick={handleSpanClick}>
                  <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                    <g filter="url(#filter0_d)">
                      <circle cx="25" cy="23" r="23" fill="white"></circle>
                    </g>
                    <path
                      d="M34.9459 16.369L31.5926 13.0157C31.4438 12.8665 31.267 12.7481 31.0723 12.6673C30.8777 12.5865 30.669 12.5449 30.4582 12.5449C30.2475 12.5449 30.0388 12.5865 29.8442 12.6673C29.6495 12.7481 29.4727 12.8665 29.3239 13.0157L15.6819 26.7373L14.5774 31.5235C14.5303 31.7555 14.5353 31.995 14.5919 32.2249C14.6485 32.4548 14.7553 32.6692 14.9047 32.8529C15.0541 33.0365 15.2423 33.1847 15.4558 33.2869C15.6693 33.3891 15.9029 33.4427 16.1396 33.4439C16.2619 33.4574 16.3854 33.4574 16.5078 33.4439L21.3337 32.3792L34.9459 18.6377C35.0951 18.4889 35.2135 18.3121 35.2943 18.1174C35.3751 17.9228 35.4167 17.7141 35.4167 17.5033C35.4167 17.2926 35.3751 17.0839 35.2943 16.8893C35.2135 16.6946 35.0951 16.5178 34.9459 16.369ZM20.2989 30.5384L16.657 31.3444L17.5028 27.7324L27.7716 17.3939L30.5777 20.1999L20.2989 30.5384ZM31.702 19.0755L28.896 16.2695L30.4383 14.6973L33.2643 17.5232L31.702 19.0755Z"
                      fill="#86B026"
                    ></path>
                    <defs>
                      <filter
                        id="filter0_d"
                        x="0"
                        y="0"
                        width="50"
                        height="50"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                      >
                        <feFlood
                          flood-opacity="0"
                          result="BackgroundImageFix"
                        ></feFlood>
                        <feColorMatrix
                          in="SourceAlpha"
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        ></feColorMatrix>
                        <feOffset dy="2"></feOffset>
                        <feGaussianBlur stdDeviation="1"></feGaussianBlur>
                        <feColorMatrix
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
                        ></feColorMatrix>
                        <feBlend
                          mode="normal"
                          in2="BackgroundImageFix"
                          result="effect1_dropShadow"
                        ></feBlend>
                        <feBlend
                          mode="normal"
                          in="SourceGraphic"
                          in2="effect1_dropShadow"
                          result="shape"
                        ></feBlend>
                      </filter>
                    </defs>
                  </svg>
                </span>
                <input
                  type="file"
                  ref={inputRef}
                  onChange={handleInputFile}
                  class="nrr-updload-file"
                  style={{ display: "none" }}
                />
              </div>
            </h5>
          </div>
          <div className="modal-body">
            <div className="modal-change-info-body">
              <div className="row-info">
                <label for="name">
                  <span className="row-title">
                    Tên
                    <span class="required">*</span>:
                  </span>
                  <Input
                    type="text"
                    class="form-control"
                    name="editFullName"
                    value={editData.editFullName}
                    style={{ marginleft: "0px;" }}
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
                </label>
              </div>
              <div className="row-info">
                <label for="gender">
                  <span class="row-title">
                    Gmail
                    <span class="required">*</span>:
                  </span>
                  <input
                    type="text"
                    class="form-control"
                    value={editData.editEmail}
                    style={{ marginleft: "0px;" }}
                    readOnly
                  />
                </label>
              </div>
              <div className="row-info">
                <label for="gender">
                  <span class="row-title">
                    Phone
                    <span class="required">*</span>:
                  </span>
                  <Input
                    type="text"
                    class="form-control"
                    name="editPhone"
                    value={editData.editPhone}
                    style={{ marginleft: "0px;" }}
                    onChange={handleInputChange}
                  />
                  {errors.editPhone && (
                    <div
                      className="invalid-feedback"
                      style={{ display: "block", color: "red" }}
                    >
                      {errors.editPhone}
                    </div>
                  )}
                </label>
              </div>
              <div className="row-info">
                <label for="gender">
                  <span class="row-title">
                    Ngày sinh
                    <span class="required">*</span>:
                  </span>
                  <DatePicker
                    className="form-control w-100 border-0"
                    name="editBirthDay"
                    value={
                      editData.editBirthDay
                        ? dayjs(editData.editBirthDay, dayFormat)
                        : null
                    }
                    onChange={(date) =>
                      handleInputChangeDate(date, "editBirthDay")
                    }
                  />
                  {errors.editBirthDay && (
                    <div
                      className="invalid-feedback"
                      style={{ display: "block", color: "red" }}
                    >
                      {errors.editBirthDay}
                    </div>
                  )}
                </label>
              </div>
              <div className="row-info">
                <label for="gender">
                  <span class="row-title">
                    Giới tính
                    <span class="required">*</span>:
                  </span>
                  <select
                    id="cars"
                    className="form-control w-100 select"
                    value={editData.editGender}
                    name="editGender"
                    onChange={handleInputChange}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </label>
              </div>
              <div className="row-info">
                <label for="gender">
                  <span class="row-title">
                    Tên trường
                    <span class="required">*</span>:
                  </span>
                  <input
                    type="text"
                    class="form-control"
                    name="editSchoolName"
                    value={editData.editSchoolName}
                    style={{ marginleft: "0px;" }}
                    onChange={handleInputChange}
                  />
                </label>
              </div>
            </div>
          </div>
        </Form>
      </Modal>

      {/* form đổi mật khẩu */}
      <Modal
        title={
          <h2
            style={{
              color: "#2484ba",
              fontSize: "20px",
              fontWeight: "bold",
              width: "60%",
            }}
          >
            Thay đổi mật khẩu
          </h2>
        }
        visible={showForgotPassword}
        okText="Lưu"
        onOk={handleChangePassword}
        onCancel={() => {
          setShowForgotPassword(false);
          setErrors("");
          setNewPassword("");
        }}
      >
        <div className="modal-header">
          <h5 className="modal-title">
            <div className="sc-jcUlvj iXziXU">
              <img src="../Image/reset-password.png" alt="" />
            </div>
          </h5>
        </div>
        <div className="modal-body" style={{ padding: "0 0.2rem 1rem" }}>
          <div className="modal-change-password-body">
            <Form>
              <div className="modal-body" style={{ padding: "0 0.2rem 1rem" }}>
                <div className="modal-change-info-body">
                  {/* <div className="row-info">
                    <label for="name">
                      <span className="row-title" style={{ minwidth: "210px" }}>
                        Mật khẩu hiện tại
                        <span class="required">*</span>:
                      </span>
                    </label>
                    <Input
                      type={enableDisable}
                      class="form-control"
                      placeholder="Nhập mật khẩu hiện tại"
                      style={{ marginLeft: "0", marginTop: "10px" }}
                      onClick={onClickDisplayPassword}
                    />
                  </div> */}
                  <div className="row-info">
                    <label for="gender">
                      <span class="row-title">
                        Mật khẩu mới
                        <span class="required">*</span>:
                      </span>
                    </label>
                    <Input
                      type="password"
                      class="form-control"
                      value={newPassword.inputNewPassword}
                      name="inputNewPassword"
                      style={{ marginLeft: "0", marginTop: "10px" }}
                      placeholder="Nhập mật khẩu mới"
                      onChange={handleInputPassword}
                    />
                    {errors.inputNewPassword && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block", color: "red" }}
                      >
                        {errors.inputNewPassword}
                      </div>
                    )}
                  </div>
                  <div className="row-info">
                    <label for="gender">
                      <span class="row-title">
                        Nhập lại mật khẩu mới
                        <span class="required">*</span>:
                      </span>
                    </label>
                    <Input
                      type="password"
                      class="form-control"
                      value={newPassword.inputComfirmPassword}
                      name="inputComfirmPassword"
                      style={{ marginLeft: "0", marginTop: "10px" }}
                      placeholder="Nhập lại mật khẩu mới"
                      onChange={handleInputPassword}
                    />
                    {errors.inputComfirmPassword && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block", color: "red" }}
                      >
                        {errors.inputComfirmPassword}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </Modal>
    </>
  );
}
