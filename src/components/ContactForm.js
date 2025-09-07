import React from 'react'
import { useState } from 'react'
import Modal from "../components/Modal";
import { useForm } from "@mantine/form";
import api from "../utils/axios";
import {
    TextInput,
    Textarea,
    Button,
    Grid
} from "@mantine/core";
import "../styles/contact-form.scss";


export default function ContactForm() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [sucessFullDetails, setSuccessfulDetails] = useState();
    const [errorDetails, setErrorDetails] = useState()
    const form = useForm({
        initialValues: {
            name: "",
            email: "",
            subject: '',
            message: "",
        },
        validate: {
            name: (value) => (value.trim() === "" ? "Name is required" : null),
            email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
            subject: (value) => (value.trim() === "" ? "Subject is required" : null),
            message: (value) => (value.trim() === "" ? "Message is required" : null),
        },

    })
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setErrorDetails(null)
        setSuccessfulDetails(null)
    };

    const handleSubmit = async (values) => {
        setIsLoading(true);
        setIsModalOpen(true);
        setErrorDetails(null);
        setSuccessfulDetails(null);

        try {
            const response = await api.post("/messages", {
                name: values.name,
                email: values.email,
                subject: values.subject,
                body: values.message,
            });

            if (response.status === 201) {
                form.reset();
                setSuccessfulDetails(response.data)

            }

        } catch (err) {
            console.error(
                "Reservation failed:",
                err.response?.data?.error || err.message
            );
            setErrorDetails(err.response?.data)
        }
        setIsLoading(false)
    };

    return (
        <div className='contact-form'>
            <div className='contact-form__header'>
                <h2 className="contact-form__title">Contact Us</h2>
                <p className="contact-form__subtitle">We would love to hear from you!</p>
                <p className="contact-form__text">Please fill out the form below and we will get back to you as soon as possible.</p>
                <p className="contact-form__text">You can also reach us at <a href="mailto:info@example.com">info@example.com</a>.</p>
            </div>

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Grid>
                    <Grid.Col span={{ base: 12, sm: 6, md: 6 }} >
                        <div data-aos="fade-up" data-aos-duration="400">
                            <TextInput
                                label="Your Name"
                                placeholder="Your Name"
                                value={form.values.name}
                                onChange={(e) => form.setFieldValue("name", e.target.value)}
                                error={form.errors.name}
                                styles={{
                                    input: {
                                        border: form.errors.name ? '1px solid red' : undefined,
                                    }
                                }}
                            />
                        </div>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <div data-aos="fade-up" data-aos-delay="100" data-aos-duration="400">
                            <TextInput
                                label="Your Email"
                                placeholder="Your Email"
                                type="email"
                                value={form.values.email}
                                onChange={(e) => form.setFieldValue("email", e.target.value)}
                                error={form.errors.email}
                                styles={{
                                    input: {
                                        border: form.errors.name ? '1px solid red' : undefined,
                                    }
                                }}
                            />
                        </div>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12 }}>
                        <div data-aos="fade-up" data-aos-delay="200" data-aos-duration="400">
                            <TextInput
                                label="Subject"
                                placeholder="Subject"
                                value={form.values.subject}
                                onChange={(e) => form.setFieldValue("subject", e.target.value)}
                                error={form.errors.subject}
                                styles={{
                                    input: {
                                        border: form.errors.name ? '1px solid red' : undefined,
                                    }
                                }}
                            />
                        </div>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12 }}>
                        <div data-aos="fade-up" data-aos-delay="300" data-aos-duration="400">
                            <Textarea
                                label="Your Message"
                                placeholder="Your Message"
                                rows={5}
                                value={form.values.message}
                                onChange={(e) => form.setFieldValue("message", e.target.value)}
                                styles={{
                                    input: {
                                        border: form.errors.name ? '1px solid red' : undefined,
                                    }
                                }}
                            />
                        </div>
                    </Grid.Col>

                </Grid>
                <div data-aos-delay="400" data-aos-duration="400" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <Button type="submit" className="btn-accent-primary contact-form__btn">
                        Send Message
                    </Button>
                </div>
            </form>
            <Modal isOpen={isModalOpen} close={() => setIsModalOpen(false)}>
                <div className="table-booking-form__modal-wrap">
                    {isLoading &&
                        <h4 className="table-booking-form__modal-header">Sending...</h4>
                    }
                    {sucessFullDetails &&
                        <h4 className="table-booking-form__modal-header">Thank You for your message!</h4>
                    }
                    {errorDetails &&
                        <h4 className="table-booking-form__modal-header">Error!</h4>
                    }
                    <div>{sucessFullDetails?.message || errorDetails?.message}</div>
                    {!isLoading &&
                        <button
                            className="btn-accent-secondary table-booking-form__modal-button"
                            onClick={handleCloseModal}
                        >
                            Ok
                        </button>
                    }

                </div>
            </Modal>

        </div>
    )
}