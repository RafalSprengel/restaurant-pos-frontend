import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Alert } from 'react-bootstrap';
import api from '../../utils/axios.js';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddCategory = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        image: '',
        index: '',
    });

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            setFormData({
                ...formData,
                image: files[0],
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(null);
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('index', formData.index);
        formDataToSend.append('image', formData.image);

        try {
            const res = await api.post('/addCategory', formDataToSend);
            if (res.status == 200) {
                setShowSuccessModal(true);
            } else {
                setErrorMessage(`Failed to save category (${res.data.error})`);
            }
        } catch (e) {
            console.log('e to : ');
            console.log(e);
            setErrorMessage(e.response.data.error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        navigate('/admin/categories');
    };

    return (
        <>
            <h3>Add a new category</h3>
            <form className="menu-item-form" onSubmit={handleSubmit}>
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                <label>Name:</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                />
                <label>Index:</label>
                <input
                    type="number"
                    name="index"
                    value={formData.index}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                />
                <label>Image:</label>
                <input type="file" accept="image/*" name="image" onChange={handleChange} />
                <button type="submit" disabled={isLoading}>
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
