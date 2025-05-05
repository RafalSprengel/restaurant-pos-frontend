import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/menu.scss';
import { useShoppingCart } from '../context/ShoppingCartContext.js';
import { useFetch } from '../hooks/useFetch.js';
import SingleDish from '../components/SingleDish';

export const Menu = () => {
     const { openProduct } = useShoppingCart();
     const navigate = useNavigate();
     const location = useLocation();
     const queryString = location.search;
     const [currentCategory, setCurrentCategory] = useState('');
     const { data: categoriesList, loading: categoriesLoading, error: categoriesError } = useFetch('/product-categories/');

     const { data, loading: productsLoading, error: productsError } = useFetch('/products/' + queryString);

     const products = data?.products || [];

     const getCurrentCategoryFromURL = () => {
          const params = new URLSearchParams(location.search);
          const currentCategory = params.get('category');
          currentCategory ? setCurrentCategory(currentCategory) : setCurrentCategory('');
     };

     useEffect(() => {
          getCurrentCategoryFromURL();
     }, [location.search]);

     const handleSearchChange = (e) => {
          const { value } = e.target;
          value ? navigate('?search=' + value) : navigate('');
     };

     const handleCategoryClick = (categoryName) => {
          const params = new URLSearchParams(location.search);
          params.forEach((value, key) => params.delete(key));
          params.set('category', categoryName);
          navigate('?' + params);
     };

     const SingleCategory = ({ category }) => {
          return (
               <div
                    className={`menu__item-categories__list__item ${category.name === currentCategory ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(category.name)}>
                    <div className="menu__item-categories__list__item__icon-container">
                         <span className="material-symbols-outlined">iC</span>
                    </div>
                    <div className="menu__item-categories__list__item__name-container">{category.name}</div>
               </div>
          );
     };

     return (
          <div className="menu">
               <div className="menu__header">
                    <h1>Menu</h1>
               </div>
               <div className="menu__search">
                    <input type="search" placeholder="Znajdź swoje danie" onChange={handleSearchChange} />
               </div>
               {categoriesLoading && <div>Loading Categories...</div>}
               <div className="menu__item-categories">
                    {categoriesError && <div className="error-message">{categoriesError.toString()}</div>}
                    {!categoriesError && categoriesList && (
                         <div className="menu__item-categories__list">
                              {categoriesList.map((category, index) => (
                                   <SingleCategory key={index} category={category} />
                              ))}
                         </div>
                    )}
               </div>
               {productsLoading && <div>Loading Products...</div>}
               <div className="menu__items-list">
                    {productsError && <div className="error-message">{productsError.toString()}</div>}
                    {!productsError && !categoriesError && products && (
                         <>
                              <div className="menu__items-list__title">{currentCategory}</div>
                              <div className="menu__items-list__content">
                                   {products.length > 0 ? (
                                        products.map((el, index) => (
                                             <div onClick={() => openProduct(el)} key={index}>
                                                  <SingleDish singleDish={el} />
                                             </div>
                                        ))
                                   ) : (
                                        <div>No product found.</div>
                                   )}
                              </div>
                         </>
                    )}
               </div>
          </div>
     );
};

export default Menu;
