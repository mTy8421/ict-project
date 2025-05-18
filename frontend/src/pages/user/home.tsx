import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Layout,
  Row,
  Col,
  Statistic,
  Progress,
  List,
  Tag,
} from "antd";
import {
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axiosInstance from "../../utils/axios";
import theme from "../../theme";
import DeanHeader from "../../components/user/Header";
import DeanNavbar from "../../components/user/Navbar";

const { Content } = Layout;
const { Title, Text } = Typography;

interface Workload {
  id: number;
  title: string;
  department: string;
  assignee: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "completed";
  start_date: string;
  end_date: string;
}

const User: React.FC = () => {
  const navigate = useNavigate();
  const [workloads, setWorkloads] = useState<Workload[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkloads = async () => {
    try {
      const response = await axiosInstance.get("/workload");
      setWorkloads(response.data);
    } catch (error) {
      console.error("Error fetching workloads:", error);
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
        return "warning";
      case "in_progress":
        return "processing";
      case "completed":
        return "success";
      default:
        return "default";
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "green";
      default:
        return "default";
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

  const totalWorkloads = workloads.length;
  const completedWorkloads = workloads.filter(
    (w) => w.status === "completed"
  ).length;
  const inProgressWorkloads = workloads.filter(
    (w) => w.status === "in_progress"
  ).length;
  const pendingWorkloads = workloads.filter(
    (w) => w.status === "pending"
  ).length;

  const completionRate =
    totalWorkloads > 0 ? (completedWorkloads / totalWorkloads) * 100 : 0;

  const recentWorkloads = workloads
    .sort(
      (a, b) =>
        new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
    )
    .slice(0, 5);

  return (
    <Layout style={{ minHeight: "100vh", background: theme.background }}>
      <DeanHeader name="test" />
      <Layout style={{ height: "calc(100vh - 70px)" }}>
        <DeanNavbar />
        <Layout style={{ padding: theme.spacing.xl, overflow: "auto" }}>
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
              <Title
                level={3}
                style={{
                  margin: 0,
                  color: theme.primary,
                  fontWeight: theme.fontWeight.semibold,
                }}
              >
                ภาพรวมภาระงาน
              </Title>
              <Text
                style={{
                  color: theme.textLight,
                  marginTop: theme.spacing.sm,
                  display: "block",
                }}
              >
                สถานะภาระงานทั้งหมดในระบบ
              </Text>
            </div>

            <Row gutter={[24, 24]}>
              <Col xs={24} sm={8}>
                <Card
                  style={{
                    borderRadius: theme.borderRadius.lg,
                    boxShadow: theme.shadow,
                    background: theme.white,
                  }}
                  bodyStyle={{ padding: theme.spacing.xl }}
                >
                  <Statistic
                    title="ภาระงานทั้งหมด"
                    value={totalWorkloads}
                    prefix={
                      <FileTextOutlined style={{ color: theme.primary }} />
                    }
                    valueStyle={{ color: theme.primary }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card
                  style={{
                    borderRadius: theme.borderRadius.lg,
                    boxShadow: theme.shadow,
                    background: theme.white,
                  }}
                  bodyStyle={{ padding: theme.spacing.xl }}
                >
                  <Statistic
                    title="กำลังดำเนินการ"
                    value={inProgressWorkloads}
                    prefix={
                      <ClockCircleOutlined style={{ color: theme.primary }} />
                    }
                    valueStyle={{ color: theme.primary }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card
                  style={{
                    borderRadius: theme.borderRadius.lg,
                    boxShadow: theme.shadow,
                    background: theme.white,
                  }}
                  bodyStyle={{ padding: theme.spacing.xl }}
                >
                  <Statistic
                    title="เสร็จสิ้น"
                    value={completedWorkloads}
                    prefix={
                      <CheckCircleOutlined style={{ color: theme.primary }} />
                    }
                    valueStyle={{ color: theme.primary }}
                  />
                </Card>
              </Col>
            </Row>

            <div style={{ marginTop: theme.spacing.xl }}>
              <Card
                title="อัตราการเสร็จสิ้น"
                style={{
                  borderRadius: theme.borderRadius.lg,
                  boxShadow: theme.shadow,
                  background: theme.white,
                }}
                bodyStyle={{ padding: theme.spacing.xl }}
              >
                <Progress
                  type="circle"
                  percent={completionRate}
                  format={(percent) => `${percent?.toFixed(1)}%`}
                  width={200}
                  strokeColor={theme.primary}
                />
                <div style={{ marginTop: theme.spacing.lg }}>
                  <Text
                    strong
                    style={{
                      display: "block",
                      marginBottom: theme.spacing.sm,
                    }}
                  >
                    สรุปสถานะ
                  </Text>
                  <div
                    style={{
                      display: "flex",
                      gap: theme.spacing.lg,
                      justifyContent: "center",
                    }}
                  >
                    <div>
                      <Text type="secondary">รอดำเนินการ</Text>
                      <Text
                        strong
                        style={{ display: "block", color: theme.warning }}
                      >
                        {pendingWorkloads} รายการ
                      </Text>
                    </div>
                    <div>
                      <Text type="secondary">กำลังดำเนินการ</Text>
                      <Text
                        strong
                        style={{ display: "block", color: theme.primary }}
                      >
                        {inProgressWorkloads} รายการ
                      </Text>
                    </div>
                    <div>
                      <Text type="secondary">เสร็จสิ้น</Text>
                      <Text
                        strong
                        style={{ display: "block", color: theme.success }}
                      >
                        {completedWorkloads} รายการ
                      </Text>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div style={{ marginTop: theme.spacing.xl }}>
              <Card
                title="ภาระงานล่าสุด"
                style={{
                  borderRadius: theme.borderRadius.lg,
                  boxShadow: theme.shadow,
                  background: theme.white,
                }}
                bodyStyle={{ padding: theme.spacing.xl }}
              >
                <List
                  dataSource={recentWorkloads}
                  renderItem={(item) => (
                    <List.Item>
                      <div style={{ width: "100%" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Text strong>{item.title}</Text>
                          <Tag color={getStatusColor(item.status)}>
                            {getStatusText(item.status)}
                          </Tag>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: theme.spacing.sm,
                          }}
                        >
                          <Text type="secondary">{item.department}</Text>
                          <Tag color={getPriorityColor(item.priority)}>
                            {getPriorityText(item.priority)}
                          </Tag>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            </div>

            {/* <Row gutter={[24, 24]} style={{ marginTop: theme.spacing.xl }}>
              <Col xs={24} md={12}>
                <Card
                  title="อัตราการเสร็จสิ้น"
                  style={{
                    borderRadius: theme.borderRadius.lg,
                    boxShadow: theme.shadow,
                    background: theme.white,
                  }}
                  bodyStyle={{ padding: theme.spacing.xl }}
                >
                  <Progress
                    type="circle"
                    percent={completionRate}
                    format={(percent) => `${percent?.toFixed(1)}%`}
                    width={200}
                    strokeColor={theme.primary}
                  />
                  <div style={{ marginTop: theme.spacing.lg }}>
                    <Text
                      strong
                      style={{
                        display: "block",
                        marginBottom: theme.spacing.sm,
                      }}
                    >
                      สรุปสถานะ
                    </Text>
                    <div style={{ display: "flex", gap: theme.spacing.lg }}>
                      <div>
                        <Text type="secondary">รอดำเนินการ</Text>
                        <Text
                          strong
                          style={{ display: "block", color: theme.warning }}
                        >
                          {pendingWorkloads} รายการ
                        </Text>
                      </div>
                      <div>
                        <Text type="secondary">กำลังดำเนินการ</Text>
                        <Text
                          strong
                          style={{ display: "block", color: theme.primary }}
                        >
                          {inProgressWorkloads} รายการ
                        </Text>
                      </div>
                      <div>
                        <Text type="secondary">เสร็จสิ้น</Text>
                        <Text
                          strong
                          style={{ display: "block", color: theme.success }}
                        >
                          {completedWorkloads} รายการ
                        </Text>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card
                  title="ภาระงานล่าสุด"
                  style={{
                    borderRadius: theme.borderRadius.lg,
                    boxShadow: theme.shadow,
                    background: theme.white,
                  }}
                  bodyStyle={{ padding: theme.spacing.xl }}
                >
                  <List
                    dataSource={recentWorkloads}
                    renderItem={(item) => (
                      <List.Item>
                        <div style={{ width: "100%" }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Text strong>{item.title}</Text>
                            <Tag color={getStatusColor(item.status)}>
                              {getStatusText(item.status)}
                            </Tag>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginTop: theme.spacing.sm,
                            }}
                          >
                            <Text type="secondary">{item.department}</Text>
                            <Tag color={getPriorityColor(item.priority)}>
                              {getPriorityText(item.priority)}
                            </Tag>
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row> */}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default User;
