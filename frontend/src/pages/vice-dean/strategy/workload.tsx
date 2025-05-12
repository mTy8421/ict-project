import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Typography, Layout, Menu, Button, Table, Input, Select, Space, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axiosInstance from '../../../utils/axios';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;
const { Option } = Select;

interface Workload {
  id: number;
  name: string;
  department: string;
  assignedTo: {
    user_name: string;
    user_role: string;
  };
  status: string;
}

const StrategyViceDeanWorkload: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [data, setData] = useState<Workload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/workload/department/ฝ่ายงานบริหารทั่วไป');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: 'ชื่อ-นามสกุล',
      dataIndex: ['assignedTo', 'user_name'],
      key: 'name',
    },
    {
      title: 'ฝ่าย',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'ตำแหน่ง',
      dataIndex: ['assignedTo', 'user_role'],
      key: 'position',
    },
    {
      title: 'จำนวนงาน',
      dataIndex: 'workload',
      key: 'workload',
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'ปกติ' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
  ];

  const filteredData = data.filter(item => {
    const matchesSearch = item.assignedTo.user_name.toLowerCase().includes(searchText.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || item.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="Logo" style={{ height: '40px', marginRight: '16px' }} />
          <Title level={4} style={{ color: 'white', margin: 0 }}>Support Staff Workload - System ICT</Title>
        </div>
        <div style={{ color: 'white' }}>
          <span>รองคณบดีฝ่ายยุทธศาสตร์และพัฒนาองค์กร</span>
          <Button type="link" style={{ color: 'white', marginLeft: '16px' }}>ออกจากระบบ</Button>
        </div>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['2']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item key="1">
              <Link to="/vice-dean/strategy">หน้าหลัก</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/vice-dean/strategy/workload">ภาระงาน</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
            <Title level={3}>ภาระงานเจ้าหน้าที่</Title>
            <Space style={{ marginBottom: 16 }}>
              <Input
                placeholder="ค้นหาชื่อ-นามสกุล"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                style={{ width: 200 }}
              />
              <Select
                defaultValue="all"
                style={{ width: 200 }}
                onChange={value => setSelectedDepartment(value)}
              >
                <Option value="all">ทุกฝ่าย</Option>
                <Option value="ฝ่ายงานบริหารทั่วไป">ฝ่ายงานบริหารทั่วไป</Option>
              </Select>
            </Space>
            <Table columns={columns} dataSource={filteredData} />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default StrategyViceDeanWorkload; 