import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext.js';
import '../styles/management.scss';
import api from '../utils/axios.js';

export const Management = () => {
     const navigate = useNavigate();
     const [errorLogout, setErrorLogout] = useState(null);
     const { isAuthenticated, logout, user, isLoading, error } = useAuth();

     const handleLogout = () => {
          try {
               api.post('/auth/logout', {
                    withCredentials: true,
               });
               logout();
               navigate('login', { replace: true });
          } catch (error) {
               console.error('Error during logout:', error);
               setErrorLogout('Logout failed: ' + error.message);
          }
     };

     useEffect(() => {
          if (user && !['member', 'moderator', 'admin'].includes(user.role)) {
               navigate('/customer/', { replace: true });
          }
          if (!isLoading && !isAuthenticated) {
               navigate('login', { replace: true });
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
                                        {({ isActive }) => (
                                             <>
                                                  <span className={isActive ? 'admin__menuSymbol admin__menuSymbol--active' : 'admin__menuSymbol'}>
                                                       &#8283;
                                                  </span>
                                                  Dashboard
                                             </>
                                        )}
                                   </NavLink>

                                   <NavLink
                                        className={({ isActive }) => (isActive ? 'admin__menuItem--active admin__menuItem' : 'admin__menuItem')}
                                        to="/management/products">
                                        {({ isActive }) => (
                                             <>
                                                  <span className={isActive ? 'admin__menuSymbol admin__menuSymbol--active' : 'admin__menuSymbol'}>
                                                       &#8283;
                                                  </span>
                                                  Products
                                             </>
                                        )}
                                   </NavLink>
                                   <NavLink
                                        className={({ isActive }) => (isActive ? 'admin__menuItem--active admin__menuItem' : 'admin__menuItem')}
                                        to="/management/categories">
                                        {({ isActive }) => (
                                             <>
                                                  <span className={isActive ? 'admin__menuSymbol admin__menuSymbol--active' : 'admin__menuSymbol'}>
                                                       &#10025;
                                                  </span>
                                                  Categories
                                             </>
                                        )}
                                   </NavLink>
                                   <NavLink
                                        className={({ isActive }) => (isActive ? 'admin__menuItem--active admin__menuItem' : 'admin__menuItem')}
                                        to="/management/customers">
                                        {({ isActive }) => (
                                             <>
                                                  <span className={isActive ? 'admin__menuSymbol admin__menuSymbol--active' : 'admin__menuSymbol'}>
                                                       &#9823;
                                                  </span>
                                                  Customers
                                             </>
                                        )}
                                   </NavLink>
                                   <NavLink
                                        className={({ isActive }) => (isActive ? 'admin__menuItem--active admin__menuItem' : 'admin__menuItem')}
                                        to="/management/orders">
                                        {({ isActive }) => (
                                             <>
                                                  <span className={isActive ? 'admin__menuSymbol admin__menuSymbol--active' : 'admin__menuSymbol'}>
                                                       &#10004;
                                                  </span>
                                                  <span className="admin__menuText">Orders</span>
                                             </>
                                        )}
                                   </NavLink>
                                   {user?.role === 'admin' && (
                                        <NavLink
                                             className={({ isActive }) => (isActive ? 'admin__menuItem--active admin__menuItem' : 'admin__menuItem')}
                                             to="/management/mgnts">
                                             {({ isActive }) => (
                                                  <>
                                                       <span className={isActive ? 'admin__menuSymbol admin__menuSymbol--active' : 'admin__menuSymbol'}>
                                                            &#10004;
                                                       </span>
                                                       <span className="admin__menuText">Managements</span>
                                                  </>
                                             )}
                                        </NavLink>
                                   )}
                                    <NavLink
                                        className={({ isActive }) => (isActive ? 'admin__menuItem--active admin__menuItem' : 'admin__menuItem')}
                                        to="/management/messages">
                                        {({ isActive }) => (
                                             <>
                                                  <span className={isActive ? 'admin__menuSymbol admin__menuSymbol--active' : 'admin__menuSymbol'}>
                                                       &#10004;
                                                  </span>
                                                  <span className="admin__menuText">Messages</span>
                                             </>
                                        )}
                                   </NavLink>
                                   <NavLink
                                        className={({ isActive }) => (isActive ? 'admin__menuItem--active admin__menuItem' : 'admin__menuItem')}
                                        to="/management/reservations">
                                        {({ isActive }) => (
                                             <>
                                                  <span className={isActive ? 'admin__menuSymbol admin__menuSymbol--active' : 'admin__menuSymbol'}>
                                                       &#10004;
                                                  </span>
                                                  <span className="admin__menuText">Table Reservations</span>
                                             </>
                                        )}
                                   </NavLink>
                                    <NavLink
                                        className={({ isActive }) => (isActive ? 'admin__menuItem--active admin__menuItem' : 'admin__menuItem')}
                                        to="/management/options">
                                        {({ isActive }) => (
                                             <>
                                                  <span className={isActive ? 'admin__menuSymbol admin__menuSymbol--active' : 'admin__menuSymbol'}>
                                                       &#10004;
                                                  </span>
                                                  <span className="admin__menuText">Options</span>
                                             </>
                                        )}
                                   </NavLink>
                              </div>
                              <div className="admin__right">
                                   <main className="admin-layout">
                                        <Outlet />
                                   </main>
                              </div>
                         </div>
                    </div>
               ) : isLoading ? (
                    <>loading</>
               ) : error && false ? (
                    <>{error}</>
               ) : errorLogout & false ? (
                    <>{errorLogout}</>
               ) : (
                    <>Access denied</>
               )}
          </>
     );
};

export default Management;
