import './styles/App.scss';
import './styles/Bootstrap.scss';
import { Routes, Route } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import Menu from './pages/Menu';
import Contact from './pages/Contact';
import EventsPage from './pages/EventsPage';
import Promotions from './pages/Promotions';
import AboutUs from './pages/AboutUs';
import LoginUser from './pages/LoginCustomer.js';
import LoginStaff from './pages/LoginStaff.js';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Checkout from './pages/Checkout';
import NotFound from './pages/NotFound';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCanceled from './pages/PaymentCanceled';
import AuthSuccess from './components/AuthSuccess';
import AdminDashboard from './pages/AdminDashboard';
import { StaffAuthProvider } from './context/StaffAuthContext';
import { ShoppingCartProvider } from './context/ShoppingCartContext.js';
import AdminLayout from './layouts/AdminLayout';
import CustomerDashboard from './pages/CustomerDashboard';
import { Outlet } from 'react-router-dom';

function App() {
    return (
        <>
            <Routes>
                {/* Public Routes */}
                <Route
                    element={
                        <ShoppingCartProvider>
                            <MainLayout />
                        </ShoppingCartProvider>
                    }>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/order/checkout" element={<Checkout />} />
                    {/* <Route path="/order/success" element={<PaymentSuccess />} /> */}
                    <Route path="/order/cancel" element={<PaymentCanceled />} />
                    <Route path="/events" element={<EventsPage />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/promotions" element={<Promotions />} />
                    <Route path="/about-us" element={<AboutUs />} />

                    <Route path="/auth/success" element={<AuthSuccess />} />
                    <Route path="/customer" element={<CustomerDashboard />} />
                </Route>
                <Route
                    element={
                        <ShoppingCartProvider>
                            <Outlet />
                        </ShoppingCartProvider>
                    }>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login-user" element={<LoginUser />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/order/success" element={<PaymentSuccess />} />
                </Route>

                {/* Admin Routes */}
                <Route
                    element={
                        <StaffAuthProvider>
                            <AdminLayout />
                        </StaffAuthProvider>
                    }>
                    <Route path="/admin/login-staff" element={<LoginStaff />} />
                    <Route path="/admin/*" element={<AdminDashboard />} />
                    {/* Catch-all route */}
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
