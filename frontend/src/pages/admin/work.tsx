import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Layout,
  Menu,
  Button,
  Row,
  Col,
  Table,
  Tag,
  Space,
  Input,
  Select,
  DatePicker,
  Tooltip,
  Modal,
  message,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  SyncOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  AreaChartOutlined,
} from "@ant-design/icons";
import axiosInstance from "../../utils/axios";
import { logout } from "../home/home";
import theme from "../../theme";
import {
  UserOutlined,
  FileTextOutlined,
  BarChartOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import DeanHeader from "../../components/admin/Header";
import DeanNavbar from "../../components/admin/Navbar";
import ReHeader from "../../components/admin/NavbarHeader";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;

interface Workload {
  id: number;
  // title: string;
  department: string;
  assignee: string;
  status: "pending" | "not_completed" | "completed";
  // priority: "low" | "medium" | "high";
  dateTimeStart: string;
  dateTimeEnd: string;
  options: any;
  user: any;
}

interface User {
  user_id: number;
  user_name: string;
  user_role: string;
}

const AdminWork: React.FC = () => {
  const navigate = useNavigate();
  const [workloads, setWorkloads] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState();

  const fetchWorkloads = async () => {
    try {
      const response = await axiosInstance.get(`/user/head`);
      setWorkloads(response.data);
    } catch (error) {
      console.error("Error fetching workloads:", error);
      message.error("ไม่สามารถดึงข้อมูลภาระงานได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkloads();
  }, []);

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: "ยืนยันการลบ",
      content: "คุณต้องการลบภาระงานนี้ใช่หรือไม่?",
      okText: "ยืนยัน",
      cancelText: "ยกเลิก",
      centered: true,
      onOk: async () => {
        try {
          await axiosInstance.delete(`/work/${id}`);
          message.success("ลบภาระงานสำเร็จ");
          fetchWorkloads();
        } catch (error) {
          console.error("Error deleting workload:", error);
          message.error("ไม่สามารถลบภาระงานได้");
        }
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return theme.warning;
      case "not_completed":
        return theme.accent;
      case "completed":
        return theme.success;
      default:
        return theme.textLight;
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

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "รอดำเนินการ";
      case "not_completed":
        return "ไม่อนุมัติ";
      case "completed":
        return "อนุมัติ";
      default:
        return status;
    }
  };

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

  const columns = [
    {
      title: "ชื่อผู้ใช้",
      dataIndex: "user_name",
      key: "user_name",
      render: (text: any) => (
        <Text strong style={{ color: theme.primary }}>
          {text}
        </Text>
      ),
    },
    {
      title: "จัดการ",
      key: "action",
      render: (record: User) => (
        <Space size="middle">
          <Tooltip title="ดูรายละเอียด">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/admin/work/user/${record.user_id}`)}
              style={{ color: theme.primary }}
            />
          </Tooltip>
          <Tooltip title="ภาพรวม">
            <Button
              type="text"
              icon={<AreaChartOutlined />}
              onClick={() =>
                navigate(`/admin/work/user/status/${record.user_id}`)
              }
              style={{ color: theme.primary }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filteredWorkloads = workloads.filter((workload) => {
    const matchesSearch = (workload.user_name?.toLowerCase() || "").includes(
      searchText.toLowerCase()
    );

    return matchesSearch;
  });

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
        <DeanHeader />
      </div>

      <div className="md:hidden">
        <ReHeader />
      </div>
      <Layout style={{ height: "calc(100vh - 70px)" }}>
        <div className="hidden md:block">
          <DeanNavbar />
        </div>
        <Layout style={{ padding: theme.spacing.xl, overflow: "auto" }}>
          <div className="hidden md:block max-w-[1200px]">
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
                <div>
                  <div>
                    <Title
                      level={3}
                      style={{
                        margin: 0,
                        color: theme.primary,
                        fontWeight: theme.fontWeight.semibold,
                      }}
                    >
                      อนุมัติภาระงาน
                    </Title>
                    <Text
                      style={{
                        color: theme.textLight,
                        marginTop: theme.spacing.sm,
                        display: "block",
                      }}
                    >
                      ดูและจัดการภาระงานทั้งหมด
                    </Text>
                  </div>
                </div>
              </div>

              <Card
                style={{
                  borderRadius: theme.borderRadius.lg,
                  boxShadow: theme.shadow,
                  background: theme.white,
                  marginBottom: theme.spacing.xl,
                }}
                bodyStyle={{ padding: theme.spacing.xl }}
              >
                <Row gutter={[24, 24]} align="middle">
                  <Col span={24} style={{ paddingBottom: theme.spacing.md }}>
                    <Search
                      placeholder="ค้นหาผู้ใช้งาน..."
                      allowClear
                      onSearch={setSearchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      style={{ width: "100%" }}
                    />
                  </Col>
                </Row>
              </Card>

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
                    dataSource={filteredWorkloads}
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
                <div>
                  <div>
                    <Title
                      level={3}
                      style={{
                        margin: 0,
                        color: theme.primary,
                        fontWeight: theme.fontWeight.semibold,
                      }}
                    >
                      อนุมัติภาระงาน
                    </Title>
                    <Text
                      style={{
                        color: theme.textLight,
                        marginTop: theme.spacing.sm,
                        display: "block",
                      }}
                    >
                      ดูและจัดการภาระงานทั้งหมด
                    </Text>
                  </div>
                </div>
              </div>

              <Card
                style={{
                  borderRadius: theme.borderRadius.lg,
                  boxShadow: theme.shadow,
                  background: theme.white,
                  marginBottom: theme.spacing.xl,
                }}
                bodyStyle={{ padding: theme.spacing.xl }}
              >
                <Row gutter={[24, 24]} align="middle">
                  <Col span={24} style={{ paddingBottom: theme.spacing.md }}>
                    <Search
                      placeholder="ค้นหาผู้ใช้งาน..."
                      allowClear
                      onSearch={setSearchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      style={{ width: "100%" }}
                    />
                  </Col>
                </Row>
              </Card>

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
                    dataSource={filteredWorkloads}
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

export default AdminWork;
