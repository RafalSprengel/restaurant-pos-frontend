import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext.js';
import '../styles/customer-panel.scss';
import api from '../utils/axios.js';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const CustomerDashboard = () => {
     const navigate = useNavigate();
     const { isAuthenticated, logout, user, isLoading } = useAuth();
     const [isChecking, setIsChecking] = useState(true);

     const handleLogout = async () => {
          try {
               await api.post('/auth/logout');
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
                         console.log('User role is restricted, logging out...');
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
          isLoading || isChecking ? (
               <div>Loading...</div>
          ) : !user ? (
               <div>Couldn't display page :(</div>
          ) : ['member', 'moderator', 'admin'].includes(user.role) ? (
               <div>Redirecting...</div>
          ) : (
               <div className="customer-panel">
                    <div className="sidebar">
                         <ul>
                              <li>
                                   <NavLink to="/customer" end>
                                        Recent orders
                                   </NavLink>
                              </li>
                              <li>
                                   <NavLink to="/customer/personal-details">Personal details</NavLink>
                              </li>
                              <li>
                                   <NavLink to="/">Homepage</NavLink>
                              </li>
                              <br />
                              <li>
                                   <NavLink onClick={handleLogout} className="logout-button">
                                        Logout
                                   </NavLink>
                              </li>
                              <br />
                         </ul>
                    </div>

                    <div className="orders-section">
                         <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                              <div></div>
                              <h5>{user.name} {user.surname}</h5>
                         </div>

                         <div className="orders-list">
                              <main className="admin-layout">
                                   <Outlet />
                              </main>
                         </div>
                    </div>
               </div>
          )
     );
}
export default CustomerDashboard;
