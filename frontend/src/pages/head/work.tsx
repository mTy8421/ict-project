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
import DeanHeader from "../../components/head/Header";
import DeanNavbar from "../../components/head/Navbar";
import ReHeader from "../../components/head/NavbarHeader";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;

interface Workload {
  id: number;
  // title: string;
  department: string;
  assignee: string;
  status: "pending" | "in_progress" | "completed";
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

const HeadWork: React.FC = () => {
  const navigate = useNavigate();
  const [workloads, setWorkloads] = useState<Workload[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState();

  const fetchWorkloads = async () => {
    try {
      const response = await axiosInstance.get(`/work`);
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
      dataIndex: "options",
      key: "options",
      render: (text: any) => (
        <Text strong style={{ color: theme.primary }}>
          {text.title}
        </Text>
      ),
    },
    {
      title: "ชื่อผู้ใช้",
      dataIndex: "user",
      key: "user",
      render: (text: any) => (
        <Text strong style={{ color: theme.primary }}>
          {text.user_name}
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
    {
      title: "วันที่สิ้นสุด",
      dataIndex: "dateTimeEnd",
      key: "dateTimeEnd",
      // dataIndex: "end_date",
      // key: "end_date",
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
              onClick={() => navigate(`/user/head/detail/${record.id}`)}
              style={{ color: theme.primary }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filteredWorkloads = workloads.filter((workload) => {
    const matchesSearch =
      (workload.options.title?.toLowerCase() || "").includes(
        searchText.toLowerCase(),
      ) ||
      (workload.department?.toLowerCase() || "").includes(
        searchText.toLowerCase(),
      ) ||
      (workload.assignee?.toLowerCase() || "").includes(
        searchText.toLowerCase(),
      );

    const matchesDate =
      !dateRange ||
      (workload.dateTimeEnd?.toString() || "").includes(dateRange as any);

    const matchesStatus =
      statusFilter.length === 0 || statusFilter.includes(workload.status);
    const matchesPriority =
      priorityFilter.length === 0 ||
      priorityFilter.includes(workload.options.priority);

    // const matchesDate =
    //   !dateRange || new Date(workload.dateTimeEnd) == new Date(dateRange);
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
                      จัดการภาระงาน
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
                  <Col
                    xs={24}
                    sm={8}
                    style={{ paddingBottom: theme.spacing.md }}
                  >
                    <Search
                      placeholder="ค้นหาภาระงาน..."
                      allowClear
                      onSearch={setSearchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      style={{ width: "100%" }}
                    />
                  </Col>
                  <Col
                    xs={24}
                    sm={8}
                    style={{ paddingBottom: theme.spacing.md }}
                  >
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
                  <Col
                    xs={24}
                    sm={8}
                    style={{ paddingBottom: theme.spacing.md }}
                  >
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
                    <Select
                      style={{ width: "100%" }}
                      placeholder="กรองตามวันที่"
                      onChange={(dates) => setDateRange(dates)}
                    >
                      {workloads.map((val) => (
                        <Select.Option value={val.dateTimeEnd}>
                          {val.dateTimeEnd}
                        </Select.Option>
                      ))}
                    </Select>
                    {/* <DatePicker */}
                    {/*   style={{ width: "100%" }} */}
                    {/*   onChange={(dates) => { */}
                    {/*     if (dates) { */}
                    {/*       setDateRange(dates.toString() as any); */}
                    {/*     } else { */}
                    {/*       setDateRange(undefined); */}
                    {/*     } */}
                    {/*   }} */}
                    {/* /> */}
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

              <Card
                style={{
                  borderRadius: theme.borderRadius.lg,
                  boxShadow: theme.shadow,
                  background: theme.white,
                }}
              ></Card>
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
                      จัดการภาระงาน
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
                  <Col
                    xs={24}
                    sm={8}
                    style={{ paddingBottom: theme.spacing.md }}
                  >
                    <Search
                      placeholder="ค้นหาภาระงาน..."
                      allowClear
                      onSearch={setSearchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      style={{ width: "100%" }}
                    />
                  </Col>
                  <Col
                    xs={24}
                    sm={8}
                    style={{ paddingBottom: theme.spacing.md }}
                  >
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
                  <Col
                    xs={24}
                    sm={8}
                    style={{ paddingBottom: theme.spacing.md }}
                  >
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
                    <Select
                      style={{ width: "100%" }}
                      placeholder="กรองตามวันที่"
                      onChange={(dates) => setDateRange(dates)}
                    >
                      {workloads.map((val) => (
                        <Select.Option value={val.dateTimeEnd}>
                          {val.dateTimeEnd}
                        </Select.Option>
                      ))}
                    </Select>
                    {/* <DatePicker */}
                    {/*   style={{ width: "100%" }} */}
                    {/*   onChange={(dates) => { */}
                    {/*     if (dates) { */}
                    {/*       setDateRange(dates.toString() as any); */}
                    {/*     } else { */}
                    {/*       setDateRange(undefined); */}
                    {/*     } */}
                    {/*   }} */}
                    {/* /> */}
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

export default HeadWork;
