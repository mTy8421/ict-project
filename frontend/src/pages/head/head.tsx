import React, { useState, useEffect } from "react";
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
} from "@ant-design/icons";
import axiosInstance from "../../utils/axios";
import theme from "../../theme";
import DeanHeader from "../../components/head/Header";
import DeanNavbar from "../../components/head/Navbar";
import ReHeader from "../../components/head/NavbarHeader";

const { Content } = Layout;
const { Title, Text } = Typography;

interface Workload {
  id: number;
  // title: string;
  description: string;
  department: string;
  // priority: "low" | "medium" | "high";
  status: "pending" | "not_completed" | "completed";
  dateTimeStart: string;
  dateTimeEnd: string;
  options: any;
}

const Head: React.FC = () => {
  const [workloads, setWorkloads] = useState<Workload[]>([]);
  const [dateRange] = useState();

  const fetchWorkloads = async () => {
    try {
      const response = await axiosInstance.get("/work/user");
      setWorkloads(response.data);
    } catch (error) {
      console.error("Error fetching workloads:", error);
    }
  };

  useEffect(() => {
    fetchWorkloads();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "not_completed":
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
      case "not_completed":
        return "ไม่อนุมัติ";
      case "completed":
        return "อนุมัติ";
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

  // const totalWorkloads = workloads.length;
  const totalWorkloads = workloads.filter((workloads) => {
    const recentWorkloads =
      !dateRange ||
      (workloads.dateTimeEnd?.toString() || "").includes(dateRange);

    return recentWorkloads;
  });

  const completedWorkloads = workloads.filter(
    (w) => w.status === "completed",
  ).length;
  const inProgressWorkloads = workloads.filter(
    (w) => w.status === "not_completed",
  ).length;
  const pendingWorkloads = workloads.filter(
    (w) => w.status === "pending",
  ).length;

  const completionRate =
    totalWorkloads.length > 0
      ? (completedWorkloads / totalWorkloads.length) * 100
      : 0;

  const filteredWorkloads = workloads.filter((workloads) => {
    const recentWorkloads =
      !dateRange ||
      (workloads.dateTimeEnd?.toString() || "").includes(dateRange);

    return recentWorkloads;
  });
  // const recentWorkloads = workloads;
  // .sort(
  //   (a, b) =>
  //     new Date(b.dateTimeStart).getTime() -
  //     new Date(a.dateTimeStart).getTime(),
  // )
  // .slice(0, 5);

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
              {/* <div
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
                  วันที่
                </Title>
                <DatePicker
                  style={{
                    width: "100%",
                    marginTop: theme.spacing.sm,
                    borderRadius: theme.borderRadius.md,
                  }}
                  onChange={(_date, dateString) =>
                    setDateRange(dateString.toString() as any)
                  }
                  format="YYYY-MM-DD"
                  placeholder="เลือกวันที่"
                />
              </div> */}

              <Row gutter={[24, 24]}>
                <Col xs={24} sm={8}>
                  <Card
                    style={{
                      borderRadius: theme.borderRadius.lg,
                      boxShadow: theme.shadow,
                      background: theme.white,
                    }}
                    styles={{ body: { padding: theme.spacing.xl } }}
                  >
                    <Statistic
                      title="ภาระงานทั้งหมด"
                      value={totalWorkloads.length}
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
                    styles={{ body: { padding: theme.spacing.xl } }}
                  >
                    <Statistic
                      title="ไม่อนุมัติ"
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
                    styles={{ body: { padding: theme.spacing.xl } }}
                  >
                    <Statistic
                      title="อนุมัติ"
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
                  title="อัตราการอนุมัติ"
                  style={{
                    borderRadius: theme.borderRadius.lg,
                    boxShadow: theme.shadow,
                    background: theme.white,
                  }}
                  styles={{ body: { padding: theme.spacing.xl } }}
                >
                  <Progress
                    type="circle"
                    percent={completionRate}
                    format={(percent) => `${percent?.toFixed(1)}%`}
                    size={200}
                    strokeColor={theme.success}
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
                        <Text type="secondary">ไม่อนุมัติ</Text>
                        <Text
                          strong
                          style={{ display: "block", color: theme.primary }}
                        >
                          {inProgressWorkloads} รายการ
                        </Text>
                      </div>
                      <div>
                        <Text type="secondary">อนุมัติ</Text>
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
                  styles={{ body: { padding: theme.spacing.xl } }}
                >
                  <List
                    dataSource={filteredWorkloads.slice(0, 5)}
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
                            <Text strong>{item.options.title}</Text>
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
                            <Text type="secondary">{item.description}</Text>
                            <Tag
                              color={getPriorityColor(item.options.priority)}
                            >
                              {getPriorityText(item.options.priority)}
                            </Tag>
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </div>
            </Content>
          </div>

          <div className="md:hidden">
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

              {/* <div
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
                  วันที่
                </Title>
                <DatePicker
                  style={{
                    width: "100%",
                    marginTop: theme.spacing.sm,
                    borderRadius: theme.borderRadius.md,
                  }}
                  onChange={(_date, dateString) =>
                    setDateRange(dateString.toString() as any)
                  }
                  format="YYYY-MM-DD"
                  placeholder="เลือกวันที่"
                />
              </div> */}

              <Row gutter={[24, 24]}>
                <Col xs={24} sm={8}>
                  <Card
                    style={{
                      borderRadius: theme.borderRadius.lg,
                      boxShadow: theme.shadow,
                      background: theme.white,
                    }}
                    styles={{ body: { padding: theme.spacing.xl } }}
                  >
                    <Statistic
                      title="ภาระงานทั้งหมด"
                      value={totalWorkloads.length}
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
                    styles={{ body: { padding: theme.spacing.xl } }}
                  >
                    <Statistic
                      title="ไม่อนุมัติ"
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
                    styles={{ body: { padding: theme.spacing.xl } }}
                  >
                    <Statistic
                      title="อนุมัติ"
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
                  title="อัตราการอนุมัติ"
                  style={{
                    borderRadius: theme.borderRadius.lg,
                    boxShadow: theme.shadow,
                    background: theme.white,
                  }}
                  styles={{ body: { padding: theme.spacing.xl } }}
                >
                  <Progress
                    type="circle"
                    percent={completionRate}
                    format={(percent) => `${percent?.toFixed(1)}%`}
                    size={200}
                    strokeColor={theme.success}
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
                        <Text type="secondary">ไม่อนุมัติ</Text>
                        <Text
                          strong
                          style={{ display: "block", color: theme.primary }}
                        >
                          {inProgressWorkloads} รายการ
                        </Text>
                      </div>
                      <div>
                        <Text type="secondary">อนุมัติ</Text>
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
                  styles={{ body: { padding: theme.spacing.xl } }}
                >
                  <List
                    dataSource={filteredWorkloads.slice(0, 5)}
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
                            <Text strong>{item.options.title}</Text>
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
                            <Text type="secondary">{item.description}</Text>
                            <Tag
                              color={getPriorityColor(item.options.priority)}
                            >
                              {getPriorityText(item.options.priority)}
                            </Tag>
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </div>

              <div style={{ marginTop: theme.spacing.xl }}>
                <Card></Card>
              </div>
            </Content>
          </div>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Head;
