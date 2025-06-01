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
  Statistic,
  Table,
  Progress,
} from "antd";
import { Column, Pie } from "@ant-design/plots";
import axiosInstance from "../../utils/axios";
import { logout } from "../home/home";
import theme from "../../theme";
import {
  UserOutlined,
  FileTextOutlined,
  BarChartOutlined,
  LogoutOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

interface WorkloadStats {
  department: string;
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<WorkloadStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get("/workload/stats/department");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const columnData = stats
    .map((dept) => [
      { type: "รอดำเนินการ", value: dept.pending, department: dept.department },
      {
        type: "กำลังดำเนินการ",
        value: dept.inProgress,
        department: dept.department,
      },
      { type: "เสร็จสิ้น", value: dept.completed, department: dept.department },
    ])
    .flat();

  const pieData = stats.map((dept) => ({
    type: dept.department,
    value: dept.total,
  }));

  const columnConfig = {
    data: columnData,
    xField: "department",
    yField: "value",
    seriesField: "type",
    isGroup: true,
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
    label: {
      position: "middle",
      layout: [
        { type: "interval-adjust-position" },
        { type: "interval-hide-overlap" },
        { type: "adjust-color" },
      ],
    },
    color: [theme.warning, theme.accent, theme.success],
  };

  const pieConfig = {
    data: pieData,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: {
      type: "outer",
      content: "{name} {percentage}",
    },
    interactions: [{ type: "element-active" }],
    color: [
      theme.primary,
      theme.secondary,
      theme.accent,
      theme.success,
      theme.warning,
    ],
  };

  const columns = [
    {
      title: "แผนก",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "ทั้งหมด",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "รอดำเนินการ",
      dataIndex: "pending",
      key: "pending",
      render: (text: number) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: theme.spacing.sm,
          }}
        >
          <ClockCircleOutlined style={{ color: theme.warning }} />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "กำลังดำเนินการ",
      dataIndex: "inProgress",
      key: "inProgress",
      render: (text: number) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: theme.spacing.sm,
          }}
        >
          <SyncOutlined spin style={{ color: theme.accent }} />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "เสร็จสิ้น",
      dataIndex: "completed",
      key: "completed",
      render: (text: number) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: theme.spacing.sm,
          }}
        >
          <CheckCircleOutlined style={{ color: theme.success }} />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "ความคืบหน้า",
      key: "progress",
      render: (record: WorkloadStats) => (
        <Progress
          percent={Math.round((record.completed / record.total) * 100)}
          size="small"
          status={record.completed === record.total ? "success" : "active"}
          strokeColor={
            record.completed === record.total ? theme.success : theme.accent
          }
        />
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
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: theme.headerBg,
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
            src="/logo.png"
            alt="Logo"
            style={{ height: "45px", marginRight: theme.spacing.lg }}
          />
          <Title
            level={4}
            style={{
              margin: 0,
              color: theme.white,
              fontWeight: theme.fontWeight.semibold,
            }}
          >
            ระบบจัดการภาระงานพนักงาน
          </Title>
        </div>
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={logout}
          style={{
            fontSize: theme.fontSize.md,
            color: theme.white,
            height: "40px",
            padding: `0 ${theme.spacing.md}`,
            display: "flex",
            alignItems: "center",
            gap: theme.spacing.sm,
            borderRadius: theme.borderRadius.md,
          }}
        >
          ออกจากระบบ
        </Button>
      </Header>
      <Layout style={{ height: "calc(100vh - 70px)" }}>
        <Sider
          width={280}
          style={{
            background: theme.sidebarBg,
            position: "sticky",
            top: 70,
            height: "calc(100vh - 70px)",
            boxShadow: theme.shadowLarge,
            overflow: "auto",
          }}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            style={{
              height: "100%",
              borderRight: 0,
              padding: `${theme.spacing.lg} 0`,
              background: theme.sidebarBg,
            }}
            theme="light"
          >
            <Menu.Item
              key="1"
              icon={
                <BarChartOutlined
                  style={{ fontSize: theme.fontSize.xl, color: theme.primary }}
                />
              }
              style={{
                margin: `${theme.spacing.sm} ${theme.spacing.md}`,
                borderRadius: theme.borderRadius.md,
                height: "48px",
                lineHeight: "48px",
                color: theme.primary,
              }}
            >
              <Link
                to="/admin"
                style={{ fontSize: theme.fontSize.md, color: theme.primary }}
              >
                ภาพรวม
              </Link>
            </Menu.Item>
            <Menu.Item
              key="2"
              icon={
                <FileTextOutlined
                  style={{ fontSize: theme.fontSize.xl, color: theme.primary }}
                />
              }
              style={{
                margin: `${theme.spacing.sm} ${theme.spacing.md}`,
                borderRadius: theme.borderRadius.md,
                height: "48px",
                lineHeight: "48px",
                color: theme.primary,
              }}
            >
              <Link
                to="/admin/workload"
                style={{ fontSize: theme.fontSize.md, color: theme.primary }}
              >
                จัดการภาระงาน
              </Link>
            </Menu.Item>
            <Menu.Item
              key="3"
              icon={
                <UserOutlined
                  style={{ fontSize: theme.fontSize.xl, color: theme.primary }}
                />
              }
              style={{
                margin: `${theme.spacing.sm} ${theme.spacing.md}`,
                borderRadius: theme.borderRadius.md,
                height: "48px",
                lineHeight: "48px",
                color: theme.primary,
              }}
            >
              <Link
                to="/admin/users"
                style={{ fontSize: theme.fontSize.md, color: theme.primary }}
              >
                จัดการผู้ใช้
              </Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: theme.spacing.xl, overflow: "auto" }}>
          <Content style={{ maxWidth: "1600px" }}>
            <div style={{ marginBottom: theme.spacing.xl }}>
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
              <p
                style={{
                  color: theme.textLight,
                  marginTop: theme.spacing.sm,
                  fontSize: theme.fontSize.md,
                }}
              >
                ข้อมูลสรุปภาระงานทั้งหมดในระบบ
              </p>
            </div>

            <Row gutter={[24, 24]} style={{ marginBottom: theme.spacing.xl }}>
              {stats.map((dept) => (
                <Col span={6} key={dept.department}>
                  <Card
                    hoverable
                    style={{
                      borderRadius: theme.borderRadius.lg,
                      boxShadow: theme.shadow,
                      background: theme.cardBg,
                      transition: theme.transition.default,
                    }}
                    bodyStyle={{ padding: theme.spacing.lg }}
                  >
                    <Statistic
                      title={
                        <span
                          style={{
                            fontSize: theme.fontSize.md,
                            color: theme.primary,
                          }}
                        >
                          {dept.department}
                        </span>
                      }
                      value={dept.total}
                      suffix={`งาน`}
                      valueStyle={{
                        color: theme.primary,
                        fontSize: theme.fontSize.xxl,
                        fontWeight: theme.fontWeight.semibold,
                      }}
                    />
                    <Progress
                      percent={Math.round((dept.completed / dept.total) * 100)}
                      size="small"
                      status={
                        dept.completed === dept.total ? "success" : "active"
                      }
                      style={{ marginTop: theme.spacing.lg }}
                      strokeColor={
                        dept.completed === dept.total
                          ? theme.success
                          : theme.accent
                      }
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: theme.spacing.sm,
                        color: theme.textLight,
                        fontSize: theme.fontSize.sm,
                      }}
                    >
                      <span>
                        เสร็จสิ้น {dept.completed}/{dept.total}
                      </span>
                      <span>
                        {Math.round((dept.completed / dept.total) * 100)}%
                      </span>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

            <Row gutter={[24, 24]} style={{ marginBottom: theme.spacing.xl }}>
              <Col span={16}>
                <Card
                  title={
                    <span
                      style={{
                        fontSize: theme.fontSize.lg,
                        fontWeight: theme.fontWeight.semibold,
                        color: theme.primary,
                      }}
                    >
                      สถานะภาระงานตามแผนก
                    </span>
                  }
                  style={{
                    borderRadius: theme.borderRadius.lg,
                    boxShadow: theme.shadow,
                    background: theme.cardBg,
                  }}
                  bodyStyle={{ padding: theme.spacing.lg }}
                >
                  <Column {...columnConfig} />
                </Card>
              </Col>
              <Col span={8}>
                <Card
                  title={
                    <span
                      style={{
                        fontSize: theme.fontSize.lg,
                        fontWeight: theme.fontWeight.semibold,
                        color: theme.primary,
                      }}
                    >
                      สัดส่วนภาระงานทั้งหมด
                    </span>
                  }
                  style={{
                    borderRadius: theme.borderRadius.lg,
                    boxShadow: theme.shadow,
                    background: theme.cardBg,
                  }}
                  bodyStyle={{ padding: theme.spacing.lg }}
                >
                  <Pie {...pieConfig} />
                </Card>
              </Col>
            </Row>

            <Card
              title={
                <span
                  style={{
                    fontSize: theme.fontSize.lg,
                    fontWeight: theme.fontWeight.semibold,
                    color: theme.primary,
                  }}
                >
                  รายละเอียดภาระงานตามแผนก
                </span>
              }
              style={{
                borderRadius: theme.borderRadius.lg,
                boxShadow: theme.shadow,
                background: theme.cardBg,
              }}
              bodyStyle={{ padding: theme.spacing.lg }}
            >
              <Table
                columns={columns}
                dataSource={stats}
                loading={loading}
                rowKey="department"
                pagination={false}
                style={{ fontSize: theme.fontSize.sm }}
              />
            </Card>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
