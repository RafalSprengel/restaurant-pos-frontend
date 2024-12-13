import React, { useEffect, useLayoutEffect, useState } from 'react';
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import '../styles/Admin.scss';
import Categories from '../components/admin/Categories.js';
import AddCategory from '../components/admin/AddCategory.js';
import Products from '../components/admin/Products.js';
import AddProduct from '../components/admin/AddProduct.js';
import UpdateProduct from '../components/admin/UpdateProduct.js';
import UpdateCategory from '../components/admin/UpdateCategory.js';
import Orders from '../components/admin/Orders.js';
import Order from '../components/admin/Order.js';
import Customers from '../components/admin/Customers.js';
import AdminLayout from '../layouts/AdminLayout.js';
import Users from '../components/admin/Users.js';
import AddUser from '../components/admin/AddUser.js';
import { useAuth } from '../context/StaffAuthContext.js';
import api from '../utils/axios.js';

export const Admin = () => {
    const navigate = useNavigate();
    const [errorLogout, setErrorLogout] = useState(null);
    const { isAuthenticated, logout, user, loading, error } = useAuth();
    console.log(user);

    const handleLogout = () => {
        try {
            api.post('/auth/logout', {
                withCredentials: true,
            });
            logout();
            navigate('/admin');
        } catch (error) {
            console.error('Error during logout:', error);
            setErrorLogout('Logout failed: ' + error.message);
        } finally {
            console.log('Logout successful');
        }
    };

    useEffect(() => {
        if (!isAuthenticated && !loading) {
            navigate('/admin/login');
        }
    }, [isAuthenticated, loading, navigate]);

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
                                to="/admin/products">
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
                                to="/admin/categories">
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
                                to="/admin/customers">
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
                                to="/admin/orders">
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
                                    to="/admin/users">
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
                                <Route element={<AdminLayout />}>
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
            ) : loading ? (
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

export default Admin;
