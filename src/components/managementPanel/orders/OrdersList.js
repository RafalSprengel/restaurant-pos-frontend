import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Modal, Button, Alert, Pagination } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Stack from 'react-bootstrap/Stack';
import { useAuth } from '../../../context/authContext';
import api from '../../../utils/axios';
import dayjs from 'dayjs';

const Orders = () => {
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
    const [searchParams] = useSearchParams();
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
            console.error('Error fetching orders:', error);
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
        if (currentOrder !== 'desc') {
            params.set('sortOrder', 'desc');
        } else {
            params.set('sortOrder', 'asc');
        }
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
        try {
            await deleteOrder(orderToDelete);
        } catch (error) {
            setErrorMessage('Failed to delete the order. Please try again.');
            console.error('Error deleting order:', error);
        }
    };

    const deleteOrder = async (id) => {
        setErrorMessage(null);
        const response = await api.delete(`/orders/${id}`);
        if (response.status !== 200) {
            setErrorMessage(`Unable to delete this order.`);
        }
    };

    const OrderRow = ({ order }) => {
        return (
            <tr onClick={() => navigate(`${order._id}`)}>
                <td>{order.orderNumber}</td>
                <td>{order.customer.name}</td>
                <td>{dayjs(order.createdAt).format('HH:mm DD/MM/YY')}</td>
                <td>{order.totalPrice}</td>
                <td>{order.status}</td>
                <td>
                    {isVisible.deleteOrderButt && (
                        <button type="button" className="btn btn-danger" onClick={(e) => handleDeleteClick(e, order._id)}>
                            Delete
                        </button>
                    )}
                </td>
            </tr>
        );
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchFromUrl = params.get('search');
        const sortByFromUrl = params.get('sortBy');
        const sortOrderFromUrl = params.get('sortOrder');
        sortOrderFromUrl ? setSortOrder(sortOrderFromUrl) : setSortOrder('');
        sortByFromUrl ? setSortCriteria(sortByFromUrl) : setSortCriteria('');
        searchFromUrl ? setSearchString(searchFromUrl) : setSearchString('');
    }, [location.search]);

    useEffect(() => {
        getOrders();
    }, [searchString, sortCriteria, sortOrder]);

    const SortArrow = ({ criteria }) => {
        const arrow = () => {
            if (criteria === sortCriteria) return sortOrder === 'desc' ? '▼' : '▲';
            else return '•';
        };
        return <>{arrow()}</>;
    };



    return (
        <>
            {!isLoading && !errorMessage && (
                <>
                    <h3>Orders</h3>
                    <Stack direction="horizontal" gap={3}>
                        <div className="p-2 ms-auto">Find order:</div>
                        <div className="p-2">
                            <input
                                type="search"
                                className="admin__searchInput"
                                placeholder="Search..."
                                onChange={handleSearchChange}
                                value={searchString}
                            />
                        </div>
                    </Stack>
                </>
            )}

            {ordersList?.length > 0 ? (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th data-name="orderNumber" onClick={handleSort}>
                                    Order No. <SortArrow criteria="orderNumber" />
                                </th>
                                <th data-name="customerName" onClick={handleSort}>
                                    Customer <SortArrow criteria="customerName" />
                                </th>
                                <th data-name="createdAt" onClick={handleSort}>
                                    Date <SortArrow criteria="createdAt" />
                                </th>
                                <th data-name="totalPrice" onClick={handleSort}>
                                    Total Price <SortArrow criteria="totalPrice" />
                                </th>
                                <th data-name="status" onClick={handleSort}>
                                    Status <SortArrow criteria="status" />
                                </th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordersList.map((order) => (
                                <OrderRow key={order._id} order={order} />
                            ))}
                        </tbody>
                    </table>
                    <Pagination className="custom-pagination">
                        <Pagination.First onClick={() => handlePageChange(1)} />
                        <Pagination.Prev
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        />
                        {[...new Array(totalPages)].map((el, index) => (
                            <Pagination.Item
                                key={index}
                                active={index + 1 === currentPage}
                                onClick={() => handlePageChange(index + 1)}>
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        />
                        <Pagination.Last onClick={() => handlePageChange(totalPages)} />
                    </Pagination>
                </>
            ) : isLoading ? (
                <h4>Loading data...</h4>
            ) : errorMessage ? (
                <Alert variant="danger">{errorMessage}</Alert>
            ) : (
                <h4>No orders found</h4>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this order?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleConfirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Orders;
