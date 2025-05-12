import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Typography, Layout, Menu, Button, Row, Col, Table, Tag, Space, Input, Select, Avatar } from 'antd';
import { SearchOutlined, UserAddOutlined, SyncOutlined } from '@ant-design/icons';
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

interface User {
  user_id: number;
  user_name: string;
  user_email: string;
  user_role: string;
  status: 'active' | 'inactive';
  created_at: string;
}

const DeanUsers: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState<string[]>([]);
  const [departmentFilter, setDepartmentFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/user');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = async (value: string) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/user/search?query=${value}`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentFilter = async (value: string[]) => {
    try {
      setLoading(true);
      if (value.length === 0) {
        const response = await axiosInstance.get('/user');
        setUsers(response.data);
      } else {
        const response = await axiosInstance.get(`/user/filter?department=${value[0]}`);
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error filtering users:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return theme.success;
      case 'inactive':
        return theme.danger;
      default:
        return theme.textLight;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'ใช้งาน';
      case 'inactive':
        return 'ไม่ใช้งาน';
      default:
        return status;
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'ผู้ดูแลระบบ';
      case 'คณบดี':
        return 'คณบดี';
      case 'รองคณบดีฝ่ายวิชาการ':
        return 'รองคณบดีฝ่ายวิชาการ';
      case 'รองคณบดีฝ่ายวิจัยและนวัตถกรรม':
        return 'รองคณบดีฝ่ายวิจัยและนวัตถกรรม';
      case 'รองคณบดีฝ่ายคุณภาพนิสิต':
        return 'รองคณบดีฝ่ายคุณภาพนิสิต';
      case 'พนักงานฝ่ายวิชาการ':
        return 'พนักงานฝ่ายวิชาการ';
      case 'พนักงานฝ่ายวิจัยและนวัตถกรรม':
        return 'พนักงานฝ่ายวิจัยและนวัตถกรรม';
      case 'พนักงานฝ่ายคุณภาพนิสิต':
        return 'พนักงานฝ่ายคุณภาพนิสิต';
      case 'พนักงานฝ่ายยุทธศาสตร์และพัฒนาองค์กร':
        return 'พนักงานฝ่ายยุทธศาสตร์และพัฒนาองค์กร';
      default:
        return role;
    }
  };

  const columns = [
    {
      title: 'ชื่อ-นามสกุล',
      dataIndex: 'user_name',
      key: 'user_name',
      render: (text: string, record: User) => (
        <Space>
          <Avatar 
            style={{ 
              backgroundColor: theme.primary,
              verticalAlign: 'middle',
            }}
            size="large"
          >
            {text.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <Text strong style={{ color: theme.primary, display: 'block' }}>{text}</Text>
            <Text type="secondary" style={{ fontSize: theme.fontSize.sm }}>{record.user_email}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'ตำแหน่ง',
      dataIndex: 'user_role',
      key: 'user_role',
      render: (role: string) => (
        <Tag color={theme.secondary} style={{ 
          padding: '4px 8px',
          borderRadius: theme.borderRadius.sm,
          fontSize: theme.fontSize.sm,
        }}>
          {getRoleText(role)}
        </Tag>
      ),
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
      title: 'วันที่สร้าง',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString('th-TH'),
    },
    {
      title: 'จัดการ',
      key: 'action',
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button 
            type="link" 
            onClick={() => navigate(`/dean/users/${record.user_id}`)}
            style={{ color: theme.primary }}
          >
            ดูรายละเอียด
          </Button>
          <Button 
            type="link" 
            onClick={() => navigate(`/dean/users/${record.user_id}/edit`)}
            style={{ color: theme.secondary }}
          >
            แก้ไข
          </Button>
        </Space>
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
        background: theme.primary,
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Title level={4} style={{ color: theme.textLight, margin: 0 }}>
          ระบบจัดการผู้ใช้
        </Title>
        <Button 
          type="text" 
          icon={<LogoutOutlined />} 
          onClick={logout}
          style={{ color: theme.textLight }}
        >
          ออกจากระบบ
        </Button>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: theme.background }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['users']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item key="dashboard" icon={<BarChartOutlined />}>
              <Link to="/dean">แดชบอร์ด</Link>
            </Menu.Item>
            <Menu.Item key="workload" icon={<FileTextOutlined />}>
              <Link to="/dean/workload">ภาระงาน</Link>
            </Menu.Item>
            <Menu.Item key="users" icon={<UserOutlined />}>
              <Link to="/dean/users">ผู้ใช้</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content>
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
                    placeholder="ค้นหาผู้ใช้..."
                    allowClear
                    onSearch={handleSearch}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </Col>
                <Col xs={24} sm={8} style={{ paddingBottom: theme.spacing.md }}>
                  <Select
                    mode="multiple"
                    placeholder="กรองตามตำแหน่ง"
                    style={{ width: '100%' }}
                    onChange={setRoleFilter}
                    options={[
                      { label: 'ผู้ดูแลระบบ', value: 'admin' },
                      { label: 'คณบดี', value: 'คณบดี' },
                      { label: 'รองคณบดีฝ่ายวิชาการ', value: 'รองคณบดีฝ่ายวิชาการ' },
                      { label: 'รองคณบดีฝ่ายวิจัยและนวัตถกรรม', value: 'รองคณบดีฝ่ายวิจัยและนวัตถกรรม' },
                      { label: 'รองคณบดีฝ่ายคุณภาพนิสิต', value: 'รองคณบดีฝ่ายคุณภาพนิสิต' },
                      { label: 'พนักงานฝ่ายวิชาการ', value: 'พนักงานฝ่ายวิชาการ' },
                      { label: 'พนักงานฝ่ายวิจัยและนวัตถกรรม', value: 'พนักงานฝ่ายวิจัยและนวัตถกรรม' },
                      { label: 'พนักงานฝ่ายคุณภาพนิสิต', value: 'พนักงานฝ่ายคุณภาพนิสิต' },
                      { label: 'พนักงานฝ่ายยุทธศาสตร์และพัฒนาองค์กร', value: 'พนักงานฝ่ายยุทธศาสตร์และพัฒนาองค์กร' },
                    ]}
                  />
                </Col>
                <Col xs={24} sm={8} style={{ paddingBottom: theme.spacing.md }}>
                  <Select
                    mode="multiple"
                    placeholder="กรองตามแผนก"
                    style={{ width: '100%' }}
                    onChange={handleDepartmentFilter}
                    options={[
                      { label: 'ฝ่ายวิชาการ', value: 'วิชาการ' },
                      { label: 'ฝ่ายวิจัยและนวัตกรรม', value: 'วิจัยและนวัตกรรม' },
                      { label: 'ฝ่ายคุณภาพนิสิต', value: 'คุณภาพนิสิต' },
                      { label: 'ฝ่ายยุทธศาสตร์และพัฒนาองค์กร', value: 'ยุทธศาสตร์และพัฒนาองค์กร' },
                    ]}
                  />
                </Col>
                <Col xs={24} sm={12} style={{ paddingBottom: theme.spacing.md }}>
                  <Select
                    mode="multiple"
                    placeholder="กรองตามสถานะ"
                    style={{ width: '100%' }}
                    onChange={setStatusFilter}
                    options={[
                      { label: 'ใช้งาน', value: 'active' },
                      { label: 'ไม่ใช้งาน', value: 'inactive' },
                    ]}
                  />
                </Col>
                <Col xs={24} sm={12} style={{ textAlign: 'right' }}>
                  <Button
                    type="primary"
                    icon={<UserAddOutlined />}
                    onClick={() => navigate('/dean/users/new')}
                    style={{
                      background: theme.primary,
                      borderColor: theme.primary,
                    }}
                  >
                    เพิ่มผู้ใช้
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
                dataSource={users}
                rowKey="user_id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) => `ทั้งหมด ${total} รายการ`,
                }}
              />
            </Card>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default DeanUsers; 