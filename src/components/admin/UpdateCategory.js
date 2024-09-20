import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdateCategory = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        index: '',
        image: null
    })

    const getCategory = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/getSingleCategory/' + id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch category')
            } else {
                const data = await response.json();
                setFormData(data)
            }
        } catch (error) {
            console.error('Error: ' + error)
        }
    }

    const handleChange = (e) => {
        const { name, value, type, files } = e.target

        if (type === 'file') {
            setFormData({
                ...formData,
                image: files[0]
            })
        }
        else {
            setFormData({
                ...formData,
                [name]: value
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('index', formData.index);
        formDataToSend.append('image', formData.image)

        try {
            const response = await fetch(`http://localhost:3001/api/updateCategory/${id}`, {
                method: 'PUT',
                body: formDataToSend
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.log("Error : " + errorData.error)
                //setErrorMessage(errorData.error || 'Failed to save the product.');
            } else {
                console.log('Updated category was successfully!')
            }
        } catch (error) {
            console.error('Error: ' + error)
        }
    }

    useEffect(() => {
        getCategory()
    }, [])
    console.log(formData)

    return (
        <>
            <form className="menu-item-form" onSubmit={handleSubmit}>
                <h2>Update existing category</h2>
                <label>Name:</label>
                <input
                    name='name'
                    type='text'
                    value={formData.name}
                    onChange={handleChange}
                />
                <label>Index</label>
                <input
                    name='index'
                    type='number'
                    value={formData.index}
                    onChange={handleChange}
                />
                <label>Image</label>
                <input
                    name='image'
                    type='file'
                    onChange={handleChange}
                />
                <button type='submit'> Save category</button>
            </form>
        </>
    )
}

export default UpdateCategory;