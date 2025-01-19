import React, { useEffect, useState } from 'react';
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import '../styles/Management.scss';
import Categories from '../components/management/Categories.js';
import AddCategory from '../components/management/AddCategory.js';
import Products from '../components/management/Products.js';
import AddProduct from '../components/management/AddProduct.js';
import UpdateProduct from '../components/management/UpdateProduct.js';
import UpdateCategory from '../components/management/UpdateCategory.js';
import Orders from '../components/management/Orders.js';
import Order from '../components/management/Order.js';
import Customers from '../components/management/Customers.js';
import ManagementLayout from '../layouts/ManagementLayout.js';
import Users from '../components/management/Users.js';
import AddUser from '../components/management/AddUser.js';
import { useAuth } from '../context/authContext.js';
import api from '../utils/axios.js';

export const Management = () => {
    const navigate = useNavigate();
    const [errorLogout, setErrorLogout] = useState(null);
    const { isAuthenticated, logout, user, isLoading, error } = useAuth('staff');
    console.log(user);

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
        if (!isLoading && !isAuthenticated) navigate('login')
    },[isAuthenticated, isLoading])

    if (isLoading) {
        return <div className="customer-panel">Loading...</div>;
    }

    return (
        <>
            {isAuthenticated ? (
                <div className="management">
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
                                to="/staff/products">
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
                                    to="/management/users">
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
                                            <span className="admin__menuText">Users</span>
                                        </>
                                    )}
                                </NavLink>
                            )}
                        </div>
                        <div className="admin__right">
                            <Routes>
                                <Route element={<ManagementLayout />}>
                                    <Route path="orders" element={<Orders />} />
                                    <Route path="categories" element={<Categories />} />
                                    <Route path="add-category" element={<AddCategory />} />
                                    <Route path="products" element={<Products />} />
                                    <Route path="add-product" element={<AddProduct />} />
                                    <Route path="customers" element={<Customers />} />
                                    <Route path="products/:id" element={<UpdateProduct />} />
                                    <Route path="orders/:id" element={<Order />} />
                                    <Route path="add-user" element={<AddUser />} />
                                    <Route path="categories/:id" element={<UpdateCategory />} />
                                    <Route path="users" element={<Users />} />
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
