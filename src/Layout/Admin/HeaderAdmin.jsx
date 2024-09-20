import { Fragment, useState, useEffect, useContext } from "react";
import { UserOutlined, DesktopOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, theme, Dropdown, Space } from 'antd';
import { UserContext } from "../../contexts/UserContext"; 
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';

const { Header } = Layout;

export default function HeaderAdmin() {
    
    const { user, onSetUser } = useContext(UserContext);
    const [cookies, setCookie, removeCookie] = useCookies([]);
    const navigate = useNavigate();

    function getItem(label, key, icon, children) {
        return {
            key,
            icon,
            children,
            label,
        };
    }
    
    const onLogOut = () => {
        // removeCookie('token', { path: '/' });
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.clear();
        onSetUser({
            data: "",
            token: "",
        })
        navigate("/");
    };

    const items = [
        // getItem(<a href={process.env.REACT_APP_CLIENT_HOST + "/four-season/user-profile"}>View Profile</a>,'1', <UserOutlined />),
        getItem(<a onClick={() =>onLogOut()}>Log out</a>, '3', <LogoutOutlined />),
    ];

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Fragment>
            <Header
                style={{
                    paddingRight: "12px",
                    background: colorBgContainer,
                }}
                className="d-flex justify-content-end"
            >
                <Dropdown
                    menu={{
                        items,
                    }}
                    placement="bottomRight"
                    trigger={['click']}
                >
                    <Space>
                        <a className="d-flex align-items-center" href="#">
                            <img src='../../Image/Avatar_Null.png' alt="" style={{ cursor: "pointer", borderRadius: "50%"  }} width="50" height="50"
                                className="" />                            
                        </a>
                    </Space>
                </Dropdown>
            </Header>
        </Fragment>
    )
}