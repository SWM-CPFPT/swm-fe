import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GetAllSubjectService } from "../../services/subjectService";
import "../../assets/PracticeQuizStyle.css";
import "../../assets/Style.css";
import Header from "../../Layout/User/Header";
import MathIcon from "../../assets/images/icons-math.png";
import PhysicsIcon from "../../assets/images/icons-physics.png";
import HistoryIcon from "../../assets/images/icons-history.png";
import EnglishIcon from "../../assets/images/icons-english.png";
import GeographyIcon from "../../assets/images/icons-geography.png";
import ChemistryIcon from "../../assets/images/icons-chemistry.png";
import LiteratureIcon from "../../assets/images/icons-literature.png";
import SociobiologyIcon from "../../assets/images/icons-sociobiology.png";
import EducationIcon from "../../assets/images/icons-education.png";
import StudyImage from "../../assets/images/study-rewards.jpg";
export default function PracticeQuizzes() {
  const [subjectAll, setSubjectAll] = useState([]);

  const colors = [
    { background: "#F7BDCB", color: "#5654A2" },
    { background: "#DE7565", color: "#4781C3" },
    { background: "#426666", color: "#C3272B" },
    { background: "#A0BF52", color: "#1D241B" },
    { background: "#146654", color: "#F05510" },
    { background: "#F8C6B5", color: "#564232" },
    { background: "#D3D4D3", color: "#615F74" },
    { background: "#6F9BC6", color: "#F3993A" },
    { background: "#327A58", color: "rgb(255, 163, 75)" },
  ];
  const iconMath = { icon: MathIcon };
  const iconSubjects = [
    { icon: LiteratureIcon },
    { icon: EnglishIcon },
    { icon: PhysicsIcon },
    { icon: ChemistryIcon },
    { icon: SociobiologyIcon },
    { icon: HistoryIcon },
    { icon: GeographyIcon },
    { icon: EducationIcon },
  ];
  const positions = [
    { top: "20%", left: "85%", transform: "translate(-50%, -75%)" }, // Position 2
    { top: "50%", left: "100%", transform: "translate(-50%, -55%)" }, // Position 3
    { top: "80%", left: "85%", transform: "translate(-50%, -30%)" }, // Position 4
    { bottom: "0", left: "50%", transform: "translate(-50%, 45%)" }, // Position 5
    { top: "80%", left: "15%", transform: "translate(-50%, -30%)" }, // Position 6
    { top: "50%", left: "0", transform: "translate(-50%, -50%)" }, // Position 7
    { top: "20%", left: "15%", transform: "translate(-50%, -75%)" }, // Position 8
    { top: "0", left: "50%", transform: "translate(-50%, -50%)" }, // Position 9
  ];

  const handleGetData = async () => {
    try {
      const result = await GetAllSubjectService();
      if (result.status === 200) {
        setSubjectAll(result.data);
      }
    } catch (error) {
      console.error("Error fetching mod service:", error);
    }
  };
  useEffect(() => {
    handleGetData();
  }, []);

  // Lấy đối tượng môn Math
  const mainSubject = subjectAll.find((subject) => subject.subjectId === 1);

  // Lọc bỏ môn Math ra khỏi các môn xung quanh
  const surroundingSubjects = subjectAll.filter(
    (subject) => subject.subjectName !== "Toán"
  );
  const navigate = useNavigate();

  const handleClick = (subjectId, subjectName) => {
    navigate("/topicStudy", {
      state: {
        subjectId: subjectId,
        subjectName: subjectName,
      },
    });
  };

  return (
    <>
      <Header />
      <span>
        <div className="body">
          <div className="sc-fxNNfJ jUsJDi dashboard">
            <div className="sc-hKgILt gTLZXx container-fluid">
              <div className="sc-JooDp huvkpK">
                <h3 class="title-comm">
                  <span class="title-holder">
                    Luyện thi trắc nghiệm/Chọn môn học
                  </span>
                </h3>
              </div>
              <div className="py-5 d-flex justify-content-between">
                <div className="container-circle col-lg-6">
                  {/* Central Subject (Math) */}
                  <div
                    className="central-circle"
                    onClick={() =>
                      handleClick(
                        mainSubject.subjectId,
                        mainSubject.subjectName
                      )
                    }
                  >
                    <img
                      alt=""
                      src={iconMath.icon}
                      style={{ width: "70px" }}
                    ></img>
                    {mainSubject ? mainSubject.subjectName : "Toán"}
                  </div>

                  {/* Surrounding Subjects */}
                  {surroundingSubjects.map((subject, index) => {
                    const iconIndex = index % iconSubjects.length;
                    const { icon } = iconSubjects[iconIndex];
                    return (
                      <div
                        key={index}
                        className="outer-circle"
                        style={{
                          ...colors[index],
                          ...positions[index],
                        }}
                        onClick={() =>
                          handleClick(subject.subjectId, subject.subjectName)
                        }
                      >
                        <img alt="" src={icon} style={{ width: "50px" }}></img>
                        {subject.subjectName}
                      </div>
                    );
                  })}
                </div>
                <div className="col-lg-6 d-flex justify-content-end">
                  <img src={StudyImage} style={{ width: "600px" }} alt="" />
                </div>
              </div>
              {/* <div className="sc-gGTGfU fSjCQg">
                <div className="sc-gsTCUz gQRQLT">
                  {subjectAll.map((item, index) => {
                    const colorIndex = index % colors.length;
                    const { background, color } = colors[colorIndex];
                    const iconIndex = index % iconSubjects.length;
                    const { icon } = iconSubjects[iconIndex];
                    return (
                      <div
                        key={item.subjectId}
                        className="sc-dlfnbm sc-eCssSg fnjxoh ddsNTO"
                        onClick={() =>
                          handleClick(item.subjectId, item.subjectName)
                        }
                      >
                        <div
                          className="sc-dcwrBW kLSqMv"
                          style={{ backgroundColor: background }}
                        >
                          <div className="sc-ehsPrw fqtCF justify-content-center">
                            <img alt="" src={icon}></img>
                          </div>
                          <div className="sc-ehsPrw ciEbjT">
                            <div
                              className="sc-dwqbIM iLQQSn"
                              aria-setsize={70}
                            ></div>
                            <p style={{ color: color }}>{item.subjectName}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </span>
    </>
  );
}
