import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';


const UpdateProduct = () => {
    const { id } = useParams();
    const [categories, setCategories] = useState([]);
    const [product, setProduct] = useState([]);

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

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                desc: product.desc || '',
                price: product.price || '',
                image: product.image || '',
                category: product.category || '',
                isFeatured: product.isFeatured || false,
                ingridiens: product.ingridiens ? product.ingridiens.join(', ') : '',
                isVegetarian: product.isVegetarian || false,
                isGlutenFree: product.isGlutenFree || false,
                isAvailable: product.isAvailable || true,
            });
        }
    }, [product]);

    const [formData, setFormData] = useState({
        name: product.name,
        desc: '',
        price: '',
        image: '',
        category: '',
        isFeatured: false,
        ingridiens: '',
        isVegetarian: false,
        isGlutenFree: false,
        isAvailable: true
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSend = {
            ...formData,
            price: parseFloat(formData.price),
            ingridiens: formData.ingridiens.split(',').map(item => item.trim()),
            category: formData.category // Wysyłamy ID kategorii wybranej przez użytkownika
        };

        try {
            const response = await fetch('http://localhost:3001/api/addProduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });

            if (response.ok) {
                const result = await response.json();
                alert('Menu item saved successfully');
                console.log('Dane otrzymane z serwera: ', result);
            } else {
                const errorData = await response.json();
                console.log('Błąd zwrócony z serwera:', errorData.error);
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error saving menu item:', error);
            alert(`Failed to save menu item: ${error.message}`);
        }
    };

    const getCategories = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/getAllCategories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error getting categories:', error);
            alert(`Failed to get categories: ${error.message}`);
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <form className="menu-item-form" onSubmit={handleSubmit}>
            <h2>Add Menu Item</h2>

            <label>Name:</label>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
            />

            <label>Description:</label>
            <textarea
                name="desc"
                value={formData.desc}
                onChange={handleChange}
            />

            <label>Price:</label>
            <input
                type="number"
                name="price"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
            />

            <label>Image URL:</label>
            <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
            />

            <label>Category:</label>
            <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
            >
                <option value="">Select a category</option>
                {categories.map(category => (
                    <option key={category._id} value={category._id}>
                        {category.name}
                    </option>
                ))}
            </select>

            <label>
                <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                />
                Is Featured
            </label>

            <label>Ingredients (comma-separated):</label>
            <input
                type="text"
                name="ingridiens"
                value={formData.ingridiens}
                onChange={handleChange}
            />

            <label>
                <input
                    type="checkbox"
                    name="isVegetarian"
                    checked={formData.isVegetarian}
                    onChange={handleChange}
                />
                Is Vegetarian
            </label>

            <label>
                <input
                    type="checkbox"
                    name="isGlutenFree"
                    checked={formData.isGlutenFree}
                    onChange={handleChange}
                />
                Is Gluten-Free
            </label>

            <label>
                <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleChange}
                />
                Is Available
            </label>

            <button type="submit">Save Menu Item</button>
        </form>
    );
};

export default UpdateProduct;