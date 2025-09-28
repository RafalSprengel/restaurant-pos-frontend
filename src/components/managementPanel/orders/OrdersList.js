import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/authContext';
import api from '../../../utils/axios';
import dayjs from 'dayjs';
import './orderList.scss';
import ConfirmationModal from '../../ConfirmationModal';
import { Loader, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

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

  const getOrders = async () => {
    const queryString = location.search;
    try {
      setErrorMessage(null);
      setIsLoading(true);
      const response = await api.get(`/orders${queryString}`);
      setOrdersList(response.data.orders || []);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(response.data.currentPage || 1);
    } catch (error) {
      setErrorMessage(error.response?.data?.error || error.message);
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
      setErrorMessage(response.data?.error || null);
      getOrders();
    } catch (error) {
      setErrorMessage(error.response?.data?.error || error.message);
    } finally {
      setIsLoading(false);
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
              {ordersList.map((order) => (
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
                    >
                      Delete
                    </button>
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
