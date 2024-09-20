import "bootstrap/dist/css/bootstrap.css";
import Header from "../../Layout/User/Header";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { GetQuestionTestByTestDetailId } from "../../services/testDetailService";
import "../../assets/ExamResult.css";
import "../../assets/Style.css";
export default function ExamResult() {
  //#region take question of test detail
  const location = useLocation();
  let testDetailId = location.state.testDetailId;
  let topicName = location.state.topicName;
  let score = location.state.score;
  let totalQuestion = location.state.totalQuestion;
  let answerRight = parseInt(((score + 0.1) * totalQuestion) / 10);
  //#endregion

  const [listQuestion, setListQuestion] = useState([]);
  const [showSolution, setShowSolution] = useState(null);
  const handleShowSolution = (questionId) => {
    setShowSolution((prevId) => (prevId === questionId ? null : questionId));
  };
  const handleGetData = async () => {
    try {
      const result = await GetQuestionTestByTestDetailId(testDetailId);
      if (result.status === 200) {
        setListQuestion(result.data);
      }
    } catch (error) {
      console.error("Error fetching mod service:", error);
    }
  };
  useEffect(() => {
    handleGetData();
  }, []);
  return (
    <>
      <Header />
      <div className="exam">
        <div className="exam-right">
          <div className="exam-right-title">
            <h6>{topicName}</h6>
          </div>
          <div className="exam-right-question">
            <p>Điểm: {score}</p>
            <p>
              Số câu đúng: {answerRight}/{totalQuestion}
            </p>
            <div className="exam-right-question-num">
              {listQuestion.map((item, index) => (
                <div className="exam-right-question-item" style={{}}>
                  <p
                    style={{
                      fontSize: 13,
                      backgroundColor:
                        item.answerUserChoose === null
                          ? "red"
                          : item.answerUserChoose === item.answerRightByQuestion
                          ? "green"
                          : "red",
                    }}
                  >
                    {index + 1}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="exam-left">
          <h4>Chi tiết bài thi</h4>
          {listQuestion.map((item, index) => (
            <div className="exam-left-quesion">
              <div className="exam-left-quesion-top">
                <p style={{ fontWeight: "bold", paddingLeft: 10, width: 60 }}>
                  Câu {index + 1}:
                </p>
                <div className="exam-left-quesion-text">
                  <p
                    style={{ paddingTop: 0, marginRight: 0 }}
                    dangerouslySetInnerHTML={{ __html: item.questionContext }}
                  ></p>
                  <img src={item.image} alt=""></img>
                </div>
              </div>
              <div className="exam-left-quesion-bottom">
                <div
                  className="exam-left-quesion-answer dl-flex"
                  style={{ display: "flex" }}
                >
                  {item.answerUserChoose === 1 ? (
                    <input
                      type="radio"
                      value="1"
                      name={item.questionId}
                      id="1"
                      checked="checked"
                      disabled
                    ></input>
                  ) : (
                    <input
                      type="radio"
                      value="1"
                      name={item.questionId}
                      id="1"
                      disabled
                    ></input>
                  )}
                  <label
                    for={item.optionA}
                    className="label-style"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: "8px",
                      color:
                        item.answerUserChoose == undefined
                          ? "#212529"
                          : item.answerRightByQuestion == 1
                          ? "green"
                          : item.answerUserChoose == 1 &&
                            item.answerRightByQuestion != 1
                          ? "red"
                          : "",
                      fontWeight:
                        item.answerUserChoose == undefined
                          ? ""
                          : item.answerUserChoose == 1 ||
                            item.answerRightByQuestion == 1
                          ? "bold"
                          : "",
                    }}
                  >
                    A.{" "}
                    <span
                      className="styleP"
                      style={{
                        marginTop: "1px",
                        marginRight: 0,
                        marginLeft: "5px",
                      }}
                      dangerouslySetInnerHTML={{ __html: item.optionA }}
                    ></span>
                  </label>
                </div>

                <div
                  className="exam-left-quesion-answer dl-flex"
                  style={{ display: "flex" }}
                >
                  {item.answerUserChoose === 2 ? (
                    <input
                      type="radio"
                      value="2"
                      name={item.questionId}
                      id="2"
                      checked="checked"
                      disabled
                    ></input>
                  ) : (
                    <input
                      type="radio"
                      value="2"
                      name={item.questionId}
                      id="2"
                      disabled
                    ></input>
                  )}
                  <label
                    for={item.optionB}
                    className="label-style"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: "8px",
                      color:
                        item.answerUserChoose == undefined
                          ? "#212529"
                          : item.answerRightByQuestion == 2
                          ? "green"
                          : item.answerUserChoose == 2 &&
                            item.answerRightByQuestion != 2
                          ? "red"
                          : "",
                      fontWeight:
                        item.answerUserChoose == undefined
                          ? ""
                          : item.answerUserChoose == 2 ||
                            item.answerRightByQuestion == 2
                          ? "bold"
                          : "",
                    }}
                  >
                    B.{" "}
                    <span
                      className="styleP"
                      style={{
                        marginTop: "1px",
                        marginRight: 0,
                        marginLeft: "5px",
                      }}
                      dangerouslySetInnerHTML={{ __html: item.optionB }}
                    ></span>
                  </label>
                </div>

                <div
                  className="exam-left-quesion-answer dl-flex"
                  style={{ display: "flex" }}
                >
                  {item.answerUserChoose === 3 ? (
                    <input
                      type="radio"
                      value="3"
                      name={item.questionId}
                      id="3"
                      checked="checked"
                      disabled
                    ></input>
                  ) : (
                    <input
                      type="radio"
                      value="3"
                      name={item.questionId}
                      id="3"
                      disabled
                    ></input>
                  )}
                  <label
                    for={item.optionC}
                    className="label-style"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: "8px",
                      color:
                        item.answerUserChoose == undefined
                          ? "#212529"
                          : item.answerRightByQuestion == 3
                          ? "green"
                          : item.answerUserChoose == 3 &&
                            item.answerRightByQuestion != 3
                          ? "red"
                          : "",
                      fontWeight:
                        item.answerUserChoose == undefined
                          ? ""
                          : item.answerUserChoose == 3 ||
                            item.answerRightByQuestion == 3
                          ? "bold"
                          : "",
                    }}
                  >
                    C.{" "}
                    <span
                      className="styleP"
                      style={{
                        marginTop: "1px",
                        marginRight: 0,
                        marginLeft: "5px",
                      }}
                      dangerouslySetInnerHTML={{ __html: item.optionC }}
                    ></span>
                  </label>
                </div>

                <div
                  className="exam-left-quesion-answer dl-flex"
                  style={{ display: "flex" }}
                >
                  {item.answerUserChoose === 4 ? (
                    <input
                      type="radio"
                      value="4"
                      name={item.questionId}
                      id="4"
                      checked="checked"
                      disabled
                    ></input>
                  ) : (
                    <input
                      type="radio"
                      value="4"
                      name={item.questionId}
                      id="4"
                      disabled
                    ></input>
                  )}
                  <label
                    for={item.optionD}
                    className="label-style"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: "8px",
                      color:
                        item.answerUserChoose == undefined
                          ? "#212529"
                          : item.answerRightByQuestion == 4
                          ? "green"
                          : item.answerUserChoose == 4 &&
                            item.answerRightByQuestion != 4
                          ? "red"
                          : "",
                      fontWeight:
                        item.answerUserChoose == undefined
                          ? ""
                          : item.answerUserChoose == 4 ||
                            item.answerRightByQuestion == 4
                          ? "bold"
                          : "",
                    }}
                  >
                    D.{" "}
                    <span
                      className="styleP"
                      style={{
                        marginTop: "1px",
                        marginRight: 0,
                        marginLeft: "5px",
                      }}
                      dangerouslySetInnerHTML={{ __html: item.optionD }}
                    ></span>
                  </label>
                </div>

                <div className="d-flex justify-content-end pe-3 pb-3">
                  <button
                    type="button"
                    class="btn btn-success"
                    onClick={() => handleShowSolution(item.questionId)}
                  >
                    Giải thích
                  </button>
                </div>
                {showSolution === item.questionId && (
                  <div className="py-2 px-3 custom-solution">
                    {(() => {
                      const tempDiv = document.createElement("div");
                      tempDiv.innerHTML = item.solution; 
                      return tempDiv.textContent || tempDiv.innerText || ""; 
                    })()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
