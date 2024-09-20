import "bootstrap/dist/css/bootstrap.css";
import Header from "../../Layout/User/Header";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GetTopicByGrade } from "../../services/topicService";
import { AddTestDetailService } from "../../services/testDetailService";
import { Modal, Input, List } from "antd";
import { UserContext } from "../../contexts/UserContext";
import { ExclamationCircleFilled } from "@ant-design/icons";
import "../../assets/TakeExam.css";
import "../../assets/Style.css";

const { Search } = Input;
export default function TakeExam() {
  const { user } = useContext(UserContext);

  //#region take subjectId
  const location = useLocation();
  let subjectId = location.state.subjectId;
  let subjectName = location.state.subjectName;
  //#endregion

  //#region move to study screen
  const navigate = useNavigate();

  const handleClick = async (item) => {
    const result = await AddTestDetailService(user.accountId);
    const testDetailId = result.testdetail.testDetailId;
    if (result) {
      navigate("/exam", {
        state: {
          testDetailId: testDetailId,
          topicId: item.topicId,
          duration: item.duration,
          topicName: item.topicName,
        },
      });
    }
  };
  //#endregion

  //#region  get topic list by grade and subjecId
  const [topicStudy, setTopicStudy] = useState([]);
  const [filteredTopicStudy, setFilteredTopicStudy] = useState([]);
  const [topicType, setTopicType] = useState("");
  const [grade, setGrade] = useState("");
  const handleListTopic = async (grade, subjectId, topicType, accountId) => {
    try {
      setTopicType(topicType);
      setGrade(grade);
      
      const result =
        grade === undefined && topicType === undefined
          ? await GetTopicByGrade("", subjectId, "", accountId)
          : grade === undefined
          ? await GetTopicByGrade("", subjectId, topicType, accountId)
          : topicType === undefined
          ? await GetTopicByGrade(grade, subjectId, "", accountId)
          : await GetTopicByGrade(grade, subjectId, topicType, accountId);
          console.log(result);
      if (result.status === 200) {
        setTopicStudy(result.data);
        setFilteredTopicStudy(result.data)
      }
    } catch (error) {
      console.error("Error fetching mod service:", error);
    }
  };
  useEffect(() => {
    handleListTopic();
  }, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const onSearch = (value) => {
    setSearchTerm(value);
    console.log(value)
    if (!value || value.trim() === "") {
      setTopicStudy(topicStudy); 
      return; 
    }
    if (value.trim()) {
      const results = filteredTopicStudy.filter(
        (item) =>
          item.topicName && // Kiểm tra nếu topicName tồn tại
          item.topicName.toLowerCase().includes(value.toLowerCase())
      );
      console.log(results)
      setTopicStudy(results);
    } else {
      setTopicStudy([]); // Nếu tìm kiếm trống, không hiển thị gì
    }
  };
  //#endregion

  //#region show modal confirm

  const { confirm } = Modal;
  const showConfirm = (item) => {
    confirm({
      title: "Vui lòng kiểm tra thật kĩ trước khi bắt đầu làm bài",
      width: 600,
      icon: <ExclamationCircleFilled />,
      content: "Chúc bạn có được kết quả tốt",
      onOk() {
        handleClick(item);
      },
      okText: "Bắt đầu",
      cancelText: "Hủy",
    });
  };
  //#endregion
  return (
    <>
      <Header />
      <span>
        <div className="body">
          <div className="sc-fxNNfJ jUsJDi dashboard">
            <div className="sc-hKgILt gTLZXx container-fluid">
              <div className="sc-JooDp huvkpK">
                <div className="d-flex pb-5">
                  <div className="custom-subjects">
                    <span className="">Môn học: {subjectName}</span>
                  </div>
                  <h3 class="custom-title-exam">Đề kiểm tra</h3>
                </div>
              </div>
              <div className="d-flex justify-content-between pb-5">
                <div>
                  <div style={{ display: "flex", width: "300px" }}>
                    <select
                      class="form-select form-select-lg mb-3"
                      aria-label=".form-select-lg example"
                      onChange={(e) =>
                        handleListTopic(
                          grade,
                          subjectId,
                          e.target.value,
                          user.accountId
                        )
                      }
                    >
                      <option selected>Chọn bài kiểm tra</option>
                      <option value="2">Kiểm tra 15 phút</option>
                      <option value="3">Kiểm tra 1 tiết</option>
                      <option value="4">Kiểm tra học kì</option>
                      <option value="5">THPT Quốc Gia</option>
                    </select>
                  </div>
                </div>

                <div>
                  {topicType !== "5" && (
                    <div className="" style={{ display: "flex" }}>
                      <select
                        class="form-select form-select-lg mb-3"
                        aria-label=".form-select-lg example"
                        onChange={(e) =>
                          handleListTopic(
                            e.target.value,
                            subjectId,
                            topicType,
                            user.accountId
                          )
                        }
                      >
                        <option selected>Chọn khối</option>
                        <option value="1">Khối 10</option>
                        <option value="2">Khối 11</option>
                        <option value="3">Khối 12</option>
                      </select>
                    </div>
                  )}
                </div>

                <div style={{ width: 300 }}>
                  {/* Thanh tìm kiếm */}
                  <Search
                    className="custom-search"
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onSearch={onSearch}
                    onChange={(e) => onSearch(e.target.value)}
                    enterButton
                  />

                  {/* Danh sách gợi ý */}
                  {filteredData.length > 0 && searchTerm.trim() && (
                    <List
                      className="custom-list-search"
                      size="small"
                      bordered
                      dataSource={filteredData}
                      renderItem={(item) => (
                        <List.Item>
                          <div
                            style={{ width: "300px" }}
                            onClick={() => showConfirm(item)}
                          >
                            <strong>{item.topicName}</strong>
                          </div>
                        </List.Item>
                      )}
                      style={{ marginTop: 10 }}
                    />
                  )}
                </div>
              </div>

              <div
                className="exam-detail"
                style={{ width: "100%", height: "auto" }}
              >
                {topicStudy.map((item, index) => (
                  <div className="exam-item">
                    <div className="exam-item-fixed">
                      <div className="exam-item-title">{item.topicName}</div>
                      <div className="exam-item-subject">{subjectName}</div>
                      {item.score !== null ? (
                        <>
                          <div className="exam-item-status-did">Đã làm</div>
                          <div
                            className="exam-item-des-dtl"
                            style={{ display: "inline-block", marginLeft: 10 }}
                          >
                            Điểm cao nhất: {item.score}
                          </div>
                        </>
                      ) : (
                        <div className="exam-item-status-didnt">Chưa làm</div>
                      )}
                      <div className="exam-item-des">
                        <div className="exam-item-des-dtl">
                          Thời gian làm bài: {item.duration} phút
                        </div>
                        <div className="exam-item-des-dtl">
                          Số câu hỏi: {item.totalQuestion} câu
                        </div>
                      </div>
                    </div>
                    {item.score !== null ? (
                      <div className="exam-button-start">
                        <div className="exam-button-again">
                          <button
                            style={{ color: "white" }}
                            onClick={() => showConfirm(item)}
                          >
                            Bắt đầu lại
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="exam-button-start"
                        style={{ marginLeft: 30 }}
                      >
                        <div className="exam-button">
                          <button
                            style={{ color: "white" }}
                            onClick={() => showConfirm(item)}
                          >
                            Bắt đầu
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </span>
    </>
  );
}
