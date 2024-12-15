import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
//import { createSlug } from '../utils/utils.js';
import '../styles/Menu.scss';
import SingleDish from '../components/SingleDish';
import { useShoppingCart } from '../context/ShoppingCartContext.js';
import { useFetch } from '../hooks/useFetch.js';
import { Alert } from 'react-bootstrap';

export const Menu = () => {
    const { openProduct } = useShoppingCart();
    const navigate = useNavigate();
    const location = useLocation();
    const queryString = location.search;
    const [currentCategory, setCurrentCategory] = useState('');
    const {
        data: categoriesList,
        loading: categoriesLoading,
        error: categoriesError,
    } = useFetch('http://localhost:3001/api/productCategories/getAllCategories');
    const {
        data,
        loading: productsLoading,
        error: productsError,
    } = useFetch('http://localhost:3001/api/products/getProducts' + queryString);
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
            <div className="menu__item-categories__list__item" onClick={() => handleCategoryClick(category.name)}>
                <div
                    className={
                        'menu__item-categories__list__item__icon-container ' +
                        (category.name == currentCategory
                            ? 'menu__item-categories__list__item__icon-container--active'
                            : '')
                    }>
                    <span className="material-symbols-outlined">
                        {/* {el.googleIconName} */}
                        iC
                    </span>
                </div>
                <div
                    className={
                        'menu__item-categories__list__item__name-container ' +
                        (category.name == currentCategory
                            ? 'menu__item-categories__list__item__name-container--active'
                            : '')
                    }>
                    {category.name}
                </div>
            </div>
        );
    };

    return (
        <div className="menu">
            <div className="menu__header">
                <h1>Menu</h1>
            </div>
            <div className="menu__search">
                <input type="search" placeholder="Znajdź swoje danie" onChange={(e) => handleSearchChange(e)}></input>
            </div>
            {categoriesLoading && <div>Loading Categories...</div>}
            <div className="menu__item-categories">
                {categoriesError && <Alert variant="danger">{categoriesError.toString()}</Alert>}
                {!categoriesError && categoriesList && (
                    <ul className="menu__item-categories__list">
                        {categoriesList.map((category, index) => (
                            <SingleCategory key={index} category={category} />
                        ))}
                    </ul>
                )}
            </div>
            {productsLoading && <div>Loading Products...</div>}
            <div className="menu__items-list">
                {productsError && <Alert variant="danger">{productsError.toString()}</Alert>}
                {!productsError &&
                    !categoriesError &&
                    products &&
                    (products.length > 0 ? (
                        <>
                            <div className="menu__items-list__title">{currentCategory}</div>
                            <div className="menu__items-list__content">
                                {
                                    <>
                                        {products.map((el, index) => {
                                            return (
                                                <div onClick={() => openProduct(el)} key={index}>
                                                    <SingleDish singleDish={el} />
                                                </div>
                                            );
                                        })}
                                    </>
                                }
                            </div>
                        </>
                    ) : (
                        <>No product found.</>
                    ))}
            </div>
        </div>
    );
};

export default Menu;
