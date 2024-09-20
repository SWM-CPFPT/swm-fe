import { Card, Col, Row } from 'antd';
import 'bootstrap/dist/css/bootstrap.css';
import { useState, useEffect } from 'react';
import { Area } from '@ant-design/plots';
import { notification } from 'antd';

import { StatictisTopicService } from '../../../services/StatictisService';
import { StatictisTopicByMonthService } from '../../../services/StatictisService';

export default function StatisticExamTest() {
    //#region - Declare - khai báo biến
    const [dataOfUTopic, setDataOfTopic] = useState({
        totalTopic: "",
        totalByMonth: "",
        totalByYear: "",
        totalByDay: "",
    })

    const [dataOfTopicByMonth, setDataOfTopicByMonth] = useState([]);
    const [inputYear, setInputYear] = useState("");
    //#endregion

    //#region - Function - thống kê topic
    const handleGetCountExamTest = async () => {
        try {
            const result1 = await StatictisTopicService();
            //trả về kết quả trên 4 box
            if (result1.status === 200) {
                setDataOfTopic({
                    totalTopic: result1.totalTopic,
                    totalByMonth: result1.totalByMonth,
                    totalByYear: result1.totalByYear,
                    totalByDay: result1.totalByDay,
                });
            } else {
                console.log("error");
            }
            //trả về kết quả ở chart đầu tiên
            const result2 = await StatictisTopicByMonthService();
            if (result2.status === 200) {
                setDataOfTopicByMonth(result2.data);
            }
        } catch (e) {
            openNotificationGet400("topRight")
        }
    }

    useEffect(() => {
        handleGetCountExamTest();
    }, []);
    //#endregion

    //#region - Function - hiển thị thông báo
    const [api, contextHolder] = notification.useNotification();
    const openNotificationGet400 = (placement) => {
        api.error({
            message: `Thông báo`,
            description: "Lấy số liệu Topic thất bại",
            placement,
        });
    };
    //#endregion


    //#region - Hiển thị chart
    const config = {
        data: dataOfTopicByMonth,
        xField: 'month',
        yField: 'value',
        xAxis: {
            range: [0, 1],
        },
    };



    const handleKeyPress = async (event) => {
        if (event.key === 'Enter') {
            const result2 = await StatictisTopicByMonthService(inputYear);
            if (result2.status === 200) {
                setDataOfTopicByMonth(result2.data);
            } else {
                openNotificationGet400("topRight")
            }
        }
    };
    //#endregion

    return (
        <div className='mt-5'>
            <h1
                style={{
                    fontSize: "30px",
                    marginBottom: "20px",
                }}
            >
                Thống kê bài thi
            </h1>
            <Row gutter={16}>
                <Col span={6}>
                    <Card title="Tổng số bài thi" bordered={false} style={{ background: '#9999FF', fontSize: "30px", fontWeight: 'bold', borderRadius: '50px' }}>
                        {dataOfUTopic.totalTopic}
                    </Card>
                </Col>
                <Col span={6}>
                    <Card title="Tổng số bài thi tạo trong ngày" bordered={false} style={{ background: '#99CCFF', fontSize: "30px", fontWeight: 'bold', borderRadius: '50px' }}>
                        {dataOfUTopic.totalByDay}
                    </Card>
                </Col>
                <Col span={6}>
                    <Card title="Tổng số bài thi tạo trong tháng" bordered={false} style={{ background: '#ffb371', fontSize: "30px", fontWeight: 'bold', borderRadius: '50px' }}>
                        {dataOfUTopic.totalByMonth}
                    </Card>
                </Col>
                <Col span={6}>
                    <Card title="Tổng số bài thi tạo trong năm" bordered={false} style={{ background: '#99FFCC', fontSize: "30px", fontWeight: 'bold', borderRadius: '50px' }} >
                        {dataOfUTopic.totalByYear}
                    </Card>
                </Col>
            </Row>
            <div className='chart w-75 m-auto mt-5'>
                <div className='d-flex justify-content-between align-items-center mb-5'>
                    <p className='text-center' style={{ fontWeight: 'bold', fontSize: '15px' }}>
                        Thống kê số lượng người đăng ký theo tháng
                    </p>
                    <div className='d-flex align-items-center'>
                        <input type='text' className='form-control' placeholder='Nhập năm'
                            onChange={(event) => setInputYear(event.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </div>
                </div>
                <Area {...config} />
            </div>
        </div>
    )
}