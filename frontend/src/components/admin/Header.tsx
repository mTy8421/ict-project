import React, { useEffect, useState } from "react";
import { Layout, Typography, Button, message } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { logout } from "../../pages/home/home";
import theme from "../../theme";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axios";

const { Header } = Layout;
const { Title } = Typography;

interface User {
  user_id: number;
  user_name: string;
  user_role: string;
}

const DeanHeader: React.FC = () => {
  const [profile, setProfile] = useState<User | undefined>();
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/user/profile");
      setProfile(response.data);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      if (error.response?.status === 401) {
        message.error("กรุณาเข้าสู่ระบบใหม่");
        navigate("/");
      } else {
        message.error("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
          Support Staff Workload - System ICT
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
          {profile?.user_name} : {profile?.user_role}
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
