import "../../../assets/HomePageStyle.css";
import "bootstrap/dist/css/bootstrap.css";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GetSubjectByTopicType } from "../../../services/subjectService";
import { GetTestDetailService } from './../../../services/HistoryService';
import { UserContext } from "../../../contexts/UserContext";
export default function ChooseSubject() {

  const navigate = useNavigate();
  const handleSubject = async (item,testDetails) => {
    const topicsAndScores = testDetails.map(test => ({
      topic: test.topic,
      // score: test.score
    }));
    navigate("/contest", {
      state: {
        topicType: item.topicType,
        subjectId: item.subjectId,
        subjectName: item.subjectName,
        topicsAndScores: topicsAndScores,
      },
    });
  };

  const [subjects, setSubjects] = useState([]);
  const { user, render, onSetRender } = useContext(UserContext);
  const [testDetails, setTestDetails] = useState([]);
  const handleGetData = async () => {
    try {
      const result = await GetSubjectByTopicType(6);
      if (result.status === 200) {
        setSubjects(result.data);
      }
    } catch (error) {
      console.error("Error fetching mod service:", error);
    }
  };
  const handleViewTestDetails = async () => {
    try {
      const result = await GetTestDetailService(user.accountId);
      if (result.status === 200) {
        setTestDetails(result.data);
        onSetRender();
      }
    } catch (error) {
      console.error("Error fetching testdetail service:", error);
    }
  };
  useEffect(() => {
    handleGetData();
    handleViewTestDetails()
  }, []);

  return (
    <>
      <div className="sc-eJMQSu eMtKRF">
        <div className="sc-gsTCUz">
          <div className="sc-dlfnbm sc-eCssSg oDHHe">
            <div className="heading-style">
              <h3 class="sc-AzgDb jgHMvr tde mb-0" style={{ color: "#57412B" }}>
                <span>Cuộc thi đang diễn ra</span>
              </h3>
            </div>
            <div className="sc-nFpLZ jXWXLS">
              <div className="sc-gsTCUz gQRQLT">
                {subjects.map((item, index) => (
                  <div
                    className="sc-dlfnbm sc-eCssSg bpiLsA drBkXF"
                    onClick={() => handleSubject(item, testDetails)}
                  >
                    <div class="sc-laRPJI CxaAG">
                      <span class="sc-jeGSBP heALfe icon">
                        <img src={item.imgLink} alt="" />
                      </span>
                      <p>{item.subjectName}</p>
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
