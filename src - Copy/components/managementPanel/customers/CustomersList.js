import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useAuth } from '../../../context/authContext';
import api from '../../../utils/axios';

const CustomersList = () => {
     const [customers, setCustomers] = useState([]);
     const [customerIdToDelete, setCustomerIdToDelete] = useState(null);
     const [showModal, setShowModal] = useState(false);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
     const [currentPage, setCurrentPage] = useState(1);
     const [totalPages, setTotalPages] = useState(1);
     const [searchString, setSearchString] = useState('');
     const [sortCriteria, setSortCriteria] = useState('');
     const [sortOrder, setSortOrder] = useState('');
     const { user } = useAuth('staff');
     const navigate = useNavigate();
     const location = useLocation();
     const [searchParams] = useSearchParams();

     const rolePermissions = {
          admin: { addNewButt: true, deleteButt: true },
          moderator: { addNewButt: true, deleteButt: true },
          member: { addNewButt: false, deleteButt: false },
     };

     const isVisible = rolePermissions[user.role] || { deleteButt: false };

     const fetchCustomers = async () => {
          const queryString = location.search;
          try {
               setError(null);
               const response = await api.get(`/customers/${queryString}`);
               if (response.status === 200) {
                    setCustomers(response.data.customers);
                    setTotalPages(response.data.totalPages);
                    setCurrentPage(response.data.currentPage);
               } else {
                    setError(`Server error: ${response.data.error}`);
               }
          } catch (err) {
               setError(err.response ? err.response.data.error : err.message);
          } finally {
               setLoading(false);
          }
     };

     const deleteCustomer = async () => {
          try {
               const res = await api.delete(`/customers/${customerIdToDelete}`);
               if (res.status !== 200) {
                    setError(`Error: ${res.data.error || 'Unable to delete customer'}`);
               }
          } catch (e) {
               setError(e.response ? `Error: ${e.response.data.error}` : 'Error: Unable to delete customer.');
          } finally {
               setShowModal(false);
               if (!error) {
                    fetchCustomers();
               }
          }
     };

     useEffect(() => {
          fetchCustomers();
     }, [searchParams, searchString, sortCriteria, sortOrder]);

     return (
          <>
               <h3>Customers</h3>
               <div>
                    {isVisible.addNewButt && <button onClick={() => navigate('/management/add-customer')}>Add customer</button>}
                    <input type="search" placeholder="search..." onChange={(e) => setSearchString(e.target.value)} value={searchString} />
               </div>
               {customers.length > 0 ? (
                    <table>
                         <thead>
                              <tr>
                                   <th>No</th>
                                   <th>Name</th>
                                   <th>Surname</th>
                                   <th>Email</th>
                                   <th>Orders</th>
                                   <th>Created</th>
                                   <th>Registered</th>
                                   <th>Actions</th>
                              </tr>
                         </thead>
                         <tbody>
                              {customers.map((customer) => (
                                   <tr key={customer._id}>
                                        <td>{customer.customerNumber}</td>
                                        <td>{customer.name}</td>
                                        <td>{customer.surname}</td>
                                        <td>{customer.email}</td>
                                        <td>{customer.amountOfOrders}</td>
                                        <td>{dayjs(customer.createdAt).format('DD/MM/YYYY')}</td>
                                        <td>{customer.isRegistered ? 'Yes' : 'No'}</td>
                                        <td>
                                             {isVisible.deleteButt && (
                                                  <button
                                                       onClick={() => {
                                                            setCustomerIdToDelete(customer._id);
                                                            setShowModal(true);
                                                       }}>
                                                       Delete
                                                  </button>
                                             )}
                                        </td>
                                   </tr>
                              ))}
                         </tbody>
                    </table>
               ) : (
                    <p>No customers found.</p>
               )}

               {showModal && (
                    <div className="modal">
                         <div className="modal-content">
                              <h4>Confirm Deletion</h4>
                              <p>Are you sure you want to delete this customer?</p>
                              <button onClick={() => setShowModal(false)}>Close</button>
                              <button onClick={deleteCustomer}>Confirm Delete</button>
                         </div>
                    </div>
               )}
          </>
     );
};

export default CustomersList;
