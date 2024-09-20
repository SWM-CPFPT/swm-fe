import { Card, Col, Row } from 'antd';
import 'bootstrap/dist/css/bootstrap.css';
import { useState, useEffect } from 'react';
import { Pie } from '@ant-design/plots';
import { notification, Select } from 'antd';
import { Option } from "antd/es/mentions";


import { StatictisQuestionService } from '../../../services/StatictisService';
import { GetAllSubject } from '../../../services/HistoryService';
import { StatictisQuestionBySubjectId } from '../../../services/StatictisService';

export default function StatisticQuestion() {
    //#region - Declare - khai báo biến    
    const [dataOfQuestion, setDataOfQuestion] = useState([]);
    const [subjectList, setSubjectList] = useState([]);
    const [dataOfQuestionType, setDataOfQuestionType] = useState([]);
    const [selectdOption, setSelectOption] = useState({
        subjectId: "0",
    });
    //#endregion

    //#region - Function - hiển thị thông báo
    const [api, contextHolder] = notification.useNotification();
    const openNotificationGet400 = (placement) => {
        api.error({
            message: `Thông báo`,
            description: "Lấy số liệu questopn thất bại",
            placement,
        });
    };
    //#endregion

    //#region - Function - thống kê question
    const handleGetCountQuestion = async () => {
        try {
            const result1 = await StatictisQuestionService();
            //trả về kết quả trên 4 box
            if (result1.status === 200) {
                setDataOfQuestion(result1.data);
            } else {
                openNotificationGet400("topRight")
            }
            const result = await GetAllSubject();
            if (result.status === 200) {
                setSubjectList(result.subjectList);
            }
            const result2 = await StatictisQuestionBySubjectId();
            if (result2.status === 200) {
                setDataOfQuestionType(result2.data);
            }

        } catch (e) {
            openNotificationGet400("topRight")
        }
    }

    useEffect(() => {
        handleGetCountQuestion();
    }, []);
    //#endregion

    //#region - Function - hiển thị chart
    const config = {
        appendPadding: 10,
        data: dataOfQuestion,
        angleField: 'totalQuestion',
        colorField: 'subjectName',
        radius: 0.8,
        label: {
            type: 'outer',
            content: '{name} {percentage}',
        },
        interactions: [
            {
                type: 'pie-legend-active',
            },
            {
                type: 'element-active',
            },
        ],
    };

    const config2 = {
        appendPadding: 10,
        data: dataOfQuestionType,
        angleField: 'totalQuestion',
        colorField: 'questionType',
        radius: 0.8,
        label: {
            type: 'outer',
            content: '{name} {percentage}',
        },
        interactions: [
            {
                type: 'pie-legend-active',
            },
            {
                type: 'element-active',
            },
        ],
    };

    const handleOnChange = async (name, value) => {
        setSelectOption({
            [name]: value,
        })
        try {
            const result = await StatictisQuestionBySubjectId(value);
            if (result.status === 200) {
                setDataOfQuestionType(result.data);
            }
        } catch (error) {
            console.error('Error fetching testdetail service:', error);
        }
    }
    //#endregion

    return (
        <div className='mt-5'>
            {contextHolder}
            <h1
                style={{
                    fontSize: "30px",
                    marginBottom: "20px",
                }}
            >
                Thống kê câu hỏi
            </h1>
            <div className='chart dl-flex justify-content-around mt-5 row' style={{ width: '90%' }}>
                <div className='col-5'>
                    <div className='d-flex justify-content-between align-items-center mb-5'>
                        <p
                            className='text-center'
                            style={{
                                fontWeight: 'bold',
                                fontSize: '15px',
                                alignSelf: 'center',
                                margin: '0'
                            }}
                        >
                            Số lượng lượng câu hỏi theo môn
                        </p>
                    </div>
                    <Pie {...config} />
                </div>
                <div className='col-5'>
                    <div className='d-flex justify-content-between align-items-center mb-3'>
                        <p
                            className='text-center'
                            style={{
                                fontWeight: 'bold',
                                fontSize: '15px',
                                alignSelf: 'center',
                                margin: '0'
                            }}
                        >
                            Số lượng lâu hỏi theo dạng bài
                        </p>
                        <div className='d-flex align-items-center w-50'>
                            <div className="searchSubject w-75" style={{ margin: '10px auto' }}>
                                <Select
                                    style={{
                                        width: '100%',
                                    }}
                                    defaultValue="Tất cả các môn"
                                    name="subjectId"
                                    allowClear
                                    onChange={(e) => handleOnChange("subjectName", e)}
                                    value={selectdOption.subjectId}
                                >
                                    <Option
                                        value="0"
                                        key="all"
                                        name="all"
                                    >
                                        Tất cả các môn
                                    </Option>
                                    {subjectList?.map((item) => (
                                        <Option
                                            value={item.subjectId}
                                            key={item.projectId}
                                            name="subjectId"
                                        >
                                            {item.subjectName}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        </div>

                    </div>
                    <Pie {...config2} />
                </div>
            </div>
        </div>
    )
}