import { useState } from 'react';
import Modal from '../../components/ModalConfirm';
import api from '../../utils/axios';
import { useFetch } from '../../hooks/useFetch';

const RecentOrderList = () => {
     const [orderToDelete, setOrderToDelete] = useState(null);
     const [isLoading, setIsLoading] = useState(true);
     const [errorMessage, setErrorMessage] = useState(null);
     const { data, loading: loadingOrders, error: fetchError, refetch: refetchOrders } = useFetch('/orders/customer');
     let orders = data || [];

     if (loadingOrders) return <p>Loading orders...</p>;
     if (fetchError) return <p>Error fetching orders: {fetchError.message}</p>;

     const handleDeleteClick = (id) => {
          setOrderToDelete(id);
     };

     const handleConfirmDelete = async () => {
          setIsLoading(true);
          try {
               const response = await api.put(`/orders/customer/${orderToDelete}`);
               if (response.status === 200) {
                    await refetchOrders();
               } else {
                    setErrorMessage('Unable to delete this order.');
               }
          } catch (error) {
               setErrorMessage('Unable to delete this order.');
          } finally {
               setIsLoading(false);
               setOrderToDelete(null);
          }
     };

     return (
          <div>
               <h4>Recent Orders</h4>
               {orders && orders.length > 0 ? (
                    <ul>
                         {orders.map((order) => (
                              <li key={order._id}>
                                   <div className="order-card">
                                        <p>
                                             <strong>Order Number:</strong> {order.orderNumber}
                                        </p>
                                        <p>
                                             <strong>Total Price:</strong> ${order.totalPrice}
                                        </p>
                                        <p>
                                             <strong>Status:</strong> {order.status}
                                        </p>
                                        <p>
                                             <strong>Order Type:</strong> {order.orderType}
                                        </p>
                                        <ul>
                                             <strong>Items:</strong>
                                             {order.products.map((product) => (
                                                  <li key={product._id}>
                                                       {product.name} - {product.quantity} (${product.price})
                                                  </li>
                                             ))}
                                        </ul>
                                        <p>
                                             <strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}
                                        </p>
                                        <p>
                                             <button type="button" className="btn btn-danger" onClick={() => handleDeleteClick(order._id)}>
                                                  Delete
                                             </button>
                                        </p>
                                   </div>
                              </li>
                         ))}
                    </ul>
               ) : (
                    <p>No recent orders found.</p>
               )}

               <Modal isOpen={orderToDelete !== null} close={() => setOrderToDelete(null)} onConfirm={handleConfirmDelete}>
                    <p>Are you sure you want to delete this order?</p>
               </Modal>
          </div>
     );
};

export default RecentOrderList;
