import { useEffect, useState } from "react";
import { Modal, Button, Alert } from 'react-bootstrap'; // Import React Bootstrap components
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const Categories = () => {
    const [categoryList, setCategoryList] = useState(null)
    const [error, setError] = useState(false);
    const [deleteError, setDeleteError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [categoryToDelete, setCategoryToDelete] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const getAllCategories = async () => {
        try {
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
                console.log('Server error: ' + errorData.error)
            }
        } catch (error) {
            console.error('Error during dodnloading data: ' + error)

        } finally {
            setIsLoading(false)
        }
    };

    const handleRowClick = (id) => {
        console.log('row klik: ' + id)
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
    }

    const Row = ({ el }) => {
        return (
            <tr onClick={() => handleRowClick(el._id)}>
                <td>{el.name}</td>
                <td onClick={(e) => handleDeleteClick(e, el._id)}>delete</td>
            </tr>
        )
    }


    const list = categoryList?.map(el => {
        return (
            <Row key={el._id} el={el} />
        )
    })
    useEffect(() => {
        getAllCategories()
    }, [isDeleting])

    return (<>
        {isLoading && <h3>Loading data...</h3>}
        {error && <h3>Something went rong :(</h3>}
        {deleteError && <h3>Error during deleting Category :(</h3>}
        {!isLoading && !error && !deleteError &&
            <>
                <h2>Categories</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
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
    </>
    )
}

export default Categories;