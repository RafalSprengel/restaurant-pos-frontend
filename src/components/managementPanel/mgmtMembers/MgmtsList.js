import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import api from '../../../utils/axios';
import { useAuth } from '../../../context/authContext';
import {
  Button,
  Container,
  Center,
  Table,
  TextInput,
  Modal,
  Notification,
  Group,
  Title,
  Stack,
  Loader,
  Pagination,
} from '@mantine/core';

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
    setIsLoading(true);
    const queryString = location.search;
    try {
      setErrorMessage(null);
      const response = await api.get(`/staff${queryString}`);
      if (response.status === 200) {
        const { staff, totalPages, currentPage } = response.data;
        setStaffList(staff);
        setTotalPages(totalPages);
        setCurrentPage(currentPage);
      } else {
        setErrorMessage(`Server error: ${response.data.error}`);
      }
    } catch (error) {
      setErrorMessage(error.response ? error.response.data.error : error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (id) => {
    navigate(`${id}`);
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setStaffToDelete(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowModal(false);
    setIsDeleting(true);
    setErrorMessage(null);
    try {
      const response = await api.delete(`/staff/${staffToDelete}`);
      if (response.status !== 200) {
        setErrorMessage('Unable to delete this staff member');
      } else {
        getStaff();
      }
    } catch (error) {
      setErrorMessage('Failed to delete staff member. Please try again.');
    } finally {
      setIsDeleting(false);
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
    navigate('?' + params.toString());
  };

  const handleSort = (e) => {
    const name = e.currentTarget.getAttribute('data-name');
    const params = new URLSearchParams(location.search);
    const currentOrder = params.get('sortOrder');
    params.set('sortOrder', currentOrder === 'desc' ? 'asc' : 'desc');
    params.delete('page');
    params.set('sortBy', name);
    navigate('?' + params.toString());
  };

  const SortArrow = ({ criteria }) => {
    if (criteria !== sortCriteria) return <>•</>;
    return sortOrder === 'desc' ? <>▼</> : <>▲</>;
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchString(params.get('search') || '');
    setSortCriteria(params.get('sortBy') || '');
    setSortOrder(params.get('sortOrder') || '');
  }, [location.search]);

  useEffect(() => {
    getStaff();
  }, [isDeleting, searchParams, searchString, sortCriteria, sortOrder]);

  return (
    <Container fluid>
      <Title order={3}>Staff Management</Title>
      <Group position="apart" mt="md" mb="md">
        {isVisible.addStaffButt && (
          <Button onClick={() => navigate('/management/add-mgmt')}>Add new..</Button>
        )}
        <TextInput
          placeholder="Search..."
          value={searchString}
          onChange={handleSearchChange}
          label="Find staff"
          style={{ maxWidth: 300 }}
        />
      </Group>

      {errorMessage && <Notification color="red" mb="md">{errorMessage}</Notification>}

      {isLoading ? (
        <Center style={{ height: '60vh' }}>
          <Loader />
        </Center>
      ) : staffList.length > 0 ? (
        <>
          <Table highlightOnHover withColumnBorders striped>
            <thead>
              <tr>
                <th data-name="staffNumber" onClick={handleSort} style={{ cursor: 'pointer' }}>
                  Number <SortArrow criteria="staffNumber" />
                </th>
                <th data-name="name" onClick={handleSort} style={{ cursor: 'pointer' }}>
                  Name <SortArrow criteria="name" />
                </th>
                <th data-name="email" onClick={handleSort} style={{ cursor: 'pointer' }}>
                  Email <SortArrow criteria="email" />
                </th>
                <th data-name="role" onClick={handleSort} style={{ cursor: 'pointer' }}>
                  Role <SortArrow criteria="role" />
                </th>
                <th data-name="createdAt" onClick={handleSort} style={{ cursor: 'pointer' }}>
                  Created At <SortArrow criteria="createdAt" />
                </th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff) => (
                <tr key={staff._id} onClick={() => handleRowClick(staff._id)} style={{ cursor: 'pointer' }}>
                  <td>{staff.staffNumber}</td>
                  <td>{`${staff.name} ${staff.surname || ''}`}</td>
                  <td>{staff.email}</td>
                  <td>{staff.role}</td>
                  <td>{dayjs(staff.createdAt).format('HH:mm DD/MM/YY')}</td>
                  <td>
                    {isVisible.deleteStaffButt && (
                      <Button color="red" size="xs" onClick={(e) => handleDeleteClick(e, staff._id)}>
                        Delete
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Center mt="md">
            <Pagination
              total={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              siblings={1}
              boundaries={1}
              size="md"
            />
          </Center>
        </>
      ) : (
        <Title order={4}>No staff found</Title>
      )}

      <Modal opened={showModal} onClose={() => setShowModal(false)} title="Confirm Deletion" centered>
        <Stack>
          <p>Are you sure you want to delete this staff member?</p>
          <Group position="apart">
            <Button onClick={() => setShowModal(false)}>Cancel</Button>
            <Button color="red" onClick={handleConfirmDelete}>Delete</Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

export default MgmtsList;
