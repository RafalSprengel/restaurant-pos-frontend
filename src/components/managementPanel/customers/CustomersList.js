import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useAuth } from '../../../context/authContext';
import api from '../../../utils/axios';
import {
  Group,
  Button,
  Center,
  Alert,
  Modal,
  Pagination,
  TextInput,
  Table,
  Text,
  Loader
} from '@mantine/core';

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
      setLoading(true);
      const response = await api.get(`/customers/${queryString}`);
      if (response.status === 200) {
        const data = response.data;
        setCustomers(data.customers);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      } else {
        setError(`Server error: ${response.data.error}`);
      }
    } catch (err) {
      setError(err.response ? err.response.data.error : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (id) => {
    navigate(`${id}`);
  };

  const deleteCustomer = async () => {
    try {
      const res = await api.delete(`/customers/${customerIdToDelete}`);
      if (res.status !== 200) {
        setError(`Error: ${res.data.error || 'Unable to delete customer'}`);
      }
    } catch (e) {
      if (e.response) {
        setError(`Error: ${e.response.data.error || 'Unknown error'}`);
      } else {
        setError('Error: Unable to delete customer.');
      }
    } finally {
      setShowModal(false);
      if (!error) {
        fetchCustomers();
      }
    }
  };

  const handleConfirmDelete = (e, id) => {
    e.stopPropagation();
    setCustomerIdToDelete(id);
    setShowModal(true);
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
    if (currentOrder !== 'desc') {
      params.set('sortOrder', 'desc');
    } else {
      params.set('sortOrder', 'asc');
    }
    params.delete('page');
    params.set('sortBy', name);
    navigate('?' + params);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(location.search);
    params.set('page', page);
    navigate('?' + params.toString());
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchFromUrl = params.get('search');
    const sortByFromUrl = params.get('sortBy');
    const sortOrderFromUrl = params.get('sortOrder');
    setSortOrder(sortOrderFromUrl || '');
    setSortCriteria(sortByFromUrl || '');
    setSearchString(searchFromUrl || '');
  }, [location.search]);

  useEffect(() => {
    fetchCustomers();
  }, [searchParams, searchString, sortCriteria, sortOrder]);

  const SortArrow = ({ criteria }) => {
    const arrow = () => {
      if (criteria === sortCriteria) return sortOrder === 'desc' ? '▼' : '▲';
      else return '•';
    };
    return <>{arrow()}</>;
  };

  if (loading) {
    return (
      <Center style={{ height: '60vh' }}>
        <Loader size="md" />
      </Center>
    );
  }

  return (
    <>
      <Text size="xl" weight={700} mb="md">Customers</Text>
      <Group position="apart" mb="md">
        {isVisible.addNewButt && (
          <Button onClick={() => navigate('/management/add-customer')}>Add customer</Button>
        )}
        <Group spacing="xs">
          <Text>find customer:</Text>
          <TextInput
            placeholder="search..."
            value={searchString}
            onChange={handleSearchChange}
          />
        </Group>
      </Group>

      {error && (
        <Alert title="Error" color="red" mb="md">
          {error}
        </Alert>
      )}

      {customers.length > 0 ? (
        <>
          <Table striped highlightOnHover withBorder>
            <thead>
              <tr>
                <th data-name="customerNumber" onClick={handleSort}>
                  No <SortArrow criteria="customerNumber" />
                </th>
                <th data-name="name" onClick={handleSort}>
                  Name <SortArrow criteria="name" />
                </th>
                <th data-name="surname" onClick={handleSort}>
                  Surname <SortArrow criteria="surname" />
                </th>
                <th data-name="email" onClick={handleSort}>
                  Email <SortArrow criteria="email" />
                </th>
                <th data-name="orders" onClick={handleSort}>
                  Orders <SortArrow criteria="orders" />
                </th>
                <th data-name="createdAt" onClick={handleSort}>
                  Created <SortArrow criteria="createdAt" />
                </th>
                <th data-name="isRegistered" onClick={handleSort}>
                  Registered <SortArrow criteria="isRegistered" />
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => {
                const formattedDate = dayjs(customer.createdAt).format('DD/MM/YYYY');
                return (
                  <tr key={customer._id} onClick={() => handleRowClick(customer._id)} style={{ cursor: 'pointer' }}>
                    <td>{customer.customerNumber}</td>
                    <td>{customer.name}</td>
                    <td>{customer.surname}</td>
                    <td>{customer.email}</td>
                    <td>{customer.amountOfOrders}</td>
                    <td>{formattedDate}</td>
                    <td>{customer.isRegistered ? 'Yes' : 'No'}</td>
                    <td>
                      {isVisible.deleteButt && (
                        <Button color="red" size="xs" onClick={(e) => handleConfirmDelete(e, customer._id)}>
                          Delete
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <Center mt="md">
            <Pagination total={totalPages} page={currentPage} onChange={handlePageChange} />
          </Center>
        </>
      ) : (
        <Alert color="blue" title="Info">No customers found.</Alert>
      )}

      <Modal opened={showModal} onClose={() => setShowModal(false)} title="Confirm Deletion" centered>
        <Text>Are you sure you want to delete this customer?</Text>
        <Group position="apart" mt="md">
          <Button variant="default" onClick={() => setShowModal(false)}>Close</Button>
          <Button color="red" onClick={deleteCustomer}>Confirm Delete</Button>
        </Group>
      </Modal>
    </>
  );
};

export default CustomersList;
