
import React, { useEffect, useState } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';


const Products = () => {

    const [ProductsList, setProductsList] = useState([]);

    const getMenuItems = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/getAllMenuItems', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setProductsList(data)
            } else {
                const errorData = await response.json();
                console.log('Błąd zwrócony z serwera:', errorData.error);
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Błąd podczas pobierania danych:', error);
            alert(`Błąd: ${error.message}`);
        }
    };

    useEffect(() => {
        getMenuItems();
    }, []);


    const List = ProductsList.map(item => (
        <div key={item._id} className="single-item">
            <NavLink to={item._id}><h3>{item.name}</h3></NavLink>
        </div>

    ))

    return (
        <>
            <div>Products</div>
            <div>{List}</div>
        </>

    )
}
export default Products;