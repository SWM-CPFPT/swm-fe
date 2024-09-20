import 'bootstrap/dist/css/bootstrap.css';
import SiderAdmin from "../../Layout/Admin/SiderAdmin";
import HeaderAdmin from "../../Layout/Admin/HeaderAdmin";
import { DatePicker, Dropdown, Breadcrumb, Layout, Table, Input, Modal, Form, notification, Button, theme, Card, Timeline, Tooltip, Select, Col, Row } from 'antd';
import { useEffect, useState } from 'react';

import StatisticUser from './StatisticComponent/StatisticUser';
import StatisticExamTest from './StatisticComponent/StatisticExamTest';
import StatisticQuestion from './StatisticComponent/StatisticQuestion';

const { Content } = Layout;


export default function Statistics() {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout
            style={{ minHeight: '100vh' }}
        >
            <SiderAdmin />
            <Layout className="site-layout">
                <HeaderAdmin />
                <Content
                    style={{
                        margin: "0 16px",
                    }}
                >
                    <Breadcrumb
                        style={{
                            margin: "16px 0",
                        }}
                    >
                        <Breadcrumb.Item>
                            Trang chủ
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Thống kê</Breadcrumb.Item>
                    </Breadcrumb>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                        }}
                    >
                        <StatisticUser/>

                        <StatisticExamTest />

                        <StatisticQuestion/>

                    </div>
                </Content>
            </Layout>
        </Layout>
    )
}