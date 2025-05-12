import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Typography, Layout, Menu, Button, Row, Col, Statistic, Table } from 'antd';
import { Column, Pie } from '@ant-design/plots';
import axiosInstance from '../../../utils/axios';
import { logout } from '../../home/home';
import {
  UserOutlined,
  FileTextOutlined,
  BarChartOutlined,
  LogoutOutlined,
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

const StudentQualityViceDeanDashboard: React.FC = () => {
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

  // ข้อมูลสำหรับกราฟ
  const workloadData = stats.map(dept => ({
    department: dept.department,
    count: dept.total,
  }));

  const config = {
    data: workloadData,
    xField: 'count',
    yField: 'department',
    seriesField: 'department',
    legend: {
      position: 'top-left' as const,
    },
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        background: '#fff',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="Logo" style={{ height: '40px', marginRight: '16px' }} />
          <Title level={4} style={{ color: 'white', margin: 0 }}>Support Staff Workload - System ICT</Title>
        </div>
        <Button 
          type="text" 
          icon={<LogoutOutlined />} 
          onClick={logout}
          style={{ fontSize: '16px' }}
        >
          ออกจากระบบ
        </Button>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item key="1" icon={<BarChartOutlined />}>
              <Link to="/vice-dean/student-quality">ภาพรวม</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<FileTextOutlined />}>
              <Link to="/vice-dean/student-quality/workload">จัดการภาระงาน</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<UserOutlined />}>
              <Link to="/vice-dean/student-quality/users">จัดการผู้ใช้</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
            <Title level={3}>ภาพรวมภาระงาน</Title>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <Card title="กราฟแสดงภาระงานตามฝ่าย">
                <Column {...config} />
              </Card>
              <Card title="สัดส่วนภาระงาน">
                <Pie
                  data={workloadData}
                  angleField="count"
                  colorField="department"
                  radius={0.8}
                  label={{
                    type: 'outer',
                  }}
                />
              </Card>
            </div>
            <h2>ภาพรวมภาระงานตามแผนก</h2>
            <Row gutter={16} style={{ marginBottom: '24px' }}>
              {stats.map((stat) => (
                <Col span={6} key={stat.department}>
                  <Card loading={loading}>
                    <Statistic
                      title={stat.department}
                      value={stat.total}
                      suffix={`/ ${stat.completed} เสร็จสิ้น`}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
            <Table
              columns={columns}
              dataSource={stats}
              loading={loading}
              rowKey="department"
            />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default StudentQualityViceDeanDashboard; 