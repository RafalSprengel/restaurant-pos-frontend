import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Alert } from 'react-bootstrap'; // Import React Bootstrap components
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const Products = () => {
    const [productsList, setProductsList] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(false);
    const [deleteError, setDeleteError] = useState(false); // State to handle delete errors
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const [productToDelete, setProductToDelete] = useState(null); // Product ID to delete
    const navigate = useNavigate();

    const getMenuItems = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/getAllProducts', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setProductsList(data);
                setError(false);
            } else {
                const errorData = await response.json();
                console.log('Server error:', errorData.error);
                setError(true);
            }
        } catch (error) {
            console.error('Error during downloading data:', error);
            setError(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getMenuItems();
    }, [isDeleting]);

    const handleRowClick = (id) => {
        navigate("/admin/products/" + id);
    };

    const handleDeleteClick = (event, id) => {
        event.stopPropagation();
        setProductToDelete(id); // Set the product to delete
        setShowModal(true); // Show the modal
    };

    const handleConfirmDelete = async () => {
        setShowModal(false); // Hide the modal
        setIsDeleting(true);
        setDeleteError(false);
        try {
            await deleteProduct(productToDelete);
        } catch (error) {
            setDeleteError(true);
            console.log("Error: " + error);
        } finally {
            setIsDeleting(false);
        }
    };

    const deleteProduct = async (id) => {
        const response = await fetch('http://localhost:3001/api/deleteProduct/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error);
        }
    };

    const List = productsList?.map(item => (
        <tr key={item._id} onClick={() => handleRowClick(item._id)}>
            <td>{item.name}</td>
            <td>{item.barcode}</td>
            <td>{item.category}</td>
            <td>{item.isAvailable ? "Available" : "Not Available"}</td>
            <td className='admin__deleteElement' onClick={(e) => handleDeleteClick(e, item._id)}>Delete</td>
        </tr>
    ));

    return (
        <>
            {isLoading && <div>Loading...</div>}
            {error && <div>Something went wrong:(</div>}
            {deleteError && <Alert variant="danger">Failed to delete the product. Please try again.</Alert>}
            {productsList?.length ? (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Barcode</th>
                            <th>Category</th>
                            <th>Is Available</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {List}
                    </tbody>
                </table>
            ) : (!isLoading && !error) && <div>No products found</div>}

            {/* Modal for confirmation */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this product?</Modal.Body>
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

export default Products;
