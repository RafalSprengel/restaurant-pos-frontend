import React, { useEffect, useState, useRef } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext.js';
import { Badge } from '@mantine/core';
import '../styles/management-panel.scss';
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

export const Management = () => {
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const [errorLogout, setErrorLogout] = useState(null);
  const { isAuthenticated, logout, user, isLoading, error } = useAuth();
  const { unreadMessageCount } = useUnreadMessages();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout', {}, { withCredentials: true });
      logout();
      navigate('login', { replace: true });
    } catch (error) {
      console.error('Error during logout:', error);
      setErrorLogout('Logout failed: ' + error.message);
    }
  };

  const toggleSidebar = () => {
    sidebarRef.current.classList.toggle('admin-panel__sidebar--open');
  }

  const hideSidebar = () => {
    sidebarRef.current.classList.remove('admin-panel__sidebar--open');
  }


  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('login', { replace: true });
      } else if (user && !['member', 'moderator', 'admin'].includes(user.role)) {
        navigate('/customer/', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  return (
    <>
      {isAuthenticated ? (
        <div className="admin-panel">
          <div className="admin-panel__header">
            <div className="admin-panel__logo">
              <span>Admin panel</span>
            </div>
            <div className="admin-panel__user-info">
              <div>{user ? 'Hi, ' + user.firstName : ''}</div>
              <div>
                <span>{user?.role}</span>
              </div>
            </div>
          </div>

          <div className="admin-panel__content">
            <div className="admin-panel__sidebar" ref={sidebarRef}>
              <NavLink
                onClick={hideSidebar}
                className={({ isActive }) =>
                  isActive
                    ? 'admin-panel__sidebar-item admin-panel__sidebar-item--active'
                    : 'admin-panel__sidebar-item'
                }
                to="/management"
                end
              >
                <IconDashboard size={20} />
                <span className="admin-panel__menu-text">Dashboard</span>
              </NavLink>

              <NavLink
                onClick={hideSidebar}
                className={({ isActive }) =>
                  isActive
                    ? 'admin-panel__sidebar-item admin-panel__sidebar-item--active'
                    : 'admin-panel__sidebar-item'
                }
                to="/management/products"
              >
                <IconBox size={20} />
                <span className="admin-panel__menu-text">Products</span>
              </NavLink>

              <NavLink
                onClick={hideSidebar}
                className={({ isActive }) =>
                  isActive
                    ? 'admin-panel__sidebar-item admin-panel__sidebar-item--active'
                    : 'admin-panel__sidebar-item'
                }
                to="/management/categories"
              >
                <IconCategory size={20} />
                <span className="admin-panel__menu-text">Categories</span>
              </NavLink>

              <NavLink
                onClick={hideSidebar}
                className={({ isActive }) =>
                  isActive
                    ? 'admin-panel__sidebar-item admin-panel__sidebar-item--active'
                    : 'admin-panel__sidebar-item'
                }
                to="/management/customers"
              >
                <IconUsers size={20} />
                <span className="admin-panel__menu-text">Customers</span>
              </NavLink>

              <NavLink
                onClick={hideSidebar}
                className={({ isActive }) =>
                  isActive
                    ? 'admin-panel__sidebar-item admin-panel__sidebar-item--active'
                    : 'admin-panel__sidebar-item'
                }
                to="/management/orders"
              >
                <IconShoppingCart size={20} />
                <span className="admin-panel__menu-text">Orders</span>
              </NavLink>

              {user?.role === 'admin' && (
                <NavLink
                  onClick={hideSidebar}
                  className={({ isActive }) =>
                    isActive
                      ? 'admin-panel__sidebar-item admin-panel__sidebar-item--active'
                      : 'admin-panel__sidebar-item'
                  }
                  to="/management/mgnts"
                >
                  <IconUsers size={20} />
                  <span className="admin-panel__menu-text">Users</span>
                </NavLink>
              )}

              <NavLink
                onClick={hideSidebar}
                style={{ width: '210px' }}
                className={({ isActive }) =>
                  isActive
                    ? 'admin-panel__sidebar-item admin-panel__sidebar-item--active'
                    : 'admin-panel__sidebar-item'
                }
                to="/management/messages"
              >
                <IconMessage size={20} />
                <span className="admin-panel__menu-text">
                  Messages &nbsp;
                  {unreadMessageCount > 0 && <Badge color="blue">{unreadMessageCount}</Badge>}
                </span>
              </NavLink>

              <NavLink
                onClick={hideSidebar}
                className={({ isActive }) =>
                  isActive
                    ? 'admin-panel__sidebar-item admin-panel__sidebar-item--active'
                    : 'admin-panel__sidebar-item'
                }
                to="/management/reservations"
              >
                <IconTable size={20} />
                <span className="admin-panel__menu-text">Table Reservations</span>
              </NavLink>

              <NavLink
                onClick={hideSidebar}
                className={({ isActive }) =>
                  isActive
                    ? 'admin-panel__sidebar-item admin-panel__sidebar-item--active'
                    : 'admin-panel__sidebar-item'
                }
                to="/management/settings"
              >
                <IconSettings size={20} />
                <span className="admin-panel__menu-text">Settings</span>
              </NavLink>

              <br />

              <span className="admin-panel__sidebar-logout" onClick={handleLogout}>
                <IconLogout size={20} />
                Logout
              </span>
            </div>

            <div className="admin-panel__main">
              <div className="admin-panel__layout">
                <span className='admin-panel__sidebar-mobile-butt' onClick={toggleSidebar}>BUTT</span>
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      ) : isLoading ? (
        <>loading</>
      ) : error ? (
        <>{error}</>
      ) : errorLogout ? (
        <>{errorLogout}</>
      ) : (
        <>Access denied</>
      )}
    </>
  );
};

export default Management;
