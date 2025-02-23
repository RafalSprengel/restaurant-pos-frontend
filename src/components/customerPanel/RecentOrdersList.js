import { useFetch } from '../../hooks/useFetch';

const RecentOrderList = () => {
    const { data: orders, loading: loadingOrders, error: fetchError, refetch } = useFetch('/orders/customer');

    if (loadingOrders) return <p>Loading orders...</p>;
    if (fetchError) return <p>Error fetching orders: {fetchError.message}</p>;

    return (
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
                                    {order.items.map((item) => (
                                        <li key={item._id}>
                                            {item.name} - {item.quantity} x ${item.price}
                                        </li>
                                    ))}
                                </ul>
                                <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No recent orders found.</p>
            )}
        </div>
    );
};

export default RecentOrderList;