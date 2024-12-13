import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { Modal, Button, Pagination } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useAuth } from '../../context/StaffAuthContext';
import api from '../../utils/axios';

const rolePremissions = {
    admin: { deleteBut: true },
    moderator: { deleteBut: true },
    member: { deleteBut: false },
};

dayjs.extend(customParseFormat);

const Orders = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { data, loading, error, refetch, fetchData } = useFetch('http://localhost:3001/api/getOrders');
    let orders = data?.orders;
    let totalPages = data?.totalPages;
    let currentPage = data?.currentPage;
    const [orderIdToDelete, setOrderIdToDelete] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [sortCriteria, setSortCriteria] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [searchString, setSearchString] = useState('');
    const { user } = useAuth();
    const isVisible = rolePremissions[user.role] || { deleteBut: false };
    const handleConfirmDelete = (e, id) => {
        e.stopPropagation();
        setOrderIdToDelete(id);
        setShowModal(true);
    };

    const deleteOrder = async () => {
        try {
            const res = await api.delete('http://localhost:3001/api/deleteOrder/' + orderIdToDelete);
            if (res !== 200) {
                console.error('Unable do delete element, datails: ' + res.data.error);
            }
        } catch (e) {
            console.error('Error deleting order:', e.response.data.error);
        } finally {
            setShowModal(false);
            refetch();
        }
    };

    const handlePageChange = (page) => {
        const params = new URLSearchParams(location.search);
        params.set('page', page);
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

    const SortArrow = ({ criteria }) => {
        const arrow = () => {
            if (criteria == sortCriteria) return sortOrder == 'desc' ? '▼' : '▲';
            else return '•';
        };
        return <>{arrow()}</>;
    };

    const handleSearchChange = (e) => {
        const { value } = e.target;
        setSearchString(value);
        const params = new URLSearchParams(location.search);
        params.delete('page');
        value == '' ? params.delete('search') : params.set('search', value);
        navigate('?' + params);
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const sortByFromUrl = params.get('sortBy');
        const sortOrderFromUrl = params.get('sortOrder');
        sortOrderFromUrl ? setSortOrder(sortOrderFromUrl) : setSortOrder('');
        sortByFromUrl ? setSortCriteria(sortByFromUrl) : setSortCriteria('');
        const queryString = location.search;
        const url = `http://localhost:3001/api/getOrders${queryString}`;
        fetchData(url);
    }, [location.search]);

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    width: '100%',
                    alignItems: 'center',
                    gap: '20px',
                }}>
                <div>find order:</div>
                <div>
                    <input type="text" placeholder="Search" onChange={handleSearchChange} value={searchString} />
                </div>
            </div>
            {orders?.length > 0 ? (
                <>
                    <div>Search</div>

                    <table>
                        <thead>
                            <tr>
                                <th data-name="orderNumber" onClick={handleSort}>
                                    Order No <SortArrow criteria="orderNumber" />
                                </th>
                                <th data-name="customer.name" onClick={handleSort}>
                                    Customer <SortArrow criteria="customer.name" />
                                </th>
                                <th data-name="isPaid" onClick={handleSort}>
                                    Status <SortArrow criteria="isPaid" />
                                </th>
                                <th data-name="orderType" onClick={handleSort}>
                                    Type <SortArrow criteria="orderType" />
                                </th>
                                <th data-name="createdAt" onClick={handleSort}>
                                    Time <SortArrow criteria="createdAt" />
                                </th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => {
                                //const formattedDate = dayjs(order.createdAt).format('HH:mm DD/MM/YY');

                                const hour = dayjs(order.createdAt).format('HH:mm');
                                const day = dayjs(order.createdAt).format('DD/MM/YY');

                                return (
                                    <tr key={order._id} onClick={() => navigate(order._id)}>
                                        <td>{order.orderNumber}</td>
                                        <td>{order.customer.name + ' ' + order.customer.surname}</td>
                                        <td>{order.isPaid ? 'Paid' : 'Not paid'}</td>
                                        <td>{order.orderType}</td>
                                        <td>
                                            <span>{hour}</span> <span style={{ fontSize: '0.7em' }}>{day}</span>
                                        </td>
                                        <td>
                                            {isVisible.deleteBut && (
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={(e) => handleConfirmDelete(e, order._id)}>
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <Pagination className="custom-pagination">
                        <Pagination.First onClick={() => handlePageChange(1)} />
                        <Pagination.Prev
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        />
                        {[...new Array(totalPages)].map((el, index) => (
                            <Pagination.Item
                                key={index}
                                active={index + 1 === currentPage}
                                onClick={() => handlePageChange(index + 1)}>
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        />
                        <Pagination.Last onClick={() => handlePageChange(totalPages)} />
                    </Pagination>
                </>
            ) : error ? (
                <>Error: {error.message}</>
            ) : loading ? (
                <>Loading...</>
            ) : (
                <>No orders found</>
            )}
            {/*modal for confirmation of deletion*/}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want do delete this order?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={deleteOrder}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Orders;
