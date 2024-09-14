import React, { useEffect, useState } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap'; // Import React Bootstrap components
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../../styles/AddProduct.scss';

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    isFeatured: false,
    ingridiens: '',
    isVegetarian: false,
    isGlutenFree: false,
    isAvailable: true
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')

  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      price: parseFloat(formData.price),
      ingridiens: formData.ingridiens.split(',').map(item => item.trim()),
      category: formData.category
    };

    try {
      console.log('Sending data from browser:', JSON.stringify(dataToSend));
      const response = await fetch('http://localhost:3001/api/addProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Data received from server: ', result);
        setShowSuccessModal(true);
      } else {
        const errorData = await response.json();
        console.log('Server error:', errorData.error);
        setShowErrorAlert(true);
        setErrorMessage(errorData.error)
      }
    } catch (error) {
      console.error('Error saving menu item:', error);
      setShowErrorAlert(true);
    }
  };

  const getCategories = async () => {
    setErrorMessage('')
    try {
      const response = await fetch('http://localhost:3001/api/getAllCategories');
      const data = await response.json();

      if (response.ok) {
        setCategories(data);
        setError(false);
        setIsLoading(false);
      } else {
        console.log('Server error:', data.error);
        setError(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error getting categories:', error);
      setError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate(-1); // Navigate to the previous page
  };

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error loading categories!</div>}

      {!isLoading && !error &&
        <form className="menu-item-form" onSubmit={handleSubmit}>
          <h2>Add a new product</h2>

          {showErrorAlert && <Alert variant="danger">Failed to save product. {errorMessage}</Alert>}

          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

          <label>Price:</label>
          <input
            type="number"
            name="price"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <label>Image URL:</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
          />

          <label>Category:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>

          <label>
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
            />
            Is Featured
          </label>

          <label>Ingredients (comma-separated):</label>
          <input
            type="text"
            name="ingridiens"
            value={formData.ingridiens}
            onChange={handleChange}
          />

          <label>
            <input
              type="checkbox"
              name="isVegetarian"
              checked={formData.isVegetarian}
              onChange={handleChange}
            />
            Is Vegetarian
          </label>

          <label>
            <input
              type="checkbox"
              name="isGlutenFree"
              checked={formData.isGlutenFree}
              onChange={handleChange}
            />
            Is Gluten-Free
          </label>

          <label>
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
            />
            Is Available
          </label>

          <button type="submit">Save Menu Item</button>
        </form>
      }

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Product added successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSuccessModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddProduct;
