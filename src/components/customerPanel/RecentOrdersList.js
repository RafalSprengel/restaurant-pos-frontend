import { useFetch } from '../../hooks/useFetch';
import { useState } from 'react';
import api from '../../utils/axios';
import { Modal, Button, Alert, Pagination } from 'react-bootstrap';

const RecentOrderList = () => {

    const [orderToDelete, setOrderToDelete] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
     const [errorMessage, setErrorMessage] = useState(null);
    const { data, loading: loadingOrders, error: fetchError, refetch: refetchOrders } = useFetch('/orders/customer');
    let orders = data || [];

    if (loadingOrders) return <p>Loading orders...</p>
    if (fetchError) return <p>Error fetching orders: {fetchError.message}</p>;

const handleDeleteClick=(id)=>{
    setOrderToDelete(id);
    setShowModal(true);
}

const handleConfirmDelete= async()=>{
    setShowModal(false);
    setIsLoading(true);

    try{
        const response = await api.delete(`/orders/customer/${orderToDelete}`);
        if(response.status === 200){
            await refetchOrders();
            setIsLoading(false);
        }else{
            setErrorMessage('Unable to delete this order.');
        }

    }catch(error){
        setIsLoading(false);
        setErrorMessage('Unable to delete this order.');
    }finally{
        setOrderToDelete(null);
        setIsLoading(false);
    }
}

    return (
        <>
        <div>
            <h4>Recent Orders</h4>
            {orders && orders.length > 0 ? (
                <ul>
                    {orders.map((order) => (
                        <li key={order._id}>
                            <div className="order-card">
                                <p><strong>Order Number:</strong> {order.orderNumber}</p>
                                <p><strong>Total Price:</strong> ${order.totalPrice}</p>
                                <p><strong>Status:</strong> {order.status}</p>
                                <p><strong>Order Type:</strong> {order.orderType}</p>
                                <ul>
                                    <strong>Items:</strong>
                                    {order.products.map((product) => (
                                        <li key={product._id}>
                                            {product.name} - {product.quantity}  (${product.price})
                                        </li>
                                    ))}
                                </ul>
                                <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                                <p><button type="button" className="btn btn-danger" onClick={()=>handleDeleteClick (order._id)}>Delete</button></p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No recent orders found.</p>
            )}
        </div>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this order?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleConfirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}; 

export default RecentOrderList;