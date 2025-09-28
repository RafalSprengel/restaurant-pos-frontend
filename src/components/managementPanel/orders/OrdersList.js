import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/authContext';
import api from '../../../utils/axios';
import dayjs from 'dayjs';
import './orderList.scss';
import ConfirmationModal from '../../ConfirmationModal';
import { Loader, TextInput } from '@mantine/core';
import { IconSearch, IconTrash } from '@tabler/icons-react'; // Dodano IconTrash
import ErrorMessage from '../../ErrorMessage';

const OrdersList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [errorFetchOrders, setErrorFetchOrders] = useState(null); // Zmieniono nazwę stanu
    const [errorDeleteOrder, setErrorDeleteOrder] = useState(null); // Nowy stan dla błędu usuwania
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false); // Nowy stan dla ładowania usuwania
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

    const getOrders = async () => {
        const queryString = location.search;
        try {
            setErrorFetchOrders(null); // Użycie nowego stanu
            setIsLoading(true);
            const response = await api.get(`/orders${queryString}`);
            setOrdersList(response.data.orders || []);
            setTotalPages(response.data.totalPages || 1);
            setCurrentPage(response.data.currentPage || 1);
        } catch (error) {
            setErrorFetchOrders(error.response?.data?.error || error.message); // Użycie nowego stanu
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
        setErrorDeleteOrder(null); // Czyszczenie poprzedniego błędu usuwania
        setOrderToDelete(id);
        setShowModal(true);
    };

    const handleConfirmDelete = async () => {
        setShowModal(false);
        setIsDeleting(true); // Włączenie ładowania dla usuwania
        try {
            setErrorDeleteOrder(null);
            const response = await api.delete(`/orders/${orderToDelete}`);
            setErrorDeleteOrder(response.data?.error || null);
            getOrders();
        } catch (error) {
            setErrorDeleteOrder(error.response?.data?.error || error.message); // Użycie nowego stanu
        } finally {
            setIsDeleting(false); // Wyłączenie ładowania dla usuwania
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

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setSortOrder(params.get('sortOrder') || '');
        setSortCriteria(params.get('sortBy') || '');
        setSearchString(params.get('search') || '');
    }, [location.search]);

    useEffect(() => {
        getOrders();
    }, [location.search]);

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
                <div className="orders-list__table-wrapper">
                    <table className="orders-list__table">
                        <thead>
                            <tr>
                                <th data-name="orderNumber" onClick={handleSort}>Order No. <SortArrow criteria="orderNumber" /></th>
                                <th data-name="customerName" onClick={handleSort}>Customer <SortArrow criteria="customerName" /></th>
                                <th data-name="createdAt" onClick={handleSort}>Date <SortArrow criteria="createdAt" /></th>
                                <th data-name="totalPrice" onClick={handleSort}>Total <SortArrow criteria="totalPrice" /></th>
                                <th data-name="isPaid" onClick={handleSort}>Is Paid <SortArrow criteria="isPaid" /></th>
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
                                                {/* Użycie IconTrash / Loader o stałym rozmiarze 16px */}
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