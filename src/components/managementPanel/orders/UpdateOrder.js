import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/authContext';
import api from '../../../utils/axios';
import { useFetch } from '../../../hooks/useFetch.js';
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
    Card,
    Text,
    Group,
    Divider,
    Badge,
    Table,
    Select,
    Paper,
} from '@mantine/core';
import { format } from 'date-fns';

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

    const { data: orderTypes, loading: loadingOrderTypes, error: errorOrderTypes } = useFetch('/orders/order-types');

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

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        navigate('/management/orders');
    };

    const formatDate = (dateStr) => {
        try {
            return format(new Date(dateStr), 'yyyy-MM-dd HH:mm');
        } catch {
            return 'Invalid date';
        }
    };

    const selectOrderTypes = orderTypes?.map((type) => ({
        value: type,
        label: type.charAt(0).toUpperCase() + type.slice(1),
    })) || [];

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

    return (
        <Container w="100%" size="lg">
            <form onSubmit={handleSubmit}>
                <Stack spacing="xl">
                    <Title order={2}>Update Order</Title>

                    {showErrorAlert && (
                        <Notification color="red" onClose={() => setShowErrorAlert(false)}>
                            {errorMessage}
                        </Notification>
                    )}

                    <Card withBorder shadow="sm" padding="lg">
                        <Group position="apart">
                            <Text weight={500}>Order #{order?.orderNumber}</Text>
                            <Badge color={order?.isPaid ? 'green' : 'red'}>
                                {order?.isPaid ? 'Paid' : 'Unpaid'}
                            </Badge>
                        </Group>
                        <Text size="sm" mt="xs">
                            Placed: {formatDate(order?.createdAt)}
                        </Text>
                        <Text size="sm">Updated: {formatDate(order?.updatedAt)}</Text>
                        <Text size="sm" mt="md">Total Price: £{order?.totalPrice}</Text>
                    </Card>

                    <Card withBorder shadow="sm" padding="lg">
                        <Title order={4}>Purchaser details</Title>
                        <Text size="sm" mt="sm">Name: {order?.purchaserDetails?.firstName} {order?.purchaserDetails?.surname}</Text>
                        <Text size="sm">Phone: {order?.purchaserDetails?.phone}</Text>
                        <Text size="sm">Email: {order?.purchaserDetails?.email}</Text>
                    </Card>

                    <Card withBorder shadow="sm" padding="lg">
                        <Title order={4}>Products</Title>
                        <Table withTableBorder striped highlightOnHover mt="sm">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order?.products?.map((product) => (
                                    <tr key={product._id}>
                                        <td>{product.name}</td>
                                        <td>{product.quantity}</td>
                                        <td>£{product.price}</td>
                                        <td>£{product.totalPrice}</td>
                                        <td style={{ width: '150px' }}>
                                            {product.ingredients?.join(', ')}<br />
                                            {product.isVegetarian && <Badge color="green" size="xs" mr="xs">Vegetarian</Badge>}
                                            {product.isGlutenFree && <Badge color="blue" size="xs">Gluten-Free</Badge>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card>

                    <Divider label="Edit Fields" labelPosition="center" />

                    <Select
                        label="Order Type"
                        name="orderType"
                        data={selectOrderTypes}
                        value={formData.orderType || ''}
                        onChange={(value) =>
                            setFormData((prev) => ({ ...prev, orderType: value }))
                        }
                        placeholder={loadingOrderTypes ? 'Loading...' : 'Select order type'}
                        disabled={loadingOrderTypes || !isEditable}
                        required
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
