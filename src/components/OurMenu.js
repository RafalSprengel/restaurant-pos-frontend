import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import "../styles/our-menu.scss";
import pizza from '../img/pizza.png';

export default function FoodMenu() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = new URLSearchParams(location.search);

    // Paginacja
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const { data: categories, loading: categoriesLoading, error: categoriesError } = useFetch('/product-categories/');
    const queryString = location.search;
    const { data: productsData, loading: productsLoading, error: productsError } = useFetch('/products/' + queryString);

    let products = productsData?.products || [];

    // Ustawienie totalPages i currentPage z danych API
    useEffect(() => {
        if (productsData) {
            setCurrentPage(productsData.currentPage || 1);
            setTotalPages(productsData.totalPages || 1);
        }
    }, [productsData]);

    const handleCategoryClick = (categoryName) => {
        const params = new URLSearchParams(location.search);
        params.forEach((value, key) => params.delete(key));
        params.set('category', categoryName);
        navigate('?' + params);
    };

    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(location.search);
        params.set('page', newPage);
        navigate('?' + params);
    };

    return (
        <div className="food-menu__content">
            <ul className='food-menu__categories-list'>
                <li><a href="#" >All</a></li>
                {categories?.map((cat, index) => (
                    <li key={index} className='food-menu__categories-list-item'>
                        <a onClick={() => handleCategoryClick(cat.name)}>{cat.name}</a>
                    </li>
                ))}
            </ul>

            <div className='food-menu__items'>
                {products?.length > 0 ? (
                    products.map((product, index) => (
                        <div key={index} className="food-menu__item">
                            <div className='food-menu__item-image-container'>
                                <img src={pizza} alt={product.name} className="food-menu__item-image" />
                            </div>
                            <div className='food-menu__item-content'>
                                <div className='food-menu__item-title-container'>
                                    <h5 className='food-menu__item-title'>{product.name}</h5>
                                    <span className='food-menu__item-dots'></span>
                                    <span className='food-menu__item-price'>&#163;{product.price}</span>
                                </div>
                                <p className='food-menu__item-description font-italic-style'>{product.desc}</p>
                            </div>
                        </div>
                    ))
                ) : productsLoading ? (
                    <p>Loading...</p>
                ) : (
                    <p>No products found.</p>
                )}
            </div>

            {/* Paginacja */}
            <div className="food-menu__pagin" style={{ marginTop: '20px' }}>
                <button className="food-menu__pagin-arrow" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
                    &lt; &lt;
                </button>
                <button className="food-menu__pagin-arrow" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    &lt;
                </button>

                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        disabled={currentPage === i + 1}
                        className={`food-menu__pagin-digit ${currentPage === i + 1 ? 'food-menu__pagin-digit--active' : ''}`}
                        style={{
                            fontWeight: currentPage === i + 1 ? 'bold' : 'normal', color: 'white'
                        }}
                    >
                        {i + 1}
                    </button>
                ))}

                <button className="food-menu__pagin-arrow" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    &gt;
                </button>
                <button className="food-menu__pagin-arrow" onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
                    &gt;&gt;
                </button>
            </div>
        </div>
    );
}