import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/authContext';
import api from '../../../utils/axios';
import dayjs from 'dayjs';
import '../../../styles/order-list.scss';
import {
    Container,
    Table,
    Button,
    TextInput,
    Modal,
    Notification,
    Group,
    Stack,
    Title,
    Pagination,
    ScrollArea,
    Loader,
    Center,
} from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';

const OrdersList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [ordersList, setOrdersList] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [searchString, setSearchString] = useState('');
    const [sortCriteria, setSortCriteria] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth('management');

    const rolePermissions = {
        admin: { deleteOrderButt: true },
        moderator: { deleteOrderButt: true },
        member: { deleteOrderButt: false },
    };

    const isVisible = rolePermissions[user.role] || { deleteOrderButt: false };

    const getOrders = async () => {
        const queryString = location.search;
        try {
            setErrorMessage(null);
            const response = await api.get(`/orders${queryString}`);
            if (response.status === 200) {
                const data = response.data;
                setOrdersList(data.orders);
                setTotalPages(data.totalPages);
                setCurrentPage(data.currentPage);
            } else {
                setErrorMessage(`Server error: ${response.data.error}`);
            }
        } catch (error) {
            setErrorMessage(error.response ? error.response.data.error : error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (page) => {
        const params = new URLSearchParams(location.search);
        params.set('page', page);
        navigate('?' + params.toString());
    };

    const handleSort = (e) => {
        const { name } = e.currentTarget.dataset;
        const params = new URLSearchParams(location.search);
        const currentOrder = params.get('sortOrder');
        params.set('sortOrder', currentOrder !== 'desc' ? 'desc' : 'asc');
        params.delete('page');
        params.set('sortBy', name);
        navigate('?' + params);
    };

    const handleSearchChange = (e) => {
        const { value } = e.target;
        setSearchString(value);
        const params = new URLSearchParams(location.search);
        params.delete('page');
        value === '' ? params.delete('search') : params.set('search', value);
        navigate('?' + params);
    };

    const handleDeleteClick = (event, id) => {
        event.stopPropagation();
        setOrderToDelete(id);
        setShowModal(true);
    };

    const handleConfirmDelete = async () => {
        setShowModal(false);
        setIsLoading(true);
        try {
            const response = await api.delete(`/orders/${orderToDelete}`);
            if (response.status === 200) {
                setErrorMessage(null);
                getOrders();
            } else {
                setErrorMessage('Unable to delete this order.');
            }
        } catch (error) {
            setErrorMessage('Failed to delete the order. Please try again.');
        } finally {
            setIsLoading(false);
            setOrderToDelete(null);
        }
    };

    const SortArrow = ({ criteria }) => {
        const arrow = () => {
            if (criteria === sortCriteria) return sortOrder === 'desc' ? '▼' : '▲';
            else return '•';
        };
        return <>{arrow()}</>;
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchFromUrl = params.get('search');
        const sortByFromUrl = params.get('sortBy');
        const sortOrderFromUrl = params.get('sortOrder');
        setSortOrder(sortOrderFromUrl || '');
        setSortCriteria(sortByFromUrl || '');
        setSearchString(searchFromUrl || '');
    }, [location.search]);

    useEffect(() => {
        getOrders();
    }, [searchString, sortCriteria, sortOrder]);

    return (
        <Container size="xl" mt="md" className="orders-list">
            <Stack>
                <Title order={2} className="orders-list__title">Orders</Title>
                <Group position="apart" className="orders-list__header">
                    <TextInput
                        icon={<IconSearch size={14} />}
                        placeholder="Search..."
                        value={searchString}
                        onChange={handleSearchChange}
                        className="orders-list__search"
                    />
                </Group>

                {errorMessage && (
                    <Notification icon={<IconX size={18} />} color="red" title="Error" className="orders-list__error-notification">
                        {errorMessage}
                    </Notification>
                )}

                {isLoading ? (
                    <Center className="orders-list__loader-wrapper">
                        <Loader size="md" />
                    </Center>
                ) : ordersList.length === 0 ? (
                    <Title order={4} className="orders-list__no-orders">No orders found</Title>
                ) : (
                    <ScrollArea className="orders-list__table-wrapper">
                        <Table striped highlightOnHover className="orders-list__table">
                            <thead>
                                <tr>
                                    <th data-name="orderNumber" onClick={handleSort} className="orders-list__table-header">
                                        Order No. <SortArrow criteria="orderNumber" />
                                    </th>
                                    <th data-name="customerName" onClick={handleSort} className="orders-list__table-header">
                                        Customer <SortArrow criteria="customerName" />
                                    </th>
                                    <th data-name="createdAt" onClick={handleSort} className="orders-list__table-header">
                                        Date <SortArrow criteria="createdAt" />
                                    </th>
                                    <th data-name="totalPrice" onClick={handleSort} className="orders-list__table-header">
                                        Total <SortArrow criteria="totalPrice" />
                                    </th>
                                    <th data-name="isPaid" onClick={handleSort} className="orders-list__table-header">
                                        Is Paid <SortArrow criteria="isPaid" />
                                    </th>
                                    <th className="orders-list__table-header">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ordersList.map((order) => (
                                    <tr key={order._id} onClick={() => navigate(`${order._id}`)} className="orders-list__table-row">
                                        <td className="orders-list__table-cell">{order.orderNumber}</td>
                                        <td className="orders-list__table-cell">
                                            {order.purchaserDetails.firstName + ' ' + order.purchaserDetails.surname}
                                        </td>
                                        <td className="orders-list__table-cell">{dayjs(order.createdAt).format('HH:mm DD/MM/YY')}</td>
                                        <td className="orders-list__table-cell">&pound;{order.totalPrice}</td>
                                        <td className="orders-list__table-cell">{order.isPaid ? 'Paid' : 'Unpaid'}</td>
                                        <td className="orders-list__table-cell">
                                            {isVisible.deleteOrderButt && (
                                                <Button
                                                    size="xs"
                                                    color="red"
                                                    onClick={(e) => handleDeleteClick(e, order._id)}
                                                    className="orders-list__delete-button"
                                                >
                                                    Delete
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </ScrollArea>
                )}

                {totalPages > 1 && (
                    <Pagination page={currentPage} onChange={handlePageChange} total={totalPages} className="orders-list__pagination" />
                )}
            </Stack>

            <Modal
                opened={showModal}
                onClose={() => setShowModal(false)}
                title="Confirm Deletion"
                centered
            >
                <p>Are you sure you want to delete this order?</p>
                <Group position="apart" mt="md" className="orders-list__modal-buttons">
                    <Button onClick={() => setShowModal(false)} variant="default">Cancel</Button>
                    <Button color="red" onClick={handleConfirmDelete}>Delete</Button>
                </Group>
            </Modal>
        </Container>
    );
};

export default OrdersList;