import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IconTrash, IconSortAscending, IconSortDescending, IconSearch } from '@tabler/icons-react';
import api from '../../../utils/axios';
import './tableReservationsList.scss';
import ConfirmationModal from '../../ConfirmationModal';
import { Loader } from '@mantine/core';
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
    const [errorFetchReservations, setErrorFetchReservations] = useState(null); // Zmieniony stan błędu
    const [errorDeleteReservation, setErrorDeleteReservation] = useState(null); // Nowy stan błędu
    const [showModal, setShowModal] = useState(false);
    const [reservationToDelete, setReservationToDelete] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    const getReservations = async () => {
        const queryString = location.search;
        try {
            setIsLoading(true);
            setErrorFetchReservations(null); // Czyścimy błąd pobierania przed startem
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
            setErrorDeleteReservation(null); // Czyścimy błąd usuwania przed startem
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
        // Czyścimy błąd usuwania przed otwarciem modala
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

    const handleSort = (e) => {
        const name = e.currentTarget.dataset.name;
        const params = new URLSearchParams(location.search);
        const current = params.get('sortOrder');
        const newOrder = current !== 'desc' ? 'desc' : 'asc';
        params.set('sortBy', name);
        params.set('sortOrder', newOrder);
        params.delete('page');
        navigate(`?${params.toString()}`);
    };

    const handlePageChange = (page) => {
        const params = new URLSearchParams(location.search);
        params.set('page', page);
        navigate(`?${params.toString()}`);
    };

    const handleRowClick = (_id) => {
        navigate(`${_id}`);
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

    // Decydujemy, który błąd wyświetlić. Błąd pobierania ma priorytet
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

            {/* Wyświetlanie błędu (pobierania lub usuwania) */}
            {currentError && (
                <ErrorMessage message={currentError}/>
            )}

            {isLoading ? (
                <div className="table-reservations-list-loading">
                    <Loader size="sm" variant="dots" />
                    <span>Loading...</span>
                </div>
            ) : reservations?.length > 0 ? (
                <div className="table-reservations-list-table-wrapper">
                    <table className="table-reservations-list-table">
                        <thead>
                            <tr>
                                <th onClick={handleSort} data-name="tableNumber">Table No. <SortIcon criteria="tableNumber" /></th>
                                <th onClick={handleSort} data-name="timeSlot.start">Date <SortIcon criteria="timeSlot.start" /></th>
                                <th onClick={handleSort} data-name="customerDetails.name">Name <SortIcon criteria="customerDetails.name" /></th>
                                <th onClick={handleSort} data-name="customerDetails.email">Email <SortIcon criteria="customerDetails.email" /></th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>{rows}</tbody>
                    </table>
                </div>
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