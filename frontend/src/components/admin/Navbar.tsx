import React from "react";
import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  BarChartOutlined,
  CheckOutlined,
  FileTextOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import theme from "../../theme";

const { Sider } = Layout;

const DeanNavbar: React.FC = () => {
  const location = useLocation();

  const getSelectedKey = () => {
    if (location.pathname === "/admin") return "1";
    if (location.pathname.startsWith("/admin/work")) return "2";
    if (location.pathname.startsWith("/admin/config/priority")) return "3";
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
        items={[
          {
            key: "1",
            icon: (
              <UserOutlined
                style={{ fontSize: theme.fontSize.xl, color: "#fff" }}
              />
            ),
            label: (
              <Link
                to="/admin"
                style={{ fontSize: theme.fontSize.md, color: "#fff" }}
              >
                จัดการผู้ใช้
              </Link>
            ),
            style: {
              margin: `${theme.spacing.sm} ${theme.spacing.md}`,
              borderRadius: theme.borderRadius.md,
              height: "48px",
              lineHeight: "48px",
              color: theme.primary,
              background: getSelectedKey() === "1" ? "#5746b6" : "",
            },
          },
          {
            key: "2",
            icon: (
              <CheckOutlined
                style={{ fontSize: theme.fontSize.xl, color: "#fff" }}
              />
            ),
            label: (
              <Link
                to="/admin/work"
                style={{ fontSize: theme.fontSize.md, color: "#fff" }}
              >
                อนุมัติภาระงาน
              </Link>
            ),
            style: {
              margin: `${theme.spacing.sm} ${theme.spacing.md}`,
              borderRadius: theme.borderRadius.md,
              height: "48px",
              lineHeight: "48px",
              color: theme.primary,
              background: getSelectedKey() === "2" ? "#5746b6" : "",
            },
          },
          {
            key: "3",
            icon: (
              <SettingOutlined
                style={{ fontSize: theme.fontSize.xl, color: "#fff" }}
              />
            ),
            label: (
              <Link
                to="/admin/config/priority"
                style={{ fontSize: theme.fontSize.md, color: "#fff" }}
              >
                ตั่งค่าระดับความเร่งด่วน
              </Link>
            ),
            style: {
              margin: `${theme.spacing.sm} ${theme.spacing.md}`,
              borderRadius: theme.borderRadius.md,
              height: "48px",
              lineHeight: "48px",
              color: theme.primary,
              background: getSelectedKey() === "3" ? "#5746b6" : "",
            },
          },
        ]}
      />
    </Sider>
  );
};

export default DeanNavbar;
