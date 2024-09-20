import "bootstrap/dist/css/bootstrap.css";
import Header from "../../Layout/User/Header";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GetQuestionByTopicId } from "../../services/questionService";
import { AddQuestionTest } from "../../services/questionTestService.jsx";
import { UpdateTestDetailService } from "../../services/testDetailService";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Modal } from "antd";
import "../../assets/Exam.css";
import "../../assets/Style.css";
import HeadTest from "../../Layout/User/HeadTest.jsx";

const dongho = "../Image/Exam/clock.png";

export default function Exam() {
  const location = useLocation();
  let topicId = location.state.topicId;
  let topicName = location.state.topicName;
  let testDetailId = location.state.testDetailId;
  let duration = location.state.duration;
  const [questions, setQuestions] = useState([]);
  const [questionDone, setQuestionDone] = useState([]);
  useEffect(() => {
    // Ẩn phần tử có id là 'my-element'
    const element = document.getElementsByClassName("divHeader")[0];
    console.log(element)
    if (element) {
      element.style.display = "none"; // Ẩn phần tử
    }

    // Cleanup: Đảm bảo phần tử được hiển thị lại nếu cần khi component unmount
    return () => {
      if (element) {
        element.style.display = "block"; // Hiển thị lại phần tử khi unmount
      }
    };
  }, []);
  // Function to retrieve data from the server and load localStorage answers
  const handleGetData = async () => {
    try {
      const result = await GetQuestionByTopicId(topicId);
      if (result.status === 200) {
        setQuestions(result.data);

        // Retrieve answers from localStorage
        const storedAnswers =
          JSON.parse(localStorage.getItem(`answers_${testDetailId}`)) || [];
        const questionState = result.data.map((item) => {
          const savedAnswer = storedAnswers.find(
            (answer) => answer.questionId === item.questionId
          );
          return {
            questionId: item.questionId,
            answerId: savedAnswer ? savedAnswer.answerId : "",
            isChoose: !!savedAnswer, // Mark true if the answer exists
          };
        });
        setQuestionDone(questionState);
      }
    } catch (error) {
      console.error("Error fetching question service:", error);
    }
  };

  // Load questions and previous answers on component mount
  useEffect(() => {
    handleGetData();
  }, []);

  // Handle choosing a question
  const handleQuestion = (e) => {
    const optionId = e.target.value;
    const questionId = e.target.name;

    const updatedAnswers = questionDone.map((item) => {
      if (questionId == item.questionId) {
        return {
          ...item,
          answerId: optionId,
          isChoose: true,
        };
      } else {
        return item;
      }
    });

    setQuestionDone(updatedAnswers);

    // Save updated answers to localStorage
    localStorage.setItem(
      `answers_${testDetailId}`,
      JSON.stringify(updatedAnswers)
    );
  };

  // Scroll to specific question on click
  function handleClickScroll(questionId) {
    const element = document.getElementById(questionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  const navigate = useNavigate();

  // Handle submission
  const handleSubmit = async () => {
    questionDone.map((item) =>
      item.answerId != null
        ? AddQuestionTest(item.questionId, testDetailId, item.answerId)
        : AddQuestionTest(item.questionId, testDetailId, "")
    );
    await UpdateTestDetailService(testDetailId);

    // Clear saved answers and timer from localStorage after submission
    localStorage.removeItem(`answers_${testDetailId}`);
    localStorage.removeItem(`minutes_${testDetailId}`);
    localStorage.removeItem(`seconds_${testDetailId}`);

    navigate("/examFinish", {
      state: {
        testDetailId: testDetailId,
      },
    });
  };

  const { confirm } = Modal;
  const showConfirm = () => {
    confirm({
      title: "Vui lòng kiểm tra thật kĩ trước khi nộp bài",
      width: 600,
      icon: <ExclamationCircleFilled />,
      onOk() {
        handleSubmit();
      },
      okText: "Nộp bài",
      cancelText: "Hủy",
    });
  };
  const [minutes, setMinutes] = useState(() => {
    const savedMinutes = localStorage.getItem(`minutes_${testDetailId}`);
    return savedMinutes !== null ? parseInt(savedMinutes) : duration - 1;
  });

  const [seconds, setSeconds] = useState(() => {
    const savedSeconds = localStorage.getItem(`seconds_${testDetailId}`);
    return savedSeconds !== null ? parseInt(savedSeconds) : 59;
  });
  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
      if (minutes === 0 && seconds === 0) {
        handleSubmit();
      }
  
      // Save the remaining time to localStorage
      localStorage.setItem(`minutes_${testDetailId}`, minutes);
      localStorage.setItem(`seconds_${testDetailId}`, seconds);
    }, 1000);
  
    return () => {
      clearInterval(myInterval);
    };
  }, [seconds, minutes]); // Add minutes and seconds as dependencies
  
  return (
    <>
      <HeadTest />
      <div className="exam-top">
        <div className="exam-timer">
          <img src={dongho} alt="clock"></img>
          <h4>
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </h4>
        </div>
      </div>
      <div className="exam">
        <div className="exam-right">
          <div className="exam-right-title">
            <h6>{topicName}</h6>
          </div>
          <div className="exam-right-question">
            <p>Câu hỏi</p>
            <div className="exam-right-question-num">
              {questionDone.map((item, index) => {
                const answeredQuestion =
                  JSON.parse(localStorage.getItem(`answers_${testDetailId}`)) ||
                  [];
                const isAnswered = answeredQuestion.find(
                  (q) => q.questionId === item.questionId && q.answerId !== ""
                );

                return (
                  <div
                    className="exam-right-question-item"
                    key={index}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleClickScroll(item.questionId)}
                  >
                    <p
                      style={{
                        backgroundColor: isAnswered ? "green" : "transparent",
                        color: isAnswered ? "white" : "black",
                      }}
                    >
                      {index + 1}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="exam-right-button">
            <button className="btn btn-primary" onClick={showConfirm}>
              Nộp bài
            </button>
          </div>
        </div>

        <div className="exam-left">
          {questions.map((item, index) => (
            <div
              className="exam-left-quesion"
              key={item.questionId}
              id={item.questionId}
            >
              <div className="exam-left-quesion-top">
                <p style={{ fontWeight: "bold", paddingLeft: 10 }}>
                  Câu {index + 1}:
                </p>
                <div className="exam-left-quesion-text">
                  <p
                    dangerouslySetInnerHTML={{ __html: item.questionContext }}
                  ></p>
                  {item.image && <img src={item.image} alt="question-img" />}
                </div>
              </div>
              <div className="exam-left-quesion-bottom">
                {["A", "B", "C", "D"].map((option, i) => (
                  <div
                    className="exam-left-quesion-answer"
                    key={i}
                    style={{ display: "flex" }}
                  >
                    <input
                      onClick={handleQuestion}
                      type="radio"
                      value={i + 1}
                      name={item.questionId}
                      checked={
                        questionDone.find(
                          (q) => q.questionId === item.questionId
                        )?.answerId === String(i + 1)
                      }
                    />
                    <label style={{ marginLeft: "8px" }}>
                      {`${option}. `}
                      <span
                        dangerouslySetInnerHTML={{
                          __html: item[`option${option}`],
                        }}
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
