import Header from "../../Layout/User/Header";
import Footer from "../../Layout/User/Footer";
import "bootstrap/dist/css/bootstrap.css";
import { Pagination } from "antd";
import { useState, useEffect } from "react";
import { notification } from "antd";
import { Navigate, useNavigate } from "react-router-dom";
import { GetNewsInPageService } from "../../services/NewsService";

import { GetNewsInUserPageService } from "../../services/NewsService";

export default function News() {
  const navigate = useNavigate();

  //#region - Declare - khai báo biến
  const [dataSource, setDataSource] = useState({
    firstNew: "",
    dailyNew: [],
    // listNew: [],
  });
  const [newsInPage, setNewInPage] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalPosts, setTotalPosts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  //#endregion

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

  //#region - Function - hiển thị tin tức
  const handleGetAllNews = async () => {
    try {
      setTimeout(async () => {
        const result = await GetNewsInUserPageService();
        const result2 = await GetNewsInPageService(currentPage, pageSize);

        if (result.status === 200) {
          setDataSource({
            firstNew: result.firstNew,
            dailyNew: result.dailyNew,
          });
        } else {
          openNotificationGetData400("topRight");
        }

        if (result2.status === 200) {
          setNewInPage(result2.data);
          setTotalPosts(result2.totalCount);
        } else {
          openNotificationGetData400("topRight");
        }

        setIsLoading(false);
      }, 1000);
    } catch (error) {
      openNotificationGetData400("topRight");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetAllNews();
  }, []);
  //#endregion

  //#region - Function - chuyển đến bài viết chi tiết
  const handleDivClick = (id) => {
    navigate(`/news/newDetail/${id}`);
  };
  //#endregion

  //#region - Function - chuyển trang
  const handlePaginationChange = async (page) => {
    const result2 = await GetNewsInPageService(page, pageSize);
    if (result2.status === 200) {
      setNewInPage(result2.data);
      setTotalPosts(result2.totalCount);
    } else {
      openNotificationGetData400("topRight");
    }
    setCurrentPage(page);
  };
  //#endregion

  const limitTextToWords = (text, wordLimit) => {
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  };
  return (
    <>
      {contextHolder}
      <Header />
      {isLoading ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "5px",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
              textAlign: "center",
            }}
          >
            Loading...
          </div>
        </div>
      ) : (
        <div>
          <div className="m-auto news" style={{ width: "80%" }}>
            <h3 className="title-comm">
              <span className="title-holder">Tin tức</span>
            </h3>
            <div className="content">
            <div className="headerContent row dl-flex justify-content-between mb-3">
                <div className="col-lg-5 ">
                  <h3
                    style={{
                      textAlign: "left",
                      color: "#565656",
                      fontWeight: "bold",
                    }}
                  >
                    Bảng tin mới nhất
                  </h3>
                </div>
                <div className="col-lg-5">
                  <h3
                    style={{
                      textAlign: "right",
                      color: "#565656",
                      fontWeight: "bold",
                    }}
                  >
                    Bảng tin trong ngày
                  </h3>
                </div>
              </div>
              <div
                className="d-flex justify-content-around pb-5"
                style={{ gap: "8px" }}
              >
                <div
                  className="position-relative col-lg-custom"
                  style={{ maxHeight: "500px" }}
                  onClick={() => handleDivClick(dataSource.firstNew.newsId)}
                >
                  <img
                    src={dataSource.firstNew.image}
                    alt="Background Image"
                    className="w-100 h-100 object-fit-cover"
                    style={{ maxHeight: "500px" }}
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
                    <p className="m-1 category-name-style">
                      {dataSource.firstNew.categoryName}
                    </p>
                    <p
                      className="text-white m-1"
                      style={{ fontSize: "30px", fontWeight: "bold" }}
                    >
                      {dataSource.firstNew.title}
                    </p>
                    <p className="m-1" style={{ color: "#dfdfdf" }}>
                      {dataSource.firstNew.createdDay}
                    </p>
                  </div>
                </div>
                <div className="col-lg-custom" style={{ maxHeight: "500px" }}>
                  <div className="news-right-column">
                    {dataSource.dailyNew?.map((item) => (
                      <div
                        className="card"
                        onClick={() => handleDivClick(item.newsId)}
                      >
                        <div className="position-relative h-100">
                          <img
                            src={item.image}
                            alt="Background Image"
                            className="w-100 h-100 object-fit-cover"
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
                            <p className="m-1 category-name-style">
                              {item.categoryName}
                            </p>
                            <p
                              className="text-white m-1 limited-text"
                              style={{ fontSize: "20px", fontWeight: "bold" }}
                            >
                              {limitTextToWords(item.title,15)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-100 pb-5">
                <div
                  style={{ borderBottom: "1px solid #e5e5e5" }}
                  className="mb-2"
                >
                  <p
                    className=""
                    style={{
                      fontSize: "30px",
                      fontWeight: "bold",
                      color: "#565656",
                    }}
                  >
                    Các bài viết khác
                  </p>
                </div>
                <div className="card-grid">
                  {newsInPage?.map((item) => item.status === "1" && (<div
                      key={item.newId}
                      className="card-article"
                      onClick={() => handleDivClick(item.newId)}
                    >
                      <img src={item.image} alt="" className="card-image" />
                      {/* <p className="m-1">{item.categoryName}</p> */}
                      <p className="text-black m-1 card-title">{item.title}</p>
                      <p className="text-black">{item.subtitle}</p>
                    </div>))}
                </div>
                <div className="w-100">
                  <Pagination
                    defaultCurrent={1}
                    current={currentPage}
                    total={totalPosts}
                    pageSize={pageSize}
                    onChange={handlePaginationChange}
                    className="justify-content-end"
                  />
                </div>
              </div>
              {/* <div className="w-100 pb-5">
                <div
                  style={{ borderBottom: "1px solid #e5e5e5" }}
                  className="mb-2"
                >
                  <p
                    className=""
                    style={{
                      fontSize: "30px",
                      fontWeight: "bold",
                      color: "#565656",
                    }}
                  >
                    Các bài viết khác
                  </p>
                </div>
                {newsInPage?.map((item) => (
                  <div
                    key={item.newId}
                    className="row mb-2 pb-2 pt-2"
                    style={{ borderBottom: "1px solid #e5e5e5" }}
                    onClick={() => handleDivClick(item.newId)}
                  >
                    <div className="col-lg-3">
                      <img
                        src={item.image}
                        alt=""
                        className="w-100"
                        style={{ overflow: "hidden" }}
                      />
                    </div>
                    <div className="col-lg-8">
                      <p className="m-1">{item.categoryName}</p>
                      <p
                        className="text-black m-1"
                        style={{ fontSize: "20px", fontWeight: "bold" }}
                      >
                        {item.title}
                      </p>
                      <p
                        className="text-black"
                        style={{
                          width: "500px",
                          maxWidth: "500px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.subTitle}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="w-100">
                  <Pagination
                    defaultCurrent={1}
                    current={currentPage}
                    total={totalPosts}
                    pageSize={pageSize}
                    onChange={handlePaginationChange}
                    className="w-50"
                  />
                </div>
              </div> */}

              {/* <div className="mainNews row mb-4 dl-flex justify-content-around">
                <div style={{ width: "65%" }}>
                  <div
                    className="w-100 position-relative mb-4"
                    style={{ maxHeight: "500px" }}
                    onClick={() => handleDivClick(dataSource.firstNew.newsId)}
                  >
                    <img
                      src={dataSource.firstNew.image}
                      alt="Background Image"
                      className="w-100 h-100 object-fit-cover"
                      style={{ maxHeight: "500px" }}
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
                        {dataSource.firstNew.categoryName}
                      </p>
                      <p
                        className="text-white m-1"
                        style={{ fontSize: "30px", fontWeight: "bold" }}
                      >
                        {dataSource.firstNew.title}
                      </p>
                      <p className="m-1" style={{ color: "#dfdfdf" }}>
                        {dataSource.firstNew.createdDay}
                      </p>
                    </div>
                  </div>
                  <div className="w-100">
                    <div
                      style={{ borderBottom: "1px solid #e5e5e5" }}
                      className="mb-2"
                    >
                      <p
                        className=""
                        style={{
                          fontSize: "30px",
                          fontWeight: "bold",
                          color: "#565656",
                        }}
                      >
                        Các bài viết khác
                      </p>
                    </div>
                    {newsInPage?.map((item) => (
                      <div
                        className="row mb-2 pb-2 pt-2"
                        style={{ borderBottom: "1px solid #e5e5e5" }}
                        onClick={() => handleDivClick(item.newId)}
                      >
                        <div className="col-lg-3">
                          <img
                            src={item.image}
                            alt=""
                            className="w-100"
                            style={{ overflow: "hidden" }}
                          />
                        </div>
                        <div className="col-lg-8">
                          <p className="m-1">{item.categoryName}</p>
                          <p
                            className="text-black m-1"
                            style={{ fontSize: "20px", fontWeight: "bold" }}
                          >
                            {item.title}
                          </p>
                          <p
                            className="text-black"
                            style={{
                              width: "500px",
                              maxWidth: "500px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.subTitle}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="w-100">
                      <Pagination
                        defaultCurrent={1}
                        current={currentPage}
                        total={totalPosts}
                        pageSize={pageSize}
                        onChange={handlePaginationChange}
                        className="w-50"
                      />
                    </div>
                  </div>
                </div>
                <div className="dl-flex" style={{ width: "30%" }}>
                  <div className="row w-100">
                    {dataSource.dailyNew?.map((item) => (
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
              </div> */}
            </div>
          </div>{" "}
        </div>
      )}

      <Footer />
    </>
  );
}
