import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import api from '../../../utils/axios';
import { useUnreadMessages } from '../../../context/UnreadMessagesProvider';
import {
    Button,
    Group,
    Center,
    Flex,
    TextInput,
    Table,
    Container,
    Text,
    Loader,
    Stack,
    ScrollArea,
    Select,
    Checkbox,
    Pagination
} from '@mantine/core';
import { modals } from '@mantine/modals';

const MessagesList = () => {
    const [messages, setMessages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchString, setSearchString] = useState('');
    const [sortCriteria, setSortCriteria] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [typeFilter, setTypeFilter] = useState('received');
    const [selectedMessages, setSelectedMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { unreadMessageCount, refetchUnreadCount } = useUnreadMessages();

    const getMessages = async () => {
        const params = new URLSearchParams(location.search);
        try {
            setIsLoading(true);
            const res = await api.get(`/messages?${params.toString()}`);
            const data = res.data;
            setMessages(data.messages);
            setTotalPages(data.totalPages);
            setCurrentPage(data.currentPage);
        } catch (err) {
            setErrorMessage(err.response?.data?.error || 'Error fetching messages');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSearchChange = (e) => {
        const { value } = e.currentTarget;
        setSearchString(value);
        const params = new URLSearchParams(location.search);
        params.set('search', value);
        params.set('page', '1');
        navigate('?' + params.toString());
    };

    const handleSort = (e) => {
        const { name } = e.currentTarget.dataset;
        const params = new URLSearchParams(location.search);
        const currentOrder = params.get('sortOrder') === 'desc' ? 'asc' : 'desc';
        params.set('sortBy', name);
        params.set('sortOrder', currentOrder);
        params.delete('page');
        navigate('?' + params.toString());
    };

    const handleTypeFilter = (value) => {
        setTypeFilter(value);
        const params = new URLSearchParams(location.search);
        value === 'all' ? params.delete('type') : params.set('type', value);
        params.delete('page');
        navigate('?' + params.toString());
    };

    const handleCheckboxChange = (id, checked) => {
        if (checked) {
            setSelectedMessages([...selectedMessages, id]);
        } else {
            setSelectedMessages(selectedMessages.filter((msgId) => msgId !== id));
        }
    };

    const openDeleteModal = (selectedMessages) => {
        modals.openConfirmModal({
            title: 'Please confirm your action',
            size: 'sm',
            radius: 'md',
            withCloseButton: false,
            children: (
                <Text size="sm">
                    Do you really want to delete this element?.
                </Text>
            ),
            labels: { confirm: 'Confirm', cancel: 'Cancel' },
            onCancel: () => console.log('Cancel'),
            onConfirm: () => deleteSelected(selectedMessages),

        })
    }

    const deleteSelected = async () => {
        try {
            await api.post(`/messages/delete-many`, { ids: selectedMessages });
            setSelectedMessages([]);
            getMessages();
        } catch (err) {
            console.error('Failed to delete messages', err);
        }
    };

    const handleRowClick = (_id) => {
        navigate(`${_id}`);
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
        setTypeFilter(params.get('type') || 'all');
        getMessages();
    }, [location.search]);

    useEffect(() => {
        refetchUnreadCount();
    },[unreadMessageCount]);

    return (
        <Container fluid>
            <Stack spacing="md">
                <Text size="xl" fw={600}>Messages</Text>
                <Flex wrap="wrap" gap="md" justify="space-between" align="center">
                    <Flex gap="sm">
                        <TextInput
                            value={searchString}
                            onChange={handleSearchChange}
                            placeholder="Search messages..."
                        />
                        <Select
                            value={typeFilter}
                            onChange={handleTypeFilter}
                            data={[
                                { value: 'received', label: 'Received' },
                                { value: 'sent', label: 'Sent' },
                            ]}
                        />
                        <Button color="red" disabled={!selectedMessages.length} onClick={() => openDeleteModal(selectedMessages)}>Delete selected</Button>
                    </Flex>
                </Flex>
            </Stack>

            {isLoading ? (
                <Center style={{ height: '70vh' }}>
                    <Loader size="md" variant="dots" />
                </Center>
            ) : errorMessage ? (
                <Text color="red">{errorMessage}</Text>
            ) : messages.length ? (
                <ScrollArea>
                    <Table striped highlightOnHover withTableBorder mt="md" verticalSpacing="sm" fontSize="sm">
                        <thead>
                            <tr>
                                <th></th>
                                <th data-name="name" onClick={handleSort} style={{ cursor: 'pointer' }}>Name <SortArrow criteria="name" /></th>
                                <th data-name="email" onClick={handleSort} style={{ cursor: 'pointer' }}>Email <SortArrow criteria="email" /></th>
                                <th data-name="subject" onClick={handleSort} style={{ cursor: 'pointer' }}>Subject <SortArrow criteria="subject" /></th>
                                <th data-name="type" onClick={handleSort} style={{ cursor: 'pointer' }}>Type <SortArrow criteria="type" /></th>
                                <th data-name="createdAt" onClick={handleSort} style={{ cursor: 'pointer' }}>Date <SortArrow criteria="createdAt" /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map((msg) => (
                                <tr key={msg._id} onClick={() => handleRowClick(msg._id)} style={{ cursor: 'pointer' , fontWeight: msg.isRead ? 'normal' : 'bold'  }}>
                                    <td>
                                        <Checkbox
                                            checked={selectedMessages.includes(msg._id)}
                                            onClick={e => e.stopPropagation()}
                                            onChange={(e) => handleCheckboxChange(msg._id, e.currentTarget.checked)}
                                            
                                        />
                                    </td>
                                    <td>{msg.name}</td>
                                    <td>{msg.email}</td>
                                    <td>{msg.subject}</td>
                                    <td>{msg.type}</td>
                                    <td>{new Date(msg.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </ScrollArea>
            ) : (
                <Text mt="md">No messages found.</Text>
            )}

            <Center mt="lg">
                <Pagination
                    total={totalPages}
                    value={currentPage}
                    onChange={(page) => {
                        const params = new URLSearchParams(location.search);
                        params.set('page', page);
                        navigate('?' + params.toString());
                    }}
                    withEdges
                    siblings={1}
                    boundaries={1}
                />
            </Center>
        </Container>
    );
};

export default MessagesList;
