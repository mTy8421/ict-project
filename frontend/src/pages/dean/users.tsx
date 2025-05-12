import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Typography, Layout, Menu, Button, Row, Col, Table, Tag, Space, Input, Select, Avatar, Tooltip, Modal, message } from 'antd';
import { SearchOutlined, UserAddOutlined, SyncOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axiosInstance from '../../utils/axios';
import { logout } from '../home/home';
import theme from '../../theme';
import {
  UserOutlined,
  FileTextOutlined,
  BarChartOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import DeanHeader from '../../components/dean/Header';
import DeanNavbar from '../../components/dean/Navbar';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'dean' | 'staff';
  department: string;
  status: 'active' | 'inactive';
}

const DeanUsers: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState<string[]>([]);
  const [departmentFilter, setDepartmentFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = async (value: string) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/users/search?query=${value}`);
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
        const response = await axiosInstance.get('/users');
        setUsers(response.data);
      } else {
        const response = await axiosInstance.get(`/users/filter?department=${value[0]}`);
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error filtering users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'ยืนยันการลบ',
      content: 'คุณต้องการลบผู้ใช้นี้ใช่หรือไม่?',
      okText: 'ยืนยัน',
      cancelText: 'ยกเลิก',
      onOk: async () => {
        try {
          await axiosInstance.delete(`/users/${id}`);
          message.success('ลบผู้ใช้สำเร็จ');
          fetchUsers();
        } catch (error) {
          console.error('Error deleting user:', error);
          message.error('ไม่สามารถลบผู้ใช้ได้');
        }
      },
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'red';
      case 'dean':
        return 'blue';
      case 'staff':
        return 'green';
      default:
        return 'default';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'ผู้ดูแลระบบ';
      case 'dean':
        return 'คณบดี';
      case 'staff':
        return 'พนักงาน';
      default:
        return role;
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'success' : 'default';
  };

  const getStatusText = (status: string) => {
    return status === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน';
  };

  const columns = [
    {
      title: 'ชื่อผู้ใช้',
      dataIndex: 'username',
      key: 'username',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'อีเมล',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'แผนก',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'บทบาท',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={getRoleColor(role)}>
          {getRoleText(role)}
        </Tag>
      ),
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'จัดการ',
      key: 'action',
      render: (record: User) => (
        <Space size="middle">
          <Tooltip title="แก้ไข">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/dean/users/${record.id}/edit`)}
              style={{ color: theme.primary }}
            />
          </Tooltip>
          <Tooltip title="ลบ">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
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
      <DeanHeader />
      <Layout style={{ height: 'calc(100vh - 70px)' }}>
        <DeanNavbar />
        <Layout style={{ padding: theme.spacing.xl, overflow: 'auto' }}>
          <Content style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ 
              marginBottom: theme.spacing.xl,
              background: theme.white,
              padding: theme.spacing.xl,
              borderRadius: theme.borderRadius.lg,
              boxShadow: theme.shadow,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Title level={3} style={{ margin: 0, color: theme.primary, fontWeight: theme.fontWeight.semibold }}>
                    จัดการผู้ใช้
                  </Title>
                  <Text style={{ color: theme.textLight, marginTop: theme.spacing.sm, display: 'block' }}>
                    ดูและจัดการผู้ใช้ทั้งหมดในระบบ
                  </Text>
                </div>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => navigate('/dean/users/new')}
                  style={{
                    background: theme.primary,
                    borderColor: theme.primary,
                    height: '45px',
                    padding: `0 ${theme.spacing.xl}`,
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.fontSize.md,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: theme.spacing.sm,
                  }}
                >
                  เพิ่มผู้ใช้
                </Button>
              </div>
            </div>

            <Card
              style={{
                borderRadius: theme.borderRadius.lg,
                boxShadow: theme.shadow,
                background: theme.white,
              }}
              bodyStyle={{ padding: theme.spacing.xl }}
            >
              <Table
                columns={columns}
                dataSource={users}
                rowKey="id"
                loading={loading}
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