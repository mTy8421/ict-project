import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Typography, Layout, Menu, Button, Row, Col, Table, Tag, Space, Input, Select, DatePicker } from 'antd';
import { SearchOutlined, FilterOutlined, PlusOutlined, SyncOutlined } from '@ant-design/icons';
import axiosInstance from '../../utils/axios';
import { logout } from '../home/home';
import theme from '../../theme';
import {
  UserOutlined,
  FileTextOutlined,
  BarChartOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;

interface Workload {
  id: number;
  title: string;
  department: string;
  assignee: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  start_date: string;
  end_date: string;
  created_at: string;
}

const DeanWorkload: React.FC = () => {
  const navigate = useNavigate();
  const [workloads, setWorkloads] = useState<Workload[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  useEffect(() => {
    const fetchWorkloads = async () => {
      try {
        const response = await axiosInstance.get('/workload');
        setWorkloads(response.data);
      } catch (error) {
        console.error('Error fetching workloads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkloads();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return theme.warning;
      case 'in_progress':
        return theme.accent;
      case 'completed':
        return theme.success;
      default:
        return theme.textLight;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return theme.danger;
      case 'medium':
        return theme.warning;
      case 'low':
        return theme.success;
      default:
        return theme.textLight;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'รอดำเนินการ';
      case 'in_progress':
        return 'กำลังดำเนินการ';
      case 'completed':
        return 'เสร็จสิ้น';
      default:
        return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'สูง';
      case 'medium':
        return 'ปานกลาง';
      case 'low':
        return 'ต่ำ';
      default:
        return priority;
    }
  };

  const columns = [
    {
      title: 'หัวข้อ',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => (
        <Text strong style={{ color: theme.primary }}>{text}</Text>
      ),
    },
    {
      title: 'แผนก',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'ผู้รับผิดชอบ',
      dataIndex: 'assignee',
      key: 'assignee',
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)} style={{ 
          padding: '4px 8px',
          borderRadius: theme.borderRadius.sm,
          fontSize: theme.fontSize.sm,
        }}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'ความสำคัญ',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)} style={{ 
          padding: '4px 8px',
          borderRadius: theme.borderRadius.sm,
          fontSize: theme.fontSize.sm,
        }}>
          {getPriorityText(priority)}
        </Tag>
      ),
    },
    {
      title: 'วันที่เริ่มต้น',
      dataIndex: 'start_date',
      key: 'start_date',
      render: (date: string) => new Date(date).toLocaleDateString('th-TH'),
    },
    {
      title: 'วันที่สิ้นสุด',
      dataIndex: 'end_date',
      key: 'end_date',
      render: (date: string) => new Date(date).toLocaleDateString('th-TH'),
    },
    {
      title: 'จัดการ',
      key: 'action',
      render: (_: any, record: Workload) => (
        <Space size="middle">
          <Button 
            type="link" 
            onClick={() => navigate(`/dean/workload/${record.id}`)}
            style={{ color: theme.primary }}
          >
            ดูรายละเอียด
          </Button>
        </Space>
      ),
    },
  ];

  const filteredWorkloads = workloads.filter(workload => {
    const matchesSearch = workload.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         workload.department.toLowerCase().includes(searchText.toLowerCase()) ||
                         workload.assignee.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(workload.status);
    const matchesPriority = priorityFilter.length === 0 || priorityFilter.includes(workload.priority);
    
    const matchesDate = !dateRange || (
      new Date(workload.start_date) >= new Date(dateRange[0]) &&
      new Date(workload.end_date) <= new Date(dateRange[1])
    );

    return matchesSearch && matchesStatus && matchesPriority && matchesDate;
  });

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
            defaultSelectedKeys={['2']}
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
                จัดการภาระงาน
              </Title>
              <p style={{ color: theme.textLight, marginTop: theme.spacing.sm, fontSize: theme.fontSize.md }}>
                ดูและจัดการภาระงานทั้งหมดในระบบ
              </p>
            </div>

            <Card
              style={{
                borderRadius: theme.borderRadius.lg,
                boxShadow: theme.shadow,
                marginBottom: theme.spacing.xl,
                padding: theme.spacing.lg,
              }}
            >
              <Row gutter={[24, 24]} align="middle">
                <Col xs={24} sm={8} style={{ paddingBottom: theme.spacing.md }}>
                  <Search
                    placeholder="ค้นหาภาระงาน..."
                    allowClear
                    onSearch={setSearchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </Col>
                <Col xs={24} sm={8} style={{ paddingBottom: theme.spacing.md }}>
                  <Select
                    mode="multiple"
                    placeholder="กรองตามสถานะ"
                    style={{ width: '100%' }}
                    onChange={setStatusFilter}
                    options={[
                      { label: 'รอดำเนินการ', value: 'pending' },
                      { label: 'กำลังดำเนินการ', value: 'in_progress' },
                      { label: 'เสร็จสิ้น', value: 'completed' },
                    ]}
                  />
                </Col>
                <Col xs={24} sm={8} style={{ paddingBottom: theme.spacing.md }}>
                  <Select
                    mode="multiple"
                    placeholder="กรองตามความสำคัญ"
                    style={{ width: '100%' }}
                    onChange={setPriorityFilter}
                    options={[
                      { label: 'สูง', value: 'high' },
                      { label: 'ปานกลาง', value: 'medium' },
                      { label: 'ต่ำ', value: 'low' },
                    ]}
                  />
                </Col>
                <Col xs={24} sm={12} style={{ paddingBottom: theme.spacing.md }}>
                  <RangePicker
                    style={{ width: '100%' }}
                    onChange={(dates) => {
                      if (dates) {
                        setDateRange([dates[0]?.toISOString() || '', dates[1]?.toISOString() || '']);
                      } else {
                        setDateRange(null);
                      }
                    }}
                  />
                </Col>
                <Col xs={24} sm={12} style={{ textAlign: 'right', paddingBottom: theme.spacing.md }}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate('/dean/workload/new')}
                    style={{
                      background: theme.primary,
                      borderColor: theme.primary,
                      height: '40px',
                      padding: `0 ${theme.spacing.lg}`,
                      borderRadius: theme.borderRadius.md,
                    }}
                  >
                    เพิ่มภาระงานใหม่
                  </Button>
                </Col>
              </Row>
            </Card>

            <Card
              style={{
                borderRadius: theme.borderRadius.lg,
                boxShadow: theme.shadow,
              }}
            >
              <Table
                columns={columns}
                dataSource={filteredWorkloads}
                loading={loading}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) => `ทั้งหมด ${total} รายการ`,
                }}
                style={{ fontSize: theme.fontSize.sm }}
              />
            </Card>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default DeanWorkload; 