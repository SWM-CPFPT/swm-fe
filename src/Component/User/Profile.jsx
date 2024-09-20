import "../../assets/ProfileStyle.css";
import "../../assets/Style.css";

import Header from "../../Layout/User/Header";
import InformationUser from "./ProfileComponent/InformationUser";

export default function Profile() {
  return (
    <>
      <Header />
      <span>
        <div className="body">
          <div
            className="sc-fZnpCs kSNmKm profile-container"
            style={{ padding: "20px 20px" }}
          >
            <div className="sc-hKgILt gTLZXx container-fluid">
              <h3 className="title-comm">
                <span className="title-holder">Hồ sơ cá nhân</span>
              </h3>
              <div className="sc-iOTrKq bxNxkC">
                {/* thông tin người dùng */}
                <InformationUser />
              </div>
            </div>
          </div>
        </div>
      </span>
    </>
  );
}
