import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IconTrash, IconSortAscending, IconSortDescending, IconSearch, IconEdit } from '@tabler/icons-react';
import api from '../../../utils/axios';
import './tableReservationsList.scss';
import ConfirmationModal from '../../ConfirmationModal';
import { Loader, TextInput, Select, Button } from '@mantine/core';
import ErrorMessage from '../../ErrorMessage';


export default function TableReservationsList() {
    const [reservations, setReservations] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchString, setSearchString] = useState('');
    const [sortCriteria, setSortCriteria] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [errorFetchReservations, setErrorFetchReservations] = useState(null);
    const [errorDeleteReservation, setErrorDeleteReservation] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [reservationToDelete, setReservationToDelete] = useState(null);
    const [expandedCardId, setExpandedCardId] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    const getReservations = async () => {
        const queryString = location.search;
        try {
            setIsLoading(true);
            setErrorFetchReservations(null);
            const res = await api.get(`/tables/reservations${queryString}`);
            setReservations(res.data.reservations);
            setTotalPages(res.data.totalPages);
            setCurrentPage(res.data.currentPage);
        } catch (err) {
            setErrorFetchReservations(err.response?.data?.error || err.message || "Error fetching reservations");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (_id) => {
        try {
            setDeletingId(_id);
            setErrorDeleteReservation(null);
            await api.delete(`/tables/reservations/${_id}`);
            setShowModal(false);
            getReservations();
        } catch (err) {
            setErrorDeleteReservation(
                err.response?.data?.error || err.message || "Failed to delete reservation"
            );
        } finally {
            setDeletingId(null);
        }
    };

    const openDeleteModal = (e, _id) => {
        e.stopPropagation();
        setErrorDeleteReservation(null);
        setReservationToDelete(_id);
        setShowModal(true);
    };

    const handleSearchChange = (e) => {
        const value = e.currentTarget.value;
        setSearchString(value);
        const params = new URLSearchParams(location.search);
        params.delete('page');
        value ? params.set('search', value) : params.delete('search');
        navigate(`?${params.toString()}`);
    };

    const handleSortChange = (newSortBy, newSortOrder) => {
        const params = new URLSearchParams(location.search);
        params.set('sortBy', newSortBy);
        params.set('sortOrder', newSortOrder);
        params.delete('page');
        navigate(`?${params.toString()}`);
    };

    const handleSortCriteriaChange = (value) => {
        const currentOrder = sortOrder || 'asc';
        handleSortChange(value, currentOrder);
    };

    const handleSortOrderChange = (value) => {
        const currentCriteria = sortCriteria || 'tableNumber';
        handleSortChange(currentCriteria, value);
    };

    const handlePageChange = (page) => {
        const params = new URLSearchParams(location.search);
        params.set('page', page);
        navigate(`?${params.toString()}`);
    };

    const handleRowClick = (_id) => {
        navigate(`${_id}`);
    };

    const toggleCardExpansion = (id) => {
        setExpandedCardId(prevId => (prevId === id ? null : id));
    };

    const SortIcon = ({ criteria }) => {
        if (criteria !== sortCriteria) return null;
        return sortOrder === 'desc' ? (
            <IconSortDescending size={16} className="table-reservations-list-sort-icon" />
        ) : (
            <IconSortAscending size={16} className="table-reservations-list-sort-icon" />
        );
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setSearchString(params.get('search') || '');
        setSortCriteria(params.get('sortBy') || '');
        setSortOrder(params.get('sortOrder') || '');
    }, [location.search]);

    useEffect(() => {
        getReservations();
    }, [location.search]);

    const sortOptions = [
        { value: 'tableNumber', label: 'Table No.' },
        { value: 'timeSlot.start', label: 'Date' },
        { value: 'customerDetails.name', label: 'Name' },
        { value: 'customerDetails.email', label: 'Email' },
    ];

    const sortOrderOptions = [
        { value: 'asc', label: 'Ascending' },
        { value: 'desc', label: 'Descending' },
    ];

    const rows = reservations.map((r) => (
        <tr key={r._id} onClick={() => handleRowClick(r._id)} style={{ cursor: 'pointer' }}>
            <td>{r.tableNumber}</td>
            <td>{r.timeSlot.start}</td>
            <td>{r.customerDetails.name}</td>
            <td>{r.customerDetails.email}</td>
            <td className="table-reservations-list-table-cell--actions">
                <button
                    className="table-reservations-list-delete-button"
                    onClick={(e) => openDeleteModal(e, r._id)}
                    disabled={deletingId === r._id}
                >
                    {deletingId === r._id ? <Loader size={16} color="white" /> : <IconTrash size={16} />}
                </button>
            </td>
        </tr>
    ));

    const currentError = errorFetchReservations || errorDeleteReservation;

    return (
        <div className="table-reservations-list-container">
            <div className="table-reservations-list-header">
                <h2 className="table-reservations-list-header__title">Reservations</h2>
                <div className="table-reservations-list-controls">
                    <div className="table-reservations-list-controls__search">
                        <IconSearch size={16} />
                        <input
                            className="table-reservations-list-controls__search-input"
                            type="text"
                            placeholder="Search by name, email or table no..."
                            value={searchString}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>
            </div>

            <div className="table-reservations-list__mobile-sort-controls">
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

            {currentError && (
                <ErrorMessage message={currentError}/>
            )}

            {isLoading ? (
                <div className="table-reservations-list-loading">
                    <Loader size="sm" variant="dots" />
                    <span>Loading...</span>
                </div>
            ) : reservations?.length > 0 ? (
                <>
                    <div className="table-reservations-list-table-wrapper">
                        <table className="table-reservations-list-table">
                            <thead>
                                <tr>
                                    <th onClick={(e) => handleSortChange('tableNumber', sortOrder === 'desc' ? 'asc' : 'desc')} data-name="tableNumber">Table No. <SortIcon criteria="tableNumber" /></th>
                                    <th onClick={(e) => handleSortChange('timeSlot.start', sortOrder === 'desc' ? 'asc' : 'desc')} data-name="timeSlot.start">Date <SortIcon criteria="timeSlot.start" /></th>
                                    <th onClick={(e) => handleSortChange('customerDetails.name', sortOrder === 'desc' ? 'asc' : 'desc')} data-name="customerDetails.name">Name <SortIcon criteria="customerDetails.name" /></th>
                                    <th onClick={(e) => handleSortChange('customerDetails.email', sortOrder === 'desc' ? 'asc' : 'desc')} data-name="customerDetails.email">Email <SortIcon criteria="customerDetails.email" /></th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>{rows}</tbody>
                        </table>
                    </div>

                    <div className="table-reservations-list__cards-group">
                        {reservations.map((r) => {
                            const isThisCardDeleting = deletingId === r._id;
                            const isExpanded = expandedCardId === r._id;
                            return (
                                <div key={r._id} className={`table-reservations-list__card ${isExpanded ? 'table-reservations-list__card--expanded' : ''}`} onClick={() => toggleCardExpansion(r._id)}>
                                    <div className="table-reservations-list__card-header">
                                        <span className="table-reservations-list__card-name">Table No: {r.tableNumber}</span>
                                        <span className="table-reservations-list__card-number">{r.timeSlot.start}</span>
                                    </div>
                                    {isExpanded && (
                                        <div className="table-reservations-list__card-details">
                                            <div className="table-reservations-list__card-row">
                                                <span className="table-reservations-list__card-label">Time:</span>
                                                <span className="table-reservations-list__card-value">{r.timeSlot.start} - {r.timeSlot.end}</span>
                                            </div>
                                            <div className="table-reservations-list__card-row">
                                                <span className="table-reservations-list__card-label">Customer:</span>
                                                <span className="table-reservations-list__card-value">{r.customerDetails.name}</span>
                                            </div>
                                            <div className="table-reservations-list__card-row">
                                                <span className="table-reservations-list__card-label">Email:</span>
                                                <span className="table-reservations-list__card-value">{r.customerDetails.email}</span>
                                            </div>
                                            <div className="table-reservations-list__card-actions">
                                                <button
                                                    className="table-reservations-list__card-button-edit"
                                                    onClick={(e) => { e.stopPropagation(); handleRowClick(r._id); }}
                                                >
                                                    <IconEdit size={16} /> Edit
                                                </button>
                                                <button
                                                    className="table-reservations-list-delete-button"
                                                    onClick={(e) => openDeleteModal(e, r._id)}
                                                    disabled={isThisCardDeleting}
                                                >
                                                    {isThisCardDeleting ? <Loader size={16} color="currentColor" /> : <IconTrash size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </>
            ) : (
                <p className="table-reservations-list-message">No reservations found.</p>
            )}

            {totalPages > 1 && (
                <div className="table-reservations-list-pagination">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            className={`table-reservations-list-pagination-button ${currentPage === page ? 'table-reservations-list-pagination-button--active' : ''}`}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}

            {showModal && (
                <ConfirmationModal
                    title="Delete Reservation"
                    message={deletingId === reservationToDelete ? "Deleting..." : "Do you really want to delete this reservation?"}
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onConfirm={() => handleDelete(reservationToDelete)}
                />
            )}
        </div>
    );
}