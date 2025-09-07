import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Typography, Layout, Button, Table, Space, Tooltip } from "antd";
import { EditOutlined } from "@ant-design/icons";
import theme from "../../theme";
import DeanHeader from "../../components/admin/Header";
import DeanNavbar from "../../components/admin/Navbar";
import ReHeader from "../../components/admin/NavbarHeader";

const { Content } = Layout;
const { Title, Text } = Typography;

const AdminConfig: React.FC = () => {
  const navigate = useNavigate();

  const dataSourceTalbe = [
    {
      key: "user_name",
      user_name: "ความสำคัญ",
      id: "priority",
    },
  ];

  const columns = [
    {
      title: "หัวข้อ",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      title: "จัดการ",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Tooltip title="แก้ไข">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/admin/config/${record.id}`)}
              style={{ color: theme.primary }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", background: theme.background }}>
      <div className="hidden md:block">
        <DeanHeader />
      </div>

      <div className="md:hidden">
        <ReHeader />
      </div>

      <Layout style={{ height: "calc(100vh - 70px)" }}>
        <div className="hidden md:block">
          <DeanNavbar />
        </div>

        <Layout style={{ padding: theme.spacing.xl, overflow: "auto" }}>
          <div className="hidden md:block">
            <Content style={{ maxWidth: "1200px", margin: "0 15%" }}>
              <div
                style={{
                  marginBottom: theme.spacing.xl,
                  background: theme.white,
                  padding: theme.spacing.xl,
                  borderRadius: theme.borderRadius.lg,
                  boxShadow: theme.shadow,
                }}
              >
                <div
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <Title
                      level={3}
                      style={{
                        margin: 0,
                        color: theme.primary,
                        fontWeight: theme.fontWeight.semibold,
                      }}
                    >
                      ตั่งค่าระบบ
                    </Title>
                    <Text
                      style={{
                        color: theme.textLight,
                        marginTop: theme.spacing.sm,
                        display: "block",
                      }}
                    >
                      ปรับแต่งตั่งค่าระบบ
                    </Text>
                  </div>
                </div>
              </div>

              <Card
                style={{
                  borderRadius: theme.borderRadius.lg,
                  boxShadow: theme.shadow,
                  background: theme.white,
                }}
                // bodyStyle={{ padding: theme.spacing.xl }}
              >
                <Table
                  columns={columns}
                  dataSource={dataSourceTalbe}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `ทั้งหมด ${total} รายการ`,
                  }}
                />
              </Card>
            </Content>
          </div>

          <div className="md:hidden">
            <Content style={{ width: "100%", margin: "0 auto" }}>
              <div
                style={{
                  marginBottom: theme.spacing.xl,
                  background: theme.white,
                  padding: theme.spacing.xl,
                  borderRadius: theme.borderRadius.lg,
                  boxShadow: theme.shadow,
                }}
              >
                <div>
                  <div>
                    <Title
                      level={3}
                      style={{
                        margin: 0,
                        color: theme.primary,
                        fontWeight: theme.fontWeight.semibold,
                      }}
                    >
                      ตั่งค่าระบบ
                    </Title>
                    <Text
                      style={{
                        color: theme.textLight,
                        marginTop: theme.spacing.sm,
                        display: "block",
                      }}
                    >
                      ปรับแต่งตั่งค่าระบบ
                    </Text>
                  </div>
                </div>
              </div>

              <Card
                style={{
                  borderRadius: theme.borderRadius.lg,
                  boxShadow: theme.shadow,
                  background: theme.white,
                }}
                // bodyStyle={{ padding: theme.spacing.xl }}
              >
                <div style={{ width: "100%", overflowX: "auto" }}>
                  <Table
                    columns={columns}
                    dataSource={dataSourceTalbe}
                    rowKey="id"
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showTotal: (total) => `ทั้งหมด ${total} รายการ`,
                    }}
                    scroll={{ x: "max-content" }}
                  />
                </div>
              </Card>
            </Content>
          </div>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminConfig;
