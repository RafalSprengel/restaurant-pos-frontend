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
import ManagementPanel from './pages/ManagementPanel.js';
import Menu from './pages/Menu';
import NotFound from './pages/NotFound';
import PaymentCanceled from './pages/PaymentCanceled';
import PaymentSuccess from './pages/PaymentSuccess';
import Promotions from './pages/Promotions';
import RegisterCustomer from './pages/RegisterCustomer.js';
import { AuthProvider } from './context/authContext.js';
import { ShoppingCartProvider } from './context/ShoppingCartContext.js';

import AddCategory from './components/managementPanel/categories/AddCategory.js';
import AddProduct from './components/managementPanel/products/AddProduct.js';
import AddCustomer from './components/managementPanel/customers/AddCustomer.js';
import CategoriesList from './components/managementPanel/categories/CategoriesList.js';
import CustomersList from './components/managementPanel/customers/CustomersList.js';
import UpdateOrder from './components/managementPanel/orders/UpdateOrder.js';
import OrdersList from './components/managementPanel/orders/OrdersList.js';
import ProductsList from './components/managementPanel/products/ProductsList.js';
import UpdateCategory from './components/managementPanel/categories/UpdateCategory.js';
import UpdateProduct from './components/managementPanel/products/UpdateProduct.js';
import MgmtsList from './components/managementPanel/mgmtMembers/MgmtsList.js';
import UpdateCustomer from './components/managementPanel/customers/UpdateCustomer.js';
import UpdateMgmt from './components/managementPanel/mgmtMembers/UpdateMgmt.js';
import AddMgmt from './components/managementPanel/mgmtMembers/AddMgmt.js';

import RecentOrdersList from './components/customerPanel/RecentOrdersList.js';
import Addresses from './components/customerPanel/Addresses.js';
import PersonalDetails from './components/customerPanel/PersonalDetails.js';


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

                    <Route path="/customer" element={<CustomerPanel />} >
                        <Route path="recent-orders" element={<RecentOrdersList />} />
                        <Route path="addresses" element={<Addresses />} />
                        <Route path="personal-details" element={<PersonalDetails />} />
                    </Route>
                    <Route path="/customer/login" element={<LoginCustomer />} />
                    <Route path="/customer/register" element={<RegisterCustomer />} />
                </Route>

                
                    <Route path="/management/login" element={<LoginManagement />} />
                    <Route path="/management/" element={<ManagementPanel />} >
                        <Route path="products" element={<ProductsList />} />
                        <Route path="products/:id" element={<UpdateProduct />} />
                        <Route path="add-product" element={<AddProduct />} />

                        <Route path="categories" element={<CategoriesList />} />
                        <Route path="categories/:id" element={<UpdateCategory />} />
                        <Route path="add-category" element={<AddCategory />} />

                        <Route path="customers" element={<CustomersList />} />
                        <Route path="customers/:id" element={<UpdateCustomer />} />
                        <Route path="add-customer" element={<AddCustomer />} />

                        <Route path="orders" element={<OrdersList />} />
                        <Route path="orders/:id" element={<UpdateOrder />} />

                        <Route path="mgnts" element={<MgmtsList />} />
                        <Route path="mgnts/:id" element={<UpdateMgmt />} />
                        <Route path="add-mgmt" element={<AddMgmt />} />
                    </Route>
                

                
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
