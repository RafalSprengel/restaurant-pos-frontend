import React, { useEffect, useState } from 'react';
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext.js';
import '../styles/Management.scss';
import api from '../utils/axios.js';
import AddCategory from '../components/managementPanel/categories/AddCategory.js';
import AddProduct from '../components/managementPanel/products/AddProduct.js';
import AddUser from '../components/managementPanel/mgmtMembers/AddMgmt.js';
import AddCustomer from '../components/managementPanel/customers/AddCustomer.js';
import Categories from '../components/managementPanel/categories/CategoriesList.js';
import Customers from '../components/managementPanel/customers/CustomersList.js';
import ManagementLayout from '../layouts/ManagementLayout.js';
import UpdateOrder from '../components/managementPanel/orders/UpdateOrder.js';
import Orders from '../components/managementPanel/orders/OrdersList.js';
import Products from '../components/managementPanel/products/ProductsList.js';
import UpdateCategory from '../components/managementPanel/categories/UpdateCategory.js';
import UpdateProduct from '../components/managementPanel/products/UpdateProduct.js';
import Mgnts from '../components/managementPanel/mgmtMembers/MgmtsList.js';
import UpdateCustomer from '../components/managementPanel/customers/UpdateCustomer.js';
import UpdateMgmt from '../components/managementPanel/mgmtMembers/UpdateMgmt.js';
import AddMgmt from '../components/managementPanel/mgmtMembers/AddMgmt.js';

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
            navigate('login');
        } catch (error) {
            console.error('Error during logout:', error);
            setErrorLogout('Logout failed: ' + error.message);
        } finally {
            console.log('Logout successful');
        }
    };

    useEffect(()=>{
        if(user && !['member', 'moderator', 'admin'].includes(user.role)) navigate('/customer/')
        if (!isLoading && !isAuthenticated) navigate('login')
    },[isAuthenticated, isLoading, navigate])

    if (isLoading) {
        return <div className="customer-panel">Loading...</div>;
    }



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
                                className={({ isActive }) =>
                                    isActive ? 'admin__menuItem--active admin__menuItem' : 'admin__menuItem'
                                }
                                to="/management/products">
                                {({ isActive }) => (
                                    <>
                                        <span
                                            className={
                                                isActive
                                                    ? 'admin__menuSymbol admin__menuSymbol--active'
                                                    : 'admin__menuSymbol'
                                            }>
                                            &#8283;
                                        </span>
                                        Products
                                    </>
                                )}
                            </NavLink>
                            <NavLink
                                className={({ isActive }) =>
                                    isActive ? 'admin__menuItem--active admin__menuItem' : 'admin__menuItem'
                                }
                                to="/management/categories">
                                {({ isActive }) => (
                                    <>
                                        <span
                                            className={
                                                isActive
                                                    ? 'admin__menuSymbol admin__menuSymbol--active'
                                                    : 'admin__menuSymbol'
                                            }>
                                            &#10025;
                                        </span>
                                        Categories
                                    </>
                                )}
                            </NavLink>
                            <NavLink
                                className={({ isActive }) =>
                                    isActive ? 'admin__menuItem--active admin__menuItem' : 'admin__menuItem'
                                }
                                to="/management/customers">
                                {({ isActive }) => (
                                    <>
                                        <span
                                            className={
                                                isActive
                                                    ? 'admin__menuSymbol admin__menuSymbol--active'
                                                    : 'admin__menuSymbol'
                                            }>
                                            &#9823;
                                        </span>
                                        Customers
                                    </>
                                )}
                            </NavLink>
                            <NavLink
                                className={({ isActive }) =>
                                    isActive ? 'admin__menuItem--active admin__menuItem' : 'admin__menuItem'
                                }
                                to="/management/orders">
                                {({ isActive }) => (
                                    <>
                                        <span
                                            className={
                                                isActive
                                                    ? 'admin__menuSymbol admin__menuSymbol--active'
                                                    : 'admin__menuSymbol'
                                            }>
                                            &#10004;
                                        </span>
                                        <span className="admin__menuText">Orders</span>
                                    </>
                                )}
                            </NavLink>
                            {user?.role === 'admin' && (
                                <NavLink
                                    className={({ isActive }) =>
                                        isActive ? 'admin__menuItem--active admin__menuItem' : 'admin__menuItem'
                                    }
                                    to="/management/mgnts">
                                    {({ isActive }) => (
                                        <>
                                            <span
                                                className={
                                                    isActive
                                                        ? 'admin__menuSymbol admin__menuSymbol--active'
                                                        : 'admin__menuSymbol'
                                                }>
                                                &#10004;
                                            </span>
                                            <span className="admin__menuText">Managements</span>
                                        </>
                                    )}
                                </NavLink>
                            )}
                        </div>
                        <div className="admin__right">
                        <Routes>
                            <Route element={<ManagementLayout />}>
                                <Route path="products" element={<Products />} />
                                <Route path="products/:id" element={<UpdateProduct />} />
                                <Route path="add-product" element={<AddProduct />} />

                                <Route path="categories" element={<Categories />} />
                                <Route path="categories/:id" element={<UpdateCategory />} />
                                <Route path="add-category" element={<AddCategory />} />

                                <Route path="customers" element={<Customers />} />
                                <Route path="customers/:id" element={<UpdateCustomer />} />
                                <Route path="add-customer" element={<AddCustomer />} />

                                <Route path="orders" element={<Orders />} />
                                <Route path="orders/:id" element={<UpdateOrder />} />

                                <Route path="mgnts" element={<Mgnts />} />
                                <Route path="mgnts/:id" element={<UpdateMgmt />} />
                                <Route path="add-mgmt" element={<AddMgmt />} />
                                
                            </Route>
                        </Routes>

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
