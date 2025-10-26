import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext.js';
import '../styles/customer-panel.scss';
import api from '../utils/axios.js';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { CiLogout } from "react-icons/ci";
import Breadcrumbs from '../components/Breadcrumbs.js';

const CustomerPanel = () => {
     const navigate = useNavigate();
     const { isAuthenticated, logout, user, isLoading } = useAuth();
     const [isChecking, setIsChecking] = useState(true);
     const [isSidebarOpen, setIsSidebarOpen] = useState(false);

     const toggleSidebar = () => {
          setIsSidebarOpen(prev => !prev);
     };

    const handleLogout = async () => {
          try { 
               logout();
               navigate('/customer/login', { replace: true });
          } catch (error) {
               console.error('Logout failed:', error.message);
          }
     }; 

     useEffect(() => {
          const checkAndLogout = async () => {
               if (user && ['member', 'moderator', 'admin'].includes(user.role)) {
                    try {
                         await api.post('/auth/logout');
                         logout();
                         navigate('/customer/login', { replace: true });
                         return;
                    } catch (error) {
                         console.error('Logout failed:', error.message);
                    } finally {
                         setIsChecking(false);
                    }
               } else if (!isLoading && !isAuthenticated) {
                    navigate('/customer/login', { replace: true });
                    setIsChecking(false);
               } else {
                    setIsChecking(false);
               }
          };

          checkAndLogout();
     }, [user, isLoading, isAuthenticated, logout, navigate]);

     if (isLoading || isChecking) {
          return <div>loading...</div>;
     }

     return (
          !user ? (
               <div>Couldn't display page :(</div>
          ) : ['member', 'moderator', 'admin'].includes(user.role) ? (
               <div>Redirecting...</div>
          ) : (
               <div className="customer-panel">
                    <div className="customer-panel__header-bar">
                         <div className="customer-panel__header-left">
                              <div className="customer-panel__hamburger" onClick={toggleSidebar}>
                                   <div></div>
                                   <div></div>
                                   <div></div>
                              </div>
                              <div>Your account</div>
                         </div>

                         <div className="customer-panel__header-right">Hi {user.firstName}</div>
                    </div>
                    <div className="customer-panel__breadcrumbs-container">
                         <Breadcrumbs />
                    </div>
                    <div className="customer-panel__content">
                         <aside className={`customer-panel__sidebar ${isSidebarOpen ? 'customer-panel__sidebar--open' : ''}`}>
                              <nav className="customer-panel__nav">
                                   <ul className="customer-panel__nav-list">
                                        <li>
                                             <NavLink
                                                  to="/customer/recent-orders"
                                                  end
                                                  onClick={() => setIsSidebarOpen(false)}
                                                  className={({ isActive }) =>
                                                       `customer-panel__nav-link${isActive ? ' customer-panel__nav-link--active' : ''}`
                                                  }
                                             >
                                                  Recent orders
                                             </NavLink>
                                        </li>
                                        <li>
                                             <NavLink
                                                  to="/customer/personal-details"
                                                  onClick={() => setIsSidebarOpen(false)}
                                                  className={({ isActive }) =>
                                                       `customer-panel__nav-link${isActive ? ' customer-panel__nav-link--active' : ''}`
                                                  }
                                             >
                                                  Personal details
                                             </NavLink>
                                        </li>
                                        <li>
                                             <NavLink
                                                  to="/customer/login"
                                                  onClick={handleLogout}
                                                  className="customer-panel__nav-link customer-panel__nav-link--logout"
                                                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                             >
                                                  Logout <CiLogout size="24" />
                                             </NavLink>
                                        </li>
                                   </ul>
                              </nav>
                         </aside>
                         <section className="customer-panel__right-panel">

                              <div className="customer-panel__orders-list">
                                   <main className="customer-panel__main-content">
                                        <Outlet />
                                   </main>
                              </div>
                         </section>
                    </div>
               </div>
          )
     );
};

export default CustomerPanel;
