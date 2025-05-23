import React, { useEffect, useState } from 'react';
import { Layout, Card, Row, Col, Statistic, Table } from 'antd';
import axiosInstance from '../../../utils/axios';
import theme from '../../../theme';
import ViceDeanHeader from '../../../components/vice-dean/Header';
import ViceDeanNavbar from '../../../components/vice-dean/Navbar';

const { Content } = Layout;

interface WorkloadStats {
  department: string;
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

const ViceDeanAcademicDashboard: React.FC = () => {
  const [workloadStats, setWorkloadStats] = useState<WorkloadStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkloadStats = async () => {
      try {
        const response = await axiosInstance.get('/workload/stats/department');
        setWorkloadStats(response.data);
      } catch (error) {
        console.error('Error fetching workload stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkloadStats();
  }, []);

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
    },
    {
      title: 'กำลังดำเนินการ',
      dataIndex: 'inProgress',
      key: 'inProgress',
    },
    {
      title: 'เสร็จสิ้น',
      dataIndex: 'completed',
      key: 'completed',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: theme.background }}>
      <ViceDeanHeader role="รองคณบดีฝ่ายวิชาการ" />
      <Layout style={{ height: 'calc(100vh - 70px)' }}>
        <ViceDeanNavbar basePath="/vice-dean/academic" />
        <Layout style={{ padding: theme.spacing.xl, overflow: 'auto' }}>
          <Content style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: `0 ${theme.spacing.xl}`,
            background: theme.white,
            borderRadius: theme.borderRadius.lg,
            boxShadow: theme.shadow,
          }}>
            <div style={{ 
              marginBottom: theme.spacing.xl,
              padding: theme.spacing.xl,
            }}>
              <h2 style={{ 
                margin: 0, 
                color: theme.primary, 
                fontWeight: theme.fontWeight.semibold,
                fontSize: theme.fontSize.xxl,
                letterSpacing: '0.5px',
              }}>
                ภาพรวมภาระงานตามแผนก
              </h2>
            </div>
            <Row gutter={[24, 24]} style={{ padding: `0 ${theme.spacing.xl}` }}>
              {workloadStats.map((stat) => (
                <Col xs={24} sm={24} md={12} key={stat.department}>
                  <Card 
                    loading={loading}
                    style={{
                      borderRadius: theme.borderRadius.lg,
                      boxShadow: theme.shadow,
                      height: '100%',
                    }}
                  >
                    <Statistic
                      title={
                        <span style={{
                          fontSize: theme.fontSize.xl,
                          fontWeight: theme.fontWeight.semibold,
                          color: theme.primary,
                        }}>
                          {stat.department}
                        </span>
                      }
                      value={stat.total}
                      suffix={
                        <span style={{
                          fontSize: theme.fontSize.lg,
                          color: theme.textLight,
                        }}>
                          / {stat.completed} เสร็จสิ้น
                        </span>
                      }
                      valueStyle={{
                        fontSize: theme.fontSize.xxl,
                        fontWeight: theme.fontWeight.bold,
                        color: theme.text,
                      }}
                    />
                    <div style={{ 
                      marginTop: theme.spacing.lg,
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: theme.spacing.md,
                    }}>
                      <Statistic
                        title="รอดำเนินการ"
                        value={stat.pending}
                        valueStyle={{ color: theme.warning }}
                      />
                      <Statistic
                        title="กำลังดำเนินการ"
                        value={stat.inProgress}
                        valueStyle={{ color: theme.primary }}
                      />
                      <Statistic
                        title="เสร็จสิ้น"
                        value={stat.completed}
                        valueStyle={{ color: theme.success }}
                      />
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
            <div style={{ padding: theme.spacing.xl }}>
              <Table
                columns={columns}
                dataSource={workloadStats}
                loading={loading}
                rowKey="department"
                style={{
                  borderRadius: theme.borderRadius.lg,
                  overflow: 'hidden',
                }}
              />
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default ViceDeanAcademicDashboard; 