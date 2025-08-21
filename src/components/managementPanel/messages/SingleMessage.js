import { useParams } from "react-router-dom";
import { useFetch } from "../../../hooks/useFetch.js";
import api from "../../../utils/axios.js";
import { useEffect, useState } from "react";
import { useUnreadMessages } from "../../../context/UnreadMessagesProvider";
import { Button, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import "./singleMessage.scss";

const SingleMessage = () => {
  const { id } = useParams();
  const { data, loading, error } = useFetch(`/messages/${id}`);
  const [showReply, setShowReply] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { refetchUnreadCount } = useUnreadMessages();

  const replyForm = useForm({
    initialValues: { subject: "", body: "" },
    validate: {
      subject: (value) => (value.trim().length ? null : "Subject is required"),
      body: (value) => (value.trim().length ? null : "Message body is required"),
    },
    validateInputOnBlur: true,
  });

  const handleBack = () => window.history.back();

  const handleDelete = async (id) => {
    try {
      await api.delete(`/messages/${id}`);
      handleBack();
    } catch (err) {
      console.log(err);
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
      console.log(err);
    }
  };

  useEffect(() => {
    refetchUnreadCount();
  }, []);

  return (
    <div className="single-message">
      {loading && <p className="single-message__loading">Loading...</p>}
      {error && <p className="single-message__error">Error: {error.message}</p>}

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
            <Button variant="default" onClick={handleBack}>
              Back
            </Button>
            <Button color="red" onClick={() => setShowModal(true)}>
              Delete
            </Button>
            {data.type === "received" && (
              <Button
                onClick={() => {
                  setShowReply(!showReply);
                  replyForm.setFieldValue("subject", `Re: ${data.subject}`);
                }}
              >
                {showReply ? "Cancel" : "Reply"}
              </Button>
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


              <Button type="submit">Send</Button>
            </form>
          )}
        </>
      )}

      {showModal && (
        <div className="single-message__modal">
          <div className="single-message__modal-content">
            <p>Are you sure you want to delete this message?</p>
            <div className="single-message__modal-buttons">
              <Button variant="default" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button color="red" onClick={() => handleDelete(id)}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleMessage;
