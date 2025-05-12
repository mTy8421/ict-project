import React, { useEffect, useState } from 'react';
import { Layout, Menu, Card, Row, Col, Statistic, Table, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  FileTextOutlined,
  BarChartOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import axiosInstance from '../../../utils/axios';
import { logout } from '../../home/home';

const { Header, Sider, Content } = Layout;

interface WorkloadStats {
  department: string;
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

const ViceDeanAcademicDashboard: React.FC = () => {
  const navigate = useNavigate();
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
          <h1 style={{ margin: 0, fontSize: '20px' }}>ระบบจัดการภาระงานพนักงาน</h1>
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
              <Link to="/vice-dean/academic">ภาพรวม</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<FileTextOutlined />}>
              <Link to="/vice-dean/academic/workload">จัดการภาระงาน</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<UserOutlined />}>
              <Link to="/vice-dean/academic/users">จัดการผู้ใช้</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
            <h2>ภาพรวมภาระงานตามแผนก</h2>
            <Row gutter={16} style={{ marginBottom: '24px' }}>
              {workloadStats.map((stat) => (
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
              dataSource={workloadStats}
              loading={loading}
              rowKey="department"
            />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default ViceDeanAcademicDashboard; 