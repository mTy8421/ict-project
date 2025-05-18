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
import DeanHeader from "../../components/user/Header";
import DeanNavbar from "../../components/user/Navbar";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;

interface Workload {
  id: number;
  title: string;
  department: string;
  assignee: string;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  start_date: string;
  end_date: string;
  created_at: string;
}

const UserHistory: React.FC = () => {
  const navigate = useNavigate();
  const [workloads, setWorkloads] = useState<Workload[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  const fetchWorkloads = async () => {
    try {
      const response = await axiosInstance.get("/workload");
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
      onOk: async () => {
        try {
          await axiosInstance.delete(`/workload/${id}`);
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
      case "in_progress":
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
      case "in_progress":
        return "กำลังดำเนินการ";
      case "completed":
        return "เสร็จสิ้น";
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
      title: "หัวข้อ",
      dataIndex: "title",
      key: "title",
      render: (text: string) => (
        <Text strong style={{ color: theme.primary }}>
          {text}
        </Text>
      ),
    },

    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={getStatusColor(status)}
          style={{
            padding: "4px 8px",
            borderRadius: theme.borderRadius.sm,
            fontSize: theme.fontSize.sm,
          }}
        >
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: "ความสำคัญ",
      dataIndex: "priority",
      key: "priority",
      render: (priority: string) => (
        <Tag
          color={getPriorityColor(priority)}
          style={{
            padding: "4px 8px",
            borderRadius: theme.borderRadius.sm,
            fontSize: theme.fontSize.sm,
          }}
        >
          {getPriorityText(priority)}
        </Tag>
      ),
    },
    {
      title: "วันที่เริ่มต้น",
      dataIndex: "start_date",
      key: "start_date",
      render: (date: string) => new Date(date).toLocaleDateString("th-TH"),
    },
    {
      title: "วันที่สิ้นสุด",
      dataIndex: "end_date",
      key: "end_date",
      render: (date: string) => new Date(date).toLocaleDateString("th-TH"),
    },
    {
      title: "จัดการ",
      key: "action",
      render: (record: Workload) => (
        <Space size="middle">
          <Tooltip title="ดูรายละเอียด">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/dean/workload/${record.id}`)}
              style={{ color: theme.primary }}
            />
          </Tooltip>
          {/* <Tooltip title="แก้ไข">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/dean/workload/${record.id}/edit`)}
              style={{ color: theme.primary }}
            />
          </Tooltip>
          <Tooltip title="ลบ">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip> */}
        </Space>
      ),
    },
  ];

  const filteredWorkloads = workloads.filter((workload) => {
    const matchesSearch =
      workload.title.toLowerCase().includes(searchText.toLowerCase()) ||
      workload.department.toLowerCase().includes(searchText.toLowerCase()) ||
      workload.assignee.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus =
      statusFilter.length === 0 || statusFilter.includes(workload.status);
    const matchesPriority =
      priorityFilter.length === 0 || priorityFilter.includes(workload.priority);

    const matchesDate =
      !dateRange ||
      (new Date(workload.start_date) >= new Date(dateRange[0]) &&
        new Date(workload.end_date) <= new Date(dateRange[1]));

    return matchesSearch && matchesStatus && matchesPriority && matchesDate;
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
      <DeanHeader name="test" />
      <Layout style={{ height: "calc(100vh - 70px)" }}>
        <DeanNavbar />
        <Layout style={{ padding: theme.spacing.xl, overflow: "auto" }}>
          <Content style={{ maxWidth: "1200px", margin: "0 auto" }}>
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
                  display: "flex",
                  justifyContent: "center",
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
                    ประวัติภาระงาน
                  </Title>
                  <Text
                    style={{
                      color: theme.textLight,
                      marginTop: theme.spacing.sm,
                      display: "block",
                    }}
                  >
                    ดูประวัติภาระงานภาระงานทั้งหมด
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
                <Col xs={24} sm={8} style={{ paddingBottom: theme.spacing.md }}>
                  <Search
                    placeholder="ค้นหาภาระงาน..."
                    allowClear
                    onSearch={setSearchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: "100%" }}
                  />
                </Col>
                <Col xs={24} sm={8} style={{ paddingBottom: theme.spacing.md }}>
                  <Select
                    mode="multiple"
                    placeholder="กรองตามสถานะ"
                    style={{ width: "100%" }}
                    onChange={setStatusFilter}
                    options={[
                      { label: "รอดำเนินการ", value: "pending" },
                      { label: "กำลังดำเนินการ", value: "in_progress" },
                      { label: "เสร็จสิ้น", value: "completed" },
                    ]}
                  />
                </Col>
                <Col xs={24} sm={8} style={{ paddingBottom: theme.spacing.md }}>
                  <Select
                    mode="multiple"
                    placeholder="กรองตามความสำคัญ"
                    style={{ width: "100%" }}
                    onChange={setPriorityFilter}
                    options={[
                      { label: "สูง", value: "high" },
                      { label: "ปานกลาง", value: "medium" },
                      { label: "ต่ำ", value: "low" },
                    ]}
                  />
                </Col>
                <Col
                  xs={24}
                  sm={12}
                  style={{ paddingBottom: theme.spacing.md }}
                >
                  <RangePicker
                    style={{ width: "100%" }}
                    onChange={(dates) => {
                      if (dates) {
                        setDateRange([
                          dates[0]?.toISOString() || "",
                          dates[1]?.toISOString() || "",
                        ]);
                      } else {
                        setDateRange(null);
                      }
                    }}
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
              />
            </Card>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default UserHistory;
