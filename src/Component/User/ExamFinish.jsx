import "bootstrap/dist/css/bootstrap.css";
import Header from "../../Layout/User/Header";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GetTestDetailByTestDetailId } from "../../services/testDetailService";
import "../../assets/ExamFinish.css";
import "../../assets/Style.css";
const icon1 = "../Image/Exam/icon-take-exam.png";

export default function ExamFinish() {
  //#region take test detail
  const location = useLocation();
  const { testDetailId } = location.state; // Destructure for better readability
  //#endregion

  const [testDetail, setTestDetail] = useState([]);

  const handleGetData = async () => {
    try {
      const result = await GetTestDetailByTestDetailId(testDetailId);
      if (result.status === 200) {
        setTestDetail(result.data);
      } else {
        console.error("Unexpected response status:", result.status);
      }
    } catch (error) {
      console.error("Error fetching test details:", error);
    }
  };

  useEffect(() => {
    handleGetData();
  }, [testDetailId]); // Ensure useEffect runs when testDetailId changes

  const navigate = useNavigate();
  const handleTestDetail = async (item) => {
    navigate("/examResult", {
      state: {
        testDetailId: testDetailId,
        topicName: item.topicName,
        score: item.score,
        answerRight: item.answerRight,
        totalQuestion: item.totalQuestion,
      },
    });
  };

  const handleHome = () => {
    navigate("/");
  };

  return (
    <>
      <Header />
      <div className="exam-finish">
        <div className="exam-finish-title">
          <img src={icon1} alt="Exam Icon" />
          <p>Kết quả kiểm tra</p>
        </div>
        <div className="exam-finish-line" style={{ width: 250 }}></div>
        {testDetail.map((item, index) => (
          <div key={index} className="exam-finish-result">
            <h5>{item.topicName}</h5>
            <hr />
            <p>
              Môn thi: <span>{item.subjectName}</span>
            </p>
            <p>
              Số câu hỏi: <span>{item.totalQuestion} câu</span>
            </p>
            <p>
              Thời gian: <span>{item.duration} phút</span>
            </p>
            <p>
              Số câu đúng:{" "}
              <span style={{ color: item.score < 5 ? "red" : "inherit" }}>
                {item.answerRight}/{item.totalQuestion}
              </span>
            </p>
            <p>
              Điểm:{" "}
              <span style={{ color: item.score < 5 ? "red" : "inherit" }}>
                {item.score}
              </span>
            </p>
            {item.score < 5 ? (
              <p style={{ fontStyle: "italic" }}>
                • Bạn cần cố gắng thêm để có kết quả tốt hơn
              </p>
            ) : item.score >= 5 && item.score < 7 ? (
              <p style={{ fontStyle: "italic" }}>
                • Điểm của bạn đang ở mức trung bình, cố gắng thêm chút nữa bạn
                nhé
              </p>
            ) : (
              <p style={{ fontStyle: "italic" }}>
                • Kết quả của bạn rất tốt, cố lên bạn nhé
              </p>
            )}
            <div className="exam-finish-result-button">
              <div
                className="exam-finish-result-button-other"
                onClick={handleHome}
              >
                Trang chủ
              </div>
              <div
                className="exam-finish-result-button-detail"
                onClick={() => handleTestDetail(item)}
              >
                Chi tiết
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
