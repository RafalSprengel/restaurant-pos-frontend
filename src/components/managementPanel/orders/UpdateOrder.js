import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/authContext';
import api from '../../../utils/axios';
import '../../../styles/update-order.scss';

const UpdateOrder = () => {
     const { id } = useParams();
     const [order, setOrder] = useState({});
     const [formData, setFormData] = useState({
          status: '',
          orderType: '',
          note: '',
          isPaid: false,
     });
     const [message, setMessage] = useState('');
     const [showSuccessModal, setShowSuccessModal] = useState(false);
     const [showErrorAlert, setShowErrorAlert] = useState(false);
     const [errorMessage, setErrorMessage] = useState('');
     const navigate = useNavigate();
     const { user } = useAuth('staff');

     const isEditable = ['admin', 'moderator'].includes(user.role);

     const getOrder = async () => {
          try {
               const response = await api.get(`/orders/${id}`);
               if (response.status === 200) {
                    setOrder(response.data);
               } else {
                    throw new Error('Failed to fetch order data');
               }
          } catch (error) {
               console.error('Error fetching order:', error);
               setErrorMessage('Failed to fetch order data. Please try again later.');
               setShowErrorAlert(true);
          }
     };

     useEffect(() => {
          getOrder();
     }, [id]);

     useEffect(() => {
          if (order) {
               setFormData({
                    status: order.status || '',
                    orderType: order.orderType || '',
                    note: order.note || '',
                    isPaid: order.isPaid || false,
               });
          }
     }, [order]);

     const handleChange = (e) => {
          const { name, value, type, checked } = e.target;
          setFormData({
               ...formData,
               [name]: type === 'checkbox' ? checked : value,
          });
     };

     const handleSubmit = async (e) => {
          e.preventDefault();

          const dataToSend = {
               ...formData,
          };

          try {
               const response = await api.put(`/orders/${id}`, dataToSend);
               if (response.status === 200) {
                    setMessage('Order updated successfully!');
                    setShowSuccessModal(true);
               } else {
                    console.error('Server error:', response.data.error);
                    setErrorMessage('Failed to update order. Please check your input and try again.');
                    setShowErrorAlert(true);
               }
          } catch (error) {
               console.error('Error saving order:', error);
               setErrorMessage('Error saving order. Please try again later.');
               setShowErrorAlert(true);
          }
     };

     const handleCloseSuccessModal = () => {
          setShowSuccessModal(false);
          setTimeout(() => {
               navigate('/orders');
          }, 500);
     };

     return (
          <>
               <form className="order-form" onSubmit={handleSubmit}>
                    <h2>Update Order</h2>

                    {showErrorAlert && <div className="alert error">{errorMessage}</div>}

                    <label>Status:</label>
                    <input type="text" name="status" value={formData.status} onChange={handleChange} required disabled={!isEditable} />

                    <label>Order Type:</label>
                    <input type="text" name="orderType" value={formData.orderType} onChange={handleChange} required disabled={!isEditable} />

                    <label>Note:</label>
                    <textarea name="note" value={formData.note} onChange={handleChange} disabled={!isEditable} />

                    <label>
                         <input type="checkbox" name="isPaid" checked={formData.isPaid} onChange={handleChange} disabled={!isEditable} />
                         Is Paid
                    </label>

                    {isEditable && <button type="submit">Save Order</button>}
               </form>

               {showSuccessModal && (
                    <div className="modal">
                         <div className="modal-content">
                              <div className="modal-header">
                                   <span className="close" onClick={() => setShowSuccessModal(false)}>
                                        &times;
                                   </span>
                                   <h2>Success</h2>
                              </div>
                              <div className="modal-body">{message}</div>
                              <div className="modal-footer">
                                   <button onClick={handleCloseSuccessModal}>OK</button>
                              </div>
                         </div>
                    </div>
               )}
          </>
     );
};

export default UpdateOrder;
