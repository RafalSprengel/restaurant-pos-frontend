import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const SingleProduct = () => {
    const [product, setProduct] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const { id } = useParams();

    const getProduct = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/getSingleProduct/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch product data');
            }

            const data = await response.json();
            setProduct(data);
        } catch (error) {
            console.error('Error fetching product:', error);
            setErrorMessage('Failed to load product details. Please try again later.');
        }
    };

    useEffect(() => {
        getProduct();
    }, [id]);

    return (
        <>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {product ? (
                <div>
                    <h2>Product Details</h2>
                    <div><strong>Name:</strong> {product.name}</div>
                    <div><strong>Description:</strong> {product.desc}</div>
                    <div><strong>Price:</strong> ${product.price}</div>
                </div>
            ) : (
                <div>Loading product details...</div>
            )}
        </>
    );
};

export default SingleProduct;
