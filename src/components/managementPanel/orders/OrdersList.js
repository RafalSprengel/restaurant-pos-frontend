import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/authContext';
import api from '../../../utils/axios';
import dayjs from 'dayjs';
import './orderList.scss';
import ConfirmationModal from '../../ConfirmationModal';
import { Loader, TextInput, Select, Button } from '@mantine/core';
import { IconSearch, IconTrash, IconEdit } from '@tabler/icons-react';
import ErrorMessage from '../../ErrorMessage';

const OrdersList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [errorFetchOrders, setErrorFetchOrders] = useState(null);
    const [errorDeleteOrder, setErrorDeleteOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [ordersList, setOrdersList] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [searchString, setSearchString] = useState('');
    const [sortCriteria, setSortCriteria] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);
    const [expandedCardId, setExpandedCardId] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth('management');

    const getOrders = async () => {
        const queryString = location.search;
        try {
            setErrorFetchOrders(null);
            setIsLoading(true);
            const response = await api.get(`/orders${queryString}`);
            setOrdersList(response.data.orders || []);
            setTotalPages(response.data.totalPages || 1);
            setCurrentPage(response.data.currentPage || 1);
        } catch (error) {
            setErrorFetchOrders(error.response?.data?.error || error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (page) => {
        const params = new URLSearchParams(location.search);
        params.set('page', page);
        navigate('?' + params.toString());
    };

    const handleSortChange = (newSortBy, newSortOrder) => {
        const params = new URLSearchParams(location.search);
        params.set('sortBy', newSortBy);
        params.set('sortOrder', newSortOrder);
        params.delete('page');
        navigate('?' + params.toString());
    };

    const handleSortCriteriaChange = (value) => {
        const currentOrder = sortOrder || 'asc';
        handleSortChange(value, currentOrder);
    };

    const handleSortOrderChange = (value) => {
        const currentCriteria = sortCriteria || 'orderNumber';
        handleSortChange(currentCriteria, value);
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
        setErrorDeleteOrder(null);
        setOrderToDelete(id);
        setShowModal(true);
    };

    const handleConfirmDelete = async () => {
        setShowModal(false);
        setIsDeleting(true);
        try {
            setErrorDeleteOrder(null);
            const response = await api.delete(`/orders/${orderToDelete}`);
            setErrorDeleteOrder(response.data?.error || null);
            getOrders();
        } catch (error) {
            setErrorDeleteOrder(error.response?.data?.error || error.message);
        } finally {
            setIsDeleting(false);
            setOrderToDelete(null);
        }
    };

    const SortArrow = ({ criteria }) => {
        const arrow = () => {
            if (criteria === sortCriteria) return sortOrder === 'desc' ? '▼' : '▲';
            return '•';
        };
        return <>{arrow()}</>;
    };

    const handleRowClick = (orderId) => {
        navigate(`${orderId}`);
    };

    const toggleCardExpansion = (id) => {
        setExpandedCardId(prevId => (prevId === id ? null : id));
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setSortOrder(params.get('sortOrder') || '');
        setSortCriteria(params.get('sortBy') || '');
        setSearchString(params.get('search') || '');
    }, [location.search]);

    useEffect(() => {
        getOrders();
    }, [location.search]);

    const sortOptions = [
        { value: 'orderNumber', label: 'Order No.' },
        { value: 'customerName', label: 'Customer' },
        { value: 'createdAt', label: 'Date' },
        { value: 'totalPrice', label: 'Total' },
        { value: 'isPaid', label: 'Is Paid' },
    ];

    const sortOrderOptions = [
        { value: 'asc', label: 'Ascending' },
        { value: 'desc', label: 'Descending' },
    ];

    const getPageNumbers = () => {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    };

    return (
        <div className="orders-list__container">
            <h1 className="orders-list__title">Orders</h1>

            <div className="orders-list__header">
                <TextInput
                    placeholder="Search orders..."
                    className="orders-list__search-input"
                    value={searchString}
                    onChange={handleSearchChange}
                    leftSection={<IconSearch size={16} />}
                />
            </div>

            <div className="orders-list__mobile-sort-controls">
                <Select
                    placeholder="Sort by"
                    data={sortOptions}
                    value={sortCriteria}
                    onChange={handleSortCriteriaChange}
                />
                <Select
                    placeholder="Order"
                    data={sortOrderOptions}
                    value={sortOrder}
                    onChange={handleSortOrderChange}
                />
            </div>

            {errorDeleteOrder && <ErrorMessage message={errorDeleteOrder} />}
            {errorFetchOrders && <ErrorMessage message={errorFetchOrders} />}

            {isLoading ? (
                <div className="orders-list__loading">
                    <Loader size="sm" variant="dots" />
                    <span>Loading...</span>
                </div>
            ) : !ordersList.length ? (
                <h4 className="orders-list__no-orders">No data to display</h4>
            ) : (
                <>
                    <div className="orders-list__table-wrapper">
                        <table className="orders-list__table">
                            <thead>
                                <tr>
                                    <th data-name="orderNumber" onClick={(e) => handleSortChange('orderNumber', sortOrder === 'desc' ? 'asc' : 'desc')}>Order No. <SortArrow criteria="orderNumber" /></th>
                                    <th data-name="customerName" onClick={(e) => handleSortChange('customerName', sortOrder === 'desc' ? 'asc' : 'desc')}>Customer <SortArrow criteria="customerName" /></th>
                                    <th data-name="createdAt" onClick={(e) => handleSortChange('createdAt', sortOrder === 'desc' ? 'asc' : 'desc')}>Date <SortArrow criteria="createdAt" /></th>
                                    <th data-name="totalPrice" onClick={(e) => handleSortChange('totalPrice', sortOrder === 'desc' ? 'asc' : 'desc')}>Total <SortArrow criteria="totalPrice" /></th>
                                    <th data-name="isPaid" onClick={(e) => handleSortChange('isPaid', sortOrder === 'desc' ? 'asc' : 'desc')}>Is Paid <SortArrow criteria="isPaid" /></th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ordersList.map((order) => {
                                    const isThisOrderDeleting = isDeleting && orderToDelete === order._id;
                                    return (
                                        <tr key={order._id} onClick={() => handleRowClick(order._id)}>
                                            <td>{order.orderNumber}</td>
                                            <td>{order.purchaserDetails?.firstName || ''} {order.purchaserDetails?.surname || ''}</td>
                                            <td>{dayjs(order.createdAt).format('HH:mm DD/MM/YY')}</td>
                                            <td>&pound;{order.totalPrice}</td>
                                            <td>{order.isPaid ? 'Paid' : 'Unpaid'}</td>
                                            <td>
                                                <button
                                                    className="orders-list__button orders-list__button--delete"
                                                    onClick={(e) => handleDeleteClick(e, order._id)}
                                                    disabled={isThisOrderDeleting}
                                                >
                                                    {isThisOrderDeleting ? (
                                                        <Loader size={16} color="currentColor" />
                                                    ) : (
                                                        <IconTrash size={16} />
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="orders-list__cards-group">
                        {ordersList.map((order) => {
                            const isThisCardDeleting = isDeleting && orderToDelete === order._id;
                            const isExpanded = expandedCardId === order._id;
                            return (
                                <div key={order._id} className={`orders-list__card ${isExpanded ? 'orders-list__card--expanded' : ''}`} onClick={() => toggleCardExpansion(order._id)}>
                                    <div className="orders-list__card-header">
                                        <span className="orders-list__card-name">Order No: {order.orderNumber}</span>
                                        <span className="orders-list__card-number">{dayjs(order.createdAt).format('DD/MM/YY')}</span>
                                    </div>
                                    {isExpanded && (
                                        <div className="orders-list__card-details">
                                            <div className="orders-list__card-row">
                                                <span className="orders-list__card-label">Customer:</span>
                                                <span className="orders-list__card-value">{order.purchaserDetails?.firstName || ''} {order.purchaserDetails?.surname || ''}</span>
                                            </div>
                                            <div className="orders-list__card-row">
                                                <span className="orders-list__card-label">Total:</span>
                                                <span className="orders-list__card-value">&pound;{order.totalPrice}</span>
                                            </div>
                                            <div className="orders-list__card-row">
                                                <span className="orders-list__card-label">Paid:</span>
                                                <span className="orders-list__card-value">{order.isPaid ? 'Yes' : 'No'}</span>
                                            </div>
                                            <div className="orders-list__card-actions">
                                                <button
                                                    className="orders-list__card-button-edit"
                                                    onClick={(e) => { e.stopPropagation(); handleRowClick(order._id); }}
                                                >
                                                    <IconEdit size={16} /> Edit
                                                </button>
                                                <button
                                                    className="orders-list__button orders-list__button--delete"
                                                    onClick={(e) => handleDeleteClick(e, order._id)}
                                                    disabled={isThisCardDeleting}
                                                >
                                                    {isThisCardDeleting ? (
                                                        <Loader size={16} color="currentColor" />
                                                    ) : (
                                                        <IconTrash size={16} />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </>
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