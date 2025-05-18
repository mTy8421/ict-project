import React from "react";
import { Layout, Typography, Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { logout } from "../../pages/home/home";
import theme from "../../theme";

const { Header } = Layout;
const { Title } = Typography;

interface Props {
  name: string;
}

const DeanHeader: React.FC<Props> = ({ name }) => {
  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        // background: theme.headerBg,
        background: "#fff",
        padding: `0 ${theme.spacing.xl}`,
        boxShadow: theme.shadowLarge,
        position: "sticky",
        top: 0,
        zIndex: theme.zIndex.header,
        height: "70px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src="/up-logo.jpg"
          alt="Logo"
          style={{
            height: "45px",
            width: "45px",
            marginRight: theme.spacing.lg,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <Title
          level={4}
          style={{
            margin: 0,
            // color: theme.white,
            color: "#000",
            fontWeight: theme.fontWeight.semibold,
          }}
        >
          ระบบจัดการภาระงานพนักงาน
        </Title>
      </div>
      <div
        style={{ display: "flex", alignItems: "center", gap: theme.spacing.lg }}
      >
        <span
          style={{
            // color: theme.white,
            color: "#000",
            fontSize: theme.fontSize.md,
          }}
        >
          admin : {name}
        </span>
        <Button
          type="text"
          icon={<LogoutOutlined style={{ color: "#000" }} />}
          onClick={logout}
          style={{
            fontSize: theme.fontSize.md,
            // color: theme.white,
            color: "#000",
            height: "40px",
            padding: `0 ${theme.spacing.md}`,
            display: "flex",
            alignItems: "center",
            gap: theme.spacing.sm,
            borderRadius: theme.borderRadius.md,
            transition: theme.transition.default,
          }}
        >
          ออกจากระบบ
        </Button>
      </div>
    </Header>
  );
};

export default DeanHeader;
