import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Layout, Menu, Button, Avatar, Dropdown, Modal, Typography, Descriptions, Row, Col, Switch, Select, Form, Input } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  TeamOutlined,
  DesktopOutlined,
  ProjectOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";
import "antd/dist/reset.css";

// Import components for different pages
import BusinessDashboard from "./components/BusinessDashboard";
import AccountingDashboard from "./components/Accounting";
import ProjectManagement from "./components/ProjectManagement";
import HumanManagement from "./components/HumanManagement";
import CRM from "./components/CRM";

const { Header, Sider, Content, Footer } = Layout;
const { Title } = Typography;
const { Option } = Select;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [userProfile, setUserProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Administrator",
    department: "IT",
    joinDate: "2022-01-01",
    lastLogin: "2023-04-15 09:30 AM",
  });
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'en',
    notifications: true,
    twoFactorAuth: false,
  });
  const [userSettings, setUserSettings] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "+1 (555) 123-4567",
    jobTitle: "Software Engineer",
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const showModal = (content) => {
    setModalContent(content);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleSettingChange = (setting, value) => {
    setUserSettings(prevSettings => ({
      ...prevSettings,
      [setting]: value
    }));
  };

  const renderModalContent = () => {
    switch (modalContent) {
      case "Profile":
        return (
          <>
            <Row gutter={[16, 16]} align="middle" justify="center">
              <Col>
                <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
              </Col>
              <Col>
                <Title level={4}>{userProfile.name}</Title>
                <Typography.Text type="secondary">{userProfile.role}</Typography.Text>
              </Col>
            </Row>
            <Descriptions bordered column={1} style={{ marginTop: '20px' }}>
              <Descriptions.Item label="Email">{userProfile.email}</Descriptions.Item>
              <Descriptions.Item label="Department">{userProfile.department}</Descriptions.Item>
              <Descriptions.Item label="Join Date">{userProfile.joinDate}</Descriptions.Item>
              <Descriptions.Item label="Last Login">{userProfile.lastLogin}</Descriptions.Item>
            </Descriptions>
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <Button type="primary" onClick={handleModalCancel}>Close</Button>
            </div>
          </>
        );
      case "Settings":
        return (
          <Form layout="vertical">
            <Form.Item label="Full Name">
              <Input 
                value={userSettings.fullName} 
                onChange={(e) => handleSettingChange('fullName', e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Email">
              <Input 
                value={userSettings.email} 
                onChange={(e) => handleSettingChange('email', e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Phone Number">
              <Input 
                value={userSettings.phoneNumber} 
                onChange={(e) => handleSettingChange('phoneNumber', e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Job Title">
              <Input 
                value={userSettings.jobTitle} 
                onChange={(e) => handleSettingChange('jobTitle', e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={handleModalCancel}>Save Changes</Button>
            </Form.Item>
          </Form>
        );
      case "Logout":
        return (
          <>
            <p>Are you sure you want to logout?</p>
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <Button onClick={handleModalCancel} style={{ marginRight: '10px' }}>Cancel</Button>
              <Button type="primary" danger onClick={handleModalCancel}>Confirm Logout</Button>
            </div>
          </>
        );
      default:
        return <p>This is the {modalContent} modal content.</p>;
    }
  };

  // Define routes with appropriate paths and icons
  const routes = [
    { path: "/", name: "Dashboard", icon: <TeamOutlined /> },
    { path: "/accounting", name: "Accounting", icon: <DesktopOutlined /> },
    { path: "/projects", name: "Projects", icon: <ProjectOutlined /> },
    { path: "/human-management", name: "Human Management", icon: <UserOutlined /> },
    { path: "/crm", name: "CRM", icon: <CustomerServiceOutlined /> },
  ];

  // Define the profile menu items
  const profileMenu = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />} onClick={() => showModal("Profile")}>
        Profile
      </Menu.Item>
      <Menu.Item key="2" icon={<SettingOutlined />} onClick={() => showModal("Settings")}>
        Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3" icon={<LogoutOutlined />} onClick={() => showModal("Logout")}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={isMobile ? true : collapsed}
          breakpoint="lg"
          collapsedWidth={isMobile ? 0 : 80}
          theme="dark"
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <div className="logo" style={{ 
            height: '32px', 
            margin: '16px', 
            background: 'rgba(255, 255, 255, 0.2)', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            color: '#fff',
            fontSize: collapsed ? '14px' : '18px',
            fontWeight: 'bold',
          }}>
            {collapsed ? "GF" : "GeneratedFIRE"}
          </div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["0"]}>
            {routes.map((route, index) => (
              <Menu.Item key={index} icon={route.icon}>
                <Link to={route.path}>{route.name}</Link>
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Layout className="site-layout" style={{ marginLeft: isMobile ? 0 : (collapsed ? 80 : 200) }}>
          <Header
            className="site-layout-background"
            style={{
              padding: '0 16px',
              background: '#001529', // Changed from '#fff' to '#001529' (dark color)
              boxShadow: '0 1px 4px rgba(0,21,41,.08)',
              position: 'sticky',
              top: 0,
              zIndex: 1,
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={toggleCollapsed}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
                color: '#fff', // Added to make the icon white for better visibility
              }}
            />
            <Dropdown overlay={profileMenu} placement="bottomRight" arrow>
              <Avatar
                icon={<UserOutlined />}
                style={{ 
                  backgroundColor: '#1890ff', 
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                size={isMobile ? "small" : "default"}
              >
                <UserOutlined style={{ fontSize: isMobile ? '14px' : '18px' }} />
              </Avatar>
            </Dropdown>
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: '#fff',
              minHeight: 280,
            }}
          >
            <Routes>
              <Route path="/" element={<BusinessDashboard />} />
              <Route path="/accounting" element={<AccountingDashboard />} />
              <Route path="/projects" element={<ProjectManagement />} />
              <Route path="/human-management" element={<HumanManagement />} />
              <Route path="/crm" element={<CRM />} />
              {/* Add new routes for profile and settings */}
              <Route path="/profile" element={<div>Profile Page</div>} />
              <Route path="/settings" element={<div>Settings Page</div>} />
            </Routes>
          </Content>
          <Footer style={{ 
            textAlign: 'center', 
            background: '#001529', 
            color: '#fff',
            padding: '15px 0',
            fontSize: '14px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <span style={{ marginRight: '5px' }}>©</span>
            {new Date().getFullYear()} BlancAI. All rights reserved.
          </Footer>
        </Layout>
      </Layout>
      <Modal
        title={null}
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={400}
      >
        {renderModalContent()}
      </Modal>
    </Router>
  );
};

export default App;