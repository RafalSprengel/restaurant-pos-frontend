import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import api from '../../../utils/axios';
import { useAuth } from '../../../context/authContext';
import { IconTrash, IconSortAscending, IconSortDescending, IconSearch, IconPlus } from '@tabler/icons-react';
import './productsList.scss';

const ProductsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productsList, setProductsList] = useState([]);
  const [searchString, setSearchString] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [sortCriteria, setSortCriteria] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth('management');

  const rolePermissions = {
    admin: { addProductButt: true, deleteProductButt: true },
    moderator: { addProductButt: true, deleteProductButt: true },
    member: { addProductButt: false, deleteProductButt: false },
  };

  const isVisible = rolePermissions[user?.role] || { addProductButt: false, deleteProductButt: false };

  const getProducts = async () => {
    const queryString = location.search;
    try {
      setErrorMessage(null);
      setIsLoading(true);
      const response = await api.get(`/products/${queryString}`);
      if (response.status === 200) {
        const data = response.data;
        setProductsList(data?.products || []);
        setTotalPages(data?.totalPages || 1);
        setCurrentPage(data?.currentPage || 1);
      } else {
        setErrorMessage(`Server error: ${response.data.error}`);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || error.message || 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (id) => {
    navigate(`${id}`);
  };

  const handleDeleteClick = (event, id) => {
    event.stopPropagation();
    setProductToDelete(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowModal(false);
    setIsDeleting(true);
    setErrorMessage(null);
    try {
      const response = await api.delete(`/products/${productToDelete}`);
      if (response.status === 200) {
        getProducts();
      } else {
        setErrorMessage(`Unable to delete this product (${response.data?.message || 'unknown error'})`);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to delete the product. Please try again.');
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
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

  useEffect(() => {
    getProducts();
  }, [isDeleting, searchParams, searchString, sortCriteria, sortOrder]);

  const SortIcon = ({ criteria }) => {
    if (criteria !== sortCriteria || !sortOrder) return null;
    return sortOrder === 'desc' ? (
      <IconSortDescending size={16} className="products-list-sort-icon" />
    ) : (
      <IconSortAscending size={16} className="products-list-sort-icon" />
    );
  };

  const getBadgeClass = (value, type) => {
    if (type === 'boolean') {
      return value ? 'products-list-badge products-list-badge--green' : 'products-list-badge products-list-badge--red';
    }
    // Dalsze warunki dla innych typów, jeśli potrzebne
    return 'products-list-badge';
  };

  const rows = productsList.map((item) => (
    <tr key={item._id} onClick={() => handleRowClick(item._id)} style={{ cursor: 'pointer' }}>
      <td>{item.productNumber}</td>
      <td>{item.name}</td>
      <td>{item.category?.name || 'N/A'}</td>
      <td>£{item.price}</td>
      <td>
        <span className={getBadgeClass(item.isAvailable, 'boolean')}>
          {item.isAvailable ? 'Yes' : 'No'}
        </span>
      </td>
      <td>
        <span className={getBadgeClass(item.isVegetarian, 'boolean')}>
          {item.isVegetarian ? 'Yes' : 'No'}
        </span>
      </td>
      <td>
        <span className={getBadgeClass(item.isGlutenFree, 'boolean')}>
          {item.isGlutenFree ? 'Yes' : 'No'}
        </span>
      </td>
      <td className="products-list-table-cell--actions">
        {isVisible.deleteProductButt && (
          <button className="products-list-delete-button" onClick={(e) => handleDeleteClick(e, item._id)}>
            <IconTrash size={16} />
          </button>
        )}
      </td>
    </tr>
  ));

  return (
    <div className="products-list-container">
      <div className="products-list-header">
        <h2 className="products-list-header__title">Products</h2>
        <div className="products-list-controls">
          {isVisible.addProductButt && (
            <button className="products-list-add-button" onClick={() => navigate('/management/add-product')}>
              <IconPlus size={16} />
              Add New
            </button>
          )}
          <div className="products-list-controls__search">
            <IconSearch size={16} />
            <input
              className="products-list-controls__search-input"
              type="text"
              placeholder="Search products..."
              value={searchString}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="products-list-error-message">
          <p>{errorMessage}</p>
        </div>
      )}

      {isLoading ? (
        <div className="products-list-loader">
          <p>Loading...</p> {/* Zastąp loader Mantine prostym tekstem lub animacją CSS */}
        </div>
      ) : productsList?.length > 0 ? (
        <div className="products-list-table-wrapper">
          <table className="products-list-table">
            <thead>
              <tr>
                <th onClick={handleSort} data-name="productNumber">No <SortIcon criteria="productNumber" /></th>
                <th onClick={handleSort} data-name="name">Name <SortIcon criteria="name" /></th>
                <th onClick={handleSort} data-name="category">Category <SortIcon criteria="category" /></th>
                <th onClick={handleSort} data-name="price">Price <SortIcon criteria="price" /></th>
                <th onClick={handleSort} data-name="isAvailable">Available <SortIcon criteria="isAvailable" /></th>
                <th onClick={handleSort} data-name="isVegetarian">Vegetarian <SortIcon criteria="isVegetarian" /></th>
                <th onClick={handleSort} data-name="isGlutenFree">Gluten-Free <SortIcon criteria="isGlutenFree" /></th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        </div>
      ) : (
        <p className="products-list-message">No products found.</p>
      )}

      {totalPages > 1 && (
        <div className="products-list-pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`products-list-pagination-button ${currentPage === page ? 'products-list-pagination-button--active' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {showModal && (
        <div className="products-list-modal">
          <p>Are you sure you want to delete this product?</p>
          <div className="products-list-modal-buttons">
            <button onClick={() => setShowModal(false)}>Cancel</button>
            <button onClick={handleConfirmDelete} style={{ backgroundColor: '#fa5252', color: 'white', border: 'none' }}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsList;