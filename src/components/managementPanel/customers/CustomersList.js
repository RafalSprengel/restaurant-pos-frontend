import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import api from '../../../utils/axios.js';
import { useAuth } from '../../../context/authContext.js';
import './customersList.scss';
import { Loader, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconSearch, IconPlus, IconX } from '@tabler/icons-react';
import ConfirmationModal from '../../ConfirmationModal';

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [customerIdToDelete, setCustomerIdToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchString, setSearchString] = useState('');
  const [sortCriteria, setSortCriteria] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const { user } = useAuth('staff');
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const fetchCustomers = async () => {
    const queryString = location.search;
    try {
      setLoading(true);
      const response = await api.get(`/customers${queryString}`);
      if (response.status === 200) {
        const data = response.data;
        setCustomers(data.customers);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      }
    } catch (err) {
      showNotification({
        title: 'Error',
        message: err.response?.data?.error || err.message,
        color: 'red',
        icon: <IconX />,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (id) => {
    navigate(`${id}`);
  };

  const deleteCustomer = async () => {
    try {
      const res = await api.delete(`/customers/${customerIdToDelete}`);
      if (res.status !== 200) {
        showNotification({
          title: 'Error',
          message: res.data?.error || 'Unable to delete customer',
          color: 'red',
          icon: <IconX />,
        });
      }
    } catch (e) {
      showNotification({
        title: 'Error',
        message:
          e.response?.data?.error ||
          "You don't have enough rights to perform this action",
        color: 'red',
        icon: <IconX />,
      });
    } finally {
      setShowModal(false);
      fetchCustomers();
    }
  };

  const handleConfirmDelete = (e, id) => {
    e.stopPropagation();
    setCustomerIdToDelete(id);
    setShowModal(true);
  };

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchString(value);
    const params = new URLSearchParams(location.search);
    params.delete('page');
    value === '' ? params.delete('search') : params.set('search', value);
    navigate('?' + params);
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

  const handlePageChange = (page) => {
    const params = new URLSearchParams(location.search);
    params.set('page', page);
    navigate('?' + params.toString());
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSortOrder(params.get('sortOrder') || '');
    setSortCriteria(params.get('sortBy') || '');
    setSearchString(params.get('search') || '');
  }, [location.search]);

  useEffect(() => {
    fetchCustomers();
  }, [searchParams, searchString, sortCriteria, sortOrder]);

  const SortArrow = ({ criteria }) => {
    if (criteria !== sortCriteria) return <>•</>;
    return <>{sortOrder === 'desc' ? '▼' : '▲'}</>;
  };

  if (loading) {
    return (
      <div className="customers-list__loading">
        <Loader size="sm" variant="dots" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="customers-list">
      <h2 className="customers-list__title">Customers</h2>

      <div className="customers-list__controls">
        <TextInput
          className="customers-list__search-input"
          type="text"
          placeholder="Search..."
          value={searchString}
          onChange={handleSearchChange}
          leftSection={<IconSearch size={16} />}
        />
        <button
          className="button-panel"
          onClick={() => navigate('/management/add-customer')}
        >
          <IconPlus size={16} />
          Add customer
        </button>
      </div>

      {customers.length > 0 ? (
        <>
          <table className="customers-list__table">
            <thead>
              <tr>
                <th data-name="customerNumber" onClick={handleSort}>
                  No <SortArrow criteria="customerNumber" />
                </th>
                <th data-name="name" onClick={handleSort}>
                  Name <SortArrow criteria="name" />
                </th>
                <th data-name="surname" onClick={handleSort}>
                  Surname <SortArrow criteria="surname" />
                </th>
                <th data-name="email" onClick={handleSort}>
                  Email <SortArrow criteria="email" />
                </th>
                <th data-name="orders" onClick={handleSort}>
                  Orders <SortArrow criteria="orders" />
                </th>
                <th data-name="createdAt" onClick={handleSort}>
                  Created <SortArrow criteria="createdAt" />
                </th>
                <th data-name="isRegistered" onClick={handleSort}>
                  Registered <SortArrow criteria="isRegistered" />
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => {
                const formattedDate = dayjs(customer.createdAt).format('DD/MM/YYYY');
                return (
                  <tr
                    key={customer._id}
                    className="customers-list__row"
                    onClick={() => handleRowClick(customer._id)}
                  >
                    <td>{customer.customerNumber}</td>
                    <td>{customer.name}</td>
                    <td>{customer.surname}</td>
                    <td>{customer.email}</td>
                    <td>{customer.amountOfOrders}</td>
                    <td>{formattedDate}</td>
                    <td>{customer.isRegistered ? 'Yes' : 'No'}</td>
                    <td>
                      <button
                        className="customers-list__delete-btn"
                        onClick={(e) => handleConfirmDelete(e, customer._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="customers-list__pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`customers-list__pagination-btn ${
                  currentPage === page
                    ? 'customers-list__pagination-btn--active'
                    : ''
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="customers-list__message">
          <p>No customers found.</p>
        </div>
      )}

      {showModal && (
        <ConfirmationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={deleteCustomer}
          message="Are you sure you want to delete this customer?"
        />
      )}
    </div>
  );
};

export default CustomersList;
