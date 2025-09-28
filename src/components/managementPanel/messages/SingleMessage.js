import { useParams } from "react-router-dom";
import { useFetch } from "../../../hooks/useFetch.js";
import api from "../../../utils/axios.js";
import { useEffect, useState } from "react";
import { useUnreadMessages } from "../../../context/UnreadMessagesProvider";
import { TextInput, Textarea, Button, Center, Loader } from "@mantine/core";
import { useForm } from "@mantine/form";
import "./singleMessage.scss";
import ConfirmationModal from '../../ConfirmationModal';
import ErrorMessage from "../../ErrorMessage";

export default function SingleMessage() {
  const { id } = useParams();
  const { data, loading, error: errorFetchMessages } = useFetch(`/messages/${id}`);
  const [showReply, setShowReply] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorDeleteMessage, setErrorDeleteMessage] = useState(null);
  const [errorReplyMessage, setErrorReplyMessage] = useState(null);
  const { refetchUnreadCount } = useUnreadMessages();

  const replyForm = useForm({
    initialValues: { subject: "", body: "" },
    validate: {
      subject: (value) => (value.trim() ? null : "Subject is required"),
      body: (value) => (value.trim() ? null : "Message body is required"),
    },
    validateInputOnBlur: true,
  });

  useEffect(() => {
    refetchUnreadCount();
  }, []);

  const handleBack = () => window.history.back();

  const handleDelete = async (messageId) => {
    try {
      await api.delete(`/messages/${messageId}`);
      handleBack();
    } catch (err) {
      setErrorDeleteMessage(err.response?.data?.error || err.message);
    }
  };

  const handleSendReply = async (values) => {
    try {
      await api.post("/messages/reply", {
        originalMessageId: id,
        name: "Admin",
        email: data.email,
        subject: values.subject,
        body: values.body,
        type: "sent",
      });
      setShowReply(false);
      replyForm.reset();
    } catch (err) {
      setErrorReplyMessage(err.response?.data?.error || err.message);
    }
  };

  if (loading) {
    return (
      <Center className="single-message__center">
        <Loader size="md" />
      </Center>
    );
  }

  return (
    <div className="single-message">

      {errorDeleteMessage && <ErrorMessage message={errorDeleteMessage} />}
      {errorReplyMessage && <ErrorMessage message={errorReplyMessage} />}
      {errorFetchMessages && <ErrorMessage message={errorFetchMessages} />}

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

          <div className="buttons-group">
            <button
              className="button-panel button-panel--delete"
              onClick={() => setShowModal(true)}
            >
              Delete
            </button>
            <button className="button-panel" onClick={handleBack}>
              Back
            </button>
            {data.type === "received" && (
              <button
                className="button-panel"
                onClick={() => {
                  setShowReply(!showReply);
                  replyForm.setFieldValue("subject", `Re: ${data.subject}`);
                }}
              >
                {showReply ? "Cancel" : "Reply"}
              </button>
            )}
          </div>

          {showReply && (
            <form
              className="single-message__reply-form"
              onSubmit={replyForm.onSubmit(handleSendReply)}
            >
              <TextInput
                label="Subject"
                placeholder="Reply subject"
                {...replyForm.getInputProps("subject")}
                classNames={{
                  input: replyForm.errors.subject
                    ? "single-message__input--error"
                    : "",
                }}
              />

              <Textarea
                label="Message"
                placeholder="Write your reply..."
                minRows={6}
                {...replyForm.getInputProps("body")}
                classNames={{
                  input: replyForm.errors.body
                    ? "single-message__input--error"
                    : "",
                }}
              />

              <button className="button-panel" type="submit">
                Send
              </button>
            </form>
          )}
        </>
      )}

      {showModal && (
        <ConfirmationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={() => handleDelete(id)}
          message="Are you sure you want to delete this message?"
        />
      )}
    </div>
  );
}
