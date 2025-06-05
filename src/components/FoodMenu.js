import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import "../styles/food-menu.scss";
import pizza from '../img/pizza.png';
import ProductCard from '../components/ProductCard.js';


export default function FoodMenu({ }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = new URLSearchParams(location.search);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false)
    const [currProdInModalObj, setCurrProdInModalObj] = useState({});
    const contentRef = useRef()

    const { data: categories, loading: categoriesLoading, error: categoriesError } = useFetch('/product-categories/');
    const queryString = location.search;
    const { data: productsData, loading: productsLoading, error: productsError } = useFetch('/products/' + queryString);
    const prod = productsData;

    let products = productsData?.products || [];

    useEffect(() => {
        if (productsData) {
            setCurrentPage(productsData.currentPage || 1);
            setTotalPages(productsData.totalPages || 1);
        }
    }, [productsData]);

    const handleCategoryClick = (categoryName) => {
        const params = new URLSearchParams(location.search);
        params.forEach((value, key) => params.delete(key));
        if (categoryName == null) { navigate('/'); return }
        params.set('category', categoryName);
        navigate('?' + params);
    };

    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(location.search);
        params.set('page', newPage);
        navigate('?' + params);
        setTimeout(() => {
            const yOffset = -150;
            const y = contentRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }, 300);
    };

    const handleOpenProductModal = (obj) => {
        setCurrProdInModalObj(obj)
        setIsProductModalOpen(true);
    };


    const onProductModalClose = () => {
        setIsProductModalOpen(false);
    };


    return (
        <>
            <div className="food-menu__content" ref={contentRef} >
                <ul className='food-menu__categories-list'>
                    <li onClick={() => handleCategoryClick(null)}> All</li>
                    {categories?.map((cat, index) => (
                        <li key={index} className='food-menu__categories-list-item'>
                            <a onClick={() => handleCategoryClick(cat.name)}>{cat.name}</a>
                        </li>
                    ))}
                </ul>

                <div className='food-menu__items'>
                    {products?.length > 0 ? (
                        products.map((product, index) => (
                            <div
                                key={index}
                                className="food-menu__item"
                                data-aos='fade-up'
                                data-aos-once="true"
                                data-aos-duration="300"
                                data-aos-offset="-200"
                                data-aos-delay={index * 50}
                                onClick={() => handleOpenProductModal(product)}
                            >
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
            <ProductCard isOpen={isProductModalOpen} close={onProductModalClose} currentProduct={currProdInModalObj} />
        </>
    );
}