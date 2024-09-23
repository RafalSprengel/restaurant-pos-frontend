import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Modal, Button, Alert, Pagination } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Stack from 'react-bootstrap/Stack';

const Products = () => {
    const [productsList, setProductsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1)
    const navigate = useNavigate();
    const location = useLocation();
    const [search, setSearch] = useState('')

    const getPageFromUrl = () => {
        const searchParams = new URLSearchParams(location.search);
        const page = parseInt(searchParams.get('page'));
        return page;
    }

    const getSearchFromUrl = () => {
        const searchParams = new URLSearchParams(location.search);
        const search = searchParams.get('search');
        return search
    }

    const getProducts = async (page = 1) => {
        try {
            setErrorMessage(null)
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
            } else {
                const errorData = await response.json();
                console.error('Server error:', errorData.error);
                setErrorMessage('Failed to load products. Please try again later.');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setErrorMessage('An error occurred while fetching products. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const searchProduct = async () => {
        try {
            setIsLoading(true)
            setError('')
            const response = await fetch('', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = response.json();
                setProductsList(data);

            }
        } catch (error) {
            console.error('Error while searching product');
            setErrorMessage('An error occurred while searching products. Please try again later.')
        } finally {
            setIsLoading(false)
        }
    }

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
        setErrorMessage(null);
        try {
            await deleteProduct(productToDelete);
        } catch (error) {
            setErrorMessage('Failed to delete the product. Please try again.');
            console.error('Error deleting product:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const deleteProduct = async (id) => {
        setErrorMessage(null)
        const response = await fetch(`http://localhost:3001/api/deleteProduct/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            setErrorMessage(`Unable to delete this product (${errorData})`)
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

    const handleSearchChange = (e) => {
        const { value } = e.target
        setSearch(value)
    }


    return (
        <>
            {isLoading && <h4>Loading data...</h4>}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            {productsList.length ? (
                <>
                    <h3>Products</h3>
                    <Stack direction="horizontal" gap={3}>
                        <div className="p-2"><input class="btn btn-primary" type="button" value="Add new.." /></div>
                        <div className="p-2 ms-auto">find item:</div>
                        <div className="p-2">
                            <input
                                type='search'
                                className='admin__searchInput'
                                placeholder='search...'
                                onChange={handleSearchChange}
                            /></div>
                    </Stack>
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
            ) : (!isLoading && !errorMessage) && <div>No products found</div>}

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
