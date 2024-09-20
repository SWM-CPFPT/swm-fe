import "bootstrap/dist/css/bootstrap.css";
import "../../assets/HomePageStyle.css";
import "../../assets/Style.css";

import Header from "../../Layout/User/Header";
import ChooseSubject from "./HomeComponent/ChooseSubject";
import ActivityInWeek from "./HomeComponent/ActivityInWeek";
import LeadBoard from "./HomeComponent/LeadBoard";
import Footer from "../../Layout/User/Footer";

import { useNavigate } from "react-router-dom";

export default function HomePage() {
  return (
    <>
      <Header />
      <span>
        <div
          className="body fade-appear-active"
          style={{ background: "#f9f9f9" }}
        >
          <div
            className="sc-cOajty jAnegm dashboard"
            style={{ marginLeft: "50px" }}
          >
            <div
              className="sc-hKgILt gTLZXx container-fluid d-flex"
              style={{ width: "85%", gap: "16px" }}
            >
              <div className="column-left">
                {/* Chọn môn học */}
                <ChooseSubject />

                {/* Các hoạt động trong tuần */}
                <ActivityInWeek />
              </div>

              <div className="column-right">
                {/* Bảng xếp hạng */}
                <LeadBoard isColumn={true} />
              </div>
            </div>
          </div>
        </div>
      </span>

      <Footer />
    </>
  );
}
