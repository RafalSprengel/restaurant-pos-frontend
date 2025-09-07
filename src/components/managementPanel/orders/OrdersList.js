import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/authContext';
import api from '../../../utils/axios';
import dayjs from 'dayjs';
import './orderList.scss';
import ConfirmationModal from '../../ConfirmationModal';
import { Loader, TextInput } from '@mantine/core';
import { IconTrash, IconSortAscending, IconSortDescending, IconSearch, IconPlus, IconEdit } from '@tabler/icons-react';


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

    const isVisible = rolePermissions[user?.role] || { deleteOrderButt: false };

    const getOrders = async () => {
        const queryString = location.search;
        try {
            setErrorMessage(null);
            const response = await api.get(`/orders${queryString}`);
            if (response.status === 200) {
                const data = response.data;
                setOrdersList(data.orders || []);
                setTotalPages(data.totalPages || 1);
                setCurrentPage(data.currentPage || 1);
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
        if (value === '') {
            params.delete('search');
        } else {
            params.set('search', value);
        }
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
    }, [location.search]);

    const handleRowClick = (orderId) => {
        navigate(`${orderId}`);
    };

    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="orders-list__container">
            <h1 className="orders-list__title">Orders</h1>

            <div className="orders-list__header">

                <TextInput
                    placeholder="Search products..."
                    className="orders-list__search-input"
                    value={searchString}
                    onChange={handleSearchChange}
                    leftSection={<IconSearch size={16} />}
                />

            </div>

            {errorMessage && (
                <div className="orders-list__notification orders-list__notification--error">
                    <span className="orders-list__notification-icon">❌</span>
                    {errorMessage}
                </div>
            )}

            {isLoading ? (
                <div className="orders-list__loading">
                    <Loader size="sm" variant="dots" />
                    <span>Loading...</span>
                </div>
            ) : !ordersList?.length ? (
                <h4 className="orders-list__no-orders">No data to display</h4>
            ) : (
                <div className="orders-list__table-wrapper">
                    <table className="orders-list__table">
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
                                <tr key={order._id} onClick={() => handleRowClick(order._id)} className="orders-list__table-row">
                                    <td className="orders-list__table-cell">{order.orderNumber}</td>
                                    <td className="orders-list__table-cell">
                                        {order.purchaserDetails?.firstName || ''} {order.purchaserDetails?.surname || ''}
                                    </td>
                                    <td className="orders-list__table-cell">{dayjs(order.createdAt).format('HH:mm DD/MM/YY')}</td>
                                    <td className="orders-list__table-cell">&pound;{order.totalPrice}</td>
                                    <td className="orders-list__table-cell">{order.isPaid ? 'Paid' : 'Unpaid'}</td>
                                    <td className="orders-list__table-cell">
                                        {isVisible.deleteOrderButt && (
                                            <button
                                                className="orders-list__button orders-list__button--delete"
                                                onClick={(e) => handleDeleteClick(e, order._id)}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {totalPages > 1 && (
                <div className="orders-list__pagination">
                    {getPageNumbers().map((page) => (
                        <button
                            key={page}
                            className={`orders-list__pagination-button ${currentPage === page ? 'orders-list__pagination-button--active' : ''}`}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}

            {showModal && (
                // <div className="orders-list__modal-overlay">
                //     <div className="orders-list__modal">
                //         <p className="orders-list__modal-text">Are you sure you want to delete this order?</p>
                //         <div className="orders-list__modal-buttons">
                //             <button className="orders-list__button orders-list__button--cancel" onClick={() => setShowModal(false)}>Cancel</button>
                //             <button className="orders-list__button orders-list__button--delete-confirm" onClick={handleConfirmDelete}>Delete</button>
                //         </div>
                //     </div>
                // </div>

                <ConfirmationModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onConfirm={handleConfirmDelete}
                    message="Are you sure you want to delete this order?"
                />
            )}
        </div>
    );
};

export default OrdersList;