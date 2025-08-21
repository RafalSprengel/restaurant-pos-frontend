import { useParams } from 'react-router-dom';
import { useFetch } from "../../../hooks/useFetch.js";
import api from '../../../utils/axios.js';
import { useEffect, useState } from 'react';
import "../../../styles/single-message.scss";
import { useUnreadMessages } from '../../../context/UnreadMessagesProvider';

const SingleMessage = () => {
  const { id } = useParams();
  const { data, loading, error } = useFetch(`/messages/${id}`);
  const [showReply, setShowReply] = useState(false);
  const [replySubject, setReplySubject] = useState('');
  const [replyBody, setReplyBody] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { unreadMessageCount, refetchUnreadCount } = useUnreadMessages();

  const handleBack = () => {
    window.history.back();
  };

  const openDeleteModal = () => {
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/messages/${id}`);
      handleBack();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSendReply = async () => {
    if (!replySubject.trim() || !replyBody.trim()) {
      return;
    }

    try {
      await api.post('/messages/reply', {
        originalMessageId: id,
        name: 'Admin',
        email: data.email,
        subject: replySubject,
        body: replyBody,
        type: 'sent',
      });

      setShowReply(false);
      setReplySubject('');
      setReplyBody('');
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    refetchUnreadCount();
  }, []);

return (
  <div className="single-message">
    {loading && <p>Loading...</p>}
    {error && <p>Error: {error.message}</p>}
    {data && (
      <>
        <h2 className="single-message__title">Message Details</h2>

        <div className="single-message__row">
          <span className="single-message__label">From:</span>
          <span className="single-message__value">{data.name}</span>
        </div>

        <div className="single-message__row">
          <span className="single-message__label">Email:</span>
          <span className="single-message__value">{data.email}</span>
        </div>

        <div className="single-message__row">
          <span className="single-message__label">Subject:</span>
          <span className="single-message__value">{data.subject}</span>
        </div>

        <div className="single-message__row">
          <span className="single-message__label">Date:</span>
          <span className="single-message__value">
            {new Date(data.createdAt).toLocaleString()}
          </span>
        </div>

        <div className="single-message__row">
          <span className="single-message__label">Type:</span>
          <span className="single-message__value">
            {data.type.charAt(0).toUpperCase() + data.type.slice(1)}
          </span>
        </div>

        <div className="single-message__row single-message__body">
          <span className="single-message__label">Message:</span>
          <p className="single-message__value">{data.body}</p>
        </div>

        <div className="single-message__buttons">
          <button className="single-message__button" onClick={handleBack}>
            Back
          </button>
          <button className="single-message__button single-message__button--delete" onClick={openDeleteModal}>
            Delete
          </button>
          {data.type === 'received' && (
            <button className="single-message__button" onClick={() => {
              setShowReply(!showReply);
              setReplySubject(`Re: ${data.subject}`);
            }}>
              {showReply ? 'Cancel' : 'Reply'}
            </button>
          )}
        </div>

        {showReply && (
          <div className="single-message__reply-form">
            <input
              type="text"
              className="single-message__reply-input"
              placeholder="Subject"
              value={replySubject}
              onChange={(e) => setReplySubject(e.currentTarget.value)}
            />
            <textarea
              className="single-message__reply-textarea"
              placeholder="Message"
              value={replyBody}
              onChange={(e) => setReplyBody(e.currentTarget.value)}
              rows={6}
            />
            <button className="single-message__button" onClick={handleSendReply}>Send</button>
          </div>
        )}
      </>
    )}
    {showModal && (
        <div className="single-message__modal">
          <div className="single-message__modal-content">
            <p>Are you sure you want to delete this message?</p>
            <div className="single-message__modal-buttons">
              <button className="single-message__button" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="single-message__button single-message__button--delete" onClick={() => handleDelete(id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
  </div>
);
};

export default SingleMessage;
