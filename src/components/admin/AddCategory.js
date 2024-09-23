import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddCategory = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        image: ''
    });

    const handleChange = (e) => {
        setShowErrorAlert(false);
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            setFormData({
                ...formData,
                image: files[0]
            })
        } else {
            setFormData({
                ...formData,
                [name]: value
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('index', formData.index)
        formDataToSend.append('image', formData.image)

        try {
            setErrorMessage(null)
            const response = await fetch('http://localhost:3001/api/addCategory', {
                method: 'POST',
                body: formDataToSend
            });

            if (response.ok) {
                setShowSuccessModal(true);
            } else {
                const errorData = await response.json()
                console.error(errorData.error);
                setErrorMessage(`Failed to save category (${errorData.error})`);
            }
        } catch (error) {
            console.error(error);
            setErrorMessage(`Connection error (${error})`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        navigate('/admin/categories');
    };

    return (
        <><h3>Add a new category</h3>
            <form className='menu-item-form' onSubmit={handleSubmit}>
                {errorMessage && <Alert variant='danger'>{errorMessage}</Alert>}
                <label>Name:</label>
                <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                />
                <label>Index:</label>
                <input
                    type='number'
                    name='index'
                    value={formData.index}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                />
                <label>Image:</label>
                <input
                    type='file'
                    accept='image/*'
                    name='image'
                    onChange={handleChange} />
                <button type='submit' disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Category'}
                </button>
            </form>

            <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>Category added successfully!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseSuccessModal}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AddCategory;
