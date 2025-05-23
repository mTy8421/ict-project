import React from "react";
import { Layout, Typography, Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import theme from "../../theme";

const { Header } = Layout;
const { Title } = Typography;

interface ViceDeanHeaderProps {
  role: string;
}

const ViceDeanHeader: React.FC<ViceDeanHeaderProps> = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%",
        height: "70px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: `0 ${theme.spacing.xl}`,
        // background: theme.primary,
        background: "#fff",
        boxShadow: theme.shadow,
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src="/up-logo.jpg"
          alt="Logo"
          style={{
            height: "40px",
            marginRight: theme.spacing.md,
            borderRadius: theme.borderRadius.md,
          }}
        />
        <Title
          level={4}
          style={{
            // color: theme.white,
            color: "#000",
            margin: 0,
            fontWeight: theme.fontWeight.semibold,
          }}
        >
          Support Staff Workload - System ICT
        </Title>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: theme.spacing.md,
        }}
      >
        <span
          style={{
            // color: theme.white,
            color: "#000",
          }}
        >
          {role}
        </span>
        <Button
          type="text"
          icon={<LogoutOutlined style={{ color: "#000" }} />}
          onClick={handleLogout}
          style={{
            // color: theme.white,
            color: "#000",
            display: "flex",
            alignItems: "center",
            gap: theme.spacing.sm,
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            borderRadius: theme.borderRadius.md,
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          ออกจากระบบ
        </Button>
      </div>
    </Header>
  );
};

export default ViceDeanHeader;
