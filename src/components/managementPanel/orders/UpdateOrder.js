import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../utils/axios';
import { useFetch } from '../../../hooks/useFetch.js';
import { format } from 'date-fns';
import './updateOrder.scss';
import ErrorMessage from '../../ErrorMessage';

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
  const [error, setError] = useState('');
  const [expandedProductCardIndex, setExpandedProductCardIndex] = useState(null);
  const navigate = useNavigate();

  const { data: orderTypes, isLoading: loadingOrderTypes } = useFetch('/orders/order-types');

  const getOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch order data. Please try again later.');
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

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/management/orders');
  };

  const formatDate = (dateStr) => {
    try {
      return format(new Date(dateStr), 'yyyy-MM-dd HH:mm');
    } catch {
      return 'Invalid date';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/orders/${id}`, formData);
      if (response.status === 200) {
        setMessage('Order updated successfully!');
        setShowSuccessModal(true);
        setError('');
      } else {
        setError(response.data?.error || 'Failed to update order. Please check your input.');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Error saving order. Please try again later.');
    }
  };

  const toggleProductCardExpansion = (productIndex) => {
    setExpandedProductCardIndex(prevIndex => (prevIndex === productIndex ? null : productIndex));
  };

  return (
    <div className="update-order__wrapper">
      <form className="update-order__form" onSubmit={handleSubmit}>
        <h2 className="update-order__title">Update Order</h2>

        {error && <ErrorMessage message={error} />}

        <div className="update-order__section">
          <div className="update-order__group">
            <p className="update-order__info" style={{ fontWeight: 500 }}>Order #{order?.orderNumber}</p>
            <span className={`update-order__badge update-order__badge--${order?.isPaid ? 'green' : 'red'}`}>
              {order?.isPaid ? 'Paid' : 'Unpaid'}
            </span>
          </div>
          <p className="update-order__info" style={{ marginTop: '8px' }}>
            Placed: {formatDate(order?.createdAt)}
          </p>
          <p className="update-order__info">Updated: {formatDate(order?.updatedAt)}</p>
          <p className="update-order__info" style={{ marginTop: '16px' }}>Total Price: £{order?.totalPrice}</p>
        </div>

        <div className="update-order__section">
          <h4 className="update-order__heading--card">Purchaser details</h4>
          <p className="update-order__info" style={{ marginTop: '8px' }}>Name: {order?.purchaserDetails?.firstName} {order?.purchaserDetails?.surname}</p>
          <p className="update-order__info">Phone: {order?.purchaserDetails?.phone}</p>
          <p className="update-order__info">Email: {order?.purchaserDetails?.email}</p>
        </div>

        <div className="update-order__section">
          <h4 className="update-order__heading--card">Products</h4>
          <div className="update-order__table-responsive-wrapper">
            <table className="update-order__table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {order?.products?.map((product, index) => (
                  <tr key={index}>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td>£{product.price}</td>
                    <td>£{product.totalPrice}</td>
                    <td style={{ width: '150px', display: 'flex', flexDirection:'column' }}>
                      {product.ingredients?.join(', ')}<br />
                      {product.isVegetarian && <span className="update-order__badge update-order__badge--green" style={{ marginRight: '8px' }}>Vegetarian</span>}
                      {product.isGlutenFree && <span className="update-order__badge update-order__badge--blue">Gluten-Free</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="update-order__product-cards-group">
            {order?.products?.map((product, index) => {
              const isExpanded = expandedProductCardIndex === index;
              return (
                <div 
                  key={index}
                  className={`update-order__product-card ${isExpanded ? 'update-order__product-card--expanded' : ''}`} 
                  onClick={() => toggleProductCardExpansion(index)}
                >
                  <div className="update-order__product-card-header">
                    <span className="update-order__product-card-name">{product.name}</span>
                    <span className="update-order__product-card-qty">Qty: {product.quantity}</span>
                  </div>
                  {isExpanded && (
                    <div className="update-order__product-card-details">
                      <div className="update-order__product-card-row">
                        <span className="update-order__product-card-label">Price:</span>
                        <span className="update-order__product-card-value">£{product.price}</span>
                      </div>
                      <div className="update-order__product-card-row">
                        <span className="update-order__product-card-label">Total:</span>
                        <span className="update-order__product-card-value">£{product.totalPrice}</span>
                      </div>
                      {product.ingredients && product.ingredients.length > 0 && (
                        <div className="update-order__product-card-row">
                          <span className="update-order__product-card-label">Ingredients:</span>
                          <span className="update-order__product-card-value">{product.ingredients.join(', ')}</span>
                        </div>
                      )}
                      <div className="update-order__product-card-row">
                        <span className="update-order__product-card-label">Vegetarian:</span>
                        <span className="update-order__product-card-value">{product.isVegetarian ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="update-order__product-card-row">
                        <span className="update-order__product-card-label">Gluten-Free:</span>
                        <span className="update-order__product-card-value">{product.isGlutenFree ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <hr style={{ margin: '16px 0', border: 0, borderTop: '1px solid #e0e0e0' }} />

        <div className="update-order__form-group">
          <label className="update-order__label" htmlFor="orderType">Order Type</label>
          <select
            className="update-order__select"
            name="orderType"
            value={formData.orderType}
            onChange={(e) => setFormData((prev) => ({ ...prev, orderType: e.target.value }))}
            disabled={loadingOrderTypes}
            required
          >
            <option value="" disabled>{loadingOrderTypes ? 'Loading...' : 'Select order type'}</option>
            {orderTypes?.map((type) => (
              <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="update-order__form-group">
          <label className="update-order__label" htmlFor="note">Note</label>
          <textarea
            className="update-order__textarea"
            name="note"
            value={formData.note}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="update-order__checkbox-group">
          <input
            type="checkbox"
            className="update-order__checkbox"
            name="isPaid"
            checked={formData.isPaid}
            onChange={handleChange}
          />
          <label htmlFor="isPaid">Is Paid</label>
        </div>

        <button type="submit" className="update-order__button">Save Order</button>
      </form>

      {showSuccessModal && (
        <div className="update-order__modal">
          <p>{message}</p>
          <div className="update-order__modal-buttons">
            <button onClick={handleCloseSuccessModal}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateOrder;