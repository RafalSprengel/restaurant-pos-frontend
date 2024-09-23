import { useEffect, useState } from "react";
import { Modal, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";

const Categories = () => {
    const [categoryList, setCategoryList] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(true)
    const [categoryToDelete, setCategoryToDelete] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate()

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };


    const getAllCategories = async () => {
        try {
            setErrorMessage(null)
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const response = await fetch('http://localhost:3001/api/getAllCategories', options);
            if (response.ok) {
                const data = await response.json();
                setCategoryList(data)
            } else {
                const errorData = await response.json()
                console.error('Server error: ' + errorData.error);
                setErrorMessage(`Connection Error (${errorData.error})`)
            }
        } catch (error) {
            console.error('Error during dodnloading data: ' + error)
            setErrorMessage(`Connection Error (${error})`)

        } finally {
            setIsLoading(false)
        }
    };

    const handleRowClick = (id) => {

        navigate(`${id}`)
    }

    const handleDeleteClick = (e, id) => {
        e.stopPropagation();
        setCategoryToDelete(id);
        setShowModal(true)
    }

    const handleConfirmDelete = async () => {
        setShowModal(false);
        setIsDeleting(true);
        setDeleteError(false);
        try {
            await deleteCategory(categoryToDelete)
        }
        catch (error) {
            setDeleteError(error)
            console.log("Error during deleting Category, details :", error)
        }
        finally { setIsDeleting(false) }
    }

    const deleteCategory = async (id) => {
        try {
            setErrorMessage(null)
            const response = await fetch('http://localhost:3001/api/deleteCategoty/' + id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Unable do delete element, datails: " + errorData.error)
                throw new Error(errorData.error);
            }
        } catch (error) {
            console.error(error)
            setErrorMessage(`Connection error (${error})`);
        }


    }

    const Row = ({ el }) => {
        return (
            <tr onClick={() => handleRowClick(el._id)}>
                <td>{el.name}</td>
                <td>
                    <img
                        src={el.image}
                        className="admin__categoryImg"
                        onClick={() => handleImageClick(el.image)}
                        style={{ cursor: 'pointer' }}
                        alt="Category"
                    />
                </td>
                <td>{el.index}</td>
                <td onClick={(e) => handleDeleteClick(e, el._id)}>delete</td>
            </tr>
        );
    };


    const list = categoryList?.map(el => {
        return (
            <Row key={el._id} el={el} />
        )
    })
    useEffect(() => {
        getAllCategories()
    }, [isDeleting])

    return (<>
        {isLoading && <h4>Loading data...</h4>}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        {!isLoading && !errorMessage &&
            <>
                <h3>Categories</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Image</th>
                            <th>Index</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list}
                    </tbody>
                </table>
            </>
        }
        {/* Modal for confirmation */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want do delete this category?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleConfirmDelete} >Delete</Button>
            </Modal.Footer>
        </Modal>
        {/* Modal for image preview */}
        <Modal show={!!selectedImage} onHide={handleCloseModal} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Image Preview</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <img src={selectedImage} className="admin__imgFluid" alt="Preview" />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
            </Modal.Footer>
        </Modal>
    </>
    )
}

export default Categories;