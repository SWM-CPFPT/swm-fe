import { useState, useContext, useEffect } from "react";
import {
  UserOutlined,
  FundOutlined,
  UsergroupAddOutlined,
  HddOutlined,
  WechatOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import "../../assets/Admin.css";
import { Color } from "antd/es/color-picker";
const { Sider } = Layout;

export default function SiderAdmin() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [items, setItems] = useState([]);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const { user } = useContext(UserContext);

  function getItem(label, key, icon, path, children) {
    return {
      key,
      icon,
      path,
      children,
      label,
    };
  }

  const adminMenu = [
    getItem(
      "Thống kê",
      "/admin/statistics",
      <FundOutlined />,
      "/admin/statistics",
      null
    ),
    getItem(
      "Quản lý người dùng",
      "/admin/manageUser",
      <UserOutlined />,
      "/admin/manageUser",
      null
    ),
    getItem(
      "Quản lý Mod",
      "/admin/manageMod",
      <UsergroupAddOutlined />,
      "/admin/manageMod",
      null
    ),
    getItem(
      "Quản lý topic",
      "/admin/manageTopic",
      <FolderOpenOutlined />,
      "/admin/manageTopic",
      null
    ),
    getItem(
      "Quản lý chương",
      "/admin/managecoursechapter",
      <FolderOpenOutlined />,
      "/admin/managecoursechapter",
      null
    ),
    getItem(
      "Quản lý diễn đàn",
      "/admin/manageForum",
      <WechatOutlined />,
      "/admin/manageForum",
      null
    ),
    getItem(
      "Quản lý tin tức",
      "/admin/manageNew",
      <HddOutlined />,
      "/admin/manageNew",
      null
    ),
  ];

  const modMenu = [
    getItem(
      "Quản lý topic",
      "/mod/manageTopic",
      <FolderOpenOutlined />,
      "/mod/manageTopic",
      null
    ),
    getItem(
      "Quản lý chương",
      "/mod/managecoursechapter",
      <HddOutlined />,
      "/mod/managecoursechapter",
      null
    ),
    getItem(
      "Quản lý tin tức",
      "/mod/manageNews",
      <HddOutlined />,
      "/mod/manageNews",
      null
    ),
  ];

  const superAdminMenu = [
    getItem(
      "Quản lý admin",
      "/superAdmin/manageAdmin",
      <FolderOpenOutlined />,
      "/superAdmin/manageAdmin",
      null
    ),
  ];

  // const items = user.roleId == 2 ? adminMenu : user.roleId == 3 ? modMenu : adminMenu;

  const onClick = (value) => {
    navigate(value.key);
  };

  useEffect(() => {
    if (user.roleId === 2) {
      setItems(adminMenu);
    } else if (user.roleId === 3) {
      setItems(modMenu);
    } else {
      setItems(superAdminMenu);
    }
  }, []);

  return (
    <>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        trigger={null}
      >
        <div className="d-flex justify-content-end me-2 mt-4">
          <Button
            type="primary"
            onClick={toggleCollapsed}
            style={{
              marginBottom: 16,
            }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
        </div>
        <Menu
          className="custom-menu"
          onClick={(key) => onClick(key)}
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          inlineCollapsed={collapsed}
          items={items}
        />
      </Sider>
    </>
  );
}
