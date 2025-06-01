import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Layout,
  Button,
  Table,
  Space,
  Input,
  Tooltip,
  Modal,
  message,
} from "antd";
import {
  SyncOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axiosInstance from "../../utils/axios";
import theme from "../../theme";
import DeanHeader from "../../components/admin/Header";
import DeanNavbar from "../../components/admin/Navbar";
import ReHeader from "../../components/admin/NavbarHeader";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

interface User {
  user_id: number;
  user_name: string;
  user_email: string;
  user_role: string;
}

interface Profile {
  user_id: number;
  user_name: string;
  user_email: string;
  user_role: string;
  // add other fields if needed
}

const AdminConfig: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState<Profile | null>(null);

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get("/user/profile");
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/user");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: "ยืนยันการลบ",
      content: "คุณต้องการลบผู้ใช้นี้ใช่หรือไม่?",
      okText: "ยืนยัน",
      cancelText: "ยกเลิก",
      onOk: async () => {
        try {
          await axiosInstance.delete(`/user/${id}`);
          message.success("ลบผู้ใช้สำเร็จ");
          fetchUsers();
        } catch (error) {
          console.error("Error deleting user:", error);
          message.error("ไม่สามารถลบผู้ใช้ได้");
        }
      },
    });
  };

  const columns = [
    {
      title: "หัวข้อ",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      title: "จัดการ",
      key: "action",
      render: (record: User) => (
        <Space size="middle">
          <Tooltip title="แก้ไข">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/admin/user/${record.user_id}/edit`)}
              style={{ color: theme.primary }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: theme.background,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <SyncOutlined
            spin
            style={{ fontSize: "48px", color: theme.accent }}
          />
          <p
            style={{
              marginTop: theme.spacing.md,
              fontSize: theme.fontSize.md,
              color: theme.textLight,
            }}
          >
            กำลังโหลดข้อมูล...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh", background: theme.background }}>
      <div className="hidden md:block">
        <DeanHeader name={profile?.user_name || ""} />
      </div>

      <div className="md:hidden">
        <ReHeader />
      </div>

      <Layout style={{ height: "calc(100vh - 70px)" }}>
        <div className="hidden md:block">
          <DeanNavbar />
        </div>

        <Layout style={{ padding: theme.spacing.xl, overflow: "auto" }}>
          <div className="hidden md:block">
            <Content style={{ maxWidth: "1200px", margin: "0 15%" }}>
              <div
                style={{
                  marginBottom: theme.spacing.xl,
                  background: theme.white,
                  padding: theme.spacing.xl,
                  borderRadius: theme.borderRadius.lg,
                  boxShadow: theme.shadow,
                }}
              >
                <div
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <Title
                      level={3}
                      style={{
                        margin: 0,
                        color: theme.primary,
                        fontWeight: theme.fontWeight.semibold,
                      }}
                    >
                      ตั่งค่าระบบ
                    </Title>
                    <Text
                      style={{
                        color: theme.textLight,
                        marginTop: theme.spacing.sm,
                        display: "block",
                      }}
                    >
                      ปรับแต่งตั่งค่าระบบ
                    </Text>
                  </div>
                </div>
              </div>

              <Card
                style={{
                  borderRadius: theme.borderRadius.lg,
                  boxShadow: theme.shadow,
                  background: theme.white,
                }}
                bodyStyle={{ padding: theme.spacing.xl }}
              >
                <Table
                  columns={columns}
                  dataSource={users}
                  rowKey="id"
                  loading={loading}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `ทั้งหมด ${total} รายการ`,
                  }}
                />
              </Card>
            </Content>
          </div>

          <div className="md:hidden">
            <Content style={{ width: "100%", margin: "0 auto" }}>
              <div
                style={{
                  marginBottom: theme.spacing.xl,
                  background: theme.white,
                  padding: theme.spacing.xl,
                  borderRadius: theme.borderRadius.lg,
                  boxShadow: theme.shadow,
                }}
              >
                <div
                // style={{
                //   display: "flex",
                //   justifyContent: "space-between",
                //   alignItems: "center",
                // }}
                >
                  <div>
                    <Title
                      level={3}
                      style={{
                        margin: 0,
                        color: theme.primary,
                        fontWeight: theme.fontWeight.semibold,
                      }}
                    >
                      จัดการผู้ใช้
                    </Title>
                    <Text
                      style={{
                        color: theme.textLight,
                        marginTop: theme.spacing.sm,
                        display: "block",
                      }}
                    >
                      ดูและจัดการผู้ใช้ทั้งหมดในระบบ
                    </Text>
                  </div>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate("/admin/work/new")}
                    style={{
                      background: theme.success,
                      borderColor: theme.success,
                      height: "45px",
                      padding: `0 ${theme.spacing.xl}`,
                      borderRadius: theme.borderRadius.md,
                      fontSize: theme.fontSize.md,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: theme.spacing.sm,
                      marginTop: "1rem",
                    }}
                  >
                    เพิ่มผู้ใช้
                  </Button>
                </div>
              </div>

              <Card
                style={{
                  borderRadius: theme.borderRadius.lg,
                  boxShadow: theme.shadow,
                  background: theme.white,
                }}
                bodyStyle={{ padding: theme.spacing.xl }}
              >
                <div style={{ width: "100%", overflowX: "auto" }}>
                  <Table
                    columns={columns}
                    dataSource={users}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showTotal: (total) => `ทั้งหมด ${total} รายการ`,
                    }}
                    scroll={{ x: "max-content" }}
                  />
                </div>
              </Card>
            </Content>
          </div>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminConfig;
