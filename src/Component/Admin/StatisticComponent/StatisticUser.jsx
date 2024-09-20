import { Card, Col, Row } from 'antd';
import 'bootstrap/dist/css/bootstrap.css';
import { useState, useEffect } from 'react';
import { Area } from '@ant-design/plots';
import { notification } from 'antd';

import { StatictisUserByMonthService } from '../../../services/StatictisService';
import { StatictisUserService } from '../../../services/StatictisService';
import { StatictisUserByDayService } from '../../../services/StatictisService';

export default function StatisticUser() {

    //#region - Declare - khai báo biến
    const [dataOfUser, setDataOfUser] = useState({
        totalUser: "",
        totalByMonth: "",
        totalByYear: "",
        totalByDay: "",
    })

    const [dataOfUserByMonth, setDataOfUserByMonth] = useState([]);
    const [dataOfUserByDay, setDataOfUserByDay] = useState([]);
    const [inputYear, setInputYear] = useState("");
    const [inputMonth, setInputMonth] = useState("");
    //#endregion

    //#region - Function - hiển thị thông báo
    const [api, contextHolder] = notification.useNotification();
    const openNotificationGet400 = (placement) => {
        api.error({
            message: `Thông báo`,
            description: "Lấy số liệu account thất bại",
            placement,
        });
    };
    //#endregion

    //#region - Function - thống kê user
    const handleGetCountUser = async () => {
        try {
            const result1 = await StatictisUserService();
            //trả về kết quả trên 4 box
            if (result1.status === 200) {
                setDataOfUser({
                    totalUser: result1.totalUser,
                    totalByMonth: result1.totalByMonth,
                    totalByYear: result1.totalByYear,
                    totalByDay: result1.totalByDay,
                });
            } else {
                openNotificationGet400("topRight")
            }
            //trả về kết quả ở chart đầu tiên
            const result2 = await StatictisUserByMonthService();
            if (result2.status === 200) {
                setDataOfUserByMonth(result2.data);
            } 
            //trả về kêt quả ở chart thứ hai
            const result3 = await StatictisUserByDayService();
            if (result3.status === 200) {
                setDataOfUserByDay(result3.data);
            }
            
        } catch (e) {
            openNotificationGet400("topRight")
        }
    }

    useEffect(() => {
        handleGetCountUser();
    }, []);
    //#endregion

    //#region - Hiển thị chart
    const config = {
        data: dataOfUserByMonth,
        xField: 'month',
        yField: 'value',
        xAxis: {
            range: [0, 1],
        },
    };

    const config2 = {
        data: dataOfUserByDay,
        xField: 'day',
        yField: 'value',
        xAxis: {
            range: [0, 1],
        },
    };


    const handleKeyPress = async (event) => {
        if (event.key === 'Enter') {
            const result2 = await StatictisUserByMonthService(inputYear);
            if (result2.status === 200) {
                setDataOfUserByMonth(result2.data);
            } else {
                openNotificationGet400("topRight")
            }
        }
    };

    const handleKeyPress2 = async (event) => {
        if (event.key === 'Enter') {
            const result3 = await StatictisUserByDayService(inputMonth);
            if (result3.status === 200) {
                setDataOfUserByDay(result3.data);
            } else {
                openNotificationGet400("topRight")
            }
        }
    };
    //#endregion

    return (
        <div>
            {contextHolder}
            <h1
                style={{
                    fontSize: "30px",
                    marginBottom: "20px",
                }}
            >
                Thống kê thành viên
            </h1>
            <Row gutter={16}>
                <Col span={6}>
                    <Card title="Tổng số thành viên" bordered={false} style={{ background: '#9999FF', fontSize: "30px", fontWeight: 'bold', borderRadius: '50px' }}>
                        {dataOfUser.totalUser}
                    </Card>
                </Col>
                <Col span={6}>
                    <Card title="Tổng số thành viên đăng ký trong ngày" bordered={false} style={{ background: '#99CCFF', fontSize: "30px", fontWeight: 'bold', borderRadius: '50px' }}>
                        {dataOfUser.totalByDay}
                    </Card>
                </Col>
                <Col span={6}>
                    <Card title="Tổng số thành viên đăng ký trong tháng" bordered={false} style={{ background: '#ffb371', fontSize: "30px", fontWeight: 'bold', borderRadius: '50px' }}>
                        {dataOfUser.totalByMonth}
                    </Card>
                </Col>
                <Col span={6}>
                    <Card title="Tổng số thành viên đăng ký trong năm" bordered={false} style={{ background: '#99FFCC', fontSize: "30px", fontWeight: 'bold', borderRadius: '50px' }} >
                        {dataOfUser.totalByYear}
                    </Card>
                </Col>
            </Row>
            <div className='chart w-75 m-auto mt-5'>
                <div className='d-flex justify-content-between align-items-center mb-5'>
                    <p className='text-center' style={{ fontWeight: 'bold', fontSize: '15px' }}>
                        Thống kê số lượng người đăng ký theo ngày
                    </p>
                    <div className='d-flex align-items-center'>
                        <input type='text' className='form-control' placeholder='Nhập tháng'
                            onChange={(event) => setInputMonth(event.target.value)}
                            onKeyPress={handleKeyPress2}
                        />
                    </div>
                </div>
                <Area {...config2} />
            </div>
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