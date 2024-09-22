import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Modal, Button, Alert, Pagination } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Products = () => {
    const [productsList, setProductsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1)
    const navigate = useNavigate();
    const location = useLocation();

    const getPageFromUrl = () => {
        const searchParams = new URLSearchParams(location.search);
        const page = parseInt(searchParams.get('page'));
        return page;
    }

    const getProducts = async (page = 1) => {
        try {
            const response = await fetch('http://localhost:3001/api/getAllProducts?page=' + page + '&limit=10', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setProductsList(data.products);
                setTotalPages(data.totalPages)
                setCurrentPage(data.currentPage)
                setError('');
            } else {
                const errorData = await response.json();
                console.error('Server error:', errorData.error);
                setError('Failed to load products. Please try again later.');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('An error occurred while fetching products. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const page = getPageFromUrl()
        getProducts(page);
    }, [isDeleting, location.search]);

    const handleRowClick = (id) => {
        navigate(`${id}`);
    };

    const handleDeleteClick = (event, id) => {
        event.stopPropagation();
        setProductToDelete(id);
        setShowModal(true);
    };

    const handleConfirmDelete = async () => {
        setShowModal(false);
        setIsDeleting(true);
        setDeleteError('');
        try {
            await deleteProduct(productToDelete);
        } catch (error) {
            setDeleteError('Failed to delete the product. Please try again.');
            console.error('Error deleting product:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const deleteProduct = async (id) => {
        const response = await fetch(`http://localhost:3001/api/deleteProduct/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete product');
        }
    };

    const handlePageChange = (page) => {
        console.log('wykonuje handlePageHange');
        navigate('?page=' + page)
    }
    const productRows = productsList.map(item => (
        <tr key={item._id} onClick={() => handleRowClick(item._id)}>
            <td>{item.name}</td>
            <td>{item.barcode}</td>
            <td>{item.category?.name || 'N/A'}</td>
            <td>{item.isAvailable ? "Available" : "Not Available"}</td>
            <td className='admin__deleteElement' onClick={(e) => handleDeleteClick(e, item._id)}>Delete</td>
        </tr>
    ));
    return (
        <>
            {isLoading && <h4>Loading data...</h4>}
            {error && <Alert variant="danger">{error}</Alert>}
            {deleteError && <Alert variant="danger">{deleteError}</Alert>}
            {productsList.length ? (
                <>
                    <h3>Products</h3>
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
                            {productRows}
                        </tbody>
                    </table>
                    <Pagination className='custom-pagination'>
                        <Pagination.First onClick={() => handlePageChange(1)} />
                        <Pagination.Prev
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={(currentPage === 1)}
                        />
                        {[...(new Array(totalPages))].map((el, index) => (
                            <Pagination.Item
                                key={index}
                                active={(index + 1 === currentPage)}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            disabled={(currentPage === totalPages)}
                            onClick={() => handlePageChange(currentPage + 1)}
                        />
                        <Pagination.Last onClick={() => handlePageChange(totalPages)} />
                    </Pagination>
                </>
            ) : (!isLoading && !error) && <div>No products found</div>}

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
