import React, { useEffect, useState } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import '../../styles/AddProduct.scss';

const AddProduct = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        desc: '',
        price: '',
        image: '',
        category: '',
        isFeatured: false,
        ingridiens: '',
        isVegetarian: false,
        isGlutenFree: false,
        isAvailable: true,
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSend = {
            ...formData,
            price: parseFloat(formData.price),
            ingridiens: formData.ingridiens.split(',').map((item) => item.trim()),
            category: formData.category,
        };

        try {
            const response = await fetch('http://localhost:3001/api/addProduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                setShowSuccessModal(true);
            } else {
                const errorData = await response.json();
                setErrorMessage(`Failed to save the product (${errorData.error})`);
            }
        } catch (error) {
            console.error(error);
            setErrorMessage(`Error while saving... (${error})`);
        }
    };

    const getCategories = async () => {
        try {
            setErrorMessage(null);
            const response = await fetch('http://localhost:3001/api/getAllCategories');
            const data = await response.json();

            if (response.ok) {
                setCategories(data);
            } else {
                setErrorMessage(`Failed to load categories. Please try again later (${data.error})`);
            }
        } catch (error) {
            console.error(error);
            setErrorMessage(`Connection error (${error})`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        navigate(-1);
    };

    return (
        <>
            {isLoading && <div>Loading...</div>}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            {!isLoading && !errorMessage && (
                <form className="menu-item-form" onSubmit={handleSubmit}>
                    <h2>Add a New Product</h2>
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />

                    <label>Description:</label>
                    <textarea name="desc" value={formData.desc} onChange={handleChange} />

                    <label>Price:</label>
                    <input type="number" name="price" step="0.01" value={formData.price} onChange={handleChange} required />

                    <label>Image URL:</label>
                    <input type="text" name="image" value={formData.image} onChange={handleChange} />

                    <label>Category:</label>
                    <select name="category" value={formData.category} onChange={handleChange} required>
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>

                    <label>
                        <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} />
                        Is Featured
                    </label>

                    <label>Ingredients (comma-separated):</label>
                    <input type="text" name="ingridiens" value={formData.ingridiens} onChange={handleChange} />

                    <label>
                        <input type="checkbox" name="isVegetarian" checked={formData.isVegetarian} onChange={handleChange} />
                        Is Vegetarian
                    </label>

                    <label>
                        <input type="checkbox" name="isGlutenFree" checked={formData.isGlutenFree} onChange={handleChange} />
                        Is Gluten-Free
                    </label>

                    <label>
                        <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} />
                        Is Available
                    </label>

                    <button type="submit">Save Product</button>
                </form>
            )}

            <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>Product added successfully!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseSuccessModal}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AddProduct;
