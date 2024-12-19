import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/authContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdateCategory = () => {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        index: '',
        image: null,
    });

    const { user } = useAuth();
    const rolePermissions = {
        admin: { saveButt: true },
        moderator: { saveButt: true },
        member: { saveButt: false },
    };
    const isVisible = rolePermissions[user.role] || { addNewButt: false, deleteButt: false };

    const getCategory = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/getSingleCategory/' + id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch category');
            } else {
                const data = await response.json();
                setFormData(data);
            }
        } catch (error) {
            console.error('Error: ' + error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setShowErrorAlert(false);
        setErrorMessage(false);

        if (type === 'file') {
            setFormData({
                ...formData,
                image: files[0],
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        navigate('/admin/categories');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('index', formData.index);
        formDataToSend.append('image', formData.image);

        try {
            const response = await fetch(`http://localhost:3001/api/updateCategory/${id}`, {
                method: 'PUT',
                body: formDataToSend,
            });
            if (!response.ok) {
                const errorData = await response.json();
                setShowErrorAlert(true);
                setErrorMessage(`Failed to save category! (${errorData.error})` || 'Failed to save the categoty.');
            } else {
                setShowSuccessModal(true);
            }
        } catch (error) {
            setShowErrorAlert(true);
            setErrorMessage(error || 'Failed to save the categoty.');
        }
    };

    useEffect(() => {
        getCategory();
    }, []);

    return (
        <>
            <form className="menu-item-form" onSubmit={handleSubmit}>
                <h2>Update existing category</h2>
                {showErrorAlert && <Alert variant="danger">{errorMessage}</Alert>}
                <label>Name:</label>
                <input name="name" type="text" value={formData.name} onChange={handleChange} />
                <label>Index</label>
                <input name="index" type="number" value={formData.index} onChange={handleChange} />
                <label>Image</label>

                {isVisible.saveButt && (
                    <>
                        <input name="image" type="file" onChange={handleChange} />
                        <button type="submit"> Save category</button>
                    </>
                )}
            </form>
            <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Success!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Category updated successfully!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseSuccessModal}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default UpdateCategory;
