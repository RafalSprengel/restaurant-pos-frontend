import './styles/App.scss';
import './styles/Bootstrap.scss';
import { Routes, Route } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import AboutUs from './pages/AboutUs';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import CustomerPanel from './pages/CustomerPanel.js';
import EventsPage from './pages/EventsPage';
import HomePage from './pages/HomePage';
import LoginCustomer from './pages/LoginCustomer.js';
import LoginManagement from './pages/LoginManagement.js';
import MainLayout from './layouts/MainLayout';
import ManagementLayout from './layouts/ManagementLayout';
import ManagementPanel from './pages/ManagementPanel.js';
import Menu from './pages/Menu';
import NotFound from './pages/NotFound';
import PaymentCanceled from './pages/PaymentCanceled';
import PaymentSuccess from './pages/PaymentSuccess';
import Promotions from './pages/Promotions';
import RegisterCustomer from './pages/RegisterCustomer.js';
import { AuthProvider } from './context/authContext.js';
import { ShoppingCartProvider } from './context/ShoppingCartContext.js';


function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route element={<Outlet />}>
                    <Route element={<ShoppingCartProvider><MainLayout /></ShoppingCartProvider>}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/menu" element={<Menu />} />
                        <Route path="/order/checkout" element={<Checkout />} />
                        <Route path="/order/success" element={<PaymentSuccess />} />
                        <Route path="/order/cancel" element={<PaymentCanceled />} />
                        <Route path="/events" element={<EventsPage />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/promotions" element={<Promotions />} />
                        <Route path="/about-us" element={<AboutUs />} />
                    </Route>

                    <Route path="/customer" element={<CustomerPanel />} />
                    <Route path="/customer/login" element={<LoginCustomer />} />
                    <Route path="/customer/register" element={<RegisterCustomer />} />
                </Route>

                <Route element={<ManagementLayout />}>
                    <Route path="/management/login" element={<LoginManagement />} />
                    <Route path="/management/*" element={<ManagementPanel />} />
                </Route>

                {/* Przeniesienie catch-all poza ścieżki */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
