import Header from "../../Layout/User/Header";
import { Table, Input, Select } from "antd";
import { Option } from "antd/es/mentions";
import { SearchOutlined } from "@ant-design/icons";
import { useEffect, useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.css";
import moment from "moment";
import { Pie } from "@ant-design/plots";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../../contexts/UserContext";
import { GetTestDetailService } from "../../services/HistoryService";
import { GetAllSubject } from "../../services/HistoryService";
import { StatictisService } from "../../services/HistoryService";

export default function TestHistory() {
  const navigate = useNavigate();
  const handleTestDetail = async (item) => {
    navigate("/examResult", {
      state: {
        testDetailId: item.testDetailId,
        topicName: item.topic,
        score: item.score,
        answerRight: item.answerRight,
        totalQuestion: item.totalQuestion,
      },
    });
  };
  //#region - Declare - Khai báo các biến cần dùng
  const columns = [
    {
      title: "Môn thi",
      width: 50,
      dataIndex: "subjectName",
      key: "subjectName",
      fixed: "left",
      style: { color: "#538dd5", color: "white" },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <Input
            autoFocus
            placeholder="Nhập môn học"
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
            onPressEnter={() => {
              confirm();
            }}
            onBlur={() => {
              confirm();
            }}
          ></Input>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        if (record.subjectName != null) {
          return record.subjectName.toLowerCase().includes(value.toLowerCase());
        }
      },
    },
    {
      title: "Thời gian thi",
      width: 70,
      dataIndex: "duration",
      key: 3,
      fixed: "left",
    },
    {
      title: "Bộ đề thi",
      dataIndex: "topic",
      key: 4,
      width: 200,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <Input
            autoFocus
            placeholder="Nhập tên đề thi"
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
            onPressEnter={() => {
              confirm();
            }}
            onBlur={() => {
              confirm();
            }}
          ></Input>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        if (record.setOfTopic != null) {
          return record.setOfTopic.toLowerCase().includes(value.toLowerCase());
        }
      },
    },
    {
      title: "Số câu",
      width: 50,
      dataIndex: "totalQuestion",
      key: 1,
      fixed: "left",
    },
    {
      title: "Khối",
      width: 50,
      dataIndex: ['grade', 'nameGrade'],
      key: 1,
      fixed: "left",
    },
    {
      title: "Kết quả",
      width: 50,
      dataIndex: "score",
      key: 1,
      fixed: "left",
    },
    {
      title: "Ngày nộp",
      width: 50,
      dataIndex: "submitDate",
      key: 1,
      fixed: "left",
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "",
      width: 50,
      key: 1,
      fixed: "left",
      render: (record) => {
        return (
          <>
            <a
              style={{ color: "#538dd5", textAlign: "center" }}
              onClick={() => handleTestDetail(record)}
            >
              Chi tiết
            </a>
          </>
        );
      },
    },
  ];
  const { user, render, onSetRender } = useContext(UserContext);
  const [dataSource, setDataSource] = useState("");
  const [subjectList, setSubjectList] = useState([]);
  const [selectedOption, setSelectedOption] = useState({
    subjectName: "",
  });
  // console.log(selectedOption);
  // console.log(dataSource);
  const pagination = {
    pageSize: 5,
    total: dataSource != null ? dataSource.length : "",
  };
  const [dataChart, setDataChart] = useState([
    {
      sex: "Understood",
      sold: 50,
    },
    {
      sex: "NotUnderstood",
      sold: 50,
    },
  ]);
  //#endregion

  //#region - Function - Hiển thị danh sách các bài đã test
  const handleViewTestDetails = async () => {
    try {
      const result = await GetTestDetailService(user.accountId);
      // console.log(result.data)
      if (result.status === 200) {
        setDataSource(result.data);
        const totalScore = dataSource.reduce((sum, item) => sum + item.score, 0);
        const diemtrungbinh = ((totalScore /dataSource.length)*10)
        const diemTrungBinhHinhTron = parseFloat(diemtrungbinh.toFixed(2));
        setDataChart([
          {
            sex: "Understood",
            sold: diemTrungBinhHinhTron,
          },
          {
            sex: "NotUnderstood",
            sold: Number(100-diemTrungBinhHinhTron),
          },
        ]);
        onSetRender();
      }
    } catch (error) {
      console.error("Error fetching testdetail service:", error);
    }
  };

  useEffect(() => {
    handleViewTestDetails();
  }, []);

  //#endregion

  //#region - Function - Lấy danh sách tất cả môn học
  const handleGetAllSubject = async () => {
    try {
      const result = await GetAllSubject();
      if (result.subjectList != null) {
        setSubjectList(result.subjectList);
      }
    } catch (error) {
      console.error("Error fetching testdetail service:", error);
    }
  };

  useEffect(() => {
    handleGetAllSubject();
  }, []);

  //#endregion

  //#region - Function - Nhận giá trị select option
  const handleOnChange = async (name, value) => {
      const result = await GetTestDetailService(user.accountId);
      var data = result.data;
      console.log(data)
    
      // setSelectedOption((prevState) => ({
      //   ...prevState,
      //   [name]: value,
      // }));
    const statictis = await StatictisService(user.accountId, value);
    console.log(statictis)
    setDataSource(statictis.data);
   
    // Gọi hàm để lọc hoặc hiển thị dữ liệu trong bảng
    console.log(dataSource)
    let filteredData;
    if (value === "Tất cả các môn") {

      filteredData = data;
      const totalScore = filteredData.reduce((sum, item) => sum + item.score, 0);
      const diemtrungbinh = ((totalScore /filteredData.length)*10)
      const diemTrungBinhHinhTron = parseFloat(diemtrungbinh.toFixed(2));
      console.log(totalScore)
      console.log(diemtrungbinh)
      console.log(diemTrungBinhHinhTron)

      console.log(filteredData)
      setDataChart([
        {
          sex: "Understood",
          sold: diemTrungBinhHinhTron,
        },
        {
          sex: "NotUnderstood",
          sold: Number(100-diemTrungBinhHinhTron),
        },
      ]);
      onSetRender();
    
    } 
    else {
      filteredData = data.filter((item) => item.subjectName === value);
      const totalScore = filteredData.reduce((sum, item) => sum + item.score, 0);
      const diemtrungbinh = ((totalScore /filteredData.length)*10)
      const diemTrungBinhHinhTron = parseFloat(diemtrungbinh.toFixed(2));
      console.log("tong diem la:",totalScore)
      console.log("tong trung binh la:",diemtrungbinh)
      console.log("diem trung binh hinh tron:",diemTrungBinhHinhTron)
      setDataChart([
        {
          sex: "Understood",
          sold: diemTrungBinhHinhTron,
        },
        {
          sex: "NotUnderstood",
          sold: Number(100 - diemTrungBinhHinhTron),
        },
      ]);
      onSetRender();
    }

    setDataSource(filteredData)
  };
  // const handleOnChange = async (name, value) => {
  //   setSelectedOption((prevState) => ({
  //     ...prevState,
  //     [name]: value,
  //   }));
  //   try {
  //     const result = await StatictisService(user.accountId, value);
  //     if (result.status === 400) {
  //       setDataSource(result.data);
  //       setDataChart([
  //         {
  //           sex: "Understood",
  //           sold: 0,
  //         },
  //         {
  //           sex: "NotUnderstood",
  //           sold: 100,
  //         },
  //       ]);
  //     }
  //     if (result.status === 200) {
  //       setDataSource(result.data);
  //       setDataChart([
  //         {
  //           sex: "Understood",
  //           sold: result.levelOfUnderStanding,
  //         },
  //         {
  //           sex: "NotUnderstood",
  //           sold: Number(100 - result.levelOfUnderStanding),
  //         },
  //       ]);
  //       onSetRender();
  //     }
  //   } catch (error) {
  //     console.error("Error fetching testdetail service:", error);
  //   }
  // };

  //#endregion

  //#region - Function - Hiển thị chart
  const config = {
    appendPadding: 10,
    data: dataChart,
    angleField: "sold",
    colorField: "sex",
    radius: 0.8,
    legend: false,
    label: {
      type: "inner",
      offset: "-50%",
      style: {
        fill: "#fff",
        fontSize: 18,
        textAlign: "center",
      },
    },
    pieStyle: ({ sex }) => {
      if (sex === "Understood") {
        return {
          fill: "#F7BDCB",
        };
      }

      return {
        fill: "#5654A2",
      };
    },
    tooltip: false,
    interactions: [
      {
        type: "element-single-selected",
      },
    ],
  };

  //#endregion

  return (
    <>
      <Header />
      <div className="m-auto bodyHistory" style={{ width: "80%" }}>
        <h3 className="title-comm">
          <span className="title-holder">Lịch sử ôn luyện</span>
        </h3>
        <div
          className="row"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          {/* statictis */}
          <div className="col-lg-4">
            <div className="searchSubject w-75" style={{ margin: "10px auto" }}>
              <Select
                style={{
                  width: "100%",
                }}
                defaultValue="Tất cả các môn"
                name="subjectId"
                allowClear
                onChange={(e) => handleOnChange("subjectName", e)}
                value={selectedOption.subjectId}
              >
                <Option value="Tất cả các môn" key="all" name="all"></Option>
                {subjectList?.map((item) => (
                  <Option
                    value={item.subjectName}
                    key={item.projectId}
                    name="subjectName"
                  >
                    {item.subjectName}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="statictis">
              <Pie {...config} />
            </div>
            <div className="mt-3">
              <p>
                * Mức độ thành thạo được tính toán và phân tích dựa trên dữ liệu
                làm bài của bạn trên toàn bộ hệ thống.
                <div style={{ display: "flex", marginLeft: "50px" }}>
                  <div
                    style={{
                      background: "#F7BDCB",
                      width: "10px",
                      height: "10px",
                      margin: "auto 0",
                    }}
                  ></div>
                  : Mức độ am hiểu
                </div>
                <div style={{ display: "flex", marginLeft: "50px" }}>
                  <div
                    style={{
                      background: "#5654A2",
                      width: "10px",
                      height: "10px",
                      margin: "auto 0",
                    }}
                  ></div>
                  : Cần ôn tập lại để làm bài tốt hơn nha
                </div>
              </p>
              <p>
                * Dữ liệu học tập sẽ bắt đầu được xử lý mỗi khi bạn hoàn thành 1
                bài luyện hoặc bài kiểm tra
              </p>
            </div>
          </div>
          {/* history table */}
          <div className="col-lg-7">
            <div
              style={{ background: "#d5c8a0", borderRadius: "10px" }}
              className="p-3 m-auto"
            >
              <p
                style={{ color: "#57412b", fontWeight: "500" }}
                className="m-auto text-center"
              >
                Mức độ thành thạo kiến thức các môn
              </p>
            </div>
            <Table
              className="text-black"
              style={{ color: "red" }}
              columns={columns}
              dataSource={dataSource}
              pagination={pagination}
            />
          </div>
        </div>
      </div>
    </>
  );
}
