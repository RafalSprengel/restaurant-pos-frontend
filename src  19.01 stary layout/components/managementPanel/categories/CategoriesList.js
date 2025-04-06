import React, { useState } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../../hooks/useFetch.js';
import Stack from 'react-bootstrap/Stack';
import api from '../../../utils/axios.js';
import { useAuth } from '../../../context/authContext.js';

const CategoriesList = () => {
     const [deletingError, setDeletingErrors] = useState(null);
     const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);
     const [showModal, setShowModal] = useState(false);
     const [selectedImage, setSelectedImage] = useState(null);
     const { data: categoryList, loading: loadingCategory, error: fetchError, refetch } = useFetch('/product-categories/');
     const navigate = useNavigate();
     const { user } = useAuth('staff');
     const rolePermissions = {
          admin: { addNewButt: true, deleteButt: true },
          moderator: { addNewButt: true, deleteButt: true },
          member: { addNewButt: false, deleteButt: false },
     };

     const isVisible = rolePermissions[user.role] || { addNewButt: false, deleteButt: false };

     const handleImageClick = (imageUrl) => {
          setSelectedImage(imageUrl);
     };

     const handleCloseModal = () => {
          setSelectedImage(null);
     };

     const handleRowClick = (id) => {
          navigate(`${id}`);
     };

     const handleConfirmDelete = (e, id) => {
          e.stopPropagation();
          setCategoryIdToDelete(id);
          setShowModal(true);
     };

     const deleteCategory = async () => {
          setDeletingErrors(null);
          try {
               const response = await api.delete(`/product-categories/${categoryIdToDelete}`);
               if (response.status === 200) {
                    refetch();
               } else {
                    const errorMessage = response.data?.error || 'Nieznany błąd';
                    console.error('Nie udało się usunąć kategorii:', errorMessage);
                    throw new Error(errorMessage);
               }
          } catch (error) {
               if (error.response) {
                    const errorMessage = error.response.data?.error || 'Błąd podczas usuwania kategorii';
                    console.error('Błąd odpowiedzi serwera:', errorMessage);
                    setDeletingErrors(errorMessage);
               } else {
                    console.error('Błąd sieciowy:', error);
                    setDeletingErrors('Błąd sieciowy. Sprawdź połączenie.');
               }
          } finally {
               setShowModal(false);
          }
     };

     const Row = ({ el }) => (
          <tr onClick={() => handleRowClick(el._id)}>
               <td>{el.name}</td>
               <td>
                    <img
                         src={el.image || 'path/to/default-image.jpg'} // Domyślny obraz, jeśli brak
                         className="admin__categoryImg"
                         onClick={() => handleImageClick(el.image)}
                         style={{ cursor: 'pointer' }}
                         alt="Category"
                    />
               </td>
               <td>{el.index}</td>
               <td>
                    {isVisible.deleteButt && (
                         <button className="btn btn-danger" onClick={(e) => handleConfirmDelete(e, el._id)}>
                              Delete
                         </button>
                    )}
               </td>
          </tr>
     );

     const categoriesRows = categoryList?.map((el) => <Row key={el._id} el={el} />);

     return (
          <>
               <h3>Categories</h3>
               <Stack direction="horizontal" gap={3}>
                    <div className="p-2">
                         {isVisible.addNewButt && (
                              <button className="btn btn-primary" onClick={() => navigate('/management/add-category')}>
                                   Add new..
                              </button>
                         )}
                    </div>
                    <div className="p-2 ms-auto"></div>
                    <div className="p-2 ms-auto"></div>
               </Stack>

               {categoryList?.length > 0 ? (
                    <>
                         <table>
                              <thead>
                                   <tr>
                                        <th>Name</th>
                                        <th>Image</th>
                                        <th>Index</th>
                                        <th>Options</th>
                                   </tr>
                              </thead>
                              <tbody>{categoriesRows}</tbody>
                         </table>
                    </>
               ) : loadingCategory ? (
                    <h4>Loading...</h4>
               ) : deletingError ? (
                    <Alert variant="danger">{deletingError}</Alert>
               ) : fetchError ? (
                    <Alert variant="danger">{fetchError.toString()}</Alert>
               ) : (
                    <> No categories Found</>
               )}
               {/* Modal for confirmation */}
               <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                         <Modal.Title>Confirm Deletion</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this category?</Modal.Body>
                    <Modal.Footer>
                         <Button variant="secondary" onClick={() => setShowModal(false)}>
                              Cancel
                         </Button>
                         <Button variant="primary" onClick={deleteCategory}>
                              Delete
                         </Button>
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
                         <Button variant="secondary" onClick={handleCloseModal}>
                              Close
                         </Button>
                    </Modal.Footer>
               </Modal>
          </>
     );
};

export default CategoriesList;
