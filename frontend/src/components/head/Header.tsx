import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Button,
  message,
  Space,
  Badge,
  Avatar,
  Modal,
  Table,
  Tag,
} from "antd";
import { LogoutOutlined, MailOutlined } from "@ant-design/icons";
import { logout } from "../../pages/home/home";
import theme from "../../theme";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axios";

const { Header } = Layout;
const { Title, Text } = Typography;

interface User {
  user_id: number;
  user_name: string;
  user_role: string;
}

interface Workload {
  id: number;
  department: string;
  assignee: string;
  status: "pending" | "not_completed" | "completed";
  dateTimeStart: string;
  dateTimeEnd: string;
  dateTimeNow: string;
  options: any;
}

const DeanHeader: React.FC = () => {
  const [profile, setProfile] = useState<User | undefined>();
  const [isMailHovered, setIsMailHovered] = useState(false);
  const navigate = useNavigate();
  const [workloads, setWorkloads] = useState<Workload[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

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

  const fetchWorkloads = async () => {
    try {
      const response = await axiosInstance.get(`/work/user`);
      setWorkloads(response.data);
    } catch (error) {
      console.error("Error fetching workloads:", error);
      message.error("ไม่สามารถดึงข้อมูลภาระงานได้");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchWorkloads();
  }, []);

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "สูง";
      case "medium":
        return "ปานกลาง";
      case "low":
        return "ต่ำ";
      default:
        return priority;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return theme.danger;
      case "medium":
        return theme.warning;
      case "low":
        return theme.success;
      default:
        return theme.textLight;
    }
  };

  const notCompletedWorkloads = workloads.filter(
    (workload) => workload.status === "not_completed"
  );

  const columns = [
    {
      title: "หัวข้อ",
      dataIndex: "options",
      key: "options",
      render: (text: any) => (
        <Text strong style={{ color: theme.primary }}>
          {text.title}
        </Text>
      ),
    },
    {
      title: "ระดับความเร่งด่วน",
      dataIndex: "options",
      key: "options",
      render: (priority: any) => (
        <Tag
          color={getPriorityColor(priority.priority)}
          style={{
            padding: "4px 8px",
            borderRadius: theme.borderRadius.sm,
            fontSize: theme.fontSize.sm,
          }}
        >
          {getPriorityText(priority.priority)}
        </Tag>
      ),
    },
  ];

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
            color: "#000",
            fontSize: theme.fontSize.md,
          }}
        >
          {profile?.user_name} : {profile?.user_role}
        </span>

        <Space>
          <Badge
            count={notCompletedWorkloads ? notCompletedWorkloads.length : 0}
            size="small"
            offset={[-2, 2]}
          >
            <div
              onMouseEnter={() => setIsMailHovered(true)}
              onMouseLeave={() => setIsMailHovered(false)}
              style={{ display: "inline-block" }}
            >
              <Avatar
                onClick={showModal}
                style={{
                  backgroundColor: isMailHovered ? "#f0f0f0" : "#fff",
                  color: "#000",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                }}
                icon={<MailOutlined />}
              />
            </div>
          </Badge>
        </Space>

        <Modal
          title="ภาระงานที่ไม่อนุมัติ"
          closable={{ "aria-label": "Custom Close Button" }}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <Table
            dataSource={notCompletedWorkloads}
            columns={columns}
            pagination={{
              pageSize: 10,
              // showSizeChanger: true,
              showTotal: (total) => `ทั้งหมด ${total} รายการ`,
            }}
            scroll={{ x: "max-content" }}
          />
        </Modal>

        <Button
          type="text"
          icon={<LogoutOutlined style={{ color: "#000" }} />}
          onClick={logout}
          style={{
            fontSize: theme.fontSize.md,
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
