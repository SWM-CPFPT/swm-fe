import "../../assets/HeaderNavStyle.css";
import "bootstrap/dist/css/bootstrap.css";
import { Dropdown } from "antd";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const itemsOfTuHoc = [
    {
      key: "1",
      label: (
        <>
          <div>
            <a
              style={{ textDecoration: "none", color: "black" }}
              onClick={() => {
                navigate("/practiceQuizz");
              }}
            >
              <button
                type="button"
                tabIndex="0"
                role="menuitem"
                class="sc-dOSReg lhXIuw dropdown-item"
                style={{ color: "black" }}
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                  fill="#000000"
                  xmlns="http://www.w3.org/2000/svg"
                  class="StyledIconBase-ea9ulj-0 jZGNBW"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path
                    fill="#000000"
                    d="M16.757 3l-7.466 7.466.008 4.247 4.238-.007L21 7.243V20a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1h12.757zm3.728-.9L21.9 3.516l-9.192 9.192-1.412.003-.002-1.417L20.485 2.1z"
                  ></path>
                </svg>
                Luyện tập trắc nghiệm
              </button>
            </a>
          </div>
        </>
      ),
    },
    {
      key: "2",
      label: (
        <>
          <div>
            <a
              style={{ textDecoration: "none", color: "black" }}
              onClick={() => {
                navigate("/testSubject");
              }}
            >
              <button
                type="button"
                tabIndex="0"
                role="menuitem"
                class="sc-dOSReg lhXIuw dropdown-item"
              >
                <svg
                  width="16"
                  height="20"
                  viewBox="0 0 16 18"
                  fill="none"
                  class="nav-icon"
                >
                  <path
                    d="M16 2.46154V8.61539C16 9.35897 15.9984 9.90545 15.9952 10.2548C15.992 10.6042 15.9872 11.0641 15.9808 11.6346C15.9744 12.2051 15.9599 12.6282 15.9375 12.9038C15.9151 13.1795 15.8846 13.5272 15.8462 13.9471C15.8077 14.367 15.758 14.6955 15.6971 14.9327C15.6362 15.1699 15.5641 15.4391 15.4808 15.7404C15.3974 16.0417 15.2965 16.3077 15.1779 16.5385C15.0593 16.7692 14.9231 17 14.7692 17.2308H0C0.50641 15.6795 0.838141 14.2452 0.995192 12.9279C1.15224 11.6106 1.23077 9.76282 1.23077 7.38462V2.46154L3.69231 2.48077V8C3.69231 8.55128 3.86218 8.9968 4.20192 9.33654C4.54167 9.67628 4.98718 9.84615 5.53846 9.84615C6.42949 9.84615 7.00641 9.54808 7.26923 8.95192C7.34615 8.77244 7.38462 8.45513 7.38462 8V3.69231H6.15385V8C6.15385 8.25 6.11539 8.41506 6.03846 8.49519C5.96154 8.57532 5.79487 8.61539 5.53846 8.61539C5.32692 8.59615 5.16987 8.54006 5.06731 8.44712C4.96474 8.35417 4.91667 8.20513 4.92308 8V2.46154H16ZM5.06731 1.52885C5.25962 1.20833 5.52244 1.04808 5.85577 1.04808C6.24039 1.04808 6.52885 1.1266 6.72115 1.28365C6.91346 1.44071 7.02564 1.70513 7.05769 2.07692H8.28846C8.28846 1.71795 8.2468 1.43269 8.16346 1.22115C8.03526 0.907051 7.77724 0.625 7.38942 0.375C7.0016 0.125 6.51603 0 5.93269 0C5.29167 0 4.76282 0.176282 4.34615 0.528846C3.91026 0.907051 3.69231 1.37821 3.69231 1.94231V2.46154H4.92308V2.23077L4.93269 1.97115L4.97596 1.76923L5.06731 1.52885Z"
                    fill="#000000"
                  ></path>
                </svg>
                Đề kiểm tra
              </button>
            </a>
          </div>
        </>
      ),
    },
  ];

  const url = window.location.pathname;

  const checkTrangChu = url == "/";
  const checkTuHoc =
    url.includes("practiceQuizz") ||
    url.includes("testSubject") ||
    url.includes("takeExam") ||
    url.includes("study") ||
    url.includes("exam") ||
    url.includes("examResult");
  const checkLichSuOnLuyen = url.includes("testHistory");
  const checkNews = url.includes("news");
  const checkForum = url.includes("forum");

  return (
    <>
      <div className="sc-iBaPrD gdARiY d-sm-block d-none">
        <ul className="sc-eggNIi JiLrb list-inline cover">
          <a
            className={checkTrangChu ? "isActive" : ""}
            onClick={() => {
              navigate("/");
            }}
          >
            <li
              class="sc-cTkwdZ degoCR list-inline-item"
              style={{ color: "#000000" }}
            >
              <h6 className="menu-item"> Trang chủ</h6>
              <div className="card-menu d-flex">
                <div className="">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/2466/2466734.png"
                    alt=""
                    width={100}
                    height={100}
                  />
                </div>
                {checkTrangChu && (
                  <div className="card-menu-des ml-2 slide-in">
                    <div>- Xem cuộc thi đang diễn ra</div>
                    <div>- Bảng xếp hạng</div>
                  </div>
                )}
              </div>
            </li>
          </a>
          <div className="sc-jNMdTA ewqGCM dropdown">
            <Dropdown
              menu={{
                items: itemsOfTuHoc,
              }}
            >
              <button
                type="button"
                aria-aria-haspopup="true"
                aria-expanded="false"
                className="btn btn-secondary"
              >
                <a className={checkTuHoc ? "isActive" : ""}>
                  <li
                    className="sc-cTkwdZ degoCR list-inline-item"
                    style={{ color: "black" }}
                  >
                    <h6 className="menu-item"> Tự học</h6>
                    <div className="card-menu d-flex">
                      <div className="">
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/6747/6747103.png"
                          alt=""
                          width={100}
                          height={100}
                        />
                      </div>
                      {checkTuHoc && (
                        <div className="card-menu-des slide-in">
                          <div>- Luyện tập trắc nghiệm</div>
                          <div>- Làm bài kiểm tra thử</div>
                          <div>- Đề kiểm tra mới nhất</div>
                        </div>
                      )}
                    </div>
                  </li>
                </a>
              </button>
            </Dropdown>
          </div>
          <a
            className={checkForum ? "isActive" : ""}
            onClick={() => {
              navigate("/forum");
            }}
          >
            <li
              class="sc-cTkwdZ degoCR list-inline-item"
              style={{ color: "black" }}
            >
              <h6 className="menu-item">Diễn đàng</h6>
              <div className="card-menu d-flex">
                <div className="">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/6747/6747157.png"
                    alt=""
                    width={100}
                    height={100}
                  />
                </div>
                {checkForum && (
                  <div className="card-menu-des ml-2 slide-in">
                    <div>- Để lại bình luận của bạn</div>
                    <div>- Cùng nhau thảo luận về những chủ đề của bạn </div>
                  </div>
                )}
              </div>
            </li>
          </a>
          <a
            className={checkNews ? "isActive" : ""}
            onClick={() => {
              navigate("/news");
            }}
          >
            <li
              class="sc-cTkwdZ degoCR list-inline-item"
              style={{ color: "black" }}
            >
              <h6 className="menu-item"> Tin tức</h6>
              <div className="card-menu d-flex">
                <div className="">
                  <img
                    src="https://png.pngtree.com/png-vector/20220520/ourmid/pngtree-digital-study-icon-color-flat-png-image_4687517.png"
                    alt=""
                    width={100}
                    height={100}
                  />
                </div>
                {checkNews && (
                  <div className="card-menu-des ml-2 slide-in">
                    <div>- Xem tin tức mới nhất</div>
                    <div></div>
                  </div>
                )}
              </div>
            </li>
          </a>
          <div className="sc-jNMdTA ewqGCM dropdown">
            <button
              type="button"
              aria-aria-haspopup="true"
              aria-expanded="false"
              className="btn btn-secondary"
            >
              <a
                className={checkLichSuOnLuyen ? "isActive" : ""}
                onClick={() => {
                  navigate("/testHistory");
                }}
              >
                <li
                  className="sc-cTkwdZ degoCR list-inline-item"
                  style={{ color: "black" }}
                >
                  <h6 className="menu-item">Lịch sử ôn luyện</h6>
                  <div className="card-menu d-flex">
                    <div className="">
                      <img
                        src="https://cdn-icons-png.freepik.com/256/747/747086.png?semt=ais_hybrid"
                        alt=""
                        width={100}
                        height={100}
                      />
                    </div>
                    {checkLichSuOnLuyen && (
                      <div className="card-menu-des ml-2 slide-in">
                        <div>- Lịch sử các bài thi</div>
                        <div>- Kiểm tra kết quả từng môn học</div>
                      </div>
                    )}
                  </div>
                </li>
              </a>
            </button>

            {/* <div tabIndex="-1" role="menu" aria-hidden="true" className="sc-bBrOnJ bhhAF dropdown-menu">
                            <a href="/tu-hoc/luyen-tap">
                                <button type="button" tabindex="0" role="menuitem" class="sc-dOSReg lhXIuw dropdown-item">
                                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="StyledIconBase-ea9ulj-0 jZGNBW">
                                        <path fill="none" d="M0 0h24v24H0z"></path><path d="M16.757 3l-7.466 7.466.008 4.247 4.238-.007L21 7.243V20a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1h12.757zm3.728-.9L21.9 3.516l-9.192 9.192-1.412.003-.002-1.417L20.485 2.1z">
                                        </path>
                                    </svg>
                                    Luyện tập trắc nghiệm
                                </button>
                            </a>
                        </div> */}
          </div>
        </ul>
      </div>
    </>
  );
}
