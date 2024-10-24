import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { Modal, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import dayjs from 'dayjs';

const Customers = () => {
    const { data: customers, loading, error, refetch } = useFetch('http://localhost:3001/api/getCustomers');
    const [customerIdToDelete, setCustomerIdToDelete] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const deleteCustomer = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/deleteCustomer/' + customerIdToDelete, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Unable do delete element, datails: ' + errorData.error);
                throw new Error(errorData.error);
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
        } finally {
            setShowModal(false);
            refetch();
        }
    };

    const handleConfirmDelete = (id) => {
        setCustomerIdToDelete(id);
        setShowModal(true);
    };

    return (
        <>
            {customers?.length > 0 ? (
                <div style={{ width: '100%' }}>
                    <div>Customers</div>
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
                                    <tr key={customer._id}>
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
                                            <button className="btn btn-danger" onClick={() => handleConfirmDelete(customer._id)}>
                                                Delete
                                            </button>
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
                <Modal.Body>Are you sure you want do delete this customer?</Modal.Body>
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
