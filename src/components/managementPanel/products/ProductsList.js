import config from "../../../config";
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../../utils/axios';
import { useAuth } from '../../../context/authContext';
import { Loader, TextInput } from '@mantine/core';
import { IconTrash, IconSortAscending, IconSortDescending, IconSearch, IconPlus, IconEdit } from '@tabler/icons-react';
import './productsList.scss';
import ConfirmationModal from '../../ConfirmationModal';
import Pagination from '../../Pagination';
import ErrorMessage from "../../ErrorMessage";

const ProductsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
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
  const cardRef = useRef(null);
  const [expandedCardId, setExpandedCardId] = useState(null);

  const { user } = useAuth('management');

  const getProducts = async () => {
    const queryString = location.search;
    try {
      setIsLoading(true);
      const response = await api.get(`/products/${queryString}`);
      if (response.status === 200) {
        const data = response.data;
        setProductsList(data?.products || []);
        setTotalPages(data?.totalPages || 1);
        setCurrentPage(data?.currentPage || 1);
      }
    } catch (error) {
      setError(error.response?.data?.error || error.message || "An unexpected error occurred");
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
    try {
      await api.delete(`/products/${productToDelete}`);
      await getProducts();
    } catch (error) {
      setError(error.response?.data?.error || error.message || "An unexpected error occurred");
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
    params.set('sortOrder', currentOrder !== 'desc' ? 'desc' : 'asc');
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
    const fetchProducts = async () => {
      await getProducts();
    };
    fetchProducts();
  }, [isDeleting, location.search, searchString, sortCriteria, sortOrder]);

  const SortIcon = ({ criteria }) => {
    if (criteria !== sortCriteria || !sortOrder) return null;
    return sortOrder === 'desc' ? (
      <IconSortDescending size={16} className="products-list__sort-icon" />
    ) : (
      <IconSortAscending size={16} className="products-list__sort-icon" />
    );
  };

  const getBadgeClass = (value) => value ? 'products-list__badge products-list__badge--green' : 'products-list__badge products-list__badge--red';

  const toggleCardExpand = (id) => {
    setExpandedCardId(prev => (prev === id ? null : id));
  };

  const rows = productsList.map((item) => (
    <tr key={item._id} onClick={() => handleRowClick(item._id)} style={{ cursor: 'pointer' }}>
      <td>{item.productNumber}</td>
      <td>{item.name}</td>
      <td>{item.category?.name || 'N/A'}</td>
      <td>£{item.price}</td>
      <td><span className={getBadgeClass(item.isAvailable)}>{item.isAvailable ? 'Yes' : 'No'}</span></td>
      <td><span className={getBadgeClass(item.isVegetarian)}>{item.isVegetarian ? 'Yes' : 'No'}</span></td>
      <td><span className={getBadgeClass(item.isGlutenFree)}>{item.isGlutenFree ? 'Yes' : 'No'}</span></td>
      <td className="products-list__table-cell--actions">
        <button className="products-list__delete-button" onClick={(e) => handleDeleteClick(e, item._id)}>
          <IconTrash size={16} />
        </button>
      </td>
    </tr>
  ));

  return (
    <div className="products-list__container">
      <div className="products-list__header">
        <h2 className="products-list__header__title">Products</h2>
        <div className="products-list__controls">
          <TextInput
            placeholder="Search products..."
            className="products-list__search-input"
            value={searchString}
            onChange={handleSearchChange}
            leftSection={<IconSearch size={16} />}
          />
          <button className="button-panel" onClick={() => navigate('/management/add-product')}>
            <IconPlus size={16} />
            Add new
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {isLoading ? (
        <div className="products-list__loading">
          <Loader size="sm" variant="dots" />
          <span>Loading...</span>
        </div>
      ) : productsList?.length > 0 ? (
        <>
          <div className="products-list__table-wrapper">
            <table className="products-list__table">
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

          <div className="products-list__cards-group">
            {productsList.map((product) => (
              <div key={product._id}
                className={`products-list__card ${expandedCardId === product._id ? 'products-list__card--expanded' : ''}`}
                ref={cardRef}
                onClick={() => toggleCardExpand(product._id)}>
                <div className="products-list__card-row">
                  <span className="products-list__card-title">{product.name}</span>
                  <img src={`${config.API_URL}${product.thumbnail}`} alt="Thumbnail" className="products-list__card-thumbnail" />
                </div>
                <div className="products-list__card-buttons-group">
                  <button className="products-list__card-button-edit" onClick={() => handleRowClick(product._id)}>
                    <IconEdit size={16} /> Edit
                  </button>
                  <button className="products-list__card-button-delete" onClick={(e) => handleDeleteClick(e, product._id)}>
                    <IconTrash size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      ) : (
        <p className="products-list__message">No products found.</p>
      )}

      {showModal && (
        <ConfirmationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmDelete}
          message="Are you sure you want to delete this product?"
        />
      )}
    </div>
  );
};

export default ProductsList;
