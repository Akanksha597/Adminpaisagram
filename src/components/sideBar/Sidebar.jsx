import React, { useState } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileTextOutlined,
  PictureOutlined,
  StarOutlined,
  LogoutOutlined,
  AppstoreOutlined,
  PhoneOutlined,
  TeamOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { toast } from 'react-toastify';
import Shreelogo from '../../assets/logo/Paisagramindia_Logo_.webp';
import axios from "axios";
import './Sidebar.css';

const API_URL = import.meta.env.VITE_API_BASE_URL;
const { Header, Sider, Content } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const location = useLocation();

  const pathToKeyMap = {
    '/admin': '1',
    '/admin/courses/list': '2',
    '/admin/banner': '3',
    '/admin/batches/list': '4',
    '/admin/testimonials': '5',
    '/admin/contact': '6',
    '/admin/portfolio': '7',
    '/admin/employees/list': '8',
    '/admin/employees/leaves': '9',
    '/admin/career/jobs': '10',
    '/admin/career/applications': '11',
  };

  const selectedKey = pathToKeyMap[location.pathname] || '';

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const siderWidth = collapsed ? 80 : 200;

  // Logout function without alert
const handleLogout = () => {
  const ToastContent = ({ closeToast }) => (
    <div>
      <p>⚠️ Are you sure you want to log out?</p>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button
          style={{
            background: '#f0f0f0',
            border: '1px solid #ccc',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          onClick={() => closeToast()} // Cancel
        >
          No
        </button>
        <button
          style={{
            background: '#1890ff',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          onClick={() => {
            // Clear data and logout
            localStorage.clear();
            sessionStorage.clear();
            logout();
            navigate('/');
            toast.dismiss(); // close the confirmation toast
            toast.success('✅ Logged out successfully', { autoClose: 2000, icon: false });
          }}
        >
          Yes
        </button>
      </div>
    </div>
  );

  toast.info(<ToastContent />, {
    position: "top-center",
    autoClose: false,
    closeOnClick: false,
    draggable: false,
    icon: false, // remove the spinning/info icon
  });
};


  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={200}
        collapsedWidth={80}
        collapsible
        collapsed={collapsed}
        trigger={null}
        className="sidebar"
      >
        {/* Logo */}
        <div className="logo-box">
          <img
            src={Shreelogo}
            alt="Logo"
            className={`logo ${collapsed ? "collapsed" : ""}`}
          />
        </div>

        {/* Menu */}
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          className="menu"
          items={[
            { key: '1', icon: <AppstoreOutlined />, label: 'Dashboard', onClick: () => navigate('/admin') },
            { key: '2', icon: <FileTextOutlined />, label: 'Event', onClick: () => navigate('/admin/Eventlist') },
             { key: '3', icon: <TeamOutlined />, label: 'Users', onClick: () => navigate('/admin/CampaignUsers') },
               { key: '4', icon: <TeamOutlined />, label: 'Participants', onClick: () => navigate('/admin/participation') },
            { key: '5', icon: <TeamOutlined />, label: 'Groups', onClick: () => navigate('/admin/creategroup') },
             { key: '6', icon: <TeamOutlined />, label: 'Reports', onClick: () => navigate('/admin/reports') },
            { key: 'logout', icon: <LogoutOutlined />, label: 'Log Out', onClick: handleLogout },
          ]}
        />
      </Sider>

      <Layout style={{ marginLeft: siderWidth, transition: "margin-left 0.3s" }}>
        <Header className="header">
          {/* Collapse Button */}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="collapse-btn"
          />

          {/* Right Section */}
          <div className="header-right">
            <GlobalOutlined className="header-icon" />
          </div>
        </Header>

        <Content className="content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Sidebar;
