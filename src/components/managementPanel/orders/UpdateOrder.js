import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/authContext';
import api from '../../../utils/axios';
import {
    TextInput,
    Textarea,
    Checkbox,
    Button,
    Container,
    Stack,
    Title,
    Notification,
    Modal,
} from '@mantine/core';

const UpdateOrder = () => {
    const { id } = useParams();
    const [order, setOrder] = useState({});
    const [formData, setFormData] = useState({
        status: '',
        orderType: '',
        note: '',
        isPaid: false,
    });
    const [message, setMessage] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth('staff');

    const isEditable = ['admin', 'moderator'].includes(user.role);

    const getOrder = async () => {
        try {
            const response = await api.get(`/orders/${id}`);
            if (response.status === 200) {
                setOrder(response.data);
            } else {
                throw new Error('Failed to fetch order data');
            }
        } catch (error) {
            setErrorMessage('Failed to fetch order data. Please try again later.');
            setShowErrorAlert(true);
        }
    };

    useEffect(() => {
        getOrder();
    }, [id]);

    useEffect(() => {
        if (order) {
            setFormData({
                status: order.status || '',
                orderType: order.orderType || '',
                note: order.note || '',
                isPaid: order.isPaid || false,
            });
        }
    }, [order]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.put(`/orders/${id}`, formData);
            if (response.status === 200) {
                setMessage('Order updated successfully!');
                setShowSuccessModal(true);
            } else {
                setErrorMessage('Failed to update order. Please check your input and try again.');
                setShowErrorAlert(true);
            }
        } catch (error) {
            setErrorMessage('Error saving order. Please try again later.');
            setShowErrorAlert(true);
        }
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        setTimeout(() => {
            navigate('/orders');
        }, 500);
    };

    return (
        <Container w="100%">
            <form onSubmit={handleSubmit}>
                <Stack spacing="md">
                    <Title order={2}>Update Order</Title>

                    {showErrorAlert && (
                        <Notification color="red" onClose={() => setShowErrorAlert(false)}>
                            {errorMessage}
                        </Notification>
                    )}

                    <TextInput
                        label="Status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                        disabled={!isEditable}
                    />

                    <TextInput
                        label="Order Type"
                        name="orderType"
                        value={formData.orderType}
                        onChange={handleChange}
                        required
                        disabled={!isEditable}
                    />

                    <Textarea
                        label="Note"
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        disabled={!isEditable}
                    />

                    <Checkbox
                        label="Is Paid"
                        name="isPaid"
                        checked={formData.isPaid}
                        onChange={handleChange}
                        disabled={!isEditable}
                    />

                    {isEditable && (
                        <Button type="submit">Save Order</Button>
                    )}
                </Stack>
            </form>

            <Modal
                opened={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="Success"
                centered
            >
                <p>{message}</p>
                <Button onClick={handleCloseSuccessModal}>OK</Button>
            </Modal>
        </Container>
    );
};

export default UpdateOrder;
