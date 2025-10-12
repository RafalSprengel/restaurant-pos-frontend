import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import api from '../../../utils/axios';
import { useAuth } from '../../../context/authContext';
import { IconTrash, IconSortAscending, IconSortDescending, IconSearch, IconPlus, IconEdit } from '@tabler/icons-react';
import './MgmtsList.scss';
import { Loader, TextInput, Select, Button } from '@mantine/core';
import ConfirmationModal from '../../ConfirmationModal';
import ErrorMessage from '../../ErrorMessage';

const MgmtsList = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const [errorFetchStaff, setErrorFetchStaff] = useState(null);
  const [errorDeleteStaff, setErrorDeleteStaff] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [staffList, setStaffList] = useState([]);
  const [searchString, setSearchString] = useState('');
  const [sortCriteria, setSortCriteria] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [expandedCardId, setExpandedCardId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const getStaff = async () => {
    setIsLoading(true);
    const queryString = location.search;
    try {
      setErrorFetchStaff(null);
      const response = await api.get(`/staff${queryString}`);
      if (response.status === 200) {
        const { staff, totalPages, currentPage } = response.data;
        setStaffList(staff);
        setTotalPages(totalPages);
        setCurrentPage(currentPage);
      } else {
        setErrorFetchStaff(`Server error: ${response.data?.error ?? 'Failed to fetch customers'}`);
      }
    } catch (e) {
      setErrorFetchStaff(e.response?.data?.error || e.message || 'Unexpected error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (id) => {
    navigate(`${id}`);
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setStaffToDelete(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowModal(false);
    setIsDeleting(true);
    setErrorDeleteStaff(null);
    try {
      const response = await api.delete(`/staff/${staffToDelete}`);
      if (response.status !== 200) {
        setErrorDeleteStaff(response.data?.error || 'Unable to delete this staff member');
      } else {
        getStaff();
      }
    } catch (e) {
      setErrorDeleteStaff(e.response?.data?.error || 'Failed to delete staff member. Please try again.');
    } finally {
      setIsDeleting(false);
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
    const currentCriteria = sortCriteria || 'staffNumber';
    handleSortChange(currentCriteria, value);
  };

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchString(value);
    const params = new URLSearchParams(location.search);
    params.delete('page');
    value === '' ? params.delete('search') : params.set('search', value);
    navigate('?' + params.toString());
  };

  const SortIcon = ({ criteria }) => {
    if (criteria !== sortCriteria) return null;
    return sortOrder === 'desc' ? (
      <IconSortDescending size={16} className="mgmts-list__sort-icon" />
    ) : (
      <IconSortAscending size={16} className="mgmts-list__sort-icon" />
    );
  };

  const toggleCardExpansion = (id) => {
    setExpandedCardId(prevId => (prevId === id ? null : id));
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchString(params.get('search') || '');
    setSortCriteria(params.get('sortBy') || '');
    setSortOrder(params.get('sortOrder') || '');
  }, [location.search]);

  useEffect(() => {
    getStaff();
  }, [isDeleting, location.search, searchString, sortCriteria, sortOrder]);

  const sortOptions = [
    { value: 'staffNumber', label: 'No' },
    { value: 'firstName', label: 'First Name' },
    { value: 'surname', label: 'Surname' },
    { value: 'email', label: 'Email' },
    { value: 'role', label: 'Role' },
    { value: 'createdAt', label: 'Created At' },
  ];

  const sortOrderOptions = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' },
  ];

  const rows = staffList.map((staff) => (
    <tr key={staff._id} onClick={() => handleRowClick(staff._id)} style={{ cursor: 'pointer' }}>
      <td>{staff.staffNumber}</td>
      <td>{`${staff.firstName} ${staff.surname || ''}`}</td>
      <td>{staff.email}</td>
      <td>{staff.role}</td>
      <td>{dayjs(staff.createdAt).format('HH:mm DD/MM/YY')}</td>
      <td className="mgmts-list__table-cell--actions">
        <button className="mgmts-list__delete-button" onClick={(e) => handleDeleteClick(e, staff._id)}>
          <IconTrash size={16} />
        </button>
      </td>
    </tr>
  ));

  return (
    <div className="mgmts-list">
      <div className="mgmts-list__header">
        <h2 className="mgmts-list__header__title">Staff</h2>
        <div className="mgmts-list__controls">
          <TextInput
            placeholder="Search staff..."
            className="mgmts-list__search-input"
            value={searchString}
            onChange={handleSearchChange}
            leftSection={<IconSearch size={16} />}
          />
          <button className="button-panel" onClick={() => navigate('/management/add-mgmt')}>
            <IconPlus size={16} />
            Add New
          </button>
        </div>
      </div>

      <div className="mgmts-list__mobile-sort-controls">
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

      {errorFetchStaff && <ErrorMessage message={errorFetchStaff} />}
      {errorDeleteStaff && <ErrorMessage message={errorDeleteStaff} />}

      {isLoading ? (
        <div className="mgmts-list__loading">
          <Loader size="sm" variant="dots" />
          <span>Loading...</span>
        </div>
      ) : staffList?.length > 0 ? (
        <>
          <div className="mgmts-list__table-wrapper">
            <table className="mgmts-list__table">
              <thead>
                <tr>
                  <th onClick={(e) => handleSortChange('staffNumber', sortOrder === 'desc' ? 'asc' : 'desc')} data-name="staffNumber">No <SortIcon criteria="staffNumber" /></th>
                  <th onClick={(e) => handleSortChange('firstName', sortOrder === 'desc' ? 'asc' : 'desc')} data-name="firstName">First Name <SortIcon criteria="firstName" /></th>
                  <th onClick={(e) => handleSortChange('surname', sortOrder === 'desc' ? 'asc' : 'desc')} data-name="surname">Surname <SortIcon criteria="surname" /></th>
                  <th onClick={(e) => handleSortChange('email', sortOrder === 'desc' ? 'asc' : 'desc')} data-name="email">Email <SortIcon criteria="email" /></th>
                  <th onClick={(e) => handleSortChange('role', sortOrder === 'desc' ? 'asc' : 'desc')} data-name="role">Role <SortIcon criteria="role" /></th>
                  <th onClick={(e) => handleSortChange('createdAt', sortOrder === 'desc' ? 'asc' : 'desc')} data-name="createdAt">Created At <SortIcon criteria="createdAt" /></th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </table>
          </div>

          <div className="mgmts-list__cards-group">
            {staffList.map((staff) => {
              const formattedDate = dayjs(staff.createdAt).format('HH:mm DD/MM/YY');
              const isThisCardDeleting = isDeleting && staffToDelete === staff._id;
              const isExpanded = expandedCardId === staff._id;
              return (
                <div key={staff._id} className={`mgmts-list__card ${isExpanded ? 'mgmts-list__card--expanded' : ''}`} onClick={() => toggleCardExpansion(staff._id)}>
                  <div className="mgmts-list__card-header">
                    <span className="mgmts-list__card-name">{staff.firstName} {staff.surname || ''}</span>
                    <span className="mgmts-list__card-number">No: {staff.staffNumber}</span>
                  </div>
                  {isExpanded && (
                    <div className="mgmts-list__card-details">
                      <div className="mgmts-list__card-row">
                        <span className="mgmts-list__card-label">Email:</span>
                        <span className="mgmts-list__card-value">{staff.email}</span>
                      </div>
                      <div className="mgmts-list__card-row">
                        <span className="mgmts-list__card-label">Role:</span>
                        <span className="mgmts-list__card-value">{staff.role}</span>
                      </div>
                      <div className="mgmts-list__card-row">
                        <span className="mgmts-list__card-label">Created At:</span>
                        <span className="mgmts-list__card-value">{formattedDate}</span>
                      </div>
                      <div className="mgmts-list__card-actions">
                        <button
                          className="mgmts-list__card-button-edit"
                          onClick={(e) => { e.stopPropagation(); handleRowClick(staff._id); }}
                        >
                          <IconEdit size={16} /> Edit
                        </button>
                        <button
                          className="mgmts-list__delete-button"
                          onClick={(e) => handleDeleteClick(e, staff._id)}
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
      ) : (
        <p className="mgmts-list__message">No staff found.</p>
      )}

      {totalPages > 1 && (
        <div className="mgmts-list__pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`mgmts-list__pagination-button ${currentPage === page ? 'mgmts-list__pagination-button--active' : ''}`}
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
          message="Are you sure you want to delete this staff member?"
        />
      )}
    </div>
  );
};

export default MgmtsList;