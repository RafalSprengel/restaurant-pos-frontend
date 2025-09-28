import React, { useEffect, useState, useRef } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext.js';
import { Badge } from '@mantine/core';
import './managementPanel.scss';
import '../styles/hamburgerIcon.scss';
import api from '../utils/axios.js';
import { useUnreadMessages } from '../context/UnreadMessagesProvider';

import {
  IconDashboard,
  IconBox,
  IconCategory,
  IconUsers,
  IconShoppingCart,
  IconMessage,
  IconSettings,
  IconTable,
  IconLogout,
} from '@tabler/icons-react';

export const ManagementPanel = () => {
  const sidebarRef = useRef(null);
  const mainRef = useRef(null);
  const hamburgerIcon = useRef(null);
  const hamburgerIconContainer = useRef(null);
  const navigate = useNavigate();
  const [errorLogout, setErrorLogout] = useState(null);
  const { isAuthenticated, logout, user, isLoading, error } = useAuth();
  const { unreadMessageCount } = useUnreadMessages();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await api.post('/auth/logout', {}, { withCredentials: true });
      logout();
      navigate('login', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Logout failed';
      setErrorLogout(msg);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleSidebar = () => {
    sidebarRef.current.classList.toggle('admin-panel__sidebar--open');
    mainRef.current.classList.toggle('admin-panel__main--overlay');
    hamburgerIcon.current.classList.toggle('hamburger-icon__container--change');
    hamburgerIconContainer.current.classList.toggle('admin-panel__sidebar-hamburger-button--open');
  };

  const hideSidebar = () => {
    sidebarRef.current.classList.remove('admin-panel__sidebar--open');
    mainRef.current.classList.remove('admin-panel__main--overlay');
    hamburgerIcon.current.classList.remove('hamburger-icon__container--change');
    hamburgerIconContainer.current.classList.remove('admin-panel__sidebar-hamburger-button--open');
  };

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('login', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

  const sidebarLinks = [
    { to: '/management', label: 'Dashboard', icon: <IconDashboard size={20} /> },
    { to: '/management/products', label: 'Products', icon: <IconBox size={20} /> },
    { to: '/management/categories', label: 'Categories', icon: <IconCategory size={20} /> },
    { to: '/management/customers', label: 'Customers', icon: <IconUsers size={20} /> },
    { to: '/management/orders', label: 'Orders', icon: <IconShoppingCart size={20} /> },
    { to: '/management/mgnts', label: 'Users', icon: <IconUsers size={20} /> },
    { to: '/management/messages', label: 'Messages', icon: <IconMessage size={20} />, badge: unreadMessageCount },
    { to: '/management/reservations', label: 'Table Reservations', icon: <IconTable size={20} /> },
    { to: '/management/settings', label: 'Settings', icon: <IconSettings size={20} /> },
  ];

  return (
    <>
      {isAuthenticated ? (
        <div className="admin-panel">
          <div className="admin-panel__header">
            <NavLink className="admin-panel__logo" to="/management">Admin panel</NavLink>
            <div className="admin-panel__user-info">
              <div>{user ? `Hi, ${user.firstName || user.surname}` : ''}</div>
              <div><span>{user?.role}</span></div>
            </div>
          </div>

          <div className="admin-panel__content">
            <div className="admin-panel__sidebar" ref={sidebarRef}>
              {sidebarLinks.map((link, idx) => (
                <NavLink
                  key={idx}
                  onClick={hideSidebar}
                  className={({ isActive }) =>
                    isActive
                      ? 'admin-panel__sidebar-item admin-panel__sidebar-item--active'
                      : 'admin-panel__sidebar-item'
                  }
                  to={link.to}
                  end={link.to === '/management'}
                  style={{ width: link.to === '/management/messages' ? '210px' : 'auto' }}
                >
                  {link.icon}
                  <span className="admin-panel__menu-text">
                    {link.label} {link.badge > 0 && <Badge color="blue">{link.badge}</Badge>}
                  </span>
                </NavLink>
              ))}

              <br />
              <span className="admin-panel__sidebar-logout" onClick={handleLogout}>
                <IconLogout size={20} />
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </span>
            </div>

            <span
              className="admin-panel__sidebar-hamburger-button"
              ref={hamburgerIconContainer}
              onClick={toggleSidebar}
            >
              <div className="hamburger-icon" ref={hamburgerIcon}>
                <div className="hamburger-icon__bar1"></div>
                <div className="hamburger-icon__bar2"></div>
                <div className="hamburger-icon__bar3"></div>
              </div>
            </span>

            <div className="admin-panel__main" ref={mainRef}>
              <div className="admin-panel__layout">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      ) : isLoading ? (
        <div className="admin-panel__loading">loading</div>
      ) : error || errorLogout ? (
        <div className="admin-panel__error">{error || errorLogout}</div>
      ) : (
        <div className="admin-panel__error">You don't have enough rights to perform this action</div>
      )}
    </>
  );
};

export default ManagementPanel;
