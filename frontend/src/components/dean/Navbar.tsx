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
    if (location.pathname === "/dean") return "1";
    if (location.pathname.startsWith("/dean/work")) return "2";
    if (location.pathname.startsWith("/dean/config/priority")) return "3";
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
                to="/dean"
                style={{ fontSize: theme.fontSize.md, color: "#fff" }}
              >
                ภาพรวมภาระงาน
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
        ]}
      />
    </Sider>
  );
};

export default DeanNavbar;
