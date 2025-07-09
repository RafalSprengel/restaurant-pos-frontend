import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext.js';
import { Badge } from '@mantine/core';
import '../styles/management.scss';
import api from '../utils/axios.js';
import { useUnreadMessages } from '../context/UnreadMessagesProvider';

export const Management = () => {
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
                    <div className="admin">
                         <div className="admin__header">
                              <div className="admin__logo">
                                   <span className="material-symbols-outlined">share_location</span>
                                   <span>Clever Food</span>
                              </div>
                              <div className="admin__gap"></div>
                              <div
                                   className="admin__title"
                                   style={{
                                        display: 'flex',
                                        alignItems: 'start',
                                        gap: '10px',
                                   }}>
                                   <div>{user ? 'Hello, ' + user.name + ' ' + user.surname : ''}</div>
                                   <details>
                                        <summary>{user?.role}</summary>
                                        <div
                                             onClick={handleLogout}
                                             style={{
                                                  cursor: 'pointer',
                                                  display: 'flex',
                                                  alignItems: 'center',
                                             }}>
                                             <span>Logout</span>
                                             <span className="material-symbols-outlined">logout</span>
                                        </div>
                                   </details>
                                   <div
                                        style={{
                                             display: 'flex',
                                             alignItems: 'start',
                                        }}>
                                        <span className="material-symbols-outlined">account_circle</span>
                                   </div>
                              </div>
                         </div>
                         <div className="admin__content">
                              <div className="admin__left">
                                   <NavLink
                                        className={({ isActive }) => (isActive ? 'admin__menuItem--active admin__menuItem' : 'admin__menuItem')}
                                        to="/management"
                                        end>
                                        {<span className="admin__menuText">Dashboard</span>}
                                   </NavLink>

                                   <NavLink
                                        className={({ isActive }) => (isActive ? 'admin__menuItem--active admin__menuItem' : 'admin__menuItem')}
                                        to="/management/products">
                                        {<span className="admin__menuText">Products</span>}
                                   </NavLink>

                                   <NavLink
                                        className={({ isActive }) => (isActive ? 'admin__menuItem--active admin__menuItem' : 'admin__menuItem')}
                                        to="/management/categories">
                                        {<span className="admin__menuText">Categories</span>}
                                   </NavLink>

                                   <NavLink
                                        className={({ isActive }) => (isActive ? 'admin__menuItem--active admin__menuItem' : 'admin__menuItem')}
                                        to="/management/customers">
                                        {<span className="admin__menuText">Customers</span>}
                                   </NavLink>

                                   <NavLink
                                        className={({ isActive }) => (isActive ? 'admin__menuItem--active admin__menuItem' : 'admin__menuItem')}
                                        to="/management/orders">
                                        {<span className="admin__menuText">Orders</span>}
                                   </NavLink>

                                   {user?.role === 'admin' && (
                                        <NavLink
                                             className={({ isActive }) => (isActive ? 'admin__menuItem--active admin__menuItem' : 'admin__menuItem')}
                                             to="/management/mgnts">
                                             {<span className="admin__menuText">Users</span>}
                                        </NavLink>
                                   )}

                                   <NavLink
                                        className={({ isActive }) => (isActive ? 'admin__menuItem--active admin__menuItem' : 'admin__menuItem')}
                                        to="/management/messages">
                                        {<span className="admin__menuText">Messages &nbsp;
                                             {unreadMessageCount > 0 &&
                                                  <Badge color="blue">{unreadMessageCount}</Badge>
                                             }
                                        </span>}
                                   </NavLink>

                                   <NavLink
                                        className={({ isActive }) => (isActive ? 'admin__menuItem--active admin__menuItem' : 'admin__menuItem')}
                                        to="/management/reservations">
                                        {<span className="admin__menuText">Table Reservations</span>}
                                   </NavLink>

                                   <NavLink
                                        className={({ isActive }) => (isActive ? 'admin__menuItem--active admin__menuItem' : 'admin__menuItem')}
                                        to="/management/settings">
                                        {<span className="admin__menuText">Settings</span>}
                                   </NavLink>
                              </div>
                              <div className="admin__right">
                                   <main className="admin-layout">
                                        <Outlet />
                                   </main>
                              </div>
                         </div>
                    </div >
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
