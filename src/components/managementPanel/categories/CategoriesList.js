import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../../hooks/useFetch.js';
import api from '../../../utils/axios.js';
import { useAuth } from '../../../context/authContext.js';

const CategoriesList = () => {
     const [deletingError, setDeletingErrors] = useState(null);
     const { data: categoryList, loading: loadingCategory, error: fetchError, refetch } = useFetch('/product-categories/');
     const navigate = useNavigate();
     const { user } = useAuth('staff');
     const rolePermissions = {
          admin: { addNewButt: true, deleteButt: true },
          moderator: { addNewButt: true, deleteButt: true },
          member: { addNewButt: false, deleteButt: false },
     };

     const isVisible = rolePermissions[user.role] || { addNewButt: false, deleteButt: false };

     const handleRowClick = (id) => {
          navigate(`${id}`);
     };

     const handleDelete = async (e, id) => {
          e.stopPropagation();
          if (!window.confirm('Are you sure you want to delete this category?')) return;
          setDeletingErrors(null);
          try {
               const response = await api.delete(`/product-categories/${id}`);
               if (response.status === 200) {
                    refetch();
               } else {
                    const errorMessage = response.data?.error || 'Unknown error';
                    console.error('Failed to delete category:', errorMessage);
                    throw new Error(errorMessage);
               }
          } catch (error) {
               if (error.response) {
                    const errorMessage = error.response.data?.error || 'Error deleting category';
                    console.error('Server response error:', errorMessage);
                    setDeletingErrors(errorMessage);
               } else {
                    console.error('Network error:', error);
                    setDeletingErrors('Network error. Please check your connection.');
               }
          }
     };

     const Row = ({ el }) => (
          <tr onClick={() => handleRowClick(el._id)}>
               <td>{el.name}</td>
               <td>
                    <img src={el.image || 'path/to/default-image.jpg'} className="admin__categoryImg" alt="Category" />
               </td>
               <td>{el.index}</td>
               <td>
                    {isVisible.deleteButt && (
                         <button className="btn btn-danger" onClick={(e) => handleDelete(e, el._id)}>
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
               {isVisible.addNewButt && (
                    <button className="btn btn-primary" onClick={() => navigate('/management/add-category')}>
                         Add new..
                    </button>
               )}
               {categoryList?.length > 0 ? (
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
               ) : loadingCategory ? (
                    <h4>Loading...</h4>
               ) : deletingError ? (
                    <p style={{ color: 'red' }}>{deletingError}</p>
               ) : fetchError ? (
                    <p style={{ color: 'red' }}>{fetchError.toString()}</p>
               ) : (
                    <> No categories Found</>
               )}
          </>
     );
};

export default CategoriesList;
