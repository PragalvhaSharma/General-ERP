import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Layout, Menu, Button, Avatar, Dropdown, Modal } from "antd";
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

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);

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
                style={{ backgroundColor: '#1890ff', cursor: 'pointer' }}
                size={isMobile ? "small" : "default"}
              />
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
        title={modalContent}
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <p>This is the {modalContent} modal content.</p>
        {modalContent === "Logout" && (
          <Button type="primary" danger onClick={handleModalCancel}>
            Confirm Logout
          </Button>
        )}
      </Modal>
    </Router>
  );
};

export default App;