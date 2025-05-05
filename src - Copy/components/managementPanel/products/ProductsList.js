import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../context/authContext';
import api from '../../../utils/axios';

const ProductsList = () => {
     const [currentPage, setCurrentPage] = useState(1);
     const [errorMessage, setErrorMessage] = useState(false);
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

     const isVisible = rolePermissions[user.role] || { addProductButt: false, deleteProductButt: false };

     const getProducts = async () => {
          const queryString = location.search;

          try {
               setErrorMessage(null);
               const response = await api.get(`/products/${queryString}`);

               if (response.status === 200) {
                    const data = response.data;
                    setProductsList(data.products);
                    setTotalPages(data.totalPages);
                    setCurrentPage(data.currentPage);
               } else {
                    setErrorMessage(`Server error: ${response.data.error}`);
               }
          } catch (error) {
               console.error('Error fetching products:', error);
               setErrorMessage(error.response ? error.response.data.error : error.message);
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
                    navigate(location.pathname, { replace: true });
               } else {
                    const errorData = response.data;
                    setErrorMessage(`Unable to delete this product (${errorData.message || 'unknown error'})`);
               }
          } catch (error) {
               if (error.response) {
                    const errorMessage = error.response.data?.message || 'Failed to delete the product. Please try again.';
                    setErrorMessage(errorMessage);
                    console.error('Error deleting product:', errorMessage);
               } else {
                    setErrorMessage('Network error. Please check your connection.');
                    console.error('Error deleting product:', error);
               }
          } finally {
               setIsDeleting(false);
          }
     };

     const handlePageChange = (page) => {
          const params = new URLSearchParams(location.search);
          params.set('page', page);
          navigate('?' + params.toString());
     };

     const productRows = productsList.map((item) => (
          <tr key={item._id} onClick={() => handleRowClick(item._id)}>
               <td>{item.productNumber}</td>
               <td>{item.name}</td>
               <td>{item.category?.name || 'N/A'}</td>
               <td>{item.price}</td>
               <td>{item.isAvailable ? 'Yes' : 'No'}</td>
               <td>{item.isVegetarian ? 'Yes' : 'No'}</td>
               <td>{item.isGlutenFree ? 'Yes' : 'No'}</td>
               <td className="admin__deleteElement">
                    {isVisible.deleteProductButt && (
                         <button type="button" className="btn btn-danger" onClick={(e) => handleDeleteClick(e, item._id)}>
                              Delete
                         </button>
                    )}
               </td>
          </tr>
     ));

     const handleSearchChange = (e) => {
          const { value } = e.target;
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
          const searchFromUrl = params.get('search');
          const sortByFromUrl = params.get('sortBy');
          const sortOrderFromUrl = params.get('sortOrder');
          sortOrderFromUrl ? setSortOrder(sortOrderFromUrl) : setSortOrder('');
          sortByFromUrl ? setSortCriteria(sortByFromUrl) : setSortCriteria('');
          searchFromUrl ? setSearchString(searchFromUrl) : setSearchString('');
     }, [location.search]);

     useEffect(() => {
          getProducts();
     }, [isDeleting, searchParams, searchString, sortCriteria, sortOrder]);

     const SortArrow = ({ criteria }) => {
          const arrow = () => {
               if (criteria === sortCriteria) return sortOrder === 'desc' ? '▼' : '▲';
               else return '•';
          };
          return <>{arrow()}</>;
     };

     return (
          <>
               {!isLoading && !errorMessage && (
                    <>
                         <h3>Products</h3>
                         <div style={{ display: 'flex', gap: '1rem' }}>
                              <div>
                                   {isVisible.addProductButt && (
                                        <button
                                             style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white' }}
                                             onClick={() => navigate('/management/add-product')}>
                                             Add new..
                                        </button>
                                   )}
                              </div>
                              <div style={{ marginLeft: 'auto' }}>
                                   <label>Find item:</label>
                              </div>
                              <div>
                                   <input
                                        type="search"
                                        style={{ padding: '8px', width: '200px' }}
                                        placeholder="search..."
                                        onChange={handleSearchChange}
                                        value={searchString}
                                   />
                              </div>
                         </div>
                    </>
               )}
               {productsList?.length > 0 ? (
                    <>
                         <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                              <thead>
                                   <tr>
                                        <th data-name="productNumber" onClick={handleSort} style={{ cursor: 'pointer' }}>
                                             Number <SortArrow criteria="productNumber" />
                                        </th>
                                        <th data-name="name" onClick={handleSort} style={{ cursor: 'pointer' }}>
                                             Name <SortArrow criteria="name" />
                                        </th>
                                        <th data-name="category" onClick={handleSort} style={{ cursor: 'pointer' }}>
                                             Category <SortArrow criteria="category" />
                                        </th>
                                        <th data-name="price" onClick={handleSort} style={{ cursor: 'pointer' }}>
                                             Price <SortArrow criteria="price" />
                                        </th>
                                        <th data-name="isAvailable" onClick={handleSort} style={{ cursor: 'pointer' }}>
                                             Is Available <SortArrow criteria="isAvailable" />
                                        </th>
                                        <th data-name="isVegetarian" onClick={handleSort} style={{ cursor: 'pointer' }}>
                                             Is Vegetarian <SortArrow criteria="isVegetarian" />
                                        </th>
                                        <th data-name="isGlutenFree" onClick={handleSort} style={{ cursor: 'pointer' }}>
                                             Is Gluten Free <SortArrow criteria="isGlutenFree" />
                                        </th>
                                        <th>Options</th>
                                   </tr>
                              </thead>
                              <tbody>{productRows}</tbody>
                         </table>
                         <div style={{ marginTop: '20px' }}>
                              <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
                                   First
                              </button>
                              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                   Previous
                              </button>
                              {[...new Array(totalPages)].map((_, index) => (
                                   <button key={index} onClick={() => handlePageChange(index + 1)} disabled={currentPage === index + 1}>
                                        {index + 1}
                                   </button>
                              ))}
                              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                                   Next
                              </button>
                              <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
                                   Last
                              </button>
                         </div>
                    </>
               ) : isLoading ? (
                    <h4>Loading data...</h4>
               ) : errorMessage ? (
                    <div style={{ color: 'red' }}>{errorMessage}</div>
               ) : (
                    <h4>No products found</h4>
               )}

               {showModal && (
                    <div className="modal" style={{ display: 'block' }}>
                         <div className="modal-content">
                              <span className="close" onClick={() => setShowModal(false)}>
                                   &times;
                              </span>
                              <h4>Confirm Deletion</h4>
                              <p>Are you sure you want to delete this product?</p>
                              <div>
                                   <button onClick={() => setShowModal(false)}>Cancel</button>
                                   <button onClick={handleConfirmDelete}>Delete</button>
                              </div>
                         </div>
                    </div>
               )}
          </>
     );
};

export default ProductsList;
