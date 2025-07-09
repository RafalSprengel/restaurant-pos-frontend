import { useParams } from 'react-router-dom';
import { Button, Group, Text, Textarea, TextInput, Stack } from "@mantine/core";
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
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
  const { unreadMessageCount, refetchUnreadCount } = useUnreadMessages();

  const handleBack = () => {
    window.history.back();
  };

  const openDeleteModal = (id) => {
    modals.openConfirmModal({
      title: 'Please confirm your action',
      size: 'sm',
      radius: 'md',
      withCloseButton: false,
      children: (
        <Text size="sm">
          Do you really want to delete this message?
        </Text>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => { },
      onConfirm: () => handleDelete(id),
    });
  };

  const openSuccessNotification = (msg = 'Message deleted!') => {
    notifications.show({
      title: 'Success',
      message: msg,
      color: 'green',
    });
  };

  const openErrorNotification = (msg = 'Cannot perform action!') => {
    notifications.show({
      title: 'Error',
      message: msg,
      color: 'red',
      autoClose: 4000,
      withCloseButton: true,
    });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/messages/${id}`);
      openSuccessNotification();
      handleBack();
    } catch (err) {
      openErrorNotification();
    }
  };

  const handleSendReply = async () => {
    if (!replySubject.trim() || !replyBody.trim()) {
      openErrorNotification('Subject and body are required.');
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

      openSuccessNotification('Reply sent successfully!');
      setShowReply(false);
      setReplySubject('');
      setReplyBody('');
    } catch (err) {
      openErrorNotification('Failed to send reply.');
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

        <Group justify="center" spacing="md" mt="md">
          <Button variant="default" onClick={handleBack}>
            Back
          </Button>
          <Button color="red" onClick={() => openDeleteModal(id)}>
            Delete
          </Button>
          {data.type === 'received' && (
            <Button onClick={() => {
              setShowReply(!showReply);
              setReplySubject(`Re: ${data.subject}`);
            }}>
              {showReply ? 'Cancel' : 'Reply'}
            </Button>
          )}
        </Group>

        {showReply && (
          <Stack mt="xl">
            <TextInput
              label="Subject"
              value={replySubject}
              onChange={(e) => setReplySubject(e.currentTarget.value)}
            />
            <Textarea
              label="Message"
              value={replyBody}
              onChange={(e) => setReplyBody(e.currentTarget.value)}
              minRows={6}
            />
            <Button onClick={handleSendReply}>Send</Button>
          </Stack>
        )}
      </>
    )}
  </div>
);
};

export default SingleMessage;
