import Header from "../../Layout/User/Header";
import Footer from "../../Layout/User/Footer";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { Pagination } from "antd";
import { useState, useEffect } from "react";
import { notification } from "antd";
import { Navigate, useNavigate } from "react-router-dom";

import { GetNewsDetailService } from "../../services/NewsService";

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  //#region - Function - lấy new detail
  const [dataSource, setDataSource] = useState("");
  const [dailyNew, setDailyNew] = useState([]);

  //#region - Function - hiển thị thông báo
  const [api, contextHolder] = notification.useNotification();
  const openNotificationGetData400 = (placement) => {
    api.error({
      message: `Thông báo`,
      description: "Lấy dữ liệu",
      placement,
    });
  };
  //#endregion

  const handleGetNewDetail = async () => {
    try {
      const response = await GetNewsDetailService(id);
      if (response.status === 200) {
        setDataSource(response.data);
        setDailyNew(response.dailyNews);
      } else {
        openNotificationGetData400();
      }
    } catch {
      openNotificationGetData400();
    }
  };

  useEffect(() => {
    handleGetNewDetail();
  }, []);
  //#endregion

  //#region - Function - Xem bài viết chi tiết
  const handleDivClick = async (id) => {
    console.log(123);
    try {
      const response = await GetNewsDetailService(id);
      if (response.status === 200) {
        setDataSource(response.data);
      } else {
        openNotificationGetData400();
      }
    } catch {
      openNotificationGetData400();
    }
  };
  //#endregion

  return (
    <>
      <Header />
      <div className="m-auto mb-5 news" style={{ width: "80%" }}>
        <h3 className="title-comm">
          <span className="title-holder">Tin tức</span>
        </h3>
        <div className="content">
          <div className="mainNews row mb-4 dl-flex justify-content-around">
            <div style={{ width: "65%" }}>
              <div
                className="w-100 position-relative mb-4"
                style={{ maxHeight: "500px" }}
              >
                <div>
                  <div className="row">
                    <div className="col-lg-6">
                      <p
                        style={{
                          fontSize: "20px",
                          color: "#0db8ea",
                          fontWeight: "bold",
                        }}
                      >
                        {dataSource.categoryName}
                      </p>
                    </div>
                    <div className="col-lg-5">
                      <p style={{ textAlign: "right" }}>
                        Ngày đăng: {dataSource.createDate}
                      </p>
                    </div>
                  </div>
                  <div className="header-news">
                    <p
                      style={{
                        fontSize: "32px",
                        lineHeight: "150%",
                        fontWeight: "bold",
                        marginBottom: "15px",
                      }}
                    >
                      {dataSource.title}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: "20px" }}>{dataSource.subtitle}</p>
                  </div>
                  <div
                    className="mb-5"
                    style={{ fontSize: "20px" }}
                    dangerouslySetInnerHTML={{ __html: dataSource.content }}
                  />
                </div>
              </div>
            </div>
            <div className="dl-flex" style={{ width: "30%" }}>
              <h3
                style={{
                  textAlign: "right",
                  color: "#565656",
                  fontWeight: "bold",
                }}
              >
                Bảng tin trong ngày
              </h3>
              <div className="row w-100">
                {dailyNew?.map((item) => (
                  <div
                    className="col-lg-6 w-100 mb-2"
                    onClick={() => handleDivClick(item.newsId)}
                  >
                    <div
                      className="w-100 position-relative"
                      style={{ maxHeight: "200px" }}
                    >
                      <img
                        src={item.image}
                        alt="Background Image"
                        className="w-100 h-100 object-fit-cover"
                        style={{ maxHeight: "200px" }}
                      />
                      <div
                        className="position-absolute w-100 h-100"
                        style={{
                          top: 0,
                          left: 0,
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                        }}
                      ></div>
                      <div
                        style={{ left: "20px", bottom: 0 }}
                        className="position-absolute"
                      >
                        <p className="m-1" style={{ color: "#dfdfdf" }}>
                          {item.categoryName}
                        </p>
                        <p
                          className="text-white m-1"
                          style={{ fontSize: "20px", fontWeight: "bold" }}
                        >
                          {item.title}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
