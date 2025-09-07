import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import api from '../../../utils/axios';
import { useAuth } from '../../../context/authContext';
import { Loader, TextInput } from '@mantine/core';
import { IconTrash, IconSortAscending, IconSortDescending, IconSearch, IconPlus, IconEdit } from '@tabler/icons-react';
import './productsList.scss';
import ConfirmationModal from '../../ConfirmationModal';
import Pagination from '../../Pagination';


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
  const cardRef = useRef(null);
  const [expandedCardId, setExpandedCardId] = useState(null);

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
      <IconSortDescending size={16} className="products-list__sort-icon" />
    ) : (
      <IconSortAscending size={16} className="products-list__sort-icon" />
    );
  };


  const getBadgeClass = (value, type) => {
    if (type === 'boolean') {
      return value ? 'products-list__badge products-list__badge--green' : 'products-list__badge products-list__badge--red';
    }
    return 'products-list__badge';
  };

  const toggleCardExpand = (id) => {
    setExpandedCardId(prev => (prev === id ? null : id));
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
      <td className="products-list__table-cell--actions">
        {isVisible.deleteProductButt && (
          <button className="products-list__delete-button" onClick={(e) => handleDeleteClick(e, item._id)}>
            <IconTrash size={16} />
          </button>
        )}
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

          {isVisible.addProductButt && (
            <button className="button-panel" onClick={() => navigate('/management/add-product')}>
              <IconPlus size={16} />
              Add new
            </button>
          )}
        </div>
      </div>


      {errorMessage && (
        <div className="products-list__error-message">
          <p>{errorMessage}</p>
        </div>
      )}


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
                  <img src={`${process.env.REACT_APP_API_URL}${product.thumbnail}`} alt="Thumbnail" className="products-list__card-thumbnail" />
                </div>
                <div className="products-list__card-row">
                  <span className="products-list__card-label-name">No.:</span>
                  <span className="products-list__card-label-value">{product.productNumber}</span>
                </div>
                <div className="products-list__card-row">
                  <span className="products-list__card-label-name">Description:</span>
                  <span className="products-list__card-label-value">{product.desc}</span>
                </div>
                <div className="products-list__card-row">
                  <span className="products-list__card-label-name">Price:</span>
                  <span className="products-list__card-label-value">£{product.price}</span>
                </div>
                <div className="products-list__card-row">
                  <span className="products-list__card-label-name">Image:</span>
                  <span className="products-list__card-label-value">{product.image}</span>
                </div>
                <div className="products-list__card-row">
                  <span className="products-list__card-label-name">Category:</span>
                  <span className="products-list__card-label-value">{product.category?.name || 'N/A'}</span>
                </div>
                <div className="products-list__card-row">
                  <span className="products-list__card-label-name">Ingredients:</span>
                  <span className="products-list__card-label-value">{product.ingredients}</span>
                </div>
                <div className="products-list__card-row">
                  <span className="products-list__card-label-name">Is Featured:</span>
                  <span className={`products-list__card-label-value ${getBadgeClass(product.isFeatured, 'boolean')}`}>
                    {product.isFeatured ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="products-list__card-row">
                  <span className="products-list__card-label-name">Is Vegetarian:</span>
                  <span className={`products-list__card-label-value ${getBadgeClass(product.isVegetarian, 'boolean')}`}>
                    {product.isVegetarian ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="products-list__card-row">
                  <span className="products-list__card-label-name">Is Gluten Free:</span>
                  <span className={`products-list__card-label-value ${getBadgeClass(product.isGlutenFree, 'boolean')}`}>
                    {product.isGlutenFree ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="products-list__card-row">
                  <span className="products-list__card-label-name">Is Available:</span>
                  <span className={`products-list__card-label-value ${getBadgeClass(product.isAvailable, 'boolean')}`}>
                    {product.isAvailable ? 'Yes' : 'No'}
                  </span>
                </div>


                <div className="products-list__card-buttons-group">
                  <button className="products-list__card-button-edit" onClick={() => handleRowClick(product._id)}>
                    <IconEdit size={16} />
                    Edit
                  </button>
                  <button className="products-list__card-button-delete" onClick={(e) => handleDeleteClick(e, product._id)}>
                    <IconTrash size={16} />
                    Delete
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