import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useFetch } from '../../../hooks/useFetch.js';
import api from '../../../utils/axios.js';
import { useAuth } from '../../../context/authContext.js';
import { IconTrash, IconSortAscending, IconSortDescending, IconSearch, IconPlus } from '@tabler/icons-react';
import './categoriesList.scss';

const CategoriesList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [searchString, setSearchString] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [sortCriteria, setSortCriteria] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth('management');

  const {
    data: categoriesList,
    loading: isLoading,
    error: fetchError,
    refetch,
  } = useFetch(`/product-categories${location.search}`);

  const rolePermissions = {
    admin: { addCategoryButt: true, deleteCategoryButt: true },
    moderator: { addCategoryButt: true, deleteCategoryButt: true },
    member: { addCategoryButt: false, deleteCategoryButt: false },
  };

  const isVisible = rolePermissions[user.role] || { addCategoryButt: false, deleteCategoryButt: false };

  const handleRowClick = (id) => {
    navigate(`${id}`);
  };

  const handleDeleteClick = (event, id) => {
    event.stopPropagation();
    setCategoryToDelete(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowModal(false);
    setIsDeleting(true);
    setErrorMessage(null);
    try {
      const response = await api.delete(`/product-categories/${categoryToDelete}`);
      if (response.status === 200) {
        refetch(); // Odświeżamy dane po usunięciu
      } else {
        throw new Error(response.data?.message || 'Unknown error');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to delete the category. Please try again.');
    } finally {
      setIsDeleting(false);
      setCategoryToDelete(null);
    }
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(location.search);
    params.set('page', page);
    navigate('?' + params.toString());
  };

  const handleSearchChange = (e) => {
    const { value } = e.currentTarget;
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchString(params.get('search') || '');
    setSortCriteria(params.get('sortBy') || '');
    setSortOrder(params.get('sortOrder') || '');
  }, [location.search]);

  const SortIcon = ({ criteria }) => {
    if (criteria !== sortCriteria) return null;
    return sortOrder === 'desc' ? (
      <IconSortDescending size={16} className="categories-list-sort-icon" />
    ) : (
      <IconSortAscending size={16} className="categories-list-sort-icon" />
    );
  };

  const rows = categoriesList?.map((item) => (
    <tr key={item._id} onClick={() => handleRowClick(item._id)} style={{ cursor: 'pointer' }}>
      <td>{item.name}</td>
      <td>
        <img
          src={item.image || `https://picsum.photos/200/200?random=${Math.random()}`}
          alt="Category"
          className="categories-list-image"
        />
      </td>
      <td>{item.index}</td>
      <td className="categories-list-table-cell--actions">
        {isVisible.deleteCategoryButt && (
          <button
            className="categories-list-delete-button"
            onClick={(e) => handleDeleteClick(e, item._id)}
          >
            <IconTrash size={16} />
          </button>
        )}
      </td>
    </tr>
  ));

  return (
    <div className="categories-list-container">
      <div className="categories-list-header">
        <h2 className="categories-list-header__title">Categories</h2>
        <div className="categories-list-controls">
          {isVisible.addCategoryButt && (
            <button
              className="categories-list-add-button"
              onClick={() => navigate('/management/add-category')}
            >
              <IconPlus size={16} />
              Add New
            </button>
          )}
          <div className="categories-list-controls__search">
            <IconSearch size={16} />
            <input
              className="categories-list-controls__search-input"
              type="text"
              placeholder="Search categories..."
              value={searchString}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="categories-list-error-message">
          <p>{errorMessage}</p>
        </div>
      )}

      {fetchError && (
        <div className="categories-list-error-message">
          <p>{fetchError.toString()}</p>
        </div>
      )}

      {isLoading ? (
        <div className="categories-list-loader">
          <p>Loading...</p>
        </div>
      ) : categoriesList?.length > 0 ? (
        <div className="categories-list-table-wrapper">
          <table className="categories-list-table">
            <thead>
              <tr>
                <th onClick={handleSort} data-name="name">
                  Name <SortIcon criteria="name" />
                </th>
                <th>Image</th>
                <th onClick={handleSort} data-name="index">
                  Index <SortIcon criteria="index" />
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        </div>
      ) : (
        <p className="categories-list-message">No categories found.</p>
      )}

      {showModal && (
        <div className="categories-list-modal">
          <p>Are you sure you want to delete this category?</p>
          <div className="categories-list-modal-buttons">
            <button onClick={() => setShowModal(false)}>Cancel</button>
            <button onClick={handleConfirmDelete} style={{ backgroundColor: '#fa5252', color: 'white', border: 'none' }}>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesList;