import "../../../assets/HomePageStyle.css";
import "bootstrap/dist/css/bootstrap.css";
import { useEffect, useState, useContext } from "react";

import { WeeklyActivityService } from "../../../services/HomeService";
import { UserContext } from "../../../contexts/UserContext";

export default function ActivityInWeek() {
  const { user, render, onSetRender } = useContext(UserContext);

  const [activity, SetActivity] = useState({
    totalTest: 0,
    avarageScore: 0,
  });
  const handleWeekLyActivity = async () => {
    try {
      if (user != null) {
        const result = await WeeklyActivityService(user.accountId);
        if (result.status === 200) {
          SetActivity({
            totalTest: result.countTest,
            avarageScore: result.totalScore,
          });
        } else {
          SetActivity({
            totalTest: 0,
            avarageScore: 0,
          });
        }
      } else {
        SetActivity({
          totalTest: 0,
          avarageScore: 0,
        });
      }
    } catch (e) {
      console.log("Can not get result");
    }
  };

  useEffect(() => {
    handleWeekLyActivity();
  }, [render]);

  return (
    <>
      {/* {user.accountId != null && */}
      <div className="sc-eJMQSu eMtKRF" style={{ marginBottom: "0" }}>
        <div className="sc-gsTCUz">
          <div className="sc-dlfnbm sc-eCssSg oDHHe">
            <div className="heading-style">
              <h3 class="sc-AzgDb jgHMvr tde mb-0" style={{ color: "#57412B" }}>
                <span>Các hoạt động trong tuần</span>
              </h3>
            </div>
            <div className="sc-nFpLZ jXWXLS activity">
              <div className="sc-gsTCUz gQRQLT gQRQLTSpace">
                <div className="sc-dlfnbm sc-eCssSg bpiLsA drBkXF bpiLsASpace">
                  <div
                    class="sc-laRPJI CxaAG"
                    style={{ background: "#d8d8d8" }}
                  >
                    <span
                      class="sc-jeGSBP heALfe icon"
                      style={{
                        color: "black",
                        fontWeight: "bold",
                        background: "none",
                        fontSize: "40px",
                      }}
                    >
                      {activity.totalTest}
                    </span>
                    <p style={{ color: "black", fontWeight: "bold" }}>
                      Bài kiểm tra
                    </p>
                  </div>
                </div>
                <div className="sc-dlfnbm sc-eCssSg bpiLsA drBkXF bpiLsASpace">
                  <div class="sc-laRPJI CxaAG" style={{ background: "white" }}>
                    <span
                      class="sc-jeGSBP heALfe icon"
                      style={{
                        color: "red",
                        fontWeight: "bold",
                        fontSize: "40px",
                      }}
                    >
                      {activity.avarageScore}
                    </span>
                    <p style={{ color: "red", fontWeight: "bold" }}>
                      Điểm trung bình
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className='sc-dlfnbm sc-eCssSg fvPGEb lbvlgl'>
                        <img src="../Image/LogoStudy2.png" alt="" style={{ maxWidth: '68%' }} />
                    </div> */}
        </div>
      </div>
    </>
  );
}
