import React from "react";
import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  BarChartOutlined,
  FileTextOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import theme from "../../theme";

const { Sider } = Layout;

const DeanNavbar: React.FC = () => {
  const location = useLocation();

  const getSelectedKey = () => {
    if (location.pathname === "/admin") return "1";
    if (location.pathname.startsWith("/admin/work")) return "2";
    if (location.pathname.startsWith("/admin/config")) return "3";
    return "1";
  };

  return (
    <Sider
      width={280}
      style={{
        background: theme.sidebarBg,
        position: "sticky",
        top: 70,
        height: "calc(100vh - 70px)",
        boxShadow: theme.shadowLarge,
        overflow: "hidden",
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        style={{
          height: "100%",
          borderRight: 0,
          padding: `${theme.spacing.lg} 0`,
          background: theme.sidebarBg,
        }}
        theme="light"
      >
        <Menu.Item
          key="1"
          icon={
            <BarChartOutlined
              style={{ fontSize: theme.fontSize.xl, color: "#fff" }}
            />
          }
          style={{
            margin: `${theme.spacing.sm} ${theme.spacing.md}`,
            borderRadius: theme.borderRadius.md,
            height: "48px",
            lineHeight: "48px",
            color: theme.primary,
            background: getSelectedKey() === "1" ? "#5746b6" : "",
          }}
        >
          <Link
            to="/admin"
            style={{ fontSize: theme.fontSize.md, color: "#fff" }}
          >
            ภาพรวม
          </Link>
        </Menu.Item>
        <Menu.Item
          key="2"
          icon={
            <FileTextOutlined
              style={{ fontSize: theme.fontSize.xl, color: "#fff" }}
            />
          }
          style={{
            margin: `${theme.spacing.sm} ${theme.spacing.md}`,
            borderRadius: theme.borderRadius.md,
            height: "48px",
            lineHeight: "48px",
            color: theme.primary,
            background: getSelectedKey() === "2" ? "#5746b6" : "",
          }}
        >
          <Link
            to="/admin/work"
            style={{ fontSize: theme.fontSize.md, color: "#fff" }}
          >
            ตรวจสอบภาระงาน
          </Link>
        </Menu.Item>
        <Menu.Item
          key="3"
          icon={
            <SettingOutlined
              style={{ fontSize: theme.fontSize.xl, color: "#fff" }}
            />
          }
          style={{
            margin: `${theme.spacing.sm} ${theme.spacing.md}`,
            borderRadius: theme.borderRadius.md,
            height: "48px",
            lineHeight: "48px",
            color: theme.primary,
            background: getSelectedKey() === "3" ? "#5746b6" : "",
          }}
        >
          <Link
            to="/admin/config"
            style={{ fontSize: theme.fontSize.md, color: "#fff" }}
          >
            ตั่งค่าระบบภาระงาน
          </Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default DeanNavbar;
