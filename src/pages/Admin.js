import React from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import '../styles/Admin.scss';
import Categories from '../components/admin/Categories';
import AddCategory from '../components/admin/AddCategory';
import Products from '../components/admin/Products';
import AddProduct from '../components/admin/AddProduct';
import UpdateProduct from '../components/admin/UpdateProduct';
import UpdateCategory from '../components/admin/UpdateCategory';


const Orders = () => <div><h3>Orders</h3></div>;

const Customers = () => <div>Customers</div>;

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
                    <NavLink className={({ isActive }) => isActive ? 'admin__menuItem--active admin__menuItem' : 'admin__menuItem'} to='/admin/products'>
                        {({ isActive }) => (
                            <>
                                <span className={isActive ? 'admin__menuSymbol admin__menuSymbol--active' : 'admin__menuSymbol'}>&#8283;</span>
                                Products
                            </>
                        )}
                    </NavLink>
                    <NavLink className={({ isActive }) => isActive ? 'admin__menuItem--active admin__menuItem' : 'admin__menuItem'} to='/admin/categories'>
                        {({ isActive }) => (
                            <>
                                <span className={isActive ? 'admin__menuSymbol admin__menuSymbol--active' : 'admin__menuSymbol'}>&#10025;</span>
                                Categories
                            </>
                        )}
                    </NavLink>
                    <NavLink className={({ isActive }) => isActive ? 'admin__menuItem--active admin__menuItem' : 'admin__menuItem'} to='/admin/customers'>
                        {({ isActive }) => (
                            <>
                                <span className={isActive ? 'admin__menuSymbol admin__menuSymbol--active' : 'admin__menuSymbol'}>&#9823;</span>
                                Customers
                            </>
                        )}
                    </NavLink>
                    <NavLink className={({ isActive }) => isActive ? 'admin__menuItem--active admin__menuItem' : 'admin__menuItem'} to='/admin/orders'>
                        {({ isActive }) => (
                            <>
                                <span className={isActive ? 'admin__menuSymbol admin__menuSymbol--active' : 'admin__menuSymbol'}>&#10004;</span>
                                <span className='admin__menuText'>Orders</span>
                            </>
                        )}
                    </NavLink>
                </div>
                <div className="admin__right">
                    <Routes>
                        <Route path="orders" element={<Orders />} />
                        <Route path="categories" element={<Categories />} />
                        <Route path="add-category" element={<AddCategory />} />
                        <Route path="products" element={<Products />} />
                        <Route path="add-product" element={<AddProduct />} />
                        <Route path="customers" element={<Customers />} />
                        <Route path="products/:id" element={<UpdateProduct />} />
                        <Route path="categories/:id" element={<UpdateCategory />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default Admin;
