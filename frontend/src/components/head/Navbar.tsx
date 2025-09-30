import React from "react";
import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  FileTextOutlined,
  BarChartOutlined,
  HistoryOutlined,
  SnippetsOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import theme from "../../theme";

const { Sider } = Layout;

const DeanNavbar: React.FC = () => {
  const location = useLocation();

  const getSelectedKey = () => {
    if (location.pathname === "/head") return "1";
    if (location.pathname.startsWith("/head/work")) return "2";
    if (location.pathname.startsWith("/head/_workload")) return "3";
    if (location.pathname.startsWith("/head/history")) return "4";
    if (location.pathname.startsWith("/head/chart")) return "5";
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
            to="/head"
            style={{ fontSize: theme.fontSize.md, color: "#fff" }}
          >
            ภาพรวม
          </Link>
        </Menu.Item>
        <Menu.Item
          key="2"
          icon={
            <CheckOutlined
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
            to="/head/work"
            style={{ fontSize: theme.fontSize.md, color: "#fff" }}
          >
            อนุมัติภาระงาน
          </Link>
        </Menu.Item>
        <Menu.Item
          key="3"
          icon={
            <SnippetsOutlined
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
            to="/head/_workload"
            style={{ fontSize: theme.fontSize.md, color: "#fff" }}
          >
            จัดการภาระงาน
          </Link>
        </Menu.Item>
        <Menu.Item
          key="4"
          icon={
            <HistoryOutlined
              style={{ fontSize: theme.fontSize.xl, color: "#fff" }}
            />
          }
          style={{
            margin: `${theme.spacing.sm} ${theme.spacing.md}`,
            borderRadius: theme.borderRadius.md,
            height: "48px",
            lineHeight: "48px",
            color: theme.primary,
            background: getSelectedKey() === "4" ? "#5746b6" : "",
          }}
        >
          <Link
            to="/head/history"
            style={{ fontSize: theme.fontSize.md, color: "#fff" }}
          >
            ประวัติภาระงาน
          </Link>
        </Menu.Item>
        <Menu.Item
          key="5"
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
            background: getSelectedKey() === "5" ? "#5746b6" : "",
          }}
        >
          <Link
            to="/head/chart"
            style={{ fontSize: theme.fontSize.md, color: "#fff" }}
          >
            สรุปผลภาระงาน
          </Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default DeanNavbar;
