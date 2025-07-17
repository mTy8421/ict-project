import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Button,
  message,
  type MenuProps,
  Menu,
  Grid,
  Dropdown,
} from "antd";
import {
  HistoryOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
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

type MenuItem = Required<MenuProps>["items"][number];

const { useBreakpoint } = Grid;

const ReHeader: React.FC = () => {
  const [profile, setProfile] = useState<User | undefined>();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const screens = useBreakpoint();

  // Menu items
  const items: MenuItem[] = [
    {
      key: "User",
      label: "ภาพรวม",
      icon: <HomeOutlined style={{ color: "#000" }} />,
      onClick: () => navigate("/head"),
    },
    {
      key: "Work",
      label: "อนุมัติภาระงาน",
      icon: <SnippetsOutlined style={{ color: "#000" }} />,
      onClick: () => navigate("/head/work"),
    },
    {
      key: "Workload",
      label: "จัดการภาระงาน",
      icon: <SnippetsOutlined style={{ color: "#000" }} />,
      onClick: () => navigate("/head/_workload"),
    },
    {
      key: "History",
      label: "ประวัติภาระงาน",
      icon: <HistoryOutlined style={{ color: "#000" }} />,
      onClick: () => navigate("/head/history"),
    },
    {
      key: "Logout",
      label: "ออกจากระบบ",
      icon: <LogoutOutlined style={{ color: "#000" }} />,
      onClick: logout,
    },
  ];
  //   End menu items

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

  const [current, setCurrent] = useState("");
  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
    setDrawerOpen(false); // Close drawer on menu click (mobile)
  };

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#fff",
        padding: `0 ${theme.spacing.xl}`,
        boxShadow: theme.shadowLarge,
        position: "sticky",
        top: 0,
        zIndex: theme.zIndex.header,
        height: "70px",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: theme.spacing.lg }}
      >
        <Title
          level={4}
          style={{
            margin: 0,
            color: "#000",
            fontWeight: theme.fontWeight.semibold,
          }}
        >
          Support Staff Workload - System ICT
        </Title>
        {/* Show horizontal menu on md+ screens */}
        {screens.md ? (
          <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={items}
            overflowedIndicator={<MenuOutlined style={{ color: "#000" }} />}
          />
        ) : (
          // Show dropdown menu on small screens
          <Dropdown
            menu={{
              items,
              onClick: onClick,
              selectedKeys: [current],
            }}
            trigger={["click"]}
            placement="bottomLeft"
          >
            <Button
              type="text"
              icon={<MenuOutlined style={{ fontSize: 24 }} />}
            />
          </Dropdown>
        )}
      </div>
    </Header>
  );
};

export default ReHeader;
