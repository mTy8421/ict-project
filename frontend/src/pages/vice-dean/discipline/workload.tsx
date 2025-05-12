import React, { useEffect, useState } from 'react';
import { Layout, Table, Button, Space, Tag, Input, Select, DatePicker } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axios';
import theme from '../../../theme';
import ViceDeanHeader from '../../../components/vice-dean/Header';
import ViceDeanNavbar from '../../../components/vice-dean/Navbar';

const { Content } = Layout;
const { RangePicker } = DatePicker;

interface Workload {
  id: number;
  title: string;
  department: string;
  assignedTo: {
    user_name: string;
  };
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

const ViceDeanDisciplineWorkload: React.FC = () => {
  const navigate = useNavigate();
  const [workloads, setWorkloads] = useState<Workload[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  useEffect(() => {
    fetchWorkloads();
  }, []);

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

  const getStatusTag = (status: string) => {
    const statusConfig = {
      pending: { color: 'warning', text: 'รอดำเนินการ' },
      in_progress: { color: 'processing', text: 'กำลังดำเนินการ' },
      completed: { color: 'success', text: 'เสร็จสิ้น' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getPriorityTag = (priority: string) => {
    const priorityConfig = {
      low: { color: 'success', text: 'ต่ำ' },
      medium: { color: 'warning', text: 'ปานกลาง' },
      high: { color: 'error', text: 'สูง' },
    };
    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns = [
    {
      title: 'หัวข้อ',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Workload) => (
        <a onClick={() => navigate(`/vice-dean/discipline/workload/${record.id}`)}>{text}</a>
      ),
    },
    {
      title: 'แผนก',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'ผู้รับผิดชอบ',
      dataIndex: ['assignedTo', 'user_name'],
      key: 'assignedTo',
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'ความสำคัญ',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => getPriorityTag(priority),
    },
    {
      title: 'วันที่สร้าง',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('th-TH'),
    },
    {
      title: 'จัดการ',
      key: 'action',
      render: (_: any, record: Workload) => (
        <Space size="middle">
          <Button type="link" onClick={() => navigate(`/vice-dean/discipline/workload/${record.id}/edit`)}>
            แก้ไข
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            ลบ
          </Button>
        </Space>
      ),
    },
  ];

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/workload/${id}`);
      fetchWorkloads();
    } catch (error) {
      console.error('Error deleting workload:', error);
    }
  };

  const filteredWorkloads = workloads.filter(workload => {
    const matchesSearch = workload.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         workload.department.toLowerCase().includes(searchText.toLowerCase()) ||
                         workload.assignedTo.user_name.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !statusFilter || workload.status === statusFilter;
    const matchesPriority = !priorityFilter || workload.priority === priorityFilter;
    const matchesDate = !dateRange || (
      new Date(workload.createdAt) >= new Date(dateRange[0]) &&
      new Date(workload.createdAt) <= new Date(dateRange[1])
    );
    return matchesSearch && matchesStatus && matchesPriority && matchesDate;
  });

  return (
    <Layout style={{ minHeight: '100vh', background: theme.background }}>
      <ViceDeanHeader role="รองคณบดีฝ่ายวินัย" />
      <Layout style={{ height: 'calc(100vh - 70px)' }}>
        <ViceDeanNavbar basePath="/vice-dean/discipline" />
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
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <h2 style={{ 
                margin: 0, 
                color: theme.primary, 
                fontWeight: theme.fontWeight.semibold,
                fontSize: theme.fontSize.xxl,
                letterSpacing: '0.5px',
              }}>
                จัดการภาระงาน
              </h2>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate('/vice-dean/discipline/workload/new')}
                style={{
                  background: theme.primary,
                  borderColor: theme.primary,
                  height: '40px',
                  padding: `0 ${theme.spacing.xl}`,
                  borderRadius: theme.borderRadius.md,
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.sm,
                }}
              >
                สร้างภาระงานใหม่
              </Button>
            </div>
            <div style={{ 
              padding: `0 ${theme.spacing.xl} ${theme.spacing.xl}`,
              display: 'flex',
              gap: theme.spacing.md,
              flexWrap: 'wrap',
            }}>
              <Input
                placeholder="ค้นหาภาระงาน..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                style={{ width: '300px' }}
              />
              <Select
                placeholder="สถานะ"
                allowClear
                style={{ width: '150px' }}
                onChange={value => setStatusFilter(value)}
              >
                <Select.Option value="pending">รอดำเนินการ</Select.Option>
                <Select.Option value="in_progress">กำลังดำเนินการ</Select.Option>
                <Select.Option value="completed">เสร็จสิ้น</Select.Option>
              </Select>
              <Select
                placeholder="ความสำคัญ"
                allowClear
                style={{ width: '150px' }}
                onChange={value => setPriorityFilter(value)}
              >
                <Select.Option value="low">ต่ำ</Select.Option>
                <Select.Option value="medium">ปานกลาง</Select.Option>
                <Select.Option value="high">สูง</Select.Option>
              </Select>
              <RangePicker
                onChange={(dates) => {
                  if (dates) {
                    setDateRange([
                      dates[0]?.toISOString() || '',
                      dates[1]?.toISOString() || '',
                    ]);
                  } else {
                    setDateRange(null);
                  }
                }}
              />
            </div>
            <div style={{ padding: `0 ${theme.spacing.xl} ${theme.spacing.xl}` }}>
              <Table
                columns={columns}
                dataSource={filteredWorkloads}
                loading={loading}
                rowKey="id"
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

export default ViceDeanDisciplineWorkload; 