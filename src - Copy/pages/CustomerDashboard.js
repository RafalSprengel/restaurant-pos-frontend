import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext.js';
import '../styles/CustomerDashboard.scss';
import api from '../utils/axios.js';

const CustomerDashboard = () => {
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
    const { isAuthenticated, logout, user, isLoading, checkAuthStatus} = useAuth('customer'); 
    const errorqq = new Error(); const stack = errorqq.stack.split('\n')[1];
    //console.log('## user: ', user,' ', stack)
    
    const handleLogout = async () => {
        try {
            await api.post('/auth/logout'); 
            logout(); 
            navigate('/customer/login');
        } catch (error) {
            console.error('Logout failed:', error.message);
        }
    };
  
    useEffect(()=>{
        if (!isLoading && !isAuthenticated) navigate('login')
    },[isAuthenticated, isLoading])

    return (
        user ? (
            <div className="customer-panel">
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
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <h1>Orders</h1>
                        <h3>{user.name + ' ' + user.surname}</h3>
                    </div>
                    
                    {orders.map((order, index) => (
                        <div
                            key={index}
                            className={`order-card ${order.status.toLowerCase().replace(' ', '-')}`}
                        >
                            <div className="order-info">
                                <p><strong>Store:</strong> {order.store}</p>
                                <p><strong>Product:</strong> {order.product}</p>
                                <p><strong>Order ID:</strong> {order.orderId}</p>
                                <p><strong>Order Date:</strong> {order.orderDate}</p>
                            </div>
                            <div className="order-actions">
                                <p><strong>Total:</strong> {order.price}</p>
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
            </div>
        ) : isLoading ? (
            <div>loading...</div>
        ):(<><div>Couldn't display page :(</div></>)
    );
    
};

export default CustomerDashboard;
