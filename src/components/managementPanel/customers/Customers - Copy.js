import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom'
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Stack from 'react-bootstrap/Stack';
import dayjs from 'dayjs';
import { useAuth } from '../../../context/authContext';
import api from '../../../utils/axios';
import { useEffect } from 'react';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [customerIdToDelete, setCustomerIdToDelete] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth('staff');
    const navigate = useNavigate();

    const rolePremissions = {
        admin: { addNewButt: true, deleteButt: true },
        moderator: { addNewButt: true, deleteButt: true },
        member: { addNewButt: false, deleteButt: false },
    };

    const isVisible = rolePremissions[user.role] || { deleteBut: false };

    const handleRowClick = (id) => {
        navigate(`${id}`);
    };

    const fetchCustomers = async () => {
        try {
            const response = await api.get('/customers/');
            setCustomers(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const deleteCustomer = async () => {
        try {
            const res = await api.delete('/customers/' + customerIdToDelete);
            if (res.status !== 200) {
                console.error('Unable to delete element, details: ' + res.data.error);
            }
        } catch (e) {
            console.error('Error deleting customer:', e.response.data.error);
        } finally {
            setShowModal(false);
            fetchCustomers(); // Refetch customers after deletion
        }
    };

    const handleConfirmDelete = (e, id) => {
        e.stopPropagation()
        setCustomerIdToDelete(id);
        setShowModal(true);
    };

    return (
        <>
            <h3>Customers</h3>
            <Stack direction="horizontal" gap={3}>
                <div className="p-2">
                {isVisible.addNewButt && (
                 <button
                 className="btn btn-primary"
                 onClick={() => navigate('/management/add-customer')}
             >
                 Add customer
             </button>
             
                )}
                </div>
                <div className="p-2 ms-auto">find customer:</div>
                <div className='p-2 ms-auto'>
                <input
                    className="admin__searchInput"
                    type="search"
                    placeholder="search..."
                 />
                </div>
            </Stack>
            {customers?.length > 0 ? (
                <div style={{ width: '100%' }}>
                    <table>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Name</th>
                                <th>Orders</th>
                                <th>Created</th>
                                <th>Registered</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer) => {
                                const formattedTime = dayjs(customer.createdAt).format('HH:mm');
                                const formattedDate = dayjs(customer.createdAt).format('DD/MM/YY');
                                return (
                                    <tr key={customer._id} onClick={() => handleRowClick(customer._id)}>
                                        <td>{customer.customerNumber}</td>
                                        <td>
                                            {customer.name} <br /> {customer.surname}
                                        </td>
                                        <td>{customer.amountOfOrders}</td>
                                        <td>
                                            {formattedTime}
                                            <br />
                                            {formattedDate}
                                        </td>
                                        <td>{customer.isRegistered ? 'Yes' : 'No'}</td>
                                        <td>
                                            {isVisible.deleteBut && (
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={(e) => handleConfirmDelete(e, customer._id)}>
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : error ? (
                <div>Error: {error.message}</div>
            ) : loading ? (
                <>Loading...</>
            ) : (
                <div>No customers found</div>
            )}
            {/*modal for confirmation of deletion*/}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this customer?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={deleteCustomer}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Customers;
