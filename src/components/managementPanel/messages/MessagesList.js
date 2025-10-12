import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../../utils/axios';
import { useUnreadMessages } from '../../../context/UnreadMessagesProvider';
import { Loader, TextInput, Select, Button } from '@mantine/core';
import { IconTrash, IconSortAscending, IconSortDescending, IconSearch, IconEdit } from '@tabler/icons-react';
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
    const [expandedCardId, setExpandedCardId] = useState(null);

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

    const handleSortChange = (newSortBy, newSortOrder) => {
        const params = new URLSearchParams(location.search);
        params.set('sortBy', newSortBy);
        params.set('sortOrder', newSortOrder);
        params.delete('page');
        navigate('?' + params.toString());
    };

    const handleSortCriteriaChange = (value) => {
        const currentOrder = sortOrder || 'asc';
        handleSortChange(value, currentOrder);
    };

    const handleSortOrderChange = (value) => {
        const currentCriteria = sortCriteria || 'createdAt';
        handleSortChange(currentCriteria, value);
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

    const toggleCardExpansion = (id) => {
        setExpandedCardId(prevId => (prevId === id ? null : id));
    };

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

    const sortOptions = [
        { value: 'name', label: 'Name' },
        { value: 'email', label: 'Email' },
        { value: 'subject', label: 'Subject' },
        { value: 'type', label: 'Type' },
        { value: 'createdAt', label: 'Date' },
    ];

    const sortOrderOptions = [
        { value: 'asc', label: 'Ascending' },
        { value: 'desc', label: 'Descending' },
    ];

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
            
            <div className="messages-list__mobile-sort-controls">
                <Select
                    placeholder="Sort by"
                    data={sortOptions}
                    value={sortCriteria}
                    onChange={handleSortCriteriaChange}
                />
                <Select
                    placeholder="Order"
                    data={sortOrderOptions}
                    value={sortOrder}
                    onChange={handleSortOrderChange}
                />
            </div>

            {errorDeleteMessages && <ErrorMessage message={errorDeleteMessages} />}
            {errorFetchMessages && <ErrorMessage message={errorFetchMessages} />}
            
            {isLoading ? (
                <div className="messages-list-loading">
                    <Loader size="sm" variant="dots" />
                    <span>Loading...</span>
                </div>
            ) : messages.length ? (
                <>
                    <div className="messages-list-table-wrapper">
                        <table className="messages-list-table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th onClick={(e) => handleSortChange('name', sortOrder === 'desc' ? 'asc' : 'desc')} data-name="name">Name <SortIcon criteria="name" /></th>
                                    <th onClick={(e) => handleSortChange('email', sortOrder === 'desc' ? 'asc' : 'desc')} data-name="email">Email <SortIcon criteria="email" /></th>
                                    <th onClick={(e) => handleSortChange('subject', sortOrder === 'desc' ? 'asc' : 'desc')} data-name="subject">Subject <SortIcon criteria="subject" /></th>
                                    <th onClick={(e) => handleSortChange('type', sortOrder === 'desc' ? 'asc' : 'desc')} data-name="type">Type <SortIcon criteria="type" /></th>
                                    <th onClick={(e) => handleSortChange('createdAt', sortOrder === 'desc' ? 'asc' : 'desc')} data-name="createdAt">Date <SortIcon criteria="createdAt" /></th>
                                </tr>
                            </thead>
                            <tbody>{rows}</tbody>
                        </table>
                    </div>

                    <div className="messages-list__cards-group">
                        {messages.map((msg) => {
                            const isExpanded = expandedCardId === msg._id;
                            return (
                                <div key={msg._id} className={`messages-list__card ${isExpanded ? 'messages-list__card--expanded' : ''}`} onClick={() => toggleCardExpansion(msg._id)} style={{ fontWeight: msg.isRead ? 'normal' : 'bold' }}>
                                    <div className="messages-list__card-header">
                                        <input
                                            type="checkbox"
                                            checked={selectedMessages.includes(msg._id)}
                                            onClick={e => e.stopPropagation()}
                                            onChange={(e) => handleCheckboxChange(msg._id, e.currentTarget.checked)}
                                        />
                                        <span className="messages-list__card-name">{msg.name}</span>
                                        <span className="messages-list__card-number">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    {isExpanded && (
                                        <div className="messages-list__card-details">
                                            <div className="messages-list__card-row">
                                                <span className="messages-list__card-label">Email:</span>
                                                <span className="messages-list__card-value">{msg.email}</span>
                                            </div>
                                            <div className="messages-list__card-row">
                                                <span className="messages-list__card-label">Subject:</span>
                                                <span className="messages-list__card-value">{msg.subject}</span>
                                            </div>
                                            <div className="messages-list__card-row">
                                                <span className="messages-list__card-label">Type:</span>
                                                <span className="messages-list__card-value">{msg.type}</span>
                                            </div>
                                            <div className="messages-list__card-actions">
                                                <button
                                                    className="messages-list__card-button-edit"
                                                    onClick={(e) => { e.stopPropagation(); handleRowClick(msg._id); }}
                                                >
                                                    <IconEdit size={16} /> View
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </>
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