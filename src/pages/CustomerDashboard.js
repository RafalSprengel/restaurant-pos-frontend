import React from 'react';
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { useCustomerAuth } from '../context/authCustomerContext.js';
import '../styles/CustomerDashboard.scss';
import api from '../utils/axios.js';

const CustomerPanel = () => {
    const orders = [
        {
            status: 'Awaiting delivery',
            store: 'LVGESS Home Store',
            product: '20A Tuya Smart Socket WiFi UK Plug',
            price: '£14.64',
            orderId: '30454856322395371',
            orderDate: 'Nov 23, 2024',
        },
        {
            status: 'Awaiting delivery',
            store: 'DeFeng Tools Store',
            product: '6pc Woodworking Metal Cutting Blade',
            price: '£0.95',
            orderId: '3045395389535371',
            orderDate: 'Nov 23, 2024',
        },
        {
            status: 'Awaiting delivery',
            store: 'ATORCH Innovative Manufactory Co.',
            product: '16A Digital Power Wattmeter',
            price: '£20.69',
            orderId: '3045395389535371',
            orderDate: 'Nov 23, 2024',
        },
        {
            status: 'Canceled',
            store: 'LVGESS Home Store',
            product: '20A Tuya Smart Socket WiFi UK Plug',
            price: '£3.30',
            orderId: '3045395388995371',
            orderDate: 'Nov 23, 2024',
        },
    ];

    const navigate = useNavigate();
    const { isAuthenticated, logout, customer, loading, error } = useCustomerAuth();

    const handleLogout = async () => {
        await api.post('/auth/logout-customer');
        await logout();
        navigate('/customer/login');
    };

    return (
        <div className="customer-panel">
            {isAuthenticated ? (
                <>
                <div className="sidebar">
                    <ul>
                        <li>Overview</li>
                        <li className="active">Orders</li>
                        <li>Payment</li>
                        <li>Refund and return</li>
                    <li>Settings</li>
                    <li>Shipping address</li>
                    <li onClick={handleLogout}>Logout</li>
                </ul>
            </div>
            <div className="orders-section">
                <h1>Orders</h1>
                {orders.map((order, index) => (
                    <div key={index} className={`order-card ${order.status.toLowerCase().replace(' ', '-')}`}>
                        <div className="order-info">
                            <p>
                                <strong>Store:</strong> {order.store}
                            </p>
                            <p>
                                <strong>Product:</strong> {order.product}
                            </p>
                            <p>
                                <strong>Order ID:</strong> {order.orderId}
                            </p>
                            <p>
                                <strong>Order Date:</strong> {order.orderDate}
                            </p>
                        </div>
                        <div className="order-actions">
                            <p>
                                <strong>Total:</strong> {order.price}
                            </p>
                            {order.status === 'Awaiting delivery' && (
                                <>
                                    <button className="btn-confirm">Confirm received</button>
                                    <button className="btn-track">Track order</button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            </>
            ) : (
                <div className="login-section">
                    <h1>You are not logged in</h1>
                    <h2>Please log in to view your orders
                        
                    </h2>
                    <button onClick={() => navigate('/customer/login')}>Login</button>
                </div>
            )}  
        </div>
    );
};

export default CustomerPanel;
