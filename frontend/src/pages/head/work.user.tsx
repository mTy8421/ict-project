import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  Typography,
  Layout,
  Button,
  Row,
  Col,
  Table,
  Tag,
  Space,
  Input,
  Select,
  Tooltip,
  message,
} from "antd";
import { EyeOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import axiosInstance from "../../utils/axios";
import theme from "../../theme";

import DeanHeader from "../../components/head/Header";
import DeanNavbar from "../../components/head/Navbar";
import ReHeader from "../../components/head/NavbarHeader";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

interface Workload {
  id: number;
  department: string;
  assignee: string;
  status: "pending" | "not_completed" | "completed";
  startTime: string;
  options: any;
}

const HeadWorkUser: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workloads, setWorkloads] = useState<Workload[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);

  const fetchWorkloads = async () => {
    try {
      const response = await axiosInstance.get(`/work/head/${id}`);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return theme.warning;
      case "not_completed":
        return theme.danger;
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
      title: "ระยะเวลาที่ใช้",
      dataIndex: "startTime",
      key: "dateCount",
      render: (startTime: string) => {
        if (!startTime) return "-";
        const [hours, minutes] = startTime.split(":").map(Number);
        if (minutes > 0) return `${hours} ชั่วโมง ${minutes} นาที`;
        return `${hours} ชั่วโมง`;
      },
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
              onClick={() =>
                navigate(`/head/work/detail/${record.id}?uid=${id}`)
              }
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

    const matchesStatus =
      statusFilter.length === 0 || statusFilter.includes(workload.status);
    const matchesPriority =
      priorityFilter.length === 0 ||
      priorityFilter.includes(workload.options.priority);

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // if (loading) {
  //   return (
  //     <div
  //       style={{
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         height: "100vh",
  //         background: theme.background,
  //       }}
  //     >
  //       <div style={{ textAlign: "center" }}>
  //         <SyncOutlined
  //           spin
  //           style={{ fontSize: "48px", color: theme.accent }}
  //         />
  //         <p
  //           style={{
  //             marginTop: theme.spacing.md,
  //             fontSize: theme.fontSize.md,
  //             color: theme.textLight,
  //           }}
  //         >
  //           กำลังโหลดข้อมูล...
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

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
                <Button
                  type="link"
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate(`/head/work/`)}
                  style={{
                    padding: 0,
                    marginBottom: theme.spacing.md,
                    color: theme.primary,
                    fontSize: theme.fontSize.md,
                    height: "auto",
                    display: "flex",
                    alignItems: "center",
                    gap: theme.spacing.sm,
                  }}
                >
                  กลับไปหน้ารายการ
                </Button>
                <Title
                  level={3}
                  style={{
                    margin: 0,
                    color: theme.primary,
                    fontWeight: theme.fontWeight.semibold,
                    fontSize: theme.fontSize.xxl,
                    letterSpacing: "0.5px",
                  }}
                >
                  อนุมัติภาระงาน
                </Title>
                <Text
                  style={{
                    color: theme.textLight,
                    marginTop: theme.spacing.sm,
                    display: "block",
                    fontSize: theme.fontSize.md,
                  }}
                >
                  ข้อมูลรายละเอียดภาระงานภาระงาน
                </Text>
              </div>

              <Card
                style={{
                  borderRadius: theme.borderRadius.lg,
                  boxShadow: theme.shadow,
                  background: theme.white,
                  marginBottom: theme.spacing.xl,
                }}
                styles={{ body: { padding: theme.spacing.xl } }}
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
                        { label: "ไม่อนุมัติ", value: "not_completed" },
                        { label: "อนุมัติ", value: "completed" },
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
                </Row>
              </Card>

              <Card
                style={{
                  borderRadius: theme.borderRadius.lg,
                  boxShadow: theme.shadow,
                  background: theme.white,
                }}
                styles={{ body: { padding: theme.spacing.xl } }}
              >
                <div style={{ width: "100%", overflowX: "auto" }}>
                  <Table
                    columns={columns}
                    dataSource={filteredWorkloads}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                      // pageSize: 10,
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
                styles={{ body: { padding: theme.spacing.xl } }}
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
                  <Col span={24} style={{ paddingBottom: theme.spacing.md }}>
                    <Select
                      mode="multiple"
                      placeholder="กรองตามสถานะ"
                      style={{ width: "100%" }}
                      onChange={setStatusFilter}
                      options={[
                        { label: "รอดำเนินการ", value: "pending" },
                        { label: "ไม่อนุมัติ", value: "not_completed" },
                        { label: "อนุมัติ", value: "completed" },
                      ]}
                    />
                  </Col>
                  <Col span={24} style={{ paddingBottom: theme.spacing.md }}>
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
                </Row>
              </Card>

              <Card
                style={{
                  borderRadius: theme.borderRadius.lg,
                  boxShadow: theme.shadow,
                  background: theme.white,
                }}
                styles={{ body: { padding: theme.spacing.xl } }}
              >
                <div style={{ width: "100%", overflowX: "auto" }}>
                  <Table
                    columns={columns}
                    dataSource={filteredWorkloads}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                      // pageSize: 10,
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

export default HeadWorkUser;
