import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const SingleProduct = () => {
    const [product, setProduct] = useState([]);
    const { id } = useParams();

    const getProduct = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/getSingleProduct/' + id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setProduct(data);
        }
        catch (error) {
            console.log('Error:' + error);
        }
    }

    useEffect(() => {
        getProduct();
    }, []);


    console.log(product);
    return (
        <>
            <div>Name: {product.name}</div>
            <div>Description: {product.desc}</div>
            <div>Price: {product.price}</div>
        </>

    )
}


export default SingleProduct;