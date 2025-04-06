import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import api from '../../../utils/axios';
import { useAuth } from '../../../context/authContext';

const MgmtsList = () => {
     const [currentPage, setCurrentPage] = useState(1);
     const [errorMessage, setErrorMessage] = useState(null);
     const [isDeleting, setIsDeleting] = useState(false);
     const [isLoading, setIsLoading] = useState(true);
     const [staffList, setStaffList] = useState([]);
     const [searchString, setSearchString] = useState('');
     const [sortCriteria, setSortCriteria] = useState('');
     const [sortOrder, setSortOrder] = useState('');
     const [totalPages, setTotalPages] = useState(1);
     const [showModal, setShowModal] = useState(false);
     const [staffToDelete, setStaffToDelete] = useState(null);
     const navigate = useNavigate();
     const location = useLocation();
     const [searchParams] = useSearchParams();
     const { user } = useAuth('management');

     const rolePermissions = {
          admin: { addStaffButt: true, deleteStaffButt: true },
          moderator: { addStaffButt: true, deleteStaffButt: true },
          member: { addStaffButt: false, deleteStaffButt: false },
     };

     const isVisible = rolePermissions[user.role] || { addStaffButt: false, deleteStaffButt: false };

     const getStaff = async () => {
          const queryString = location.search;

          try {
               setErrorMessage(null);
               const response = await api.get(`/staff/${queryString}`);

               if (response.status === 200) {
                    const { staff, totalPages, currentPage } = response.data;
                    setStaffList(staff);
                    setTotalPages(totalPages);
                    setCurrentPage(currentPage);
               } else {
                    setErrorMessage(`Server error: ${response.data.error}`);
               }
          } catch (error) {
               console.error('Error fetching staff:', error);
               setErrorMessage(error.response ? error.response.data.error : error.message);
          } finally {
               setIsLoading(false);
          }
     };

     const handleRowClick = (id) => {
          navigate(`${id}`);
     };

     const handleDeleteClick = (event, id) => {
          event.stopPropagation();
          setStaffToDelete(id);
          setShowModal(true);
     };

     const handleConfirmDelete = async () => {
          setShowModal(false);
          setIsLoading(true);
          setIsDeleting(true);
          setErrorMessage(null);
          try {
               await deleteStaff(staffToDelete);
          } catch (error) {
               setErrorMessage('Failed to delete staff member. Please try again.');
               console.error('Error deleting staff:', error);
          } finally {
               setIsLoading(false);
               setIsDeleting(false);
          }
     };

     const deleteStaff = async (id) => {
          setErrorMessage(null);
          const response = await api.delete(`/staff/${id}`);
          if (response.status !== 200) {
               setErrorMessage(`Unable to delete this staff member`);
          }
     };

     const handlePageChange = (page) => {
          const params = new URLSearchParams(location.search);
          params.set('page', page);
          navigate('?' + params.toString());
     };

     const handleSearchChange = (e) => {
          const { value } = e.target;
          setSearchString(value);
          const params = new URLSearchParams(location.search);
          params.delete('page');
          value === '' ? params.delete('search') : params.set('search', value);
          navigate('?' + params);
     };

     const handleSort = (e) => {
          const { name } = e.currentTarget.dataset;
          const params = new URLSearchParams(location.search);
          const currentOrder = params.get('sortOrder');
          params.set('sortOrder', currentOrder === 'desc' ? 'asc' : 'desc');
          params.delete('page');
          params.set('sortBy', name);
          navigate('?' + params);
     };

     const SortArrow = ({ criteria }) => {
          const arrow = () => {
               if (criteria === sortCriteria) return sortOrder === 'desc' ? '▼' : '▲';
               else return '•';
          };
          return <>{arrow()}</>;
     };

     useEffect(() => {
          // Set search string and sort criteria from URL
          const params = new URLSearchParams(location.search);
          setSearchString(params.get('search') || '');
          setSortCriteria(params.get('sortBy') || '');
          setSortOrder(params.get('sortOrder') || '');
     }, [location.search]);

     useEffect(() => {
          getStaff();
     }, [isDeleting, searchParams, searchString, sortCriteria, sortOrder]);

     const staffRows = staffList.map((staff) => (
          <tr key={staff._id} onClick={() => handleRowClick(staff._id)}>
               <td>{staff.staffNumber}</td>
               <td>{`${staff.name} ${staff.surname || ''}`}</td>
               <td>{staff.email}</td>
               <td>{staff.role}</td>
               <td>{dayjs(staff.createdAt).format('HH:mm DD/MM/YY')}</td>
               <td className="admin__deleteElement">
                    {isVisible.deleteStaffButt && (
                         <button type="button" className="btn btn-danger" onClick={(e) => handleDeleteClick(e, staff._id)}>
                              Delete
                         </button>
                    )}
               </td>
          </tr>
     ));

     return (
          <>
               <h3>Staff Management</h3>
               <div style={{ display: 'flex', gap: '1rem' }}>
                    <div>
                         {isVisible.addStaffButt && (
                              <button className="btn-primary" onClick={() => navigate('/management/add-mgmt')}>
                                   Add new..
                              </button>
                         )}
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                         Find staff:
                         <input type="search" className="admin__searchInput" placeholder="Search..." onChange={handleSearchChange} value={searchString} />
                    </div>
               </div>

               {staffList.length > 0 ? (
                    <>
                         <table>
                              <thead>
                                   <tr>
                                        <th data-name="staffNumber" onClick={handleSort}>
                                             Number <SortArrow criteria="staffNumber" />
                                        </th>
                                        <th data-name="name" onClick={handleSort}>
                                             Name <SortArrow criteria="name" />
                                        </th>
                                        <th data-name="email" onClick={handleSort}>
                                             Email <SortArrow criteria="email" />
                                        </th>
                                        <th data-name="role" onClick={handleSort}>
                                             Role <SortArrow criteria="role" />
                                        </th>
                                        <th data-name="createdAt" onClick={handleSort}>
                                             Created At <SortArrow criteria="createdAt" />
                                        </th>
                                        <th>Options</th>
                                   </tr>
                              </thead>
                              <tbody>{staffRows}</tbody>
                         </table>
                         <div className="pagination">
                              <button onClick={() => handlePageChange(1)}>First</button>
                              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                   Prev
                              </button>
                              {[...new Array(totalPages)].map((el, index) => (
                                   <button key={index} className={index + 1 === currentPage ? 'active' : ''} onClick={() => handlePageChange(index + 1)}>
                                        {index + 1}
                                   </button>
                              ))}
                              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                                   Next
                              </button>
                              <button onClick={() => handlePageChange(totalPages)}>Last</button>
                         </div>
                    </>
               ) : isLoading ? (
                    <h4>Loading data...</h4>
               ) : errorMessage ? (
                    <div className="alert alert-danger">{errorMessage}</div>
               ) : (
                    <h4>No staff found</h4>
               )}

               {showModal && (
                    <div className="modal">
                         <div className="modal-content">
                              <span className="close" onClick={() => setShowModal(false)}>
                                   &times;
                              </span>
                              <h4>Confirm Deletion</h4>
                              <p>Are you sure you want to delete this staff member?</p>
                              <button onClick={() => setShowModal(false)}>Cancel</button>
                              <button onClick={handleConfirmDelete}>Delete</button>
                         </div>
                    </div>
               )}
          </>
     );
};

export default MgmtsList;
