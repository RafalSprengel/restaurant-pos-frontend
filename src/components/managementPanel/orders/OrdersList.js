import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../context/authContext';
import api from '../../../utils/axios';
import dayjs from 'dayjs';

const OrdersList = () => {
     const [currentPage, setCurrentPage] = useState(1);
     const [errorMessage, setErrorMessage] = useState(null);
     const [isLoading, setIsLoading] = useState(true);
     const [ordersList, setOrdersList] = useState([]);
     const [totalPages, setTotalPages] = useState(1);
     const [searchString, setSearchString] = useState('');
     const [sortCriteria, setSortCriteria] = useState('');
     const [sortOrder, setSortOrder] = useState('');
     const [showModal, setShowModal] = useState(false);
     const [orderToDelete, setOrderToDelete] = useState(null);
     const navigate = useNavigate();
     const location = useLocation();
     const [searchParams] = useSearchParams();
     const { user } = useAuth('management');

     const rolePermissions = {
          admin: { deleteOrderButt: true },
          moderator: { deleteOrderButt: true },
          member: { deleteOrderButt: false },
     };

     const isVisible = rolePermissions[user.role] || { deleteOrderButt: false };

     const getOrders = async () => {
          const queryString = location.search;

          try {
               setErrorMessage(null);
               const response = await api.get(`/orders${queryString}`);
               if (response.status === 200) {
                    const data = response.data;
                    setOrdersList(data.orders);
                    setTotalPages(data.totalPages);
                    setCurrentPage(data.currentPage);
               } else {
                    setErrorMessage(`Server error: ${response.data.error}`);
               }
          } catch (error) {
               console.error('Error fetching orders:', error);
               setErrorMessage(error.response ? error.response.data.error : error.message);
          } finally {
               setIsLoading(false);
          }
     };

     const handlePageChange = (page) => {
          const params = new URLSearchParams(location.search);
          params.set('page', page);
          navigate('?' + params.toString());
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

     const handleSearchChange = (e) => {
          const { value } = e.target;
          setSearchString(value);
          const params = new URLSearchParams(location.search);
          params.delete('page');
          value === '' ? params.delete('search') : params.set('search', value);
          navigate('?' + params);
     };

     const handleDeleteClick = (event, id) => {
          event.stopPropagation();
          setOrderToDelete(id);
          setShowModal(true);
     };

     const handleConfirmDelete = async () => {
          setShowModal(false);
          setIsLoading(true);
          try {
               const response = await api.delete(`/orders/${orderToDelete}`);

               if (response.status === 200) {
                    setErrorMessage(null);
                    getOrders();
               } else {
                    setErrorMessage('Unable to delete this order.');
               }
          } catch (error) {
               setErrorMessage('Failed to delete the order. Please try again.');
               console.error('Error deleting order:', error);
          } finally {
               setIsLoading(false);
               setOrderToDelete(null);
          }
     };

     const OrderRow = ({ order }) => {
          return (
               <tr onClick={() => navigate(`${order._id}`)}>
                    <td>{order.orderNumber}</td>
                    <td>{order.purchaserDetails.firstName + ' ' + order.purchaserDetails.surname}</td>
                    <td>{dayjs(order.createdAt).format('HH:mm DD/MM/YY')}</td>
                    <td>&pound;{order.totalPrice}</td>
                    <td>{order.status}</td>
                    <td>{isVisible.deleteOrderButt && <button onClick={(e) => handleDeleteClick(e, order._id)}>Delete</button>}</td>
               </tr>
          );
     };

     useEffect(() => {
          const params = new URLSearchParams(location.search);
          const searchFromUrl = params.get('search');
          const sortByFromUrl = params.get('sortBy');
          const sortOrderFromUrl = params.get('sortOrder');
          setSortOrder(sortOrderFromUrl || '');
          setSortCriteria(sortByFromUrl || '');
          setSearchString(searchFromUrl || '');
     }, [location.search]);

     useEffect(() => {
          getOrders();
     }, [searchString, sortCriteria, sortOrder]);

     const SortArrow = ({ criteria }) => {
          const arrow = () => {
               if (criteria === sortCriteria) return sortOrder === 'desc' ? '▼' : '▲';
               else return '•';
          };
          return <>{arrow()}</>;
     };

     return (
          <div>
               {!isLoading && !errorMessage && (
                    <>
                         <h3>Orders</h3>
                         <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <div>Find order:</div>
                              <input type="search" placeholder="Search..." onChange={handleSearchChange} value={searchString} style={{ marginLeft: '10px' }} />
                         </div>
                    </>
               )}

               {ordersList?.length > 0 ? (
                    <>
                         <table>
                              <thead>
                                   <tr>
                                        <th data-name="orderNumber" onClick={handleSort}>
                                             Order No. <SortArrow criteria="orderNumber" />
                                        </th>
                                        <th data-name="customerName" onClick={handleSort}>
                                             Customer <SortArrow criteria="customerName" />
                                        </th>
                                        <th data-name="createdAt" onClick={handleSort}>
                                             Date <SortArrow criteria="createdAt" />
                                        </th>
                                        <th data-name="totalPrice" onClick={handleSort}>
                                             Total Price <SortArrow criteria="totalPrice" />
                                        </th>
                                        <th data-name="status" onClick={handleSort}>
                                             Status <SortArrow criteria="status" />
                                        </th>
                                        <th>Actions</th>
                                   </tr>
                              </thead>
                              <tbody>
                                   {ordersList.map((order) => (
                                        <OrderRow key={order._id} order={order} />
                                   ))}
                              </tbody>
                         </table>
                         <div className="pagination">
                              <button onClick={() => handlePageChange(1)}>&lt;&lt; First</button>
                              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                   &lt; Prev
                              </button>
                              {[...new Array(totalPages)].map((el, index) => (
                                   <button key={index} onClick={() => handlePageChange(index + 1)} disabled={index + 1 === currentPage}>
                                        {index + 1}
                                   </button>
                              ))}
                              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                                   Next &gt;
                              </button>
                              <button onClick={() => handlePageChange(totalPages)}>Last &gt;&gt;</button>
                         </div>
                    </>
               ) : isLoading ? (
                    <h4>Loading data...</h4>
               ) : errorMessage ? (
                    <div style={{ color: 'red' }}>{errorMessage}</div>
               ) : (
                    <h4>No orders found</h4>
               )}

               {showModal && (
                    <div className="modal">
                         <div className="modal-content">
                              <div className="modal-header">
                                   <h5>Confirm Deletion</h5>
                                   <button onClick={() => setShowModal(false)}>&times;</button>
                              </div>
                              <div className="modal-body">Are you sure you want to delete this order?</div>
                              <div className="modal-footer">
                                   <button onClick={() => setShowModal(false)}>Cancel</button>
                                   <button onClick={handleConfirmDelete}>Delete</button>
                              </div>
                         </div>
                    </div>
               )}
          </div>
     );
};

export default OrdersList;
