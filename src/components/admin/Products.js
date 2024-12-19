import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Modal, Button, Alert, Pagination } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Stack from 'react-bootstrap/Stack';
import { useAuth } from '../../context/authContext';
import api from '../../utils/axios';

const Products = () => {
    const [productsList, setProductsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortCriteria, setSortCriteria] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [searchString, setSearchString] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { user } = useAuth();

    const rolePermissions = {
        admin: { addProductButt: true, deleteProductButt: true },
        moderator: { addProductButt: true, deleteProductButt: true },
        member: { addProductButt: false, deleteProductButt: false },
    };

    const isVisible = rolePermissions[user.role] || { addProductButt: false, deleteProductButt: false };

    const getProducts = async () => {
        const queryString = location.search;

        try {
            setErrorMessage(null);
            const response = await fetch(`http://localhost:3001/api/getProducts${queryString}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setProductsList(data.products);
                setTotalPages(data.totalPages);
                setCurrentPage(data.currentPage);
            } else {
                const errorData = await response.json();
                console.error('Server error:', errorData.error);
                setErrorMessage(errorData.error.toString());
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setErrorMessage(error.message.toString());
        } finally {
            setIsLoading(false);
        }
    };

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
        setErrorMessage(null);
        const response = await api.delete(`http://localhost:3001/api/deleteProduct/${id}`);
        if (!response.ok) {
            const errorData = await response.json();
            setErrorMessage(`Unable to delete this product (${errorData})`);
        }
    };

    const handlePageChange = (page) => {
        const params = new URLSearchParams(location.search);
        params.set('page', page);
        navigate('?' + params.toString());
    };

    const productRows = productsList.map((item) => (
        <tr key={item._id} onClick={() => handleRowClick(item._id)}>
            <td>{item.name}</td>
            <td>{item.category?.name || 'N/A'}</td>
            <td>{item.price}</td>
            <td>{item.isAvailable ? 'Yes' : 'No'}</td>
            <td>{item.isVegetarian ? 'Yes' : 'No'}</td>
            <td>{item.isGlutenFree ? 'Yes' : 'No'}</td>
            <td className="admin__deleteElement">
                {isVisible.deleteProductButt && (
                    <button type="button" className="btn btn-danger" onClick={(e) => handleDeleteClick(e, item._id)}>
                        Delete
                    </button>
                )}
            </td>
        </tr>
    ));

    const handleSearchChange = (e) => {
        const { value } = e.target;
        setSearchString(value);
        const params = new URLSearchParams(location.search);
        params.delete('page');
        value == '' ? params.delete('search') : params.set('search', value);
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

    useEffect(() => {
        //set search string from url to search input
        const params = new URLSearchParams(location.search);
        const searchFromUrl = params.get('search');
        const sortByFromUrl = params.get('sortBy');
        const sortOrderFromUrl = params.get('sortOrder');
        sortOrderFromUrl ? setSortOrder(sortOrderFromUrl) : setSortOrder('');
        sortByFromUrl ? setSortCriteria(sortByFromUrl) : setSortCriteria('');
        searchFromUrl ? setSearchString(searchFromUrl) : setSearchString('');
    }, [location.search]);

    useEffect(() => {
        getProducts();
    }, [isDeleting, searchParams, searchString, sortCriteria, sortOrder]);

    const SortArrow = ({ criteria }) => {
        const arrow = () => {
            if (criteria == sortCriteria) return sortOrder == 'desc' ? '▼' : '▲';
            else return '•';
        };
        return <>{arrow()}</>;
    };
    return (
        <>
            {!isLoading && !errorMessage && (
                <>
                    <h3>Products</h3>
                    <Stack direction="horizontal" gap={3}>
                        <div className="p-2">
                            {isVisible.addProductButt && (
                                <>
                                    <input
                                        className="btn btn-primary"
                                        type="button"
                                        value="Add new.."
                                        onClick={() => navigate('/admin/add-product')}
                                    />
                                </>
                            )}
                        </div>
                        <div className="p-2 ms-auto"></div>
                        <div className="p-2 ms-auto">find item:</div>
                        <div className="p-2">
                            <input
                                type="search"
                                className="admin__searchInput"
                                placeholder="search..."
                                onChange={handleSearchChange}
                                value={searchString}
                            />
                        </div>
                    </Stack>
                </>
            )}
            {productsList?.length > 0 ? (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th data-name="name" onClick={handleSort}>
                                    Name <SortArrow criteria="name" />
                                </th>
                                <th data-name="category" onClick={handleSort}>
                                    Category <SortArrow criteria="category" />
                                </th>
                                <th data-name="price" onClick={handleSort}>
                                    Price <SortArrow criteria="price" />
                                </th>
                                <th data-name="isAvailable" onClick={handleSort}>
                                    Is Available <SortArrow criteria="isAvailable" />
                                </th>
                                <th data-name="isVegetarian" onClick={handleSort}>
                                    Is Vegetarian <SortArrow criteria="isVegetarian" />
                                </th>
                                <th data-name="isGlutenFree" onClick={handleSort}>
                                    Is Gluten Free <SortArrow criteria="isGlutenFree" />
                                </th>
                                <th>Options</th>
                            </tr>
                        </thead>
                        <tbody>{productRows}</tbody>
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
            ) : isLoading ? (
                <h4>Loading data...</h4>
            ) : errorMessage ? (
                <Alert variant="danger">{errorMessage}</Alert>
            ) : (
                <h4>No products found</h4>
            )}

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
