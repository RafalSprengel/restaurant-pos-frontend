import { useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import '../../styles/Orders.scss';
import dayjs from 'dayjs';

const Order = () => {
    const { id } = useParams();
    const { data: order, loading, error, refetch } = useFetch('http://localhost:3001/api/getOrders/' + id);

    if (!order) {
        return <div>Loading...</div>;
    }
    return (
        <div table className="orders-table">
            <table>
                <tr>
                    <th>No:</th>
                    <td>{order.orderNumber}</td>
                </tr>
                <tr>
                    <th>Customer:</th>
                    <td>
                        <details>
                            <ul>
                                <li>
                                    <strong>Name:</strong> {order.customer.name}
                                </li>
                                <li>
                                    <strong>Surname:</strong> {order.customer.surname}
                                </li>
                                <li>
                                    <strong>Email:</strong> {order.customer.email}
                                </li>
                                <li>
                                    <strong>Is Registered:</strong> {order.customer.isRegistered ? 'Yes' : 'No'}
                                </li>
                            </ul>
                        </details>
                    </td>
                </tr>
                <th>Order items:</th>
                <td>
                    <details>
                        {order.products.map((product, index) => (
                            <div key={index}>
                                <div>Product {index + 1}</div>
                                <ul>
                                    <li>
                                        <strong>Name:</strong> {product.name}
                                    </li>
                                    {product.ingridiens > 0 && (
                                        <li>
                                            <strong>Ingridients:</strong>
                                            <ul>
                                                {product.ingridiens.map((ingridient, idx) => (
                                                    <li key={idx}>{ingridient}</li>
                                                ))}
                                            </ul>
                                        </li>
                                    )}
                                    <li>
                                        <strong>Price:</strong> {product.price}
                                    </li>
                                    <li>
                                        <strong>Quantity:</strong> {product.quantity}
                                    </li>
                                </ul>
                            </div>
                        ))}
                    </details>
                </td>
                <tr>
                    <th>Total price:</th>
                    <td>{order.totalPrice}</td>
                </tr>
                <tr></tr>
                <tr>
                    <th>Order type:</th>
                    <td>{order.orderType}</td>
                </tr>
                {order.time && (
                    <tr>
                        <th>Order time:</th>
                        <td>{order.orderTime}</td>
                    </tr>
                )}
                <tr>
                    <th>Order status:</th>
                    <td>{order.status}</td>
                </tr>
                {order.note && (
                    <tr>
                        <th>Order note:</th>
                        <td>{order.note}</td>
                    </tr>
                )}
                <tr>
                    <th>Order paid:</th>
                    <td>{order.isPaid ? 'Yes' : 'No'}</td>
                </tr>
                <tr>
                    <th>Order date</th>
                    <td>{dayjs(order.createdAt).format(' HH:mm DD/MM/YY')} </td>
                </tr>
            </table>
        </div>
    );
};

export default Order;
