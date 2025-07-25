
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import './styles/app.scss';

import { Routes, Route } from 'react-router-dom';
import Checkout from './pages/Checkout';
import CustomerPanel from './pages/CustomerPanel.js';
import HomePage from './pages/HomePage';
import LoginCustomer from './pages/LoginCustomer.js';
import LoginManagement from './pages/LoginManagement.js';
import MainLayout from './layouts/MainLayout';
import ManagementPanel from './pages/ManagementPanel.js';
import Menu from './pages/Menu';
import NotFound from './pages/NotFound';
import PaymentCanceled from './pages/PaymentCanceled';
import PaymentSuccess from './pages/PaymentSuccess';
import RegisterCustomer from './pages/RegisterCustomer.js';
import { AuthProvider } from './context/authContext.js';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { ShoppingCartProvider } from './context/ShoppingCartContext.js';
import { UnreadMessagesProvider } from './context/UnreadMessagesProvider.js';

import Dashboard from './components/managementPanel/Dashboard.js';
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
import MessagesList from './components/managementPanel/messages/MessagesList.js';
import SingleMessage from './components/managementPanel/messages/SingleMessage.js';
import TableReservationsList from './components/managementPanel/tableReservations/TableReservationsList.js';
import SingleTableReservation from './components/managementPanel/tableReservations/SingleTableReservation.js';
import Settings from './components/managementPanel/settings/Settings.js';
import RecentOrdersList from './components/customerPanel/RecentOrdersList.js';
import PersonalDetails from './components/customerPanel/PersonalDetails.js';
import NoConnection from './pages/NoConnection.js';


function App() {
     return (
          <MantineProvider>
               <Notifications />
               <ModalsProvider>
                    <AuthProvider>
                         <Routes>
                              <Route
                                   element={
                                        <ShoppingCartProvider>
                                             <MainLayout />
                                        </ShoppingCartProvider>
                                   }>
                                   <Route path="/" element={<HomePage />} />
                                   <Route path="/menu" element={<Menu />} />
                                   <Route path="/order/checkout" element={<Checkout />} />
                                   <Route path="/order/success" element={<PaymentSuccess />} />
                                   <Route path="/order/cancel" element={<PaymentCanceled />} />
                              </Route>

                              <Route path="/customer" element={<CustomerPanel />}>
                                   <Route index element={<RecentOrdersList />} />
                                   <Route path="personal-details" element={<PersonalDetails />} />
                              </Route>
                              <Route path="/customer/login" element={<LoginCustomer />} />
                              <Route path="/customer/register" element={<RegisterCustomer />} />

                              <Route path="/management/login" element={<LoginManagement />} />
                              <Route path="/management/" element={
                                   <UnreadMessagesProvider>
                                        <ManagementPanel />
                                   </UnreadMessagesProvider>
                              }>
                                   <Route index element={<Dashboard />} />
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
                                   <Route path="messages" element={<MessagesList />} />
                                   <Route path="messages/:id" element={<SingleMessage />} />
                                   <Route path="reservations" element={<TableReservationsList />} />
                                   <Route path="reservations/:id" element={<SingleTableReservation />} />
                                   <Route path="settings" element={<Settings />} />
                              </Route>
                              <Route path='no-connection' element={<NoConnection />}></Route>
                              <Route path="*" element={<NotFound />} />
                         </Routes>
                    </AuthProvider>
               </ModalsProvider >
          </MantineProvider >
     );
}

export default App;
