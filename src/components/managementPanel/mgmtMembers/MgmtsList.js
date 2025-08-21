import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import api from '../../../utils/axios';
import { useAuth } from '../../../context/authContext';
import { IconTrash, IconSortAscending, IconSortDescending, IconSearch, IconPlus } from '@tabler/icons-react';
import './MgmtsList.scss';

const MgmtsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [staffList, setStaffList] = useState([]);
  const [searchString, setSearchString] = useState('');
  const [sortCriteria, setSortCriteria] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth('management');

  const rolePermissions = {
    admin: { addStaffButt: true, deleteStaffButt: true },
    moderator: { addStaffButt: true, deleteStaffButt: true },
    member: { addStaffButt: false, deleteStaffButt: false },
  };

  const isVisible = rolePermissions[user.role] || { addStaffButt: false, deleteStaffButt: false };

  const getStaff = async () => {
    setIsLoading(true);
    const queryString = location.search;
    try {
      setErrorMessage(null);
      const response = await api.get(`/staff${queryString}`);
      if (response.status === 200) {
        const { staff, totalPages, currentPage } = response.data;
        setStaffList(staff);
        setTotalPages(totalPages);
        setCurrentPage(currentPage);
      } else {
        setErrorMessage(`Server error: ${response.data.error}`);
      }
    } catch (error) {
      setErrorMessage(error.response ? error.response.data.error : error.message);
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
    setErrorMessage(null);
    try {
      const response = await api.delete(`/staff/${staffToDelete}`);
      if (response.status !== 200) {
        setErrorMessage('Unable to delete this staff member');
      } else {
        getStaff();
      }
    } catch (error) {
      setErrorMessage('Failed to delete staff member. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(location.search);
    params.set('page', page);
    navigate('?' + params.toString());
  };

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchString(value);
    const params = new URLSearchParams(location.search);
    params.delete('page');
    value === '' ? params.delete('search') : params.set('search', value);
    navigate('?' + params.toString());
  };

  const handleSort = (e) => {
    const name = e.currentTarget.getAttribute('data-name');
    const params = new URLSearchParams(location.search);
    const currentOrder = params.get('sortOrder');
    params.set('sortOrder', currentOrder === 'desc' ? 'asc' : 'desc');
    params.delete('page');
    params.set('sortBy', name);
    navigate('?' + params.toString());
  };

  const SortIcon = ({ criteria }) => {
    if (criteria !== sortCriteria) return null;
    return sortOrder === 'desc' ? (
      <IconSortDescending size={16} className="mgmts-list-sort-icon" />
    ) : (
      <IconSortAscending size={16} className="mgmts-list-sort-icon" />
    );
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchString(params.get('search') || '');
    setSortCriteria(params.get('sortBy') || '');
    setSortOrder(params.get('sortOrder') || '');
  }, [location.search]);

  useEffect(() => {
    getStaff();
  }, [isDeleting, searchParams, searchString, sortCriteria, sortOrder]);

  const rows = staffList.map((staff) => (
    <tr key={staff._id} onClick={() => handleRowClick(staff._id)} style={{ cursor: 'pointer' }}>
      <td>{staff.staffNumber}</td>
      <td>{`${staff.name} ${staff.surname || ''}`}</td>
      <td>{staff.email}</td>
      <td>{staff.role}</td>
      <td>{dayjs(staff.createdAt).format('HH:mm DD/MM/YY')}</td>
      <td className="mgmts-list-table-cell--actions">
        {isVisible.deleteStaffButt && (
          <button className="mgmts-list-delete-button" onClick={(e) => handleDeleteClick(e, staff._id)}>
            <IconTrash size={16} />
          </button>
        )}
      </td>
    </tr>
  ));

  return (
    <div className="mgmts-list-container">
      <div className="mgmts-list-header">
        <h2 className="mgmts-list-header__title">Staff</h2>
        <div className="mgmts-list-controls">
          {isVisible.addStaffButt && (
            <button className="mgmts-list-add-button" onClick={() => navigate('/management/add-mgmt')}>
              <IconPlus size={16} />
              Add New
            </button>
          )}
          <div className="mgmts-list-controls__search">
            <IconSearch size={16} />
            <input
              className="mgmts-list-controls__search-input"
              type="text"
              placeholder="Search staff..."
              value={searchString}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="mgmts-list-error-message">
          <p>{errorMessage}</p>
        </div>
      )}

      {isLoading ? (
        <div className="mgmts-list-loader">
          <p>Loading...</p>
        </div>
      ) : staffList?.length > 0 ? (
        <div className="mgmts-list-table-wrapper">
          <table className="mgmts-list-table">
            <thead>
              <tr>
                <th onClick={handleSort} data-name="staffNumber">No <SortIcon criteria="staffNumber" /></th>
                <th onClick={handleSort} data-name="name">Name <SortIcon criteria="name" /></th>
                <th onClick={handleSort} data-name="email">Email <SortIcon criteria="email" /></th>
                <th onClick={handleSort} data-name="role">Role <SortIcon criteria="role" /></th>
                <th onClick={handleSort} data-name="createdAt">Created At <SortIcon criteria="createdAt" /></th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        </div>
      ) : (
        <p className="mgmts-list-message">No staff found.</p>
      )}

      {totalPages > 1 && (
        <div className="mgmts-list-pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`mgmts-list-pagination-button ${currentPage === page ? 'mgmts-list-pagination-button--active' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {showModal && (
        <div className="mgmts-list-modal">
          <p>Are you sure you want to delete this staff member?</p>
          <div className="mgmts-list-modal-buttons">
            <button onClick={() => setShowModal(false)}>Cancel</button>
            <button onClick={handleConfirmDelete} style={{ backgroundColor: '#fa5252', color: 'white', border: 'none' }}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MgmtsList;
