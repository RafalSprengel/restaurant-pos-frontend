import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../../utils/axios';
import { useUnreadMessages } from '../../../context/UnreadMessagesProvider';
import { Loader, TextInput } from '@mantine/core';
import { IconTrash, IconSortAscending, IconSortDescending, IconSearch } from '@tabler/icons-react';
import './MessagesList.scss';
import ConfirmationModal from '../../ConfirmationModal';
import ErrorMessage from "../../ErrorMessage";

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
    const [isDeleting, setIsDeleting] = useState(false);
    const [errorFetchMessages, setErrorFetchMessages] = useState(null);
    const [errorDeleteMessages, setErrorDeleteMessages] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { unreadMessageCount, refetchUnreadCount } = useUnreadMessages();

    const getMessages = async () => {
        const params = new URLSearchParams(location.search);
        setErrorFetchMessages(null);
        try {
            setIsLoading(true);
            const res = await api.get(`/messages?${params.toString()}`);
            const data = res.data;
            setMessages(data.messages);
            setTotalPages(data.totalPages);
            setCurrentPage(data.currentPage);
        } catch (err) {
            setErrorFetchMessages(err.response?.data?.error || 'Error fetching messages');
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

    const openDeleteModal = () => {
        setErrorDeleteMessages(null);
        setShowModal(true);
    };

    const deleteSelected = async () => {
        setErrorDeleteMessages(null);
        try {
            setIsDeleting(true);
            await api.post(`/messages/delete-many`, { ids: selectedMessages });
            setSelectedMessages([]);
            setShowModal(false);
            await getMessages();
        } catch (err) {
            setErrorDeleteMessages(err.response?.data?.error || 'Failed to delete messages');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleRowClick = (_id) => navigate(`${_id}`);

    const SortIcon = ({ criteria }) => {
        if (criteria !== sortCriteria) return null;
        return sortOrder === 'desc' ? (
            <IconSortDescending size={16} className="messages-list-sort-icon" />
        ) : (
            <IconSortAscending size={16} className="messages-list-sort-icon" />
        );
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
    }, [unreadMessageCount]);

    const rows = messages.map((msg) => (
        <tr key={msg._id} onClick={() => handleRowClick(msg._id)} style={{ cursor: 'pointer', fontWeight: msg.isRead ? 'normal' : 'bold' }}>
            <td>
                <input
                    type="checkbox"
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
    ));

    return (
        <div className="messages-list-container">
            <div className="messages-list-header">
                <h2 className="messages-list-header__title">Messages</h2>
                <div className="messages-list-controls">
                    <div className="messages-list-controls__search-group">
                        <TextInput
                            placeholder="Search messages..."
                            value={searchString}
                            onChange={handleSearchChange}
                            leftSection={<IconSearch size={16} />}
                        />
                    </div>
                    <select className="messages-list-controls__select" value={typeFilter} onChange={(e) => handleTypeFilter(e.target.value)}>
                        <option value="all">All</option>
                        <option value="received">Received</option>
                        <option value="sent">Sent</option>
                    </select>
                    <button
                        className="messages-list-delete-button"
                        disabled={!selectedMessages.length || isDeleting}
                        onClick={openDeleteModal}
                    >
                        {isDeleting ? <Loader size={16} color="white" /> : <IconTrash size={16} />}
                        {isDeleting ? 'Deleting...' : 'Delete selected'}
                    </button>
                </div>
            </div>
            
            {errorDeleteMessages && <ErrorMessage message={errorDeleteMessages} />}
            {errorFetchMessages && <ErrorMessage message={errorFetchMessages} />}
            
            {isLoading ? (
                <div className="messages-list-loading">
                    <Loader size="sm" variant="dots" />
                    <span>Loading...</span>
                </div>
            ) : messages.length ? (
                <div className="messages-list-table-wrapper">
                    <table className="messages-list-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th onClick={handleSort} data-name="name">Name <SortIcon criteria="name" /></th>
                                <th onClick={handleSort} data-name="email">Email <SortIcon criteria="email" /></th>
                                <th onClick={handleSort} data-name="subject">Subject <SortIcon criteria="subject" /></th>
                                <th onClick={handleSort} data-name="type">Type <SortIcon criteria="type" /></th>
                                <th onClick={handleSort} data-name="createdAt">Date <SortIcon criteria="createdAt" /></th>
                            </tr>
                        </thead>
                        <tbody>{rows}</tbody>
                    </table>
                </div>
            ) : (
                <p className="messages-list-message">No messages found.</p>
            )}

            {totalPages > 1 && (
                <div className="messages-list-pagination">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            className={`messages-list-pagination-button ${currentPage === page ? 'messages-list-pagination-button--active' : ''}`}
                            onClick={() => {
                                const params = new URLSearchParams(location.search);
                                params.set('page', page);
                                navigate('?' + params.toString());
                            }}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}

            {showModal && (
                <ConfirmationModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onConfirm={deleteSelected}
                    message={`Do you really want to delete the selected messages? ${isDeleting ? ' (Deleting...)' : ''}`}
                />
            )}
        </div>
    );
};

export default MessagesList;