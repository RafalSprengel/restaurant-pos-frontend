import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFetch } from '../../../hooks/useFetch.js';
import api from '../../../utils/axios.js';
import { Loader, TextInput } from '@mantine/core';
import { IconTrash, IconSortAscending, IconSortDescending, IconSearch, IconPlus } from '@tabler/icons-react';
import './categoriesList.scss';
import ConfirmationModal from '../../ConfirmationModal';
import ErrorMessage from '../../ErrorMessage';

const CategoriesList = () => {
  const [error, setError] = useState(null); // zmiana nazwy
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [searchString, setSearchString] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { data, isLoading, error: fetchError, refetch } = useFetch(`/product-categories${location.search}`);
  const categoriesList = data?.categories || [];

  useEffect(() => {
    if (data?.pagination) {
      setCurrentPage(data.pagination.page);
      setTotalPages(data.pagination.totalPages);
    }
  }, [data]);

  const handleRowClick = (id) => navigate(`${id}`);

  const handleDeleteClick = (event, id) => {
    event.stopPropagation();
    setCategoryToDelete(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowModal(false);
    setError(null);
    try {
      const response = await api.delete(`/product-categories/${categoryToDelete}`);
      if (response.status === 200) refetch();
      else setError(response.data?.error || 'Failed to delete the category.');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to delete the category.');
    } finally {
      setCategoryToDelete(null);
    }
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(location.search);
    params.set('page', page);
    navigate('?' + params.toString());
  };

  const handleSearchChange = (e) => {
    const value = e.currentTarget.value;
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

  const [sortCriteria, setSortCriteria] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchString(params.get('search') || '');
    setSortCriteria(params.get('sortBy') || '');
    setSortOrder(params.get('sortOrder') || '');
  }, [location.search]);

  const SortIcon = ({ criteria }) => {
    if (criteria !== sortCriteria) return null;
    return sortOrder === 'desc' ? (
      <IconSortDescending size={16} className="categories-list__sort-icon" />
    ) : (
      <IconSortAscending size={16} className="categories-list__sort-icon" />
    );
  };

  return (
    <div className="categories-list__container">
      <div className="categories-list__header">
        <h2 className="categories-list__title">Categories</h2>
        <div className="categories-list__controls">
          <TextInput
            placeholder="Search categories..."
            className="categories-list__search-input"
            value={searchString}
            onChange={handleSearchChange}
            leftSection={<IconSearch size={16} />}
          />
          <button className="button-panel" onClick={() => navigate('/management/add-category')}>
            <IconPlus size={16} /> Add New
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}
      {fetchError && <div className="categories-list__error-message"><p>{fetchError.toString()}</p></div>}

      {isLoading ? (
        <div className="categories-list__loader" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Loader size="sm" variant="dots" />
          <span>Loading...</span>
        </div>
      ) : categoriesList.length > 0 ? (
        <>
          <div className="categories-list__table-wrapper">
            <table className="categories-list__table">
              <thead>
                <tr>
                  <th onClick={handleSort} data-name="name">
                    Name <SortIcon criteria="name" />
                  </th>
                  <th onClick={handleSort} data-name="index">
                    Index <SortIcon criteria="index" />
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categoriesList.map(item => (
                  <tr key={item._id} onClick={() => handleRowClick(item._id)} style={{ cursor: 'pointer' }}>
                    <td>{item.name}</td>
                    <td>{item.index}</td>
                    <td className="categories-list__table-cell--actions">
                      <button
                        className="categories-list__delete-button"
                        onClick={(e) => handleDeleteClick(e, item._id)}
                      >
                        <IconTrash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="categories-list__pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`categories-list__pagination__button ${i + 1 === currentPage ? 'categories-list__pagination__button--active' : ''}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p className="categories-list__message">No categories found.</p>
      )}

      {showModal && (
        <ConfirmationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmDelete}
          message="Are you sure you want to delete this category?"
        />
      )}
    </div>
  );
};

export default CategoriesList;
