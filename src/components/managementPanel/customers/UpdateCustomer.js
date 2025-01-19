import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../../context/authContext';
import api from '../../../utils/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../styles/UpdateCustomer.scss'

const UpdateCustomer = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        phone: '',
        isRegistered: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth('staff');

    const isEditable = ['admin', 'moderator'].includes(user.role);

    const getCustomer = async () => {
        try {
            const response = await api.get(`/customers/${id}`);
            if (response.status === 200) {
                setFormData(response.data);
            } else {
                throw new Error('Failed to fetch customer');
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.error || error.message);
            setShowErrorAlert(true);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setShowErrorAlert(false);
        setErrorMessage('');

        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        navigate('/management/customers');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.put(`/customers/${id}`, formData);
            if (response.status === 200) {
                setShowSuccessModal(true);
            } else {
                throw new Error(response.data.error || 'Failed to update customer.');
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.error || error.message);
            setShowErrorAlert(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getCustomer();
    }, []);

    return (
        <>
            <form className="customer-form" onSubmit={handleSubmit}>
                <h2>Update Customer</h2>
                {showErrorAlert && <Alert variant="danger">{errorMessage}</Alert>}

                <label>Name:</label>
                <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditable}
                />

                <label>Surname:</label>
                <input
                    name="surname"
                    type="text"
                    value={formData.surname}
                    onChange={handleChange}
                    disabled={!isEditable}
                />

                <label>Email:</label>
                <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditable}
                />

                <label>Phone:</label>
                <input
                    name="phone"
                    type="text"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditable}
                     pattern="^\+?[0-9\s\-\(\)]*$"
    title="Phone number can contain only numbers, spaces, '-', '(', ')' and '+'"
                />

                <label>
                    <input
                        name="isRegistered"
                        type="checkbox"
                        checked={formData.isRegistered}
                        onChange={handleChange}
                        disabled={!isEditable}
                    />{' '}
                    Registered
                </label>

                {isEditable && <button type="submit" disabled={isLoading}>Save Customer</button>}
            </form>

            <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Success!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Customer updated successfully!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseSuccessModal}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default UpdateCustomer;
