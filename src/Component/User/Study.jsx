import 'bootstrap/dist/css/bootstrap.css';
import Header from '../../Layout/User/Header';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { GetQuestionByCourseChaptersInUser } from '../../services/chapterService';
import '../../assets/Study.css';
import '../../assets/Style.css';

const study1 = '../Image/Exam/icon-study.png';
const study2 = '../Image/Exam/learning.jpg';
const study3 = '../Image/Exam/anhdapan.jpg';

export default function Study() {
    //#region lấy chapterId
    const location = useLocation();
    let chapterId = location.state.chapterId;
    //#endregion

    //#region lấy câu hỏi
    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);
    const [disableChoose, setDisableChoose] = useState(false); // Không cho phép chọn lại nếu đã trả lời
    const [resetQuestion, setResetQuestion] = useState(true);
    const [solution, setSolution] = useState(false);
    const [answers, setAnswers] = useState({});

    const [countRight, setCountRight] = useState(0);
    const [countWrong, setCountWrong] = useState(0);
const [countQuestion, setCountQuestion] = useState(0)
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const result = await GetQuestionByCourseChaptersInUser(chapterId);
                if (result && result.data) {
                    const fetchedQuestions = result.data;
                    console.log('Fetched questions:', fetchedQuestions); // Xem xét dữ liệu có được lấy thành công không
                    setCountQuestion(result.count)
                    // Load saved answers from localStorage
                    const savedAnswers = JSON.parse(localStorage.getItem('quizAnswers')) || {};
                    setAnswers(savedAnswers);

                    // Load saved counts from localStorage
                    const savedRight = parseInt(localStorage.getItem('countRight'), 10) || 0;
                    const savedWrong = parseInt(localStorage.getItem('countWrong'), 10) || 0;
                    setCountRight(savedRight);
                    setCountWrong(savedWrong);

                    // Apply saved answers to the fetched questions
                    const updatedQuestions = fetchedQuestions.map(question => {
                        const savedAnswer = savedAnswers[question.questionId];
                        return {
                            ...question,
                            userAnswer: savedAnswer ? savedAnswer.answerId : null
                        };
                    });
                    setQuestions(updatedQuestions);
                } else {
                    console.error('No data found or result.data is undefined');
                }
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchQuestions();
    }, [chapterId]);

    useEffect(() => {
        if (questions.length > 0) {
            setDisableChoose(!!answers[questions[current]?.questionId]);
            setSolution(!!answers[questions[current]?.questionId]);
        }
    }, [questions, current, answers]);
