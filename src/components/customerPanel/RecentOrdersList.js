import { useEffect, useState } from 'react';
import api from '../../utils/axios';
import { useFetch } from '../../hooks/useFetch';
import { modals } from '@mantine/modals';
import { Text } from '@mantine/core';
import '../../styles/recent-orders-list.scss';

const RecentOrdersList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const { data, isLoading: loadingOrders, error: fetchError, refetch: refetchOrders } = useFetch('/orders/customer');
  const orders = data || [];



  const handleConfirmDelete = async (id) => {
    setIsLoading(true);
    setErrorMessage(null);
    console.log('order to delete : ' + id)

    try {
      const response = await api.put(`/orders/customer/${id}`);
      if (response.status === 200) {
        await refetchOrders();
      } else {
        setErrorMessage('Unable to delete this order.');
      }
    } catch (err) {
      setErrorMessage('Unable to delete this order.');
      console.log(err)
    } finally {
      setIsLoading(false);
    }
  };

  const openDeletingOrderConfirmModal = (id) => modals.openConfirmModal({
    title: 'Deleting order',
    children: (
      <Text size="sm">
        Do you really want to delete this order?
      </Text>
    ),
    labels: { confirm: 'Delete this order', cancel: 'Cancel' },
    onCancel: () => console.log('Cancel'),
    onConfirm: () => handleConfirmDelete(id),
  });


  if (loadingOrders) {
    return (
      <div className="recent-orders-list__loading">
        <span>Loading orders...</span>
      </div>
    );
  }

  if (fetchError) {
    return <div className="recent-orders-list__error">Error fetching orders: {fetchError.message}</div>;
  }

  return (
    <div className="recent-orders-list">
      <div className="recent-orders-list__title">
        <div className="recent-orders-list__title-text">Recent Orders</div>
        <div className="recent-orders-list__line-wrapper">
          <div className="recent-orders-list__line"></div>
        </div>
      </div>

      {orders.length > 0 ? (
        <div className="recent-orders-list__orders">
          {orders.map((order) => (
            <div className="recent-orders-list__order-card" key={order._id}>
              <div className="recent-orders-list__order-info">
                <div className="recent-orders-list__order-label">
                  <strong>Order Number:</strong>
                </div>
                <div className="recent-orders-list__order-data">
                  {order.orderNumber}
                </div>
              </div>
              <div className="recent-orders-list__order-info">
                <div className="recent-orders-list__order-label">
                  <strong>Total Price:</strong>
                </div>
                <div className="recent-orders-list__order-data">
                  ${order.totalPrice?.toFixed(2) || '0.00'}
                </div>
              </div>
              <div className="recent-orders-list__order-info">
                <div className="recent-orders-list__order-label">
                  <strong>Status:</strong>
                </div>
                <div className="recent-orders-list__order-data">
                  {order.isPaid ? 'Paid' : 'Unpaid'}
                </div>
              </div>
              <div className="recent-orders-list__order-info">
                <div className="recent-orders-list__order-label">
                  <strong>Order Type:</strong>
                </div>
                <div className="recent-orders-list__order-data">
                  {order.orderType}
                </div>
              </div>
              <div className="recent-orders-list__order-info">
                <strong>Items:</strong>
              </div>
              <div className="recent-orders-list__order-items">
                {order.products.map((product, index) => (
                  <div className="recent-orders-list__order-item" key={index}>
                    {product.quantity} x {product.name} (${(product.price * product.quantity).toFixed(2)})
                  </div>
                ))}
              </div>
              <div className="recent-orders-list__order-info">
                <div className="recent-orders-list__order-label">
                  <strong>Placed at:</strong>
                </div>
                <div className="recent-orders-list__order-data">
                  {new Date(order.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="recent-orders-list__order-actions">
                <button
                  className="recent-orders-list__delete-btn"
                  onClick={() => openDeletingOrderConfirmModal(order._id)}
                  disabled={isLoading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="recent-orders-list__empty">No recent orders found.</div>
      )}
    </div>
  );
};

export default RecentOrdersList;
