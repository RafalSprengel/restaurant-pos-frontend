import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import api from '../../../utils/axios.js';
import { useAuth } from '../../../context/authContext.js';
import './customersList.scss';

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [customerIdToDelete, setCustomerIdToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchString, setSearchString] = useState('');
  const [sortCriteria, setSortCriteria] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const { user } = useAuth('staff');
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const rolePermissions = {
    admin: { addNewButt: true, deleteButt: true },
    moderator: { addNewButt: true, deleteButt: true },
    member: { addNewButt: false, deleteButt: false },
  };
  const isVisible = rolePermissions[user.role] || { deleteButt: false };

  const fetchCustomers = async () => {
    const queryString = location.search;
    try {
      setError(null);
      setLoading(true);
      const response = await api.get(`/customers/${queryString}`);
      if (response.status === 200) {
        const data = response.data;
        setCustomers(data.customers);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      } else {
        setError(`Server error: ${response.data.error}`);
      }
    } catch (err) {
      setError(err.response ? err.response.data.error : err.message);
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
        setError(`Error: ${res.data.error || 'Unable to delete customer'}`);
      }
    } catch (e) {
      if (e.response) {
        setError(`Error: ${e.response.data.error || 'Unknown error'}`);
      } else {
        setError('Error: Unable to delete customer.');
      }
    } finally {
      setShowModal(false);
      if (!error) {
        fetchCustomers();
      }
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
    if (currentOrder !== 'desc') {
      params.set('sortOrder', 'desc');
    } else {
      params.set('sortOrder', 'asc');
    }
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
    const searchFromUrl = params.get('search');
    const sortByFromUrl = params.get('sortBy');
    const sortOrderFromUrl = params.get('sortOrder');
    setSortOrder(sortOrderFromUrl || '');
    setSortCriteria(sortByFromUrl || '');
    setSearchString(searchFromUrl || '');
  }, [location.search]);

  useEffect(() => {
    fetchCustomers();
  }, [searchParams, searchString, sortCriteria, sortOrder]);

  const SortArrow = ({ criteria }) => {
    const arrow = () => {
      if (criteria === sortCriteria) return sortOrder === 'desc' ? '▼' : '▲';
      else return '•';
    };
    return <>{arrow()}</>;
  };

  if (loading) {
    return (
      <div className="customers-list-loader">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="customers-list">
      {/* Header */}
      <h2 className="customers-list__title">Customers</h2>

      <div className="customers-list__controls">
        {isVisible.addNewButt && (
          <button
            className="customers-list__add-btn"
            onClick={() => navigate('/management/add-customer')}
          >
            Add customer
          </button>
        )}
        <div className="customers-list__search">
          <span>Find customer:</span>
          <input
            className="customers-list__search-input"
            type="text"
            placeholder="Search..."
            value={searchString}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Error Notification */}
      {error && (
        <div className="customers-list__notification customers-list__notification--error">
          <p>{error}</p>
        </div>
      )}

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
                      {isVisible.deleteButt && (
                        <button
                          className="customers-list__delete-btn"
                          onClick={(e) => handleConfirmDelete(e, customer._id)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="customers-list__pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`customers-list__pagination-btn ${
                  currentPage === page ? 'customers-list__pagination-btn--active' : ''
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

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="customers-list__modal">
          <div className="customers-list__modal-content">
            <h3 className="customers-list__modal-title">Confirm Deletion</h3>
            <p>Are you sure you want to delete this customer?</p>
            <div className="customers-list__modal-actions">
              <button
                className="customers-list__modal-btn customers-list__modal-btn--cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="customers-list__modal-btn customers-list__modal-btn--delete"
                onClick={deleteCustomer}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersList;