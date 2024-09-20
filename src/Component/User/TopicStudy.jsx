import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import "../../assets/PracticeQuizStyle.css";
import "../../assets/Style.css";
import Header from "../../Layout/User/Header";
import { GetCouseCharterByGrade } from "../../services/chapterService";

export default function TopicStudy() {
  const { user } = useContext(UserContext);

  //#region take subjectId
  const location = useLocation();
  const [subjectId, setSubjectId] = useState(null); // Khởi tạo state cho subjectId

  // Hàm xử lý cập nhật subjectId từ location.state
  useEffect(() => {
    if (location.state && location.state.subjectId) {
      setSubjectId(location.state.subjectId); // Cập nhật state từ location.state
    }
  }, [location.state]);
  // let subjectId = location.state.subjectId;
  let subjectName = location.state.subjectName;
  //#endregion

  //#region move to study screen
  const navigate = useNavigate();

  const handleClick = (chapterId) => {
    navigate("/study", {
      state: {
        chapterId: chapterId,
      },
    });
  };
  //#endregion
  //#region  get topic list by grade and subjecId
  const [topicStudy, setTopicStudy] = useState([]);
  const handleGetData = async (grade,subjectId) => {
    try {
      const result = await GetCouseCharterByGrade(
        grade,
        subjectId,
      );
      if (result && result.data) {
        setTopicStudy(result.data);
      }
    } catch (error) {
      console.log("Mời chọn khối");
      console.error("Error fetching mod service:", error);
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);
  //#endregion
console.log(topicStudy);
  return (
    <>
      <Header />
      <span>
        <div className="body">
          <div className="sc-fxNNfJ jUsJDi dashboard">
            <div className="sc-hKgILt gTLZXx container-fluid">
              <div className="d-flex pb-5 justify-content-between">
                <div className="sc-JooDp huvkpK w-50">
                  <div id="topic-header">
                    <h3 class="tde">
                      <span class="null">Luyện tập trắc nghiệm</span>
                    </h3>
                    <div class="sub-cat">
                      <span className="custom-subject-name">
                        Môn học: {subjectName}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="topic-study-grade" style={{ display: "flex" }}>
                  <select
                    class="form-select form-select-lg"
                    aria-label=".form-select-lg example"
                    onChange={(e) =>
                      handleGetData(e.target.value,subjectId)
                    }
                  >
                    <option selected>Chọn khối</option>

                    <option value="1">Khối 10</option>
                    <option value="2">Khối 11</option>
                    <option value="3">Khối 12</option>
                  </select>
                </div>
              </div>
              <div
                className="exam-detail"
                style={{ width: "100%", height: "auto" }}
              >
                {topicStudy.map((item, index) => (
                  <div
                  key={item.chapterId}
                    className="exam-item"
                    onClick={() => handleClick(item.chapterId)}
                  >
                    <div className="exam-item-fixed">
                      <div className="exam-item-title">{item.chapterTitle}</div>
                    </div>
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
