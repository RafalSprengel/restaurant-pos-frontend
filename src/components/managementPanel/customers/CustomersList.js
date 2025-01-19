import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Modal, Button, Pagination, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Stack from 'react-bootstrap/Stack';
import dayjs from 'dayjs';
import { useAuth } from '../../../context/authContext';
import api from '../../../utils/axios';

const Customers = () => {
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

    // Pobieranie danych o klientach
    const fetchCustomers = async () => {
        const queryString = location.search;
        try {
            setError(null);
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

    // Funkcja obsługująca kliknięcie w wiersz tabeli
    const handleRowClick = (id) => {
        navigate(`${id}`);
    };

    // Funkcja obsługująca usunięcie klienta
    const deleteCustomer = async () => {
        try {
            const res = await api.delete(`/customers/${customerIdToDelete}`);
            if (res.status !== 200) {
                console.error('Unable to delete customer:', res.data.error);
            }
        } catch (e) {
            console.error('Error deleting customer:', e.response.data.error);
        } finally {
            setShowModal(false);
            fetchCustomers(); // Odśwież dane po usunięciu
        }
    };

    // Funkcja obsługująca kliknięcie w przycisk usuwania
    const handleConfirmDelete = (e, id) => {
        e.stopPropagation();
        setCustomerIdToDelete(id);
        setShowModal(true);
    };

    // Funkcja obsługująca zmianę wyszukiwania
    const handleSearchChange = (e) => {
        const { value } = e.target;
        setSearchString(value);
        const params = new URLSearchParams(location.search);
        params.delete('page');
        value === '' ? params.delete('search') : params.set('search', value);
        navigate('?' + params);
    };

    // Funkcja obsługująca zmianę sortowania
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

    // Funkcja do zmiany strony
    const handlePageChange = (page) => {
        const params = new URLSearchParams(location.search);
        params.set('page', page);
        navigate('?' + params.toString());
    };

    // Inicjalizacja wyszukiwania, sortowania i paginacji
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchFromUrl = params.get('search');
        const sortByFromUrl = params.get('sortBy');
        const sortOrderFromUrl = params.get('sortOrder');
        setSortOrder(sortOrderFromUrl || '');
        setSortCriteria(sortByFromUrl || '');
        setSearchString(searchFromUrl || '');
    }, [location.search]);

    // Pobieranie danych po każdej zmianie
    useEffect(() => {
        fetchCustomers();
    }, [searchParams, searchString, sortCriteria, sortOrder]);

    // Komponent strzałki do nagłówka tabeli
    const SortArrow = ({ criteria }) => {
        const arrow = () => {
            if (criteria === sortCriteria) return sortOrder === 'desc' ? '▼' : '▲';
            else return '•';
        };
        return <>{arrow()}</>;
    };

    return (
        <>
            <h3>Customers</h3>
            <Stack direction="horizontal" gap={3}>
                <div className="p-2">
                    {isVisible.addNewButt && (
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/management/add-customer')}
                        >
                            Add customer
                        </button>
                    )}
                </div>
                <div className="p-2 ms-auto">find customer:</div>
                <div className="p-2">
                    <input
                        type="search"
                        className="admin__searchInput"
                        placeholder="search..."
                        onChange={handleSearchChange}
                        value={searchString}
                    />
                </div>
            </Stack>

            {customers?.length > 0 ? (
                <div style={{ width: '100%' }}>
                    <table>
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
                                    <tr key={customer._id} onClick={() => handleRowClick(customer._id)}>
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
                                                    className="btn btn-danger"
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
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        />
                        <Pagination.Last onClick={() => handlePageChange(totalPages)} />
                    </Pagination>
                </div>
            ) : (
                <Alert variant="info">No customers found.</Alert>
            )}

            {/* Modal for confirm delete */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this customer?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={deleteCustomer}>
                        Confirm Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Customers;
