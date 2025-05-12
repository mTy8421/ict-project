import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Typography, Layout, Menu, Button, Row, Col, Statistic, Table, Progress } from 'antd';
import { Column, Pie } from '@ant-design/plots';
import axiosInstance from '../../utils/axios';
import { logout } from '../home/home';
import theme from '../../theme';
import {
  UserOutlined,
  FileTextOutlined,
  BarChartOutlined,
  LogoutOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

interface WorkloadStats {
  department: string;
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

const DeanDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<WorkloadStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/workload/stats/department');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const columnData = stats.map(dept => [
    { type: 'รอดำเนินการ', value: dept.pending, department: dept.department },
    { type: 'กำลังดำเนินการ', value: dept.inProgress, department: dept.department },
    { type: 'เสร็จสิ้น', value: dept.completed, department: dept.department },
  ]).flat();

  const pieData = stats.map(dept => ({
    type: dept.department,
    value: dept.total,
  }));

  const columnConfig = {
    data: columnData,
    xField: 'department',
    yField: 'value',
    seriesField: 'type',
    isGroup: true,
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
    label: {
      position: 'middle',
      layout: [
        { type: 'interval-adjust-position' },
        { type: 'interval-hide-overlap' },
        { type: 'adjust-color' },
      ],
    },
    color: [theme.warning, theme.accent, theme.success],
  };

  const pieConfig = {
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'element-active' }],
    color: [theme.primary, theme.secondary, theme.accent, theme.success, theme.warning],
  };

  const columns = [
    {
      title: 'แผนก',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'ทั้งหมด',
      dataIndex: 'total',
      key: 'total',
    },
    {
      title: 'รอดำเนินการ',
      dataIndex: 'pending',
      key: 'pending',
      render: (text: number) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
          <ClockCircleOutlined style={{ color: theme.warning }} />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: 'กำลังดำเนินการ',
      dataIndex: 'inProgress',
      key: 'inProgress',
      render: (text: number) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
          <SyncOutlined spin style={{ color: theme.accent }} />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: 'เสร็จสิ้น',
      dataIndex: 'completed',
      key: 'completed',
      render: (text: number) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
          <CheckCircleOutlined style={{ color: theme.success }} />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: 'ความคืบหน้า',
      key: 'progress',
      render: (record: WorkloadStats) => (
        <Progress
          percent={Math.round((record.completed / record.total) * 100)}
          size="small"
          status={record.completed === record.total ? 'success' : 'active'}
          strokeColor={record.completed === record.total ? theme.success : theme.accent}
        />
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: theme.background
      }}>
        <div style={{ textAlign: 'center' }}>
          <SyncOutlined spin style={{ fontSize: '48px', color: theme.accent }} />
          <p style={{ marginTop: theme.spacing.md, fontSize: theme.fontSize.md, color: theme.textLight }}>
            กำลังโหลดข้อมูล...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', background: theme.background }}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        background: theme.headerBg,
        padding: `0 ${theme.spacing.xl}`,
        boxShadow: theme.shadowLarge,
        position: 'sticky',
        top: 0,
        zIndex: theme.zIndex.header,
        height: '70px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="Logo" style={{ height: '45px', marginRight: theme.spacing.lg }} />
          <Title level={4} style={{ margin: 0, color: theme.white, fontWeight: theme.fontWeight.semibold }}>
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
            height: '40px',
            padding: `0 ${theme.spacing.md}`,
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
            borderRadius: theme.borderRadius.md,
            transition: theme.transition.default,
          }}
        >
          ออกจากระบบ
        </Button>
      </Header>
      <Layout style={{ height: 'calc(100vh - 70px)' }}>
        <Sider width={280} style={{ 
          background: theme.sidebarBg,
          position: 'sticky',
          top: 70,
          height: 'calc(100vh - 70px)',
          boxShadow: theme.shadowLarge,
          overflow: 'auto',
        }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{ 
              height: '100%', 
              borderRight: 0,
              padding: `${theme.spacing.lg} 0`,
              background: theme.sidebarBg,
            }}
            theme="light"
          >
            <Menu.Item 
              key="1" 
              icon={<BarChartOutlined style={{ fontSize: theme.fontSize.xl, color: theme.primary }} />}
              style={{
                margin: `${theme.spacing.sm} ${theme.spacing.md}`,
                borderRadius: theme.borderRadius.md,
                height: '48px',
                lineHeight: '48px',
                color: theme.primary,
              }}
            >
              <Link to="/dean" style={{ fontSize: theme.fontSize.md, color: theme.primary }}>ภาพรวม</Link>
            </Menu.Item>
            <Menu.Item 
              key="2" 
              icon={<FileTextOutlined style={{ fontSize: theme.fontSize.xl, color: theme.primary }} />}
              style={{
                margin: `${theme.spacing.sm} ${theme.spacing.md}`,
                borderRadius: theme.borderRadius.md,
                height: '48px',
                lineHeight: '48px',
                color: theme.primary,
              }}
            >
              <Link to="/dean/workload" style={{ fontSize: theme.fontSize.md, color: theme.primary }}>จัดการภาระงาน</Link>
            </Menu.Item>
            <Menu.Item 
              key="3" 
              icon={<UserOutlined style={{ fontSize: theme.fontSize.xl, color: theme.primary }} />}
              style={{
                margin: `${theme.spacing.sm} ${theme.spacing.md}`,
                borderRadius: theme.borderRadius.md,
                height: '48px',
                lineHeight: '48px',
                color: theme.primary,
              }}
            >
              <Link to="/dean/users" style={{ fontSize: theme.fontSize.md, color: theme.primary }}>จัดการผู้ใช้</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: theme.spacing.xl, overflow: 'auto' }}>
          <Content style={{ maxWidth: '1600px' }}>
            <div style={{ marginBottom: theme.spacing.xl }}>
              <Title level={3} style={{ margin: 0, color: theme.primary, fontWeight: theme.fontWeight.semibold }}>
                ภาพรวมภาระงาน
              </Title>
              <p style={{ color: theme.textLight, marginTop: theme.spacing.sm, fontSize: theme.fontSize.md }}>
                ข้อมูลสรุปภาระงานทั้งหมดในระบบ
              </p>
            </div>
            
            <div style={{ padding: theme.spacing.lg }}>
              <Row gutter={[theme.spacing.lg, theme.spacing.lg]}>
                {stats.map((stat) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={stat.department}>
                    <Card
                      hoverable
                      style={{
                        borderRadius: theme.borderRadius.lg,
                        boxShadow: theme.shadow,
                        height: '100%',
                      }}
                    >
                      <Statistic
                        title={stat.department}
                        value={stat.total}
                        valueStyle={{ color: theme.primary }}
                      />
                      <Progress
                        percent={Math.round((stat.completed / stat.total) * 100)}
                        status="active"
                        strokeColor={{
                          '0%': theme.secondary,
                          '100%': theme.primary,
                        }}
                        style={{ marginTop: theme.spacing.md }}
                      />
                      <Row gutter={[theme.spacing.sm, theme.spacing.sm]} style={{ marginTop: theme.spacing.md }}>
                        <Col span={8}>
                          <Statistic
                            title="รอดำเนินการ"
                            value={stat.pending}
                            valueStyle={{ color: theme.warning }}
                          />
                        </Col>
                        <Col span={8}>
                          <Statistic
                            title="กำลังดำเนินการ"
                            value={stat.inProgress}
                            valueStyle={{ color: theme.accent }}
                          />
                        </Col>
                        <Col span={8}>
                          <Statistic
                            title="เสร็จสิ้น"
                            value={stat.completed}
                            valueStyle={{ color: theme.success }}
                          />
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))}
              </Row>

              <Row style={{ marginTop: theme.spacing.xxl }}>
                <Col span={24}>
                  <Card
                    title="สัดส่วนภาระงานทั้งหมด"
                    style={{
                      borderRadius: theme.borderRadius.lg,
                      boxShadow: theme.shadow,
                    }}
                  >
                    <Pie {...pieConfig} />
                  </Card>
                </Col>
              </Row>

              <Row style={{ marginTop: theme.spacing.xxl }}>
                <Col span={24}>
                  <Card
                    title={<span style={{ fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.semibold, color: theme.primary }}>
                      สถานะภาระงานตามแผนก
                    </span>}
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
              </Row>
            </div>

            <Card 
              title={<span style={{ fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.semibold, color: theme.primary }}>
                รายละเอียดภาระงานตามแผนก
              </span>}
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

export default DeanDashboard; 