import "../../../assets/HomePageStyle.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState, useContext, useEffect } from "react";
import {
  GetTopicByTopicType,
  GetRankingOfTopic,
} from "../../../services/topicService";
import { GetUserDoTest } from "../../../services/testDetailService";
import { Option } from "antd/es/mentions";
import { Select } from "antd";
export default function LeadBoard({ isColumn }) {
  //#region - Declare - Khai báo các biến cần dùng
  const [topicList, setTopicList] = useState([]);

  //#endregion

  //#region - Function - Lấy danh sách tất cả cuộc thi
  const handleGetTopicByTopicType = async () => {
    try {
      const result = await GetTopicByTopicType(6);
      if (result.data != null) {
        setTopicList(result.data);
      }
    } catch (error) {
      console.error("Error fetching testdetail service:", error);
    }
  };

  useEffect(() => {
    handleGetTopicByTopicType();
  }, []);
  //#endregion

  //#region Danh sách user chăm chỉ
  const [userHard, setUserHard] = useState([]);
  const handleMostTopicDetail = async () => {
    try {
      const result = await GetUserDoTest();
      if (result.newData != null) {
        setUserHard(result.newData);
      }
    } catch (error) {
      console.error("Error fetching testdetail service:", error);
    }
  };

  useEffect(() => {
    handleMostTopicDetail();
  }, []);
  //#endregion

  //#region  get top 3 user thi tốt nhất
  const [ranking, setRanking] = useState([]);

  const handleOnChange = async (name, value) => {
    setSelectedOption({ ...selectdOption, [name]: value });

    try {
      const result = await GetRankingOfTopic(value, 6);
      if (result.status != null) {
        // Sắp xếp danh sách điểm từ cao xuống thấp
        const sortedData = result.data.sort((a, b) => b.score - a.score);
        setRanking(sortedData);
      }
    } catch (error) {
      console.error("Error fetching mod service:", error);
    }
  };

  const [selectdOption, setSelectedOption] = useState({ topicId: '', topicName: '' });


  //#endregion
  useEffect(() => {
    const fetchInitialRanking = async () => {
      if (topicList && topicList.length > 0) {
        const firstTopic = topicList[0];
        setSelectedOption({
          topicId: firstTopic.topicId,
          topicName: firstTopic.topicName,
        });

        try {
          const result = await GetRankingOfTopic(firstTopic.topicId, 6);
          if (result.status != null) {
            const sortedData = result.data.sort((a, b) => b.score - a.score);
            setRanking(sortedData);
          }
        } catch (error) {
          console.error("Error fetching initial ranking:", error);
        }
      }
    };

    fetchInitialRanking();
  }, [topicList]);

  return (
    <>
      <div className={`sc-ehSCib ${isColumn ? "" : "kYuMkW"} mb-5`}>
        <h2 className="sc-AzgDb eXzbuF">
          <svg width="23" height="26" viewBox="0 0 23 26" fill="none">
            <path
              d="M9.43525 15.3323V24.7675H0C0 22.2651 0.994068 19.8652 2.76352 18.0958C4.53297 16.3263 6.93286 15.3323 9.43525 15.3323ZM16.5117 24.1778L13.0454 26L13.7071 22.141L10.9036 19.4071L14.7791 18.8434L16.5117 15.3323L18.2454 18.8434L22.1198 19.4071L19.3163 22.141L19.9768 26L16.5117 24.1778ZM9.43525 14.1529C5.52552 14.1529 2.35881 10.9862 2.35881 7.07643C2.35881 3.1667 5.52552 0 9.43525 0C13.345 0 16.5117 3.1667 16.5117 7.07643C16.5117 10.9862 13.345 14.1529 9.43525 14.1529Z"
              fill="#FFC000"
            ></path>
          </svg>
          <span>Bảng xếp hạng</span>
        </h2>
        <div className="">
                    <div className="">
                      <Select
                        className="react-select__value-container css-1hwfws3"
                        style={{
                          width: "50%",
                          height:"40px",
                          border: "none",
                        }}
                        onChange={(e) => handleOnChange("topicId", e)}
                        value={selectdOption.topicId}
                      >
                        {topicList?.map((item) => (
                          <Option value={item.topicId}>{item.topicName}</Option>
                        ))}
                      </Select>
                    </div>
             </div>
        <div
          className={`sc-gsTCUz ${isColumn ? "" : "gQRQLT"}`}
          style={{
            justifyContent: "space-around",
            flexDirection: isColumn ? "column" : "row",
          }}
        >
          <div
            className={`sc-dlfnbm sc-eCssSg ${isColumn ? "" : "dcHHcO"}  oDHHe`}
          >
           
            <div className="sc-aemoO hgHGyw">
                <div className="container-ranking">
                  <div id="header">{/* <h1>Ranking</h1> */}</div>
                  <div id="leaderboard">
                    <div class="ribbon"></div>
                    <table>
                      <tr>
                        <td class="number pt-0 pb-0">1</td>
                        <td class="name p-0">{ranking[0]?.fullName}</td>
                        <td class="points p-0">
                          {ranking[0]?.score}
                          <img
                            class="gold-medal"
                            src="https://github.com/malunaridev/Challenges-iCodeThis/blob/master/4-leaderboard/assets/gold-medal.png?raw=true"
                            alt="gold medal"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td class="number">2</td>
                        <td class="name p-0">{ranking[1]?.fullName}</td>
                        <td class="points">{ranking[1]?.score}</td>
                      </tr>
                      <tr>
                        <td class="number">3</td>
                        <td class="name p-0">{ranking[2]?.fullName}</td>
                        <td class="points">{ranking[2]?.score}</td>
                      </tr>
                    </table>
                  </div>
                </div>
              
            </div>
          </div>

          {isColumn ? (
            <>
              <div className="header-style-2">
                <h3 class="tde">
                  <span>Số bài kiểm tra đã làm</span>
                </h3>
                <hr />
              </div>
              <div className="container-ranking">
                <div id="header">{/* <h1>Ranking</h1> */}</div>
                <div id="leaderboard">
                  <div class="ribbon"></div>
                  <table>
                    <tr>
                      <td class="number pt-0 pb-0">1</td>
                      <td class="name p-0">{userHard[0]?.fullName}</td>
                      <td class="points p-0">
                        {userHard[0]?.totalTest}{" "}
                        <img
                          class="gold-medal"
                          src="https://github.com/malunaridev/Challenges-iCodeThis/blob/master/4-leaderboard/assets/gold-medal.png?raw=true"
                          alt="gold medal"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td class="number">2</td>
                      <td class="name p-0">{userHard[1]?.fullName}</td>
                      <td class="points ps-0">{userHard[1]?.totalTest}</td>
                    </tr>
                    <tr>
                      <td class="number">3</td>
                      <td class="name p-0">{userHard[2]?.fullName}</td>
                      <td class="points ps-0">{userHard[2]?.totalTest}</td>
                    </tr>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="sc-dlfnbm sc-eCssSg dcHHcO oDHHe">
              <div className="sc-aemoO hgHGyw">
                <div className="sc-jONnTn jIvnOH">
                  <p
                    class="sc-eLgOdN ejJoEn d-sm-inline-block d-none"
                    style={{ color: "#000000" }}
                  >
                    Số bài kiểm tra đã làm
                  </p>
                  <div>
                    <div className="sc-kIeTtH cnxSGb">
                      <div className="d-sm-flex justify-content-between d-none">
                        <div className="sc-dacFzL dOuBXx">
                          <div className="sc-dtwoBo eYHLTI">
                            <img src="../Image/Avatar_Null.png" alt="" />
                            <div className="sc-jUEnpm cCSKON">
                              <span class="sc-jQbIHB edLmyf">3</span>
                            </div>
                          </div>
                          <p style={{ marginTop: "20px", marginBottom: 0 }}>
                            {userHard[2]?.fullName}
                          </p>
                          <i style={{ marginTop: 5 }}>
                            {userHard[2]?.totalTest} bài
                          </i>
                        </div>
                        <div className="sc-dacFzL HrxDC">
                          <div className="sc-dtwoBo bkcwRn">
                            <img src="../Image/Avatar_Null.png" alt="" />
                            <div className="sc-jUEnpm cCSKON">
                              <span class="sc-jQbIHB hnLJUX">1</span>
                              <svg
                                width="18"
                                height="23"
                                viewBox="0 0 18 23"
                                fill="none"
                              >
                                <path
                                  d="M17.0463 6.56434C16.5791 6.10626 16.319 5.49705 16.319 4.84534C16.319 3.08383 14.8547 1.64817 13.0581 1.64817C12.3982 1.64817 11.772 1.39315 11.3048 0.935065C10.0332 -0.311688 7.96682 -0.311688 6.69521 0.935065C6.22799 1.39315 5.60664 1.64817 4.94193 1.64817C3.1453 1.64817 1.68103 3.08383 1.68103 4.84534C1.68103 5.49233 1.42574 6.10626 0.953706 6.56434C0.337169 7.16883 0 7.97166 0 8.82645C0 9.68123 0.337169 10.4841 0.953706 11.0885C1.42093 11.5466 1.68103 12.1558 1.68103 12.8076C1.68103 13.564 1.94985 14.2588 2.39854 14.806C3.09088 15.6503 3.78643 16.7174 3.49883 17.7707L2.73379 20.5725C2.50505 21.4103 3.39395 22.1124 4.15625 21.6965C4.61754 21.4448 5.19535 21.5997 5.46861 22.0486C5.9177 22.7862 7.03123 22.6292 7.25885 21.7961L8.2482 18.1753C8.33732 17.8491 8.65948 17.6529 8.99759 17.6529C9.33578 17.6529 9.65806 17.849 9.74749 18.1752L10.7394 21.7927C10.9679 22.6259 12.0817 22.7824 12.531 22.0445C12.8045 21.5953 13.3826 21.4401 13.8442 21.692C14.6065 22.1079 15.495 21.4055 15.2662 20.5678L14.5012 17.766C14.2136 16.7127 14.9091 15.6456 15.6015 14.8013C16.0501 14.2541 16.319 13.5593 16.319 12.8028C16.319 12.1558 16.5791 11.5419 17.0463 11.0838C18.3179 9.84179 18.3179 7.8111 17.0463 6.56434ZM6.78721 20.5773C6.63587 21.1322 5.89437 21.2372 5.5949 20.7461C5.41271 20.4474 5.02795 20.3444 4.72083 20.5121C4.21313 20.7894 3.62104 20.3216 3.77356 19.7636L4.76284 16.1442C4.78565 16.0607 4.86506 16.0047 4.95157 16.0047C5.61145 16.0047 6.23762 16.2597 6.70484 16.7178C6.78191 16.7934 6.85898 16.8595 6.94086 16.9256C6.96495 16.9445 6.98903 16.9634 7.01311 16.9823C7.07091 17.0248 7.12871 17.0673 7.19133 17.1098C7.22505 17.1334 7.26358 17.1523 7.2973 17.1759C7.35028 17.2043 7.39845 17.2373 7.45143 17.2656C7.49478 17.2893 7.54295 17.3129 7.5863 17.3318C7.62851 17.3525 7.65365 17.4004 7.64128 17.4458L6.78721 20.5773ZM14.2409 19.7636C14.3934 20.3216 13.8013 20.7894 13.2936 20.5121C12.9865 20.3444 12.6017 20.4474 12.4195 20.7461C12.1201 21.2372 11.3786 21.1322 11.2272 20.5773L10.3748 17.4519C10.3611 17.4014 10.3832 17.3433 10.433 17.327C10.4811 17.3034 10.5245 17.2845 10.5727 17.2562C10.6256 17.2279 10.6738 17.1995 10.722 17.1712C10.7605 17.1476 10.7942 17.1287 10.8328 17.1051C10.8906 17.0673 10.9435 17.0248 11.0013 16.9823C11.0302 16.9634 11.0591 16.9445 11.0832 16.9209C11.1651 16.8548 11.2422 16.7887 11.3192 16.7131C11.7865 16.255 12.4078 16 13.0725 16C13.1544 16.01 13.2273 16.0552 13.2491 16.1348L14.2409 19.7636Z"
                                  fill="url(#paint0_linear)"
                                ></path>
                                <defs>
                                  <linearGradient
                                    id="paint0_linear"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="24"
                                    gradientUnits="userSpaceOnUse"
                                  >
                                    <stop stop-color="#F7971E"></stop>
                                    <stop
                                      offset="1"
                                      stop-color="#FFD200"
                                    ></stop>
                                  </linearGradient>
                                </defs>
                              </svg>
                            </div>
                          </div>
                          <p style={{ marginTop: "20px", marginBottom: 0 }}>
                            {userHard[0]?.fullName}
                          </p>
                          <i style={{ marginTop: 5 }}>
                            {userHard[0]?.totalTest} bài
                          </i>
                        </div>
                        <div className="sc-dacFzL kAYTCb">
                          <div className="sc-dtwoBo iLzkhh">
                            <img src="../Image/Avatar_Null.png" alt="" />
                            <div className="sc-jUEnpm cCSKON">
                              <span class="sc-jQbIHB beXZvd">2</span>
                            </div>
                          </div>
                          <p style={{ marginTop: "20px", marginBottom: 0 }}>
                            {userHard[1]?.fullName}
                          </p>
                          <i style={{ marginTop: 5 }}>
                            {userHard[1]?.totalTest} bài
                          </i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
