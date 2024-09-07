import React from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import '../styles/Admin.scss';
import AddItemForm from '../components/admin/AddItemForm';
import Products from '../components/admin/Products';
import SingleProduct from '../components/admin/SingleProduct';


const Orders = () => <div>Orders</div>;
const EditMenu = () => <div>Edit menu</div>;

const Customers = () => <div>Customers</div>;
const Settings = () => <div>Settings</div>;
const Logout = () => <div>Logout</div>;

export const Admin = () => {
    return (
        <div className="admin">
            <div className="admin__header">
                <div className="admin__logo">
                    <span className='material-symbols-outlined'>share_location</span>
                    <span>Clever Food</span>
                </div>
                <div className="admin__gap"></div>
                <div className="admin__title">
                    <span className='material-symbols-outlined'>account_circle</span>
                    <span className='admin__name'>Admin</span>
                </div>
            </div>
            <div className="admin__content">
                <div className="admin__left">
                    <NavLink className='admin__menuItem' to='/admin/orders'>Orders</NavLink>
                    <NavLink className='admin__menuItem' to='/admin/edit-menu'>Edit Menu</NavLink>
                    <NavLink className='admin__menuItem' to='/admin/products'>Products</NavLink>
                    <NavLink className='admin__menuItem' to='/admin/add-a-new-product'>Add a new products</NavLink>
                    <NavLink className='admin__menuItem' to='/admin/customers'>Customers</NavLink>
                    <NavLink className='admin__menuItem' to='/admin/settings'>Settings</NavLink>
                    <NavLink className='admin__menuItem' to='/admin/logout'>Logout</NavLink>
                </div>
                <div className="admin__right">
                    <Routes>
                        <Route path="orders" element={<Orders />} />
                        <Route path="edit-menu" element={<EditMenu />} />
                        <Route path="products" element={<Products />} />
                        <Route path="add-a-new-product" element={<AddItemForm />} />
                        <Route path="customers" element={<Customers />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="products/:id" element={<SingleProduct />} />
                        <Route path="logout" element={<Logout />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}



export default Admin;