// xoá localstorage
useEffect(() => {
    const handleBeforeUnload = () => {
      // Xoá localStorage khi người dùng điều hướng ra khỏi trang /exam
      if (location.pathname !== '/exam') {
        localStorage.removeItem('countRight');
        localStorage.removeItem('countWrong');
      }
    };

    // Lắng nghe sự kiện khi người dùng rời khỏi trang
    return () => {
      handleBeforeUnload();
    };
  }, [location.pathname]);
    const nextQuestion = () => {
        if (current < questions.length - 1) {
            setCurrent(current + 1);
            setResetQuestion(true);
            setDisableChoose(!!answers[questions[current + 1]?.questionId]);
            setSolution(!!answers[questions[current + 1]?.questionId]);
        }
    };

    const prevQuestion = () => {
        if (current > 0) {
            setCurrent(current - 1);
            setResetQuestion(true);
            setDisableChoose(!!answers[questions[current - 1]?.questionId]);
            setSolution(!!answers[questions[current - 1]?.questionId]);
        }
    };

    const chooseAnswer = (choose, answer, questionId) => {
        if (disableChoose) return; // Không cho phép chọn lại nếu đã trả lời

        const newAnswers = { ...answers, [questionId]: { answerId: choose, correct: choose === answer } };
        setAnswers(newAnswers);
        localStorage.setItem('quizAnswers', JSON.stringify(newAnswers));

        setDisableChoose(true);
        setResetQuestion(false);
        setSolution(true);

        setQuestions(questions.map(question => {
            if (question.questionId === questionId) {
                return {
                    ...question,
                    userAnswer: choose,
                };
            }
            return question;
        }));

        // Update countRight and countWrong and save to localStorage
        if (choose === answer) {
            const updatedRight = countRight + 1;
            setCountRight(updatedRight);
            localStorage.setItem('countRight', updatedRight);
        } else {
            const updatedWrong = countWrong + 1;
            setCountWrong(updatedWrong);
            localStorage.setItem('countWrong', updatedWrong);
        }
    };

    return (
        <>
            <Header />
            <div className='study'>
                <div className='study-left'>
                    {questions.length === 0 ? (
                        <p>No questions available</p>
                    ) : (
                        questions.map((item, index) =>
                            index === current && (
                                <React.Fragment key={item.questionId}>
                                    <div className='study-left-question'>
                                        <div style={{ display: 'flex' }}>
                                            <div className='study-left-question-img'>
                                                <img src={study1} alt='Question Icon' />
                                                <p style={{ fontWeight: 'bold' }}>Câu {index + 1}:</p>
                                            </div>
                                            <p dangerouslySetInnerHTML={{ __html: item.questionContext }}></p>
                                        </div>
                                        <img style={{ maxWidth: '700px', maxHeight: '350px', objectFit: 'cover' }} src={item.image} alt='Question' />
                                    </div>
                                    {['A', 'B', 'C', 'D'].map((option, i) => {
                                        const answerId = i + 1;
                                        const optionContent = item[`option${option}`];
                                        const userAnswer = item.userAnswer === answerId;
                                        const isCorrect = answerId === item.answer?.answerId;
                                        const isWrong = !isCorrect && userAnswer;

                                        return (
                                            <div
                                                key={answerId}
                                                className='study-left-answer'
                                                onClick={!disableChoose ? () => chooseAnswer(answerId, item.answer?.answerId, item.questionId) : null}
                                                style={{
                                                    border: resetQuestion && !disableChoose
                                                        ? '3px solid white'
                                                        : isCorrect
                                                            ? '3px solid #00CC33'
                                                            : isWrong
                                                                ? '3px solid red'
                                                                : '3px solid white',
                                                }}
                                            >
                                                <div
                                                    className='study-left-answer-left'
                                                    style={{
                                                        backgroundColor: resetQuestion && !disableChoose
                                                            ? ''
                                                            : isCorrect
                                                                ? '#00cc33'
                                                                : isWrong
                                                                    ? '#ff0000'
                                                                    : '',
                                                    }}
                                                >
                                                    <p>{option}</p>
                                                </div>
                                                <div className='study-left-answer-right'>
                                                    <p style={{ marginBottom: 0, marginTop: 7 }} dangerouslySetInnerHTML={{ __html: optionContent }}></p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {solution && (
                                        <div className='study-left-solution'>
                                            <h6 style={{ color: 'green', marginLeft: 30, marginTop: 15 }}>
                                                Đáp án: <span style={{ color: 'black', fontWeight: 400 }}>{item.answer?.answerName}</span>
                                            </h6>
                                            <h6 style={{ color: 'green', marginLeft: 30, marginTop: 15 }}>
                                                Mức độ: <span style={{ color: 'black', fontWeight: 400 }}>{item.level?.levelName}</span>
                                            </h6>
                                            <h6 style={{ color: 'green', marginLeft: 30, marginTop: 15 }}>Lời giải</h6>
                                            <div className='study-left-solution-detail' style={{ fontWeight: 400 }} dangerouslySetInnerHTML={{ __html: item.solution }}></div>
                                        </div>
                                    )}
                                    <div className='study-left-button'>
                                        <div className='study-left-button-back' onClick={prevQuestion}>Câu trước</div>
                                        <div className='study-left-button-next' onClick={nextQuestion}>Câu tiếp theo</div>
                                    </div>
                                </React.Fragment>
                            )
                        )
                    )}
                </div>
                <div className='study-right'>
                   
                 <div className='study-right-button'>
                        <div className='study-right-button-total'>
                            <p>Đã làm</p>
                            <div className='study-right-button-icon'>
                            <span>{countRight+countWrong}/{countQuestion}</span>
                            </div>
                        </div>
                        <div className='study-right-button-right'>
                            <p>Số câu đúng</p>
                            <div className='study-right-button-icon'>
                                <span>{countRight}</span>
                            </div>
                        </div>
                        <div className='study-right-button-wrong'>
                            <p>Số câu sai</p>
                            <div className='study-right-button-icon'>
                                <span>{countWrong}</span>
                            </div>
                        </div>
                     
                    </div>
                  
                </div>
            </div>
        </>
    );
}
