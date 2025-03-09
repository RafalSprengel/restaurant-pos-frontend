import React, { useEffect } from 'react';
import { useAuth } from '../context/authContext.js';
import '../styles/CustomerDashboard.scss';
import api from '../utils/axios.js';
import { NavLink, Outlet, Route, Routes, useNavigate } from 'react-router-dom';




const CustomerDashboard = () => {
console.log('Renderuje komponent Customer panel');

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
    const { isAuthenticated, logout, user, isLoading} = useAuth(); 
    
    const handleLogout = async () => {
        try {
            await api.post('/auth/logout'); 
            logout(); 
            navigate('/customer/login', {replace: true});
        } catch (error) {
            console.error('Logout failed:', error.message);
        }
    };
  
    useEffect(()=>{
        if(user && ['member', 'moderator', 'admin'].includes(user.role)) navigate('/management')
        if (!isLoading && !isAuthenticated) navigate('login', {replace: true})
    },[isAuthenticated, isLoading,navigate])

    return (
        user ? ( 
            <div className="customer-panel">
               <div className="sidebar">
    <ul>
        <li>
            <NavLink to="/customer/recent-orders">
                Recent orders
            </NavLink>
        </li>
        <li>
            <NavLink to="/customer/addresses">
                My addresses
            </NavLink>
        </li>
        <li>
            <NavLink to="/customer/personal-details">
                Personal details
            </NavLink>
        </li>
        <li>
            <NavLink onClick={handleLogout} className="logout-button">
                Logout
            </NavLink>
        </li>
    </ul>
</div>

                <div className="orders-section">
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <div></div>
                        <h5>{user.name + ' ' + user.surname }</h5>
                    </div>

                    <div className="orders-list">
                    
                        <main className="admin-layout">
                            <Outlet />
                        </main> 
                    </div>
                    
                
                </div>
            </div>
        ) : isLoading ? (
            <div>loading...</div>
        ):(<><div>Couldn't display page :(</div></>)
    );
    
};

export default CustomerDashboard;
