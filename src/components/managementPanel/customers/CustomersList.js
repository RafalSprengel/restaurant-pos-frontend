import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import api from '../../../utils/axios.js';
import './customersList.scss';
import { Loader, TextInput, Select, Button } from '@mantine/core';
import { IconSearch, IconPlus, IconTrash, IconSortAscending, IconSortDescending, IconEdit } from '@tabler/icons-react';
import ConfirmationModal from '../../ConfirmationModal';
import ErrorMessage from '../../ErrorMessage';

const CustomersList = () => {
    const [customers, setCustomers] = useState([]);
    const [customerIdToDelete, setCustomerIdToDelete] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [errorFetchCustomers, setErrorFetchCustomers] = useState(null);
    const [errorDeleteCustomer, setErrorDeleteCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchString, setSearchString] = useState('');
    const [sortCriteria, setSortCriteria] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [expandedCardId, setExpandedCardId] = useState(null);

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
                setErrorFetchCustomers(null);
            } else {
                setErrorFetchCustomers(response.data?.error || 'Failed to fetch customers');
            }
        } catch (err) {
            setErrorFetchCustomers(err.response?.data?.error || err.message || 'Unexpected error');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (id) => {
        navigate(`${id}`);
    };

    const deleteCustomer = async () => {
        setIsDeleting(true);
        setShowModal(false);
        try {
            setErrorDeleteCustomer(null);
            const res = await api.delete(`/customers/${customerIdToDelete}`);
            if (res.status !== 200) {
                setErrorDeleteCustomer(res.data?.error || 'Unable to delete customer');
            } else {
                setErrorDeleteCustomer(null);
            }
        } catch (e) {
            setErrorDeleteCustomer(
                e.response?.data?.error ||
                "You don't have enough rights to perform this action"
            );
        } finally {
            setIsDeleting(false);
            setCustomerIdToDelete(null);
            fetchCustomers();
        }
    };

    const handleConfirmDelete = (e, id) => {
        e.stopPropagation();
        setErrorDeleteCustomer(null);
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
        const currentCriteria = sortCriteria || 'customerNumber';
        handleSortChange(currentCriteria, value);
    };

    const handlePageChange = (page) => {
        const params = new URLSearchParams(location.search);
        params.set('page', page);
        navigate('?' + params.toString());
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
        fetchCustomers();
    }, [location.search]);

    const SortArrow = ({ criteria }) => {
        if (criteria !== sortCriteria) return <>•</>;
        return <>{sortOrder === 'desc' ? '▼' : '▲'}</>;
    };

    const sortOptions = [
        { value: 'customerNumber', label: 'No' },
        { value: 'firstName', label: 'First Name' },
        { value: 'surname', label: 'Surname' },
        { value: 'email', label: 'Email' },
        { value: 'orders', label: 'Orders' },
        { value: 'createdAt', label: 'Created' },
        { value: 'isRegistered', label: 'Registered' },
    ];

    const sortOrderOptions = [
        { value: 'asc', label: 'Ascending' },
        { value: 'desc', label: 'Descending' },
    ];

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

            <div className="customers-list__mobile-sort-controls">
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

            {errorDeleteCustomer && <ErrorMessage message={errorDeleteCustomer} />}
            {errorFetchCustomers && <ErrorMessage message={errorFetchCustomers} />}
            
            {customers.length > 0 ? (
                <>
                    <div className="customers-list__table-wrapper">
                        <table className="customers-list__table">
                            <thead>
                                <tr>
                                    <th data-name="customerNumber" onClick={(e) => handleSortChange('customerNumber', sortOrder === 'desc' ? 'asc' : 'desc')}>
                                        No <SortArrow criteria="customerNumber" />
                                    </th>
                                    <th data-name="firstName" onClick={(e) => handleSortChange('firstName', sortOrder === 'desc' ? 'asc' : 'desc')}>
                                        First Name <SortArrow criteria="firstName" />
                                    </th>
                                    <th data-name="surname" onClick={(e) => handleSortChange('surname', sortOrder === 'desc' ? 'asc' : 'desc')}>
                                        Surname <SortArrow criteria="surname" />
                                    </th>
                                    <th data-name="email" onClick={(e) => handleSortChange('email', sortOrder === 'desc' ? 'asc' : 'desc')}>
                                        Email <SortArrow criteria="email" />
                                    </th>
                                    <th data-name="orders" onClick={(e) => handleSortChange('orders', sortOrder === 'desc' ? 'asc' : 'desc')}>
                                        Orders <SortArrow criteria="orders" />
                                    </th>
                                    <th data-name="createdAt" onClick={(e) => handleSortChange('createdAt', sortOrder === 'desc' ? 'asc' : 'desc')}>
                                        Created <SortArrow criteria="createdAt" />
                                    </th>
                                    <th data-name="isRegistered" onClick={(e) => handleSortChange('isRegistered', sortOrder === 'desc' ? 'asc' : 'desc')}>
                                        Registered <SortArrow criteria="isRegistered" />
                                    </th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((customer) => {
                                    const formattedDate = dayjs(customer.createdAt).format('DD/MM/YYYY');
                                    const isThisRowDeleting = isDeleting && customerIdToDelete === customer._id;

                                    return (
                                        <tr
                                            key={customer._id}
                                            className="customers-list__row"
                                            onClick={() => handleEditClick(customer._id)}
                                        >
                                            <td>{customer.customerNumber}</td>
                                            <td>{customer.firstName}</td>
                                            <td>{customer.surname}</td>
                                            <td>{customer.email}</td>
                                            <td>{customer.amountOfOrders}</td>
                                            <td>{formattedDate}</td>
                                            <td>{customer.isRegistered ? 'Yes' : 'No'}</td>
                                            <td>
                                                <button
                                                    className="customers-list__delete-btn"
                                                    onClick={(e) => handleConfirmDelete(e, customer._id)}
                                                    disabled={isThisRowDeleting}
                                                >
                                                    {isThisRowDeleting ? (
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

                    <div className="customers-list__cards-group">
                        {customers.map((customer) => {
                            const formattedDate = dayjs(customer.createdAt).format('DD/MM/YYYY');
                            const isThisCardDeleting = isDeleting && customerIdToDelete === customer._id;
                            const isExpanded = expandedCardId === customer._id;

                            return (
                                <div 
                                    key={customer._id} 
                                    className={`customers-list__card ${isExpanded ? 'customers-list__card--expanded' : ''}`} 
                                    onClick={() => toggleCardExpansion(customer._id)}
                                >
                                    <div className="customers-list__card-header">
                                        <span className="customers-list__card-name">{customer.firstName} {customer.surname}</span>
                                        <span className="customers-list__card-number">No: {customer.customerNumber}</span>
                                    </div>
                                    {isExpanded && (
                                        <div className="customers-list__card-details">
                                            <div className="customers-list__card-row">
                                                <span className="customers-list__card-label">Email:</span>
                                                <span className="customers-list__card-value">{customer.email}</span>
                                            </div>
                                            <div className="customers-list__card-row">
                                                <span className="customers-list__card-label">Phone:</span>
                                                <span className="customers-list__card-value">{customer.phone}</span>
                                            </div>
                                            <div className="customers-list__card-row">
                                                <span className="customers-list__card-label">Orders:</span>
                                                <span className="customers-list__card-value">{customer.amountOfOrders}</span>
                                            </div>
                                            <div className="customers-list__card-row">
                                                <span className="customers-list__card-label">Created:</span>
                                                <span className="customers-list__card-value">{formattedDate}</span>
                                            </div>
                                            <div className="customers-list__card-row">
                                                <span className="customers-list__card-label">Registered:</span>
                                                <span className="customers-list__card-value">{customer.isRegistered ? 'Yes' : 'No'}</span>
                                            </div>
                                            <div className="customers-list__card-actions">
                                                <button
                                                    className="customers-list__card-button-edit"
                                                    onClick={(e) => { e.stopPropagation(); handleEditClick(customer._id); }}
                                                >
                                                    <IconEdit size={16} /> Edit
                                                </button>
                                                <button
                                                    className="customers-list__delete-btn"
                                                    onClick={(e) => handleConfirmDelete(e, customer._id)}
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

                    <div className="customers-list__pagination">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                className={`customers-list__pagination-btn ${currentPage === page
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