import "./App.css";
import { Fragment } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "./contexts/UserContext";

//#Region Auth Routes
import Login from "./Component/Auth/Login";
import ConfirmEmail from "./Component/Auth/ConfirmEmail";

//#Region User Routes
import HomePage from "./Component/User/HomePage";
import PracticeQuizzes from "./Component/User/PracticeQuizzes";
import TestSubject from "./Component/User/TestSubject";
import Profile from "./Component/User/Profile";
import TestHistory from "./Component/User/TestHistory";
import News from "./Component/User/News";
import Forum from "./Component/User/Forum";
import TakeExam from "./Component/User/TakeExam";
import Exam from "./Component/User/Exam";
import ExamResult from "./Component/User/ExamResult";
import Study from "./Component/User/Study";
import ExamFinish from "./Component/User/ExamFinish";
import TopicStudy from "./Component/User/TopicStudy";
import Contest from "./Component/User/Contest";
import Ranking from "./Component/User/Ranking";
import NewsDetail from "./Component/User/NewsDetail";

//#Region Admin Routes
import ManageUser from "./Component/Admin/ManageUser";
import ManageMod from "./Component/Admin/ManageMod";
import ManageQuestion from "./Component/Admin/ManageQuestion";
import ManageTopic from "./Component/Admin/ManageTopic";
import ManageNews from "./Component/Admin/ManageNews";
import ManageCourseChapter from "./Component/Admin/ManageCourseChapter"
import ManageQuestionChapter from "./Component/Admin/ManageQuestionChapter";
import Man from "./Component/Admin/ManageCourseChapter";
import Statistics from "./Component/Admin/Statistics";
import Testfirebase from "./Testfirebase";
import PostProvider from "./contexts/PostContext";
import SubjectProvider from "./contexts/SubjectContext";
//#region Mod Routers
import ManageNewsByMod from "./Component/Mod/ManageNewsByMod";
import ManageForum from "./Component/Admin/ManageForum";
import ManageTopicByMod from "./Component/Mod/ManageTopicByMod";
import ManageCourseChapterByMod from "./Component/Mod/ManageCourseChapterByMod";
import ManageQuestionChapterByMod from "./Component/Mod/ManageQuestionChapterByMod";
import ManageQuestionByMod from "./Component/Mod/ManageQuestionByMod";
import CommentProvider from "./contexts/CommentContext";

//add notifications
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//#region SuperAdmin Routers
import ManageAdmin from "./Component/SuperAdmin/ManageAdmin";

function App() {
  const { token, user } = useContext(UserContext);

  return (
    <Fragment>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          {!token ? (
            <>
              <Route path="/login" element={<Login />}></Route>
              <Route
                path="/forum"
                element={
                  <PostProvider>
                    <SubjectProvider>
                      <CommentProvider>
                        <Forum />
                      </CommentProvider>
                    </SubjectProvider>
                  </PostProvider>
                }
              ></Route>
              <Route path="/news" element={<News />}></Route>
              <Route path="confirm/:email" element={<ConfirmEmail />} />
              <Route
                path="/practiceQuizz"
                element={<PracticeQuizzes />}
              ></Route>
              <Route path="/testSubject" element={<TestSubject />}></Route>
              <Route path="/test" element={<Testfirebase />}></Route>
              <Route path="/news/newDetail/:id" element={<NewsDetail />} />

              <Route path="/*" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              {user.roleId == "4" ? (
                <>
                  <Route path="/news" element={<News />}></Route>
                  <Route path="/testSubject" element={<TestSubject />}></Route>
                  <Route path="/test" element={<Testfirebase />}></Route>
                  <Route
                    path="/practiceQuizz"
                    element={<PracticeQuizzes />}
                  ></Route>
                  <Route path="/profile" element={<Profile />}></Route>
                  <Route path="/testHistory" element={<TestHistory />}></Route>
                  <Route path="/takeExam" element={<TakeExam />}></Route>
                  <Route path="/exam" element={<Exam />}></Route>
                  <Route
                    path="/forum"
                    element={
                      <PostProvider>
                        <SubjectProvider>
                          <CommentProvider>
                            <Forum />
                          </CommentProvider>
                        </SubjectProvider>
                      </PostProvider>
                    }
                  ></Route>
                  <Route path="/examResult" element={<ExamResult />}></Route>
                  <Route path="/study" element={<Study />}></Route>
                  <Route path="/examFinish" element={<ExamFinish />}></Route>
                  <Route path="/topicStudy" element={<TopicStudy />}></Route>
                  <Route path="/contest" element={<Contest />}></Route>
                  <Route path="/ranking" element={<Ranking />}></Route>
                  <Route path="/news/newDetail/:id" element={<NewsDetail />} />

                  {/* <Route path="/*" element={<Navigate to="/" />} /> */}
                </>
              ) : (
                <>
                  {user.roleId == "2" ? (
                    <>
                      <Route path="/admin/statictis" element={<Statistics />} />
                      <Route
                        path="/admin/manageUser"
                        element={<ManageUser />}
                      />
                      <Route path="/admin/manageMod" element={<ManageMod />} />
                      <Route
                        path="/admin/manageTopic"
                        element={<ManageTopic />}
                      />
                        <Route
                        path="/admin/manageCourseChapter"
                        element={<ManageCourseChapter />}
                      />
                        <Route
                        path="admin/manageQuestionChapter/:id"
                        element={<ManageQuestionChapter />}
                      />
                      <Route path="/admin/manageNew" element={<ManageNews />} />
                      <Route
                        path="/admin/manageQuestion/:id"
                        element={<ManageQuestion />}
                      />
                      <Route
                        path="/admin/manageForum"
                        element={
                          <PostProvider>
                            <SubjectProvider>
                              <CommentProvider>
                                <ManageForum />
                              </CommentProvider>
                            </SubjectProvider>
                          </PostProvider>
                        }
                      />

                      <Route
                        path="/*"
                        element={<Navigate to="/admin/statictis" />}
                      />
                    </>
                  ) : user.roleId == "3" ? (
                    <>
                      <Route
                        path="/mod/manageNews"
                        element={<ManageNewsByMod />}
                      />
                      <Route
                        path="/mod/managecoursechapter"
                        element={<ManageCourseChapterByMod />}
                      />
                      <Route
                        path="/mod/manageTopic"
                        element={<ManageTopicByMod />}
                      />
                      <Route
                        path="mod/manageQuestion/:id"
                        element={<ManageQuestionByMod />}
                      />
                      <Route
                        path="mod/manageQuestionChapter/:id"
                        element={<ManageQuestionChapterByMod />}
                      />

                      <Route
                        path="/*"
                        element={<Navigate to="/mod/manageTopic" />}
                      />
                    </>
                  ) : (
                    <>
                      <Route
                        path="/superAdmin/manageAdmin"
                        element={<ManageAdmin />}
                      />

                      {/* <Route
                      path="/*"
                      element={<Navigate to="/superAdmin/manageAdmin" />}
                    /> */}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
